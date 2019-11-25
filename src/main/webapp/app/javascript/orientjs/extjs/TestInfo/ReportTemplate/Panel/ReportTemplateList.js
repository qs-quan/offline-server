/**
 * Created by dailin on 2019/8/25 19:26.
 */

Ext.define('OrientTdm.TestInfo.ReportTemplate.Panel.ReportTemplateList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.reportTemplateList',
    requires: [
        'OrientTdm.BackgroundMgr.DocReport.Model.DocReportExtModel',
        'OrientTdm.BackgroundMgr.DocReport.Common.DocReportMaker'
    ],
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    usePage: false,

    /**
     * 视图初始化
     */
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
    },

    createToolBarItems: function () {
        var me = this;
        var retVal = [];
        if (me.hasBar) {
            var addConfig = {
                title: '新增报告模板',
                height: 0.8 * globalHeight,
                width: 0.8 * globalWidth,
                nodeId: me.nodeId,
                formConfig: {
                    formClassName: 'OrientTdm.BackgroundMgr.DocReport.Common.DocReportMaker',
                    appendParam: function () {
                        return {
                            actionUrl: me.store.getProxy().api['create'],
                            nodeId: me.nodeId,
                            successCallback: function (resp) {
                                me.fireEvent('refreshGrid');
                                this.up("window").close();
                            }
                        }
                    }
                }
            };

            var updateConfig = {
                title: '修改报告模板',
                height: 0.8 * globalHeight,
                width: 0.8 * globalWidth,
                formConfig: {
                    formClassName: 'OrientTdm.BackgroundMgr.DocReport.Common.DocReportMaker',
                    appendParam: function () {
                        return {
                            actionUrl: me.store.getProxy().api['update'],
                            originalData: this.getSelectedData()[0],
                            successCallback: function () {
                                me.fireEvent('refreshGrid');
                                this.up('window').close();
                            }
                        }
                    }
                }
            };

            var retVal = [{
                iconCls: 'icon-create',
                text: '新增',
                itemId: 'create',
                scope: this,
                handler: Ext.bind(me.onCreateClick, me, [addConfig], false)
            }, {
                iconCls: 'icon-delete',
                text: '批量删除',
                disabled: false,
                itemId: 'delete',
                scope: this,
                handler: this.onDeleteClick
            }];
            var deleteAction = retVal[1];
            deleteAction.isDisabled = function (view, rowIndex, colIndex, itemId, record) {
                var isDisabled = false;
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/DocReports/modifyIsDisable.rdm', {
                    reportName: record.data.reportName
                }, false, function (response) {
                    isDisabled = response.decodedData;
                });
                return isDisabled;
            };
            me.actionItems.push({
                iconCls: 'icon-update',
                text: '修改',
                itemId: 'update',
                scope: this,
                handler: Ext.bind(me.onUpdateClick, me, [updateConfig], false),
                isDisabled: deleteAction.isDisabled
            }, deleteAction);
        }

        me.actionItems.push({
            iconCls: 'icon-preview',
            text: '预览',
            itemId: 'preview',
            scope: this,
            handler: me.onPreviewClick
        });
        return retVal;
    },

    createColumns: function () {
        return [
            {
                header: '报告名称',
                flex: 1,
                sortable: true,
                dataIndex: 'reportName',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '绑定模型',
                width: 150,
                sortable: true,
                dataIndex: 'modelId_display',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '创建人',
                width: 150,
                sortable: true,
                dataIndex: 'createUser',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '创建时间',
                width: 150,
                sortable: true,
                dataIndex: 'createTime',
                filter: {
                    type: 'string'
                }
            }
        ];
    },

    createStore: function () {
        var me = this;
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.BackgroundMgr.DocReport.Model.DocReportExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    'read': serviceName + '/DocReports/list.rdm',
                    'create': serviceName + '/DocReports/create.rdm',
                    'update': serviceName + '/DocReports/update.rdm',
                    'delete': serviceName + '/DocReports/delete.rdm'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                },
                extraParams: {
                    nodeId: me.nodeId
                    // limit: 25
                }
            }
        });
        this.store = retVal;
        return retVal;
    },
    onPreviewClick: function () {
        var me = this;
        var selectedRecord = OrientExtUtil.GridHelper.getSelectedRecord(me)[0];
        var reportId = selectedRecord.getId();
        var bindModelId = selectedRecord.get('modelId');
        //open grid window
        var modelGrid = Ext.create("OrientTdm.Common.Extend.Grid.OrientModelGrid", {
            modelId: bindModelId,
            isView: 0,
            afterInitComponent: function () {
                var grid = this;
                var toolbar = grid.dockedItems[0];
                var buttons = toolbar.query('button');
                Ext.each(buttons, function (button) {
                    button.hide();
                });
            }
        });
        OrientExtUtil.WindowHelper.createWindow(modelGrid, {
            title: '预览',
            buttons: [
                {
                    text: '生成报告',
                    iconCls: 'icon-preview',
                    handler: function () {
                        if (OrientExtUtil.GridHelper.hasSelected(modelGrid)) {
                            var dataId = OrientExtUtil.GridHelper.getSelectRecordIds(modelGrid).join(",");
                            me._doPreview(reportId, dataId);
                            this.up('window').close();
                        }
                    }
                },
                {
                    text: '关闭',
                    iconCls: 'icon-close',
                    handler: function () {
                        this.up('window').close();
                    }
                }
            ]
        });
    },
    _doPreview: function (reportId, dataId) {
        OrientExtUtil.FileHelper.previewDoc(reportId, dataId);
    }
});