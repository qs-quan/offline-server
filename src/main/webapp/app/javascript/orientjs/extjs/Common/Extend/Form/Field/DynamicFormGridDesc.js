/**
 * Created by Administrator on 2016/7/16 0016.
 */
Ext.define('OrientTdm.Common.Extend.Form.Field.DynamicFormGridDesc', {
    extend: 'OrientTdm.Common.Extend.Form.Field.FormGrid',
    alias: 'widget.DynamicFormGridDesc',
    alternateClassName: 'OrientExtend.dynamicFormGridDesc',
    initComponent: function () {
        var me = this;
        var toolBar = me.createToolBar();
        Ext.apply(me, {
            dockedItems: [toolBar],
            selModel: {
                mode: 'MULTI'
            },
            selType: "checkboxmodel"
        });
        this.callParent(arguments);
    },
    createStore: function () {
        var me = this;
        var data = [];
        var store = Ext.create("Ext.data.Store", {
            fields: [],
            data: data
        });
        return store;
    },
    createColumns: function () {
        var me = this;
        var columns = [];
        if (me.columnDesc.type == 'C_NameValue') {
            columns.push({
                header: '名称',
                dataIndex: '名称',
                sortable: true,
                flex: 1,
                editor: {
                    allowBlank: true,
                    xtype: 'textfield'
                }
            },{
                header: '值',
                dataIndex: '值',
                sortable: true,
                flex: 1,
                editor: {
                    allowBlank: true,
                    xtype: 'textfield'
                }
            });
        }
        return columns;
    }
    ,
    createPlugins: function () {
        var me = this;
        var cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 2,
            listeners: {
                beforeedit: function (editor, e) {
                    return me.columnDesc.editAble;
                }
            }
        });
        return [cellEditing];
    }
    ,
    createToolBar: function () {
        var me = this;
        if (me.columnDesc.editAble === true) {
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
                },
                {
                    iconCls: 'icon-import',
                    text: '导入',
                    itemId: 'import',
                    scope: this,
                    handler: me._onImportClick
                },
                {
                    iconCls: 'icon-headSetting',
                    text: '列头设置',
                    itemId: 'headSetting',
                    scope: this,
                    handler: me._onHeadSettingClick
                }
            ];
            var toolBar = Ext.create('Ext.toolbar.Toolbar', {
                items: toolBarItems
            });
            return toolBar;
        } else
            return null;

    }
    ,
    _onHeadSettingClick: function () {
        //获取当前column信息
        var me = this;
        var fields = [];
        Ext.each(me.columnManager.columns, function (column, index) {
            //去除多选column
            if (index > 0) {
                fields.push({
                    name: column.dataIndex
                });
            }

        });
        this.mixins.CommonField.showHeadModifyWin.call(me, fields);
    }
    ,
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
    }
    ,
    _onDeleteClick: function () {
        var me = this;
        var store = this.getStore();
        store.remove(OrientExtUtil.GridHelper.getSelectedRecord(this));
    }
    ,
    _onImportClick: function () {
        var me = this;
        var uploadImportFilePanel = Ext.create('OrientTdm.DataMgr.Import.UploadImportFilePanel', {
            successCallback: function (resp) {
                var tableEntity = resp.results;
                //创建columns
                var columns = [];
                //初始化数据
                var gridData = [];
                Ext.each(tableEntity.dataEntityList, function (dataEntity, index) {
                    //每行数据
                    var rowData = dataEntity.fieldEntityList;
                    var data = {};
                    Ext.each(rowData, function (cellData) {
                        //单元格数据
                        if (index == 0) {
                            columns.push({
                                header: cellData.name,
                                dataIndex: cellData.name,
                                sortable: true,
                                flex: 1,
                                editor: {
                                    allowBlank: true,
                                    xtype: 'textfield'
                                }
                            });
                        }
                        data[cellData.name] = cellData.value;
                    });
                    gridData.push(data);
                });
                //不展现唯一标识
                columns = Ext.Array.erase(columns, 0, 1);
                //创建store
                var store = Ext.create('Ext.data.Store', {
                    fields: Ext.Array.pluck(columns, 'dataIndex'),
                    data: gridData
                });
                me.reconfigure(store, columns);
                this.up('window').close();
            }
        });
        var win = Ext.create('Ext.Window', {
            plain: true,
            title: '导入数据',
            height: 110,
            width: 400,
            maximizable: false,
            modal: true,
            items: [
                uploadImportFilePanel
            ]
        });
        win.show();
    }
    ,
    _reconfigFormGrid: function (data) {
        var me = this;
        var columns = [];
        var fields = [];
        Ext.each(data, function (rowData, index) {
            if (index == 0) {
                for (var pro in rowData) {
                    columns.push({
                        header: pro,
                        flex: 1,
                        sortable: true,
                        dataIndex: pro,
                        editor: {
                            xtype: 'textfield'
                        }
                    });
                    fields.push(pro);
                }
            }
        });
        var store = Ext.create("Ext.data.Store", {
            fields: fields,
            data: data
        });
        me.reconfigure(store, columns);
    }
    ,
    _reconfigGridByHead: function (headArray) {
        var me = this;
        var newDatas = [];
        var store = me.getStore();
        if (store.getCount() == 0) {
            store.insert(0, {});
        }
        store.each(function (record) {
            var oldData = record.getData();
            var newData = {};
            Ext.each(headArray, function (head) {
                newData[head] = oldData[head] || "";
            });
            newDatas.push(newData);
        });
        me._reconfigFormGrid(newDatas);
    }
    ,
    setValue: function (value) {
        var me = this;
        if (!Ext.isEmpty(value)) {
            data = Ext.decode(value);
            //重新生成table
            me._reconfigFormGrid(data);
        }
        return me;
    },
    customReadOnly: function () {
        //自定义只读组件形态

    }
})
;