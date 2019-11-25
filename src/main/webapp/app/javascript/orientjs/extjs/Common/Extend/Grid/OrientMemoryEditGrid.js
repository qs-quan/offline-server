/**
 * Created by Administrator on 2016/9/6 0006.
 */
Ext.define('OrientTdm.Common.Extend.Grid.OrientMemoryEditGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.orientMemoryEditGrid',
    alternateClassName: 'OrientExtend.OrientMemoryEditGrid',
    config: {
        gridData: null
    },
    statics: {},
    initComponent: function () {
        var me = this;
        if (!me.gridData || me.gridData.length == 0) {
            throw('表格内容不可为空');
        } else {
            //增加特殊属性
            var plugins = me.createPlugins();
            var store = me.createStore();
            var columns = me.createColumns();
            var toolBar = me.createToolBar();
            Ext.apply(me, {
                store: store,
                columns: columns,
                plugins: plugins,
                dockedItems: [toolBar],
                selModel: {
                    mode: 'MULTI'
                },
                selType: "checkboxmodel"
            });
            me.callParent(arguments);
        }
    },
    getGridData: function () {
        var me = this;
        var data = [];
        me.getStore().each(function (record) {
            var toSaveData = record.getData();
            delete toSaveData.id;
            data.push(toSaveData);
        });
        return data;
    },
    createStore: function () {
        var me = this;
        var data = me.gridData;
        var fields = [];
        for (param in data[0]) {
            fields.push(param);
        }
        var store = Ext.create("Ext.data.Store", {
            fields: fields,
            data: data
        });
        return store;
    },
    createColumns: function () {
        var me = this;
        var columns = [];
        var data = me.gridData;
        for (param in data[0]) {
            columns.push({
                header: param,
                sortable: true,
                flex: 1,
                dataIndex: param,
                editor: {
                    xtype: 'textfield'
                }
            });
        }
        return columns;
    },
    createPlugins: function () {
        var me = this;
        var cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 2,
            listeners: {
                beforeedit: function (editor, e) {
                    return true;
                }
            }
        });
        return [cellEditing];
    },
    createToolBar: function () {
        var me = this;
        var toolBarItems = [
            {
                iconCls: 'icon-create',
                text: '新增',
                itemId: 'create',
                scope: this,
                handler: me._onCreateClick
            },
            {
                iconCls: 'icon-delete',
                text: '删除',
                itemId: 'delete',
                scope: this,
                handler: me._onDeleteClick
            }, {
                iconCls: 'icon-up',
                text: '上移',
                itemId: 'up',
                scope: this,
                handler: me._upRecord
            },
            {
                iconCls: 'icon-down',
                text: '下移',
                itemId: 'down',
                scope: this,
                handler: me._downRecord
            }
        ];
        var toolBar = Ext.create('Ext.toolbar.Toolbar', {
            items: toolBarItems
        });
        return toolBar;
    },
    _onCreateClick: function () {
        var me = this;
        var newData = {};
        var store = this.getStore();
        Ext.each(me.columnManager.columns, function (column, index) {
            //去除多选column
            if (index > 0) {
                newData[column.text] = "";
            }
        });
        store.insert(store.getCount(), newData);
    },
    _onDeleteClick: function () {
        var me = this;
        var store = this.getStore();
        store.remove(OrientExtUtil.GridHelper.getSelectedRecord(this));
    },
    _upRecord: function () {
        var grid = this;
        var store = grid.getStore();
        var selectedRecords = grid.getSelectionModel().getSelection();
        if (selectedRecords.length == 0) {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, "请至少选择一条已选字段记录");
        } else {
            var index = store.indexOf(selectedRecords[0]);
            if (index != 0) {
                store.remove(selectedRecords);
                store.insert(index - 1, selectedRecords);
                grid.getSelectionModel().select(selectedRecords);
            } else {
                OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.alreadyTop);
            }
        }
    },
    _downRecord: function () {
        var grid = this;
        var store = grid.getStore();
        var selectedRecords = grid.getSelectionModel().getSelection();
        if (selectedRecords.length == 0) {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, "请至少选择一条已选字段记录");
        } else {
            var index = store.indexOf(selectedRecords[selectedRecords.length - 1]);
            if (index != store.getCount() - 1) {
                store.remove(selectedRecords);
                store.insert(index + 1, selectedRecords);
                grid.getSelectionModel().select(selectedRecords);
            } else {
                OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.alreadyBottom);
            }
        }
    }
})
;