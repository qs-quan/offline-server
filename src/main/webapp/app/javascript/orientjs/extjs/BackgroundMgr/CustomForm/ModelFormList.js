/**
 * Created by enjoy on 2016/3/16 0016.
 */
Ext.define('OrientTdm.BackgroundMgr.CustomForm.ModelFormList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.modelFormExtList',
    requires: [
        'OrientTdm.BackgroundMgr.CustomForm.Model.ModelFormExtModel',
        'OrientTdm.BackgroundMgr.CustomForm.Create.ModelViewAddDashBord',
        'OrientTdm.BackgroundMgr.CustomForm.Update.ModelViewUpdateHtml',
        'OrientTdm.BackgroundMgr.CustomForm.Common.FreemarkerForm'
    ],
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    //视图初始化
    createToolBarItems: function () {
        var me = this;
        var addConfig = {
            title: '新增表单模板',
            height:450,
            width: 900,
            formConfig: {
                formClassName: 'OrientTdm.BackgroundMgr.CustomForm.Create.ModelViewAddDashBord',
                appendParam: function () {
                    return {
                        bindModelName: 'MODEL_FORM_VIEW',
                        successCallback: function (resp, callBackArguments) {
                            me.fireEvent('refreshGrid');
                            if(callBackArguments) {
                                this.up('window').close();
                            }
                        }
                    }
                }
            }
        };
        var updateConfig = {
            title: '修改表单模板',
            maximized: true,
            formConfig: {
                formClassName: 'OrientTdm.BackgroundMgr.CustomForm.Update.ModelViewUpdateHtml',
                //加载参数
                appendParam: function () {
                    return {
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
            tooltip: {
                text: '新增表单模板',
                title: '操作提示'
            },
            handler: Ext.bind(me.onCreateClick, me, [addConfig], false)
        }, {
            iconCls: 'icon-delete',
            text: '批量删除',
            disabled: false,
            itemId: 'delete',
            scope: this,
            tooltip: {
                text: '删除表单模板',
                title: '操作提示'
            },
            handler: this.onDeleteClick
        }, {
            iconCls: 'icon-modelClear',
            text: '无效表单清理',
            iconCls: 'icon-dataClear',
            itemId: 'clear',
            scope: this,
            tooltip: {
                text: '清理由于模型删除遗留的脏数据信息',
                title: '操作提示'
            },
            handler: this.onClearClick
        }];
        me.actionItems = [{
            iconCls: 'icon-update',
            text: '修改',
            itemId: 'update',
            scope: this,
            tooltip: {
                text: '修改表单模板',
                title: '操作提示'
            },
            handler: Ext.bind(me.onUpdateClick, me, [updateConfig], false)
        }, retVal[1], {
            iconCls: 'icon-previewForm',
            text: '预览',
            disabled: false,
            itemId: 'preview',
            scope: this,
            tooltip: {
                text: '预览表单模板',
                title: '操作提示'
            },
            handler: this.onPreviewBtnClick
        }];
        return retVal;
    },
    createColumns: function () {
        return [
            {
                header: '表单标题',
                width: 150,
                sortable: true,
                dataIndex: 'name',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '数据表',
                width: 100,
                sortable: true,
                dataIndex: 'modelid_display',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '创建时间',
                width: 150,
                sortable: true,
                dataIndex: 'createtime'
            },
            {
                header: '表单描述',
                flex: 1,
                sortable: false,
                dataIndex: 'desc'
            }
        ];
    },
    createStore: function () {
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.BackgroundMgr.CustomForm.Model.ModelFormExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    'read': serviceName + '/modelFormView/list.rdm',
                    'create': serviceName + '/modelFormView/create.rdm',
                    'update': serviceName + '/modelFormView/update.rdm',
                    'delete': serviceName + '/modelFormView/delete.rdm'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    root: 'results',
                    messageProperty: 'msg'
                },
                writer: {
                    type: 'json',
                    writeAllFields: false,
                    root: 'data'
                }
            }
        });
        this.store = retVal;
        return retVal;
    },
    onPreviewBtnClick: function () {
        var selections = this.getSelectionModel().getSelection();
        if (selections.length === 0) {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.atleastSelectOne);
        } else if (selections.length > 1) {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.onlyCanSelectOne);
        } else {
            var data = selections[0];
            var formViewId = data.get('id');
            var modelId = data.get('modelid');
            var item = Ext.create('OrientTdm.BackgroundMgr.CustomForm.Common.FreemarkerForm', {
                formViewId: formViewId,
                modelId: modelId
            });
            OrientExtUtil.WindowHelper.createWindow(item, {
                title: '预览'
            });
        }
    },
    onClearClick: function () {
        var me = this;
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelFormView/doClearData.rdm', true, {}, function () {
            me.fireEvent('refreshGrid');
        });
    }
});

