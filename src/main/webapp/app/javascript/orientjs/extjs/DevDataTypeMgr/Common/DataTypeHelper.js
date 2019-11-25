/**
 * Created by Administrator on 2016/7/6 0006.
 */
Ext.define("OrientTdm.DevDataTypeMgr.Common.DataTypeHelper", {
    extend: 'Ext.Base',
    alternateClassName: 'DataTypeHelper',
    statics: {
        defaultColumn: {
            type: {
                header: '类型',
                width: 150,
                sortable: true,
                dataIndex: 'datatype',
                renderer: function (value, p, r) {
                    switch (value) {
                        case "string" :
                            return "字符串";
                        case "boolean" :
                            return "布尔";
                        case "integer" :
                            return "整数";
                        case "double" :
                            return "实数";
                        case "file" :
                            return "文件";
                        case "date" :
                            return "日期";
                    }
                    return value;
                }
            },
            dataType: {
                header: '基础类型',
                width: 150,
                sortable: true,
                dataIndex: 'datatype',
                renderer: function (value, p, r) {
                    switch (value) {
                        case "string" :
                            return "字符串";
                        case "boolean" :
                            return "布尔";
                        case "integer" :
                            return "整数";
                        case "double" :
                            return "实数";
                        case "file" :
                            return "文件";
                        case "date" :
                            return "日期";
                    }
                    return value;
                },
                editor: {
                    xtype: 'combobox',
                    allowBlank: false,
                    store: Ext.create("Ext.data.Store", {
                        data: [
                            {"text": "实数", "value": "double"},
                            {"text": "整数", "value": "integer"},
                            {"text": "字符串", "value": "string"},
                            {"text": "布尔", "value": "boolean"},
                            {"text": "日期", "value": "date"},
                            {"text": "文件", "value": "file"}
                        ],
                        fields: ['text', 'value']
                    }),
                    triggerAction: 'all',
                    mode: 'local',
                    displayField: 'text',
                    valueField: 'value'
                }
            },
            status: {
                header: '状态',
                width: 150,
                sortable: true,
                dataIndex: 'status',
                renderer: function (value, p, r) {
                    switch (value) {
                        case 0 :
                            return "编制中";
                        case 1 :
                            return "审批中";
                        case 2 :
                            return "已发布";
                        case 3 :
                            return "修改中";
                        case 4 :
                            return "已废弃";
                    }
                    return '<a href="javascript:void(0);" style="color:#0000FF;text-decoration:underline;">'
                        + value + '</a>';
                }
            },
            delete: {
                header: '删除',
                xtype: 'actioncolumn',
                width: 50,
                align: 'center',
                sortable: false,
                menuDisabled: true,
                items: [{
                    icon: 'app/images/icons/default/common/delete.png',
                    tooltip: '删除',
                    scope: this,
                    handler: function (grid, rowIndex) {
                        grid.getStore().removeAt(rowIndex);
                    }
                }]
            },
            hisAction: {
                header: '历史版本',
                xtype: 'actioncolumn',
                width: 60,
                align: 'center',
                sortable: false,
                menuDisabled: true,
                items: [{
                    icon: 'app/images/icons/default/common/detail.png',
                    tooltip: '历史版本',
                    scope: this,
                    handler: function (grid, rowIndex) {
                        grid.up('baseDataTypeGrid').fireEvent("showHisData", rowIndex);
                    }
                }]
            }
        },
        getDefaultDataTypeColumns: function () {
            return [
                {
                    header: '名称',
                    width: 150,
                    sortable: true,
                    dataIndex: 'datatypename'
                },
                DataTypeHelper.defaultColumn.type,
                {
                    header: '描述',
                    flex: 1,
                    sortable: true,
                    dataIndex: 'description'
                },
                {
                    header: '版本',
                    width: 100,
                    sortable: true,
                    dataIndex: 'version'
                }
            ];
        },
        getEditableDataTypeColumns: function () {
            return [
                {
                    header: '类型名称',
                    flex: 1,
                    sortable: true,
                    dataIndex: 'datatypename',
                    editor: {
                        allowBlank: false
                    }
                },
                DataTypeHelper.defaultColumn.dataType,
                DataTypeHelper.defaultColumn.status,
                {
                    header: '版本',
                    width: 100,
                    sortable: true,
                    dataIndex: 'version'
                },
                {
                    header: '创建者',
                    width: 100,
                    sortable: true,
                    dataIndex: 'username'
                },
                DataTypeHelper.defaultColumn.delete,
                DataTypeHelper.defaultColumn.hisAction,
                {
                    width: 10
                }
            ];
        },
        getSubEnumEditableDataTypeColumns: function () {
            return [
                {
                    header: '参数名称',
                    flex: 1,
                    sortable: true,
                    dataIndex: 'datasubname',
                    editor: {
                        allowBlank: false
                    }
                },
                DataTypeHelper.defaultColumn.status,
                DataTypeHelper.defaultColumn.delete,
                {
                    width: 10
                }
            ];
        },
        getSubCompleteEditableDataTypeColumns: function () {
            return [
                {
                    header: '参数名称',
                    flex: 1,
                    sortable: true,
                    dataIndex: 'datasubname',
                    editor: {
                        allowBlank: false
                    }
                },
                DataTypeHelper.defaultColumn.status, {
                    header: '单位',
                    width: 100,
                    sortable: true,
                    dataIndex: 'unit',
                    editor: {
                        allowBlank: false
                    }
                }, DataTypeHelper.defaultColumn.dataType,
                {
                    header: '默认值',
                    width: '100',
                    sortable: true,
                    dataIndex: 'value',
                    editor: {
                        allowBlank: false
                    }
                },
                DataTypeHelper.defaultColumn.delete,
                {
                    width: 10
                }
            ];
        }
    }
});