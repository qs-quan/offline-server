/**
 * Created by enjoy on 2016/4/6 0006.
 */
Ext.define('OrientTdm.BackgroundMgr.CustomGrid.ModelGridList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.modelGridList',
    requires: [
        "OrientTdm.BackgroundMgr.CustomGrid.Create.ModelGridAddDashBord",
        "OrientTdm.BackgroundMgr.CustomGrid.Model.ModelGridExtModel"
    ],
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    //视图初始化
    createToolBarItems: function () {
        var me = this;
        var addConfig = {
            title: '新增数据模板',
            formConfig: {
                formClassName: "OrientTdm.BackgroundMgr.CustomGrid.Create.ModelGridAddDashBord",
                appendParam: function () {
                    return {
                        bindModelName: "MODEL_GRID_VIEW"
                    }
                }
            },
            buttons: [
                {
                    iconCls: 'icon-save',
                    text: '保存',
                    handler: function () {
                        this.up("window").down("modelGridAddDashBord").doSave(
                            function () {
                                me.fireEvent("refreshGrid");
                            }
                        );
                    }
                },
                {
                    iconCls: 'icon-saveAndClose',
                    text: '保存并关闭',
                    handler: function () {
                        this.up("window").down("modelGridAddDashBord").doSave(
                            function () {
                                me.fireEvent("refreshGrid");
                                this.up("window").close();
                            }
                        );
                    }
                },
                {
                    iconCls: 'icon-close',
                    text: '关闭',
                    handler: function () {
                        this.up("window").close();
                    }
                }
            ]
        };
        var updateConfig = {
            title: '修改数据模板',
            formConfig: {
                formClassName: "OrientTdm.BackgroundMgr.CustomGrid.Update.ModelGridUpdateDashBord",
                appendParam: function () {
                    return {
                        bindModelName: "FREEMARK_TEMPLATE",
                        originalData: this.getSelectedData()[0],
                        successCallback: function () {
                            me.fireEvent("refreshGrid");
                            this.up("window").close();
                        }
                    }
                }
            },
            buttons: [
                {
                    iconCls: 'icon-save',
                    text: '保存',
                    handler: function () {
                        this.up("window").down("modelGridUpdateDashBord").doSave(
                            function () {
                                me.fireEvent("refreshGrid");
                                this.up("window").close();
                            }
                        );
                    }
                },
                {
                    iconCls: 'icon-close',
                    text: '关闭',
                    handler: function () {
                        this.up("window").close();
                    }
                }
            ]
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
        }, {
            iconCls: 'icon-dataClear',
            text: '数据清理',
            itemId: 'clear',
            scope: this,
            tooltip: {
                text: '清理由于模型删除遗留的脏数据信息',
                title: '操作提示'
            },
            handler: this.onClearClick
        },
            {
                iconCls: 'icon-export',
                text: '导出',
                itemId: 'export',
                scope: this,
                handler: this.onExportClick
            },
            {
                iconCls: 'icon-import',
                text: '导入',
                itemId: 'import',
                scope: this,
                handler: this.onImportClick
            }
        ];
        me.actionItems = [{
            iconCls: 'icon-update',
            text: '修改',
            itemId: 'update',
            scope: this,
            handler: Ext.bind(me.onUpdateClick, me, [updateConfig], false)
        }, retVal[1], {
            iconCls: 'icon-previewGrid',
            text: '预览',
            disabled: false,
            itemId: 'preview',
            scope: this,
            handler: this.onPreviewClick
        }];
        return retVal;
    },
    createColumns: function () {
        return [
            {
                header: '模板标题',
                flex: 1,
                sortable: true,
                dataIndex: 'name',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '对应表',
                width: 150,
                sortable: true,
                dataIndex: 'modelid_display',
                filter: {
                    type: 'string'
                }
            }
        ];
    },
    createStore: function () {
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.BackgroundMgr.CustomGrid.Model.ModelGridExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    "read": serviceName + '/modelGridView/list.rdm',
                    "create": serviceName + '/modelGridView/create.rdm',
                    "update": serviceName + '/modelGridView/update.rdm',
                    "delete": serviceName + '/modelGridView/delete.rdm'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                }
            }
        });
        this.store = retVal;
        return retVal;
    },
    onPreviewClick: function () {
        if (OrientExtUtil.GridHelper.hasSelectedOne(this)) {
            var selectedRecord = OrientExtUtil.GridHelper.getSelectedRecord(this)[0];
            new Ext.Window({
                width: 0.8 * globalWidth,
                title: '模型表格预览',
                height: 0.8 * globalHeight,
                layout: 'card',
                activeItem: 0,
                items: [
                    {
                        xtype: 'orientModelGrid',
                        modelId: Ext.decode(selectedRecord.get("modelid")),
                        templateId: selectedRecord.get("id")
                    }, {
                        layout: 'fit'
                    }
                ],
                buttons: [{
                    text: '关闭',
                    handler: function () {
                        this.up("window").close();
                    }
                }]
            }).show();
            //new Ext.Window({
            //    width: "80%",
            //    title: '模型表格预览',
            //    height: "80%",
            //    layout: 'border',
            //    activeItem: 0,
            //    items: [
            //        {
            //            xtype: 'orientModelGrid',
            //            modelId: Ext.decode(selectedRecord.get("modelid"))["id"],
            //            templateId: selectedRecord.get("id"),
            //            region: 'center'
            //        }, {
            //            layout: 'fit',
            //            region: 'south',
            //            height: '50%',
            //            collapsed: true,
            //            collapsible: true
            //        }
            //    ],
            //    buttons: [{
            //        text: '关闭',
            //        handler: function () {
            //            this.up("window").close();
            //        }
            //    }]
            //}).show();
        }
    },
    onClearClick: function () {
        var me = this;
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelGridView/doClearData.rdm', true, {}, function () {
            me.fireEvent('refreshGrid');
        });
    },
    onExportClick: function () {
        var me = this;
        if (OrientExtUtil.GridHelper.hasSelected(me)) {
            var gridTemplateIds = OrientExtUtil.GridHelper.getSelectRecordIds(me);
            window.location.href = serviceName + '/modelGridView/export.rdm?ids=' + gridTemplateIds.join(',');
        }
    },
    onImportClick: function () {
        var me = this;
        var item = {
            xtype: 'form',
            items: [
                {
                    xtype: 'filefield',
                    emptyText: '选择一个xml文件',
                    fieldLabel: '文件',
                    name: 'dataFile',
                    allowBlank: false,
                    maxHeight: 25,
                    labelWidth: 50,
                    buttonText: '',
                    buttonConfig: {
                        iconCls: 'icon-upload'
                    },
                    validator: function (value) {
                        var arr = value.split('.');
                        if (arr[arr.length - 1] != 'xml') {
                            return '请上传后缀名为xml的文件！！！';
                        } else {
                            return true;
                        }
                    }
                }
            ],
            frame: false,
            bodyPadding: 10,
            layout: 'anchor',
            autoScroll: true,
            bodyStyle: 'border-width:0 0 0 0; background:transparent',
            defaults: {
                anchor: '100%',
                msgTarget: 'side'
            }
        };
        OrientExtUtil.WindowHelper.createWindow(item, {
            title: '导入数据',
            buttons: [
                {
                    text: '保存',
                    iconCls: 'icon-save',
                    handler: function () {
                        var form = this.up('window').down('form').getForm();
                        var window = this.up('window');
                        if (form.isValid()) {
                            form.submit({
                                clientValidation: true,
                                url: serviceName + '/modelGridView/import.rdm',
                                waitTitle: '提示',
                                waitMsg: '保存中，请稍后...',
                                success: function (form, action) {
                                    me.fireEvent("refreshGrid");
                                    window.close();
                                },
                                failure: function (form, action) {
                                    switch (action.failureType) {
                                        case Ext.form.action.Action.CLIENT_INVALID:
                                            OrientExtUtil.Common.err('失败', '表单存在错误');
                                            break;
                                        case Ext.form.action.Action.CONNECT_FAILURE:
                                            OrientExtUtil.Common.err('失败', '无法连接服务器');
                                            break;
                                        case Ext.form.action.Action.SERVER_INVALID:
                                            OrientExtUtil.Common.err('失败', action.result.msg);
                                    }
                                }
                            });
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
        }, 120, 100);
    }
});
