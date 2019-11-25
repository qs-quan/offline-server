/**
 * 数据表历史版本
 */

Ext.define('OrientTdm.TestBomBuild.Panel.GridPanel.TestDataVersion.TestDataVersionList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    requires: [
        "OrientTdm.Common.Util.OrientExtUtil"
    ],
    alias: 'widget.TestDataVersionList',
    config: {
        extraFilter: ''
    },
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,

    initComponent: function () {
        var me = this;
        me.initEvents();
        me.callParent(arguments);
    },

    createStore: function () {
        var me = this;
        var retVal = Ext.create("Ext.data.Store", {
            autoLoad: true,
            fields: [{
                name: 'filePath'
            }, {
                name: 'versionName'
            }, {
                name: 'createUserName'
            }, {
                name: 'createTime'
            }],
            proxy: {
                type: 'ajax',
                api: {
                    "read": serviceName + "/TestDataController/readVersionList.rdm"
                },
                reader: {
                    type: 'json',
                    totalProperty: 'totalProperty',
                    root: 'results'
                },
                extraParams: {
                    nodeId: me.nodeId
                }
            },
            sorters : [{
                property : 'createTime', // 指定要排序的列索引
                direction : 'DESC' // 降序，  ASC：赠序
            }]
        });

        me.store = retVal;
        return retVal;
    },

    // 不显示分页栏
    createFooBar: function(){},

    createColumns: function () {
        var me = this;
        var columns = [{
                xtype:'actioncolumn',
                header: '操作',
                width: 60,
                dataIndex: 'filePath',
                items: [{
                    iconCls: 'icon-preview',
                    tooltip: '查看详情',
                    handler: function(grid, rowIndex, colIndex, item, e, record) {
                        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TestDataController/recordDetailList.rdm', {
                            filePath: record.data.filePath
                        }, false, function (response) {
                            if (response.decodedData.success) {
                                var results = response.decodedData.results;
                                var width = results.fields.length > 9 ?  0.8 * globalWidth : 0.5 * globalWidth;

                                var dataListSize = results.datas.length;
                                var height = 100;
                                if(dataListSize < 15){
                                    height = 0.3 * globalHeight;
                                }else if(dataListSize < 25){
                                    height = 0.5 * globalHeight;
                                }else{
                                    height = 0.8 * globalHeight;
                                }
                                OrientExtUtil.WindowHelper.createWindow(Ext.create('OrientTdm.TestBomBuild.Panel.GridPanel.TestDataVersion.TestDataVersionDetailList', results), {
                                    title: '【' + record.data.versionName + '】历史版本详情',
                                    layout: "fit",
                                    width: width,
                                    height:  height,
                                    buttonAlign: 'center'
                                })
                                //me.up().close();
                            }else{
                                OrientExtUtil.Common.tip('提示','该版本数据不存在！');
                                grid.getStore().reload();
                            }
                        });
                    }
                },' ', {
                    iconCls: 'icon-delete',
                    tooltip: '删除',
                    handler: function(grid, rowIndex, colIndex, item, e, record) {
                        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/FileMngController/deleteFile.rdm', {
                            filePath: record.data.filePath
                        }, false, function (response) {
                            OrientExtUtil.Common.tip('提示','删除版本成功！');
                            grid.getStore().reload();
                        });
                    }
                }
            ]},{
                header: '版本名称',
                flex: 1,
                sortable: true,
                dataIndex: 'versionName'
            },{
                header: '创建人',
                flex: 1,
                sortable: true,
                dataIndex: 'createUserName'
            },{
                header: '创建时间',
                flex: 1,
                sortable: true,
                dataIndex: 'createTime'
            }];

        return columns;
    }

});