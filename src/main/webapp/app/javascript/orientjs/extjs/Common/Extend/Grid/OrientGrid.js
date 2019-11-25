/**
 * Created by enjoy on 2016/3/17 0017.
 * ExtGrid自定义父类
 */

Ext.define('OrientTdm.Common.Extend.Grid.OrientGrid', {
    extend: 'Ext.grid.Panel',
    alternateClassName: 'OrientExtend.Grid',
    alias: 'widget.orientGrid',
    requires: [
        'Ext.ux.grid.FiltersFeature'
    ],
    frame: true,
    loadMask: true,
    config: {
        usePage: true,
        multiSelect: true,
        selType: 'checkboxmodel',
        //前后处理器
        beforeInitComponent: Ext.emptyFn,
        afterInitComponent: Ext.emptyFn,
        actionItems: [],
        pageSize: globalPageSize || 25,
    },
    //视图初始化
    createToolBarItems: function () {
        return [];
    },
    createFooBar: function () {
        var me = this;
        return {
            xtype: 'pagingtoolbar',
            store: me.store,   // same store GridPanel is using
            dock: 'bottom',
            displayInfo: true,
            items: [
                {
                    xtype: 'tbseparator'
                },
                {
                    xtype: 'numberfield',
                    labelWidth: 30,
                    width: 100,
                    fieldLabel: '每页',
                    enableKeyEvents: true,
                    value: me.pageSize,
                    listeners: {
                        keydown: function (field, e) {
                            if (e.getKey() == Ext.EventObject.ENTER && !Ext.isEmpty(field.getValue())) {
                                var newPageSize = field.getValue();
                                var store = me.getStore();
                                store.pageSize = newPageSize;
                                store.loadPage(1);
                            }
                        }
                    }
                }, '条'

            ]
        };
    },
    createColumns: function () {
        return [];
    },
    createStore: function () {
        return {};
    },
    initComponent: function () {
        var me = this;
        //初始化
        me.actionItems = [];
        me.beforeInitComponent.call(me);
        //定义Store
        var store = me.createStore.call(me);
        me.store = store;
        store.pageSize = me.pageSize;
        //加载数据后触发事件
        store.on('load', function (store, record) {
            me.fireEvent('afterLoadData', record);
        });
        //定义Columns
        var columns = me.createColumns.call(me);
        //定义contextmenu
        var toolBarItems = me.createToolBarItems.call(me);
        /*var contextMenu = Ext.create('Ext.menu.Menu', {
            items: toolBarItems
        });*/
        //增加actionColumn
        var actionColumns = me._initActionColumns();
        Ext.Array.insert(columns, 0, actionColumns);
        //定义top菜单栏
        var toolBar = toolBarItems && toolBarItems.length > 0 ? Ext.create('Ext.toolbar.Toolbar', {
            items: toolBarItems
        }) : null;
        //定义bottom菜单栏
        //定义底部按钮
        var footBar = me.usePage === true ? me.createFooBar.call(me) : null;
        //更改参数
        if (me.usePage === false && 'memory' != store.getProxy().type) {
            store.getProxy().setExtraParam('start', null);
            store.getProxy().setExtraParam('limit', null);
        }
        Ext.Object.merge(me, {
            viewConfig: {
                stripeRows: true
                /*listeners: {
                    itemcontextmenu: function (view, rec, node, index, e) {
                        e.stopEvent();
                        contextMenu.showAt(e.getXY());
                        return false;
                    }
                }*/
            },
            dockedItems: [toolBar, footBar],
            columns: columns,
            store: store,
            selModel: {
                /**
                 SINGLE - 允许一次只能选择一个。 使用allowDeselect以允许取消选择哪个选项。这个是默认的。
                 SIMPLE - 允许一次一个接着一个的选择多个。Each click in grid will either格子中的每一次点击将选择或者取消选择一个元素。
                 MULTI - 允许使用Ctrl和Shift键对多个项目进行复杂的选择。
                 */
                mode: me.multiSelect ? 'SIMPLE' : 'SINGLE',
                // 只能通过多选框勾选
                checkOnly: false
            },
            selType: me.selType,
            listeners: {
                itemdblclick: function (view, record, item, index) {
                    me.doubleClick(view, record, item, index);
                }
            }
        });
        me.afterInitComponent.call(me);
        this.callParent(arguments);
        this.addEvents('refreshGrid', 'filterByForm', 'afterLoadData');
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'refreshGrid', me.refreshGrid, me);
        me.mon(me, 'loadData', me.loadData, me);
        me.mon(me, 'filterByForm', me.filterByForm, me);
    },

    filterByForm: function (formValue) {
        //根据查询表单结果 过滤表格信息
        for (var proName in formValue) {
            this.getStore().getProxy().setExtraParam(proName, formValue[proName]);
        }
        this.getStore().loadPage(1);
    },

    //刷新表格
    refreshGrid: function () {
        //清空选择
        this.getSelectionModel().clearSelections();
        var store = this.getStore();
        var lastOptions = store.lastOptions;
        store.reload(lastOptions);
    },

    doubleClick: function (view, record, item, index) {
        var me = this;
        if (me.modelDesc && me.modelDesc.btns) {
            var btns = me.modelDesc.btns;
            Ext.each(btns, function (btn) {
                if (me.templateId && btn.name == "详细") {
                    var detailButton = Ext.create("OrientTdm.Common.Extend.Button.Override.DetailModelDataButton", {
                        record: record,
                        opreationType: "doubleClick"
                    });
                    detailButton.triggerClicked(me);
                }
            });
        }
    },

    /**
     * 加载数据（主要用于查询）
     * @param data
     */
    loadData: function (data) {
        //清空选择
        this.getSelectionModel().clearSelections();
        var store = this.getStore();
        store.loadData(data);
    },

    /**
     * 删除表格数据
     */
    onDeleteClick: function () {
        var me = this;
        if (me.getStore() && me.getStore().getProxy() && me.getStore().getProxy().api) {
            OrientExtUtil.GridHelper.deleteRecords(me, me.getStore().getProxy().api['delete'], function () {
                me.fireEvent('refreshGrid');
            });
        } else {
            OrientExtUtil.Common.err(OrientLocal.prompt.error, '未定义删除Url');
        }

    },
    onCreateClick: function (cfg) {
        if (cfg.formConfig.appendParam) {
            var extraParam = cfg.formConfig.appendParam.call(this);
            Ext.apply(cfg.formConfig, extraParam);
        }
        //弹出新增面板窗口
        var win = Ext.create('Ext.Window', Ext.apply({
            plain: true,
            height: 0.7 * globalHeight,
            width: 0.7 * globalWidth,
            layout: 'fit',
            maximizable: true,
            modal: true,
            items: [
                Ext.create(cfg.formConfig.formClassName, cfg.formConfig)
            ]
        }, cfg));
        win.show();
    },

    onUpdateClick: function (cfg) {
        var selections = this.getSelectionModel().getSelection();
        if (selections.length === 0) {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.atleastSelectOne);
        } else if (selections.length > 1) {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.onlyCanSelectOne);
        } else {
            if (cfg.formConfig.appendParam) {
                var extraParam = cfg.formConfig.appendParam.call(this);
                Ext.apply(cfg.formConfig, extraParam);
            }
            var updateWin = Ext.create('Ext.Window', Ext.apply({
                plain: true,
                height: 0.7 * globalHeight,
                width: 0.7 * globalWidth,
                layout: 'fit',
                maximizable: true,
                modal: true,
                items: [
                    Ext.create(cfg.formConfig.formClassName, cfg.formConfig)
                ]
            }, cfg));
            updateWin.show();
        }
    },

    //获取选中的记录
    getSelectedData: function () {
        var selections = this.getSelectionModel().getSelection();
        return selections;
    },

    _changeRowClass: function (record, rowIndex, rowParams, store) {

    },

    _initActionColumns: function () {
        var me = this;
        var retVal = null;
        if (me.actionItems.length > 0) {
            var items = [];
            var index = 0;
            Ext.each(me.actionItems, function (actionItem) {
                items.push({
                    iconCls: actionItem.iconCls,
                    tooltip: actionItem.text,
                    handler: function (grid, rowIndex, colIndex) {
                        var record = grid.store.getAt(rowIndex);
                        me.getSelectionModel().deselectAll();
                        me.getSelectionModel().select(record, false, true);
                        var scope = actionItem.scope || actionItem;
                        actionItem.handler.apply(scope, arguments);
                    },
                    isDisabled: function (view, rowIndex, colIndex, item, record) {
                        if (actionItem.isDisabled) {
                            return actionItem.isDisabled(view, rowIndex, colIndex, item, record);
                        } else {
                            return false;
                        }
                    }
                });
                if (index < me.actionItems.length - 1) {
                    items.push(' ');
                }
                index++;
            });
            var width = 30 * ((items.length + items.length - 1) / 2);
            retVal = {
                xtype: 'actioncolumn',
                text: '操作',
                align: 'center',
                width: width < 50 ? 50 : width,
                items: items
            };
        }
        return null == retVal ? [] : [retVal];
    }
});
