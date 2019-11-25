/**
 * 检查数据字段
 */
Ext.define('OrientTdm.Common.Extend.Form.Field.CheckColumnDesc', {
    extend: 'OrientTdm.Common.Extend.Form.Field.FormGrid',
    alias: 'widget.CheckColumnDesc',
    alternateClassName: 'OrientExtend.checkColumnDesc',
    requires: [
        'OrientTdm.Common.Extend.Plugin.CombineCheckEditor'
    ],
    config:{
      listData:null
    },
    statics: {},
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
    createStore: function () {
        var me = this;
        var data = [];
        var store = Ext.create("Ext.data.Store", {
            fields: [
                {
                    name: 'labelName'
                },
                {
                    name: 'inputValue'
                }
            ],
            data: data
        });
        return store;
    },
    createColumns: function () {
        var me = this;
        var columns = [{
            header: '检查内容',
            flex: 1,
            sortable: true,
            dataIndex: 'labelName',
            editor: {
                xtype: 'textfield'
            }
        }, {
            header: '检查结果',
            flex: 1,
            sortable: true,
            dataIndex: 'inputValue',
            editor: {
                xtype: 'textfield'
            },
            renderer: function (value) {
                var retVal = value;
                if (typeof value == 'boolean') {
                    retVal = value == true ? '<span style="color: green; ">检查通过</span>' : '<font color=red>检查未通过</font>';
                } else if (value.split('[orient-mid]').length == 2) {
                    var splitArray = value.split('[orient-mid]');
                    retVal = ("true" == splitArray[0] ? '<span style="color: green; ">检查通过</span>' : '<font color=red>检查未通过</font>') + "：" + splitArray[1];
                }
                return retVal;
            }
        }, {
            xtype: 'actioncolumn',
            align:'center',
            header: '附件',
            flex:1,
            items: [{
                icon: serviceName + '/app/images/icons/default/common/update.png',
                tooltip: '查看附件',
                handler: Ext.bind(me.showAttachment, me)
            }]
        }];
        return columns;
    },
    createToolBar: function () {
        var me = this;
        if (me.columnDesc.editAble === true) {
            var toolBarItems = [
                {
                    iconCls: 'icon-create',
                    text: '新增勾选检查项',
                    itemId: 'createCheck',
                    scope: this,
                    handler: Ext.bind(me._onCreateClick, me, ['check'], false)
                },
                {
                    iconCls: 'icon-create',
                    text: '新增普通检查项',
                    itemId: 'createCommon',
                    scope: this,
                    handler: Ext.bind(me._onCreateClick, me, ['common'], false)
                },
                {
                    iconCls: 'icon-create',
                    text: '新增复合检查项',
                    itemId: 'createCCombine',
                    scope: this,
                    handler: Ext.bind(me._onCreateClick, me, ['combine'], false)
                },
                {
                    iconCls: 'icon-delete',
                    text: '删除',
                    itemId: 'delete',
                    scope: this,
                    handler: me._onDeleteClick
                }
            ];
            var toolBar = Ext.create('Ext.toolbar.Toolbar', {
                items: toolBarItems
            });
            return toolBar;
        } else
            return null;

    },
    initComponent: function () {
        var me = this;
        var toolBar = me.createToolBar();
        Ext.apply(me, {
            dockedItems: [toolBar],
            selModel: {
                mode: 'MULTI'
            },
            selType: "checkboxmodel",
            listeners: {
                celldblclick: function (view, td, cellIndex, record, tr, rowIndex) {
                    var belongGrid = view.up('CheckColumnDesc');
                    var clickedColumn = belongGrid.columns[cellIndex - 1];
                    var clickedcolumnIndex = clickedColumn.dataIndex;
                    var clickedColumnValue = record.get(clickedcolumnIndex);
                    if (typeof clickedColumnValue == 'boolean') {
                        clickedColumn.setEditor({
                            xtype: 'checkbox'
                        });
                    } else {
                        var splitArray = clickedColumnValue.split('[orient-mid]');
                        if (splitArray.length > 1) {
                            clickedColumn.setEditor({
                                xtype: 'CombineCheckEditor'
                            });
                        } else {
                            clickedColumn.setEditor({
                                xtype: 'textfield'
                            });
                        }
                    }
                }
            }
        });
        me.callParent(arguments);
    },
    _onCreateClick: function (type) {
        var me = this;
        var newData = {
            labelName: '检查项'
        };
        if ("check" == type) {
            newData['inputValue'] = false;
        } else if ('common' == type) {
            newData['inputValue'] = '';
        } else {
            //check and input
            newData['inputValue'] = 'false[orient-mid]';
        }

        var store = this.getStore();
        store.insert(store.getCount(), newData);
    },
    _onDeleteClick: function (type) {
        var me = this;
        var store = this.getStore();
        store.remove(OrientExtUtil.GridHelper.getSelectedRecord(me));
    },
    //重载提交数据
    getSubmitData: function () {
        var me = this;
        var columnId = me.columnDesc.id;
        return me.getGridData();
    },
    showAttachment:function() {
        var me = this;
        var data = {};
        if(me.listData != null) {
            data = me.listData;
        }else {
            data = me.up().up().originalData[me.name];
        }
        //var data = me.up().up().originalData[me.name];
        var fileGrid = Ext.create('OrientTdm.Collab.Data.PVMData.Common.PVMFileList',{data:data});
        var showFileWin = Ext.create('Ext.Window', {
            plain: true,
            height: 0.7 * globalHeight,
            width: 0.7 * globalWidth,
            layout: 'fit',
            maximizable: true,
            modal: true,
            title: '查看附件',
            items: [
                fileGrid
            ]
        });
        showFileWin.show();
    }
});