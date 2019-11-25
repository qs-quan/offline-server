/**
 * Created by qjs on 2016/12/20.
 * 制作综合模板时展现的树
 */
Ext.define('OrientTdm.BackgroundMgr.PVMMulTemplate.MulPVMDataTree', {
    extend: 'OrientTdm.Common.Extend.Tree.OrientTree',
    alias: 'widget.mulPvmDataTree',
    loadMask: true,
    requires: [
        'OrientTdm.Common.Extend.Form.Selector.ChooseModelPanel',
        'OrientTdm.BackgroundMgr.PVMTemplate.PVMTemplateDashBord',
        'OrientTdm.Collab.Data.PVMData.Common.PVMCombineDashBord',
        'OrientTdm.BackgroundMgr.PVMHtml.PVMHtmlDashBord'
    ],
    config: {
        dataId: '',
        actionType:'',
        templateId:'',
        preview:false
    },
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            afterInitComponent: function () {
                this.viewConfig.listeners.refresh = function () {
                    //去除默认的选中事件
                };
            },
            lbar: me.createLeftBar()
        });
        this.callParent(arguments);
        this.addEvents("reconfigPVMData");
    },
    initEvents: function () {
        var me = this;
        me.mon(me, 'reconfigPVMData', me.reconfigPVMData, me);
        me.callParent();
    },
    itemClickListener: function (tree, record, item) {
        var me = this;
        var modelName = record.get('text');
        var modelId = record.raw.checkmodelid;//不同于组件配置项的modelId,这里是checkmodelId
        var templateId = record.raw.templateid;
        var html = record.raw.html;
        //获取ID集合
        var panelId = 'status-mul' + '-' + modelId;
        var tabPanel = me.up('pvmMulTemplateDataDashBord').centerPanelComponent;
        var sonPanel = tabPanel.child('panel[itemId=' + panelId + ']');
        if (!sonPanel) {
            sonPanel = Ext.create('OrientTdm.BackgroundMgr.PVMMulTemplate.Common.PVMMulCombineDashBoard', {
                itemId: panelId,
                title: modelName,
                modelId: modelId,//从这里开始的modelId就是checkmodelid了
                templateId:templateId,
                rawData: record.raw,
                iconCls: record.get('iconCls'),
                preview:me.preview
            });
            tabPanel.add(sonPanel);
        } else {
            if (tabPanel.activeTab.itemId == panelId) {
                sonPanel.fireEvent('activate', sonPanel);
            }
        }

        if(!me.preview) {
            me.down('#setRemark').setDisabled(false);
            me.down('#setCheckRole').setDisabled(false);
        }

        tabPanel.setActiveTab(sonPanel);
    },
    createToolBarItems: function () {
        var me = this;
        var retVal = [{
            xtype: 'trigger',
            width: 316,
            triggerCls: 'x-form-clear-trigger',
            onTriggerClick: function () {
                this.setValue('');
                me.clearFilter();
            },
            emptyText: '快速搜索',
            enableKeyEvents: true,
            listeners: {
                keyup: function (field, e) {
                    if (Ext.EventObject.ESC == e.getKey()) {
                        field.onTriggerClick();
                    } else {
                        me.filterByText(this.getRawValue(), "text");
                    }
                }
            }
        }];

        return retVal;
    },
    createFooBar: function () {
        return null;
    },
    createStore: function () {
        var me = this;

        var retVal;
        retVal = new Ext.data.TreeStore({
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: serviceName + '/PVMMulCheckRelation/getByPid.rdm',
                extraParams: {
                    //修改要传templateId
                    templateId: me.templateId,
                    actionType:me.actionType
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                }
            },
            root: {
                text: 'root',
                id: '-1',
                expanded: true
            },
            listeners: {
                load: function (store, record) {

                },
                scope: me
            }
        });

        return retVal;
    },
    _addModel: function () {//这些新增操作全部要走新的url
        var me = this;
        //弹出选择模型window
        var chooseModelPanel = Ext.create('OrientTdm.Common.Extend.Form.Selector.ChooseModelPanel', {
            multiSelect: false,
            selectedValue: '',
            containsView: false,
            excludeSchemaId: '240',//过滤掉协同模型
            afterInitComponent: function () {
                this.viewConfig.listeners.refresh = function () {
                    //去除默认的选中事件
                };
            },
            saveAction: function (saveData, callBack) {
                var flag = me._checkCanSave(saveData);
                if (flag == true) {
                    me._doCreate(saveData);
                    callBack.call(this);
                }
            }
        });
        var win = Ext.create('Ext.Window', {
                plain: true,
                title: '选择模型',
                height: 600,
                width: 400,
                layout: 'fit',
                maximizable: true,
                modal: true,
                items: [
                    chooseModelPanel
                ]
            }
        );
        win.show();
    },
    _removeModel: function () {
        var me = this;
        var selectedRecords = me.getSelectionModel().getSelection();
        if (selectedRecords.length == 0) {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.atleastSelectOne);
        } else if (me._containsInvalidRecord(selectedRecords) == true) {
            OrientExtUtil.Common.err(OrientLocal.prompt.error, OrientLocal.prompt.onlyCanRemoveModel);
        } else {
            OrientExtUtil.Common.confirm(OrientLocal.prompt['delete'], OrientLocal.prompt.confirmDelete, function (btn) {
                if (btn == 'yes') {
                    me._doRemove(selectedRecords);
                }
            });
        }
    },
    _containsInvalidRecord: function (records) {
        var flag = false;
        Ext.each(records, function (record) {
            if (record.get('id').indexOf('status') != -1) {
                flag = true;
            }
        });
        return flag;
    },
    _checkCanSave: function (saveData) {
        var me = this;
        //是否可以保存
        var flag = false;
        if (saveData.length == 0) {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.atleastSelectOne);
        } else {
            var modelId = saveData[0].id;
            //校验是否已经存在
            var params = {
                checkmodelid: modelId,
                templateId:me.templateId
            };
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/PVMMulCheckRelation/canAdd.rdm', params, false, function (resp) {
                var retData = resp.decodedData.results;
                if (retData == 'true') {
                    flag = true;
                }
            });
        }
        return flag;
    },
    _canAddFromTemplates: function (templateIds) {
        var me = this;
        var flag = false;
        var params = {
            templateIds: templateIds,//检查表模板id
            templateId: me.templateId//综合模板id
        };
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/PVMMulCheckRelation/canAddFromTemplate.rdm', params, false, function (resp) {
            var retData = resp.decodedData.results;
            if (retData == true) {
                flag = true;
            }
        });
        return flag;
    },
    _canAddFromHtmlTemplates: function (htmlTemplateIds) {
        var me = this;
        var flag = false;
        var params = {
            htmlTemplateIds: htmlTemplateIds,
            modelId: '',//从html模板中新增时modelId应当为空值
            templateId: me.templateId
        };
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/PVMMulCheckRelation/canAddFromHtmlTemplate.rdm', params, false, function (resp) {
            var retData = resp.decodedData.results;
            if (retData == true) {
                flag = true;
            }
        });
        return flag;
    },
    _doCreate: function (saveData) {
        var me = this;
        var store = me.getStore();
        var modelId = saveData[0].id;
        var params = {
            checkmodelid: modelId,
            templateId: me.templateId
        };
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/PVMMulCheckRelation/create.rdm', params, false, function (resp) {
            //保存成功后操作
            store.reload({
                node: me.getRootNode()
            });
        });
    },
    doSaveFromTemplate: function (templateIds, callBack) {
        var me = this;
        var store = me.getStore();
        var params = {
            templateIds: templateIds,
            templateId: me.templateId
        };
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/PVMMulCheckRelation/createByTemplate.rdm', params, false, function (resp) {
            //保存成功后操作
            store.reload({
                node: me.getRootNode()
            });
            if (callBack) {
                callBack.call(me);
            }
        });
    },
    doSaveFromHtmlTemplate: function (htmlTemplateIds, callBack) {
        var me = this;
        var store = me.getStore();
        var params = {
            htmlTemplateIds: htmlTemplateIds,
            modelId: '',//html模板的checkmodelid为空值
            templateId: me.templateId
        };
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/PVMMulCheckRelation/createByHtmlTemplate.rdm', params, false, function (resp) {
            //保存成功后操作
            store.reload({
                node: me.getRootNode()
            });
            if (callBack) {
                callBack.call(me);
            }
        });
    },
    _doRemove: function (records) {
        var me = this;
        var store = me.getStore();
        if (records[0].raw['checktablestatus'] > 2) {
            OrientExtUtil.Common.err(OrientLocal.prompt.error, OrientLocal.prompt.allreadyDelived);
        } else {
            var toRemoveIds = [];
            Ext.each(records, function (record) {
                var checkModelId = record.raw.id;
                toRemoveIds.push(checkModelId);
            });
            var params = {
                toDelIds: toRemoveIds
            };
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/PVMMulCheckRelation/delete.rdm', params, false, function (resp) {
                //保存成功后操作
                store.reload({
                    node: me.getRootNode()
                });
                //移除右侧相关Tab面板
                Ext.each(records, function (record) {
                    var modelId = record.raw.checkmodelid;
                    var panelId = 'status-mul' + '-' + modelId;
                    var tabPanel = me.up('pvmMulTemplateDataDashBord').centerPanelComponent;
                    var sonPanel = tabPanel.child('panel[itemId=' + panelId + ']');
                    if (sonPanel) {
                        tabPanel.remove(sonPanel);
                    }
                });
            });
        }
    },
    _addByTemplate: function () {
        var me = this;
        //选择模板
        var win = Ext.create('Ext.Window', {
                plain: true,
                title: '选择模板',
                height: 600,
                width: 1024,
                layout: 'fit',
                maximizable: true,
                modal: true,
                items: [
                    {
                        xtype: 'pvmTemplateDashBord'
                    }
                ],
                buttons: [
                    {
                        text: '关闭',
                        iconCls: 'icon-close',
                        handler: function () {
                            win.close();
                        }
                    }, {
                        text: '保存',
                        iconCls: 'icon-save',
                        handler: function () {
                            var templateGrid = win.down('pvmTemplateList');
                            //获取选中的数据集合
                            var templateIds = OrientExtUtil.GridHelper.getSelectRecordIds(templateGrid);
                            if (templateIds.length == 0) {
                                OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.atleastSelectOne);
                            } else {
                                //校验是否可以新增
                                var canAdd = me._canAddFromTemplates(templateIds);
                                if (canAdd == true) {
                                    me.doSaveFromTemplate(templateIds, function () {
                                        win.close();
                                    });
                                }
                            }
                        }
                    }
                ]
            }
        );
        win.show();
    },
    _addByHtmlTemplate: function () {
        var me = this;
        //选择模板
        var win = Ext.create('Ext.Window', {
                plain: true,
                title: '选择HTML模板',
                height: 600,
                width: 1024,
                layout: 'fit',
                maximizable: true,
                modal: true,
                items: [
                    {
                        xtype: 'pvmHtmlDashBord'
                    }
                ],
                buttons: [
                    {
                        text: '关闭',
                        iconCls: 'icon-close',
                        handler: function () {
                            win.close();
                        }
                    }, {
                        text: '保存',
                        iconCls: 'icon-save',
                        handler: function () {
                            var templateGrid = win.down('pvmHtmlList');
                            //获取选中的数据集合
                            var templateIds = OrientExtUtil.GridHelper.getSelectRecordIds(templateGrid);
                            if (templateIds.length == 0) {
                                OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.atleastSelectOne);
                            } else {
                                //校验是否可以新增
                                var canAdd = me._canAddFromHtmlTemplates(templateIds);
                                if (canAdd == true) {
                                    me.doSaveFromHtmlTemplate(templateIds, function () {
                                        win.close();
                                    });
                                }
                            }
                        }
                    }
                ]
            }
        );
        win.show();
    },
    reconfigPVMData: function () {
        var me = this;
        var currentNode = this.getSelectionModel().getSelection()[0];
        me.fireEvent("itemclick", me, currentNode);
    },
    _setAssigners: function () {
        var me = this;
        //var combineDashBoard = me.up('pvmDataDashBord').down('pvmCombineDashBord');
        var combineDashBoard = me.up('pvmMulTemplateDataDashBord').down('#checkModelData').getActiveTab();
        combineDashBoard._setAssigners();
    },
    _setRemark: function () {
        var me = this;
        var checkModel = OrientExtUtil.TreeHelper.getSelectNodes(me)[0];
        var item = Ext.create('OrientTdm.Common.Extend.Form.OrientForm', {
            successCallback: function () {
                checkModel.raw.remark = this.down('[name=remark]').getValue();
                this.up('window').close();
            },
            actionUrl: serviceName + '/PVMMulCheckRelation/saveRemark.rdm',
            items: [
                {
                    xtype: 'hidden',
                    name: 'id',
                    value: checkModel.getId()
                }, {
                    fieldLabel: '备注',
                    xtype: 'textarea',
                    name: 'remark',
                    allowBlank: false,
                    value: checkModel.raw.remark
                }
            ]
        });
        OrientExtUtil.WindowHelper.createWindow(item, {
            title: '设置备注',
            buttons: [
                {
                    text: '保存',
                    iconCls: 'icon-save',
                    handler: function () {
                        this.up('window').down('orientForm').fireEvent('saveOrientForm');
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
        }, 200, 100);
    },
    createLeftBar: function () {
        var me = this;

        var retVal = [];

        retVal.push({
                iconCls: 'icon-create',
                tooltip: '新增数据检查表',
                itemId: 'createByModel',
                disabled: me.preview ? true : false,
                scope: me,
                handler: me._addModel
            },
            {
                iconCls: 'icon-create',
                tooltip: '新增模板检查表',
                itemId: 'createByTemplate',
                disabled: me.preview ? true : false,
                scope: me,
                handler: me._addByTemplate
            },
            {
                iconCls: 'icon-create',
                tooltip: '新增自定义检查表',
                itemId: 'createByHtml',
                disabled: me.preview ? true : false,
                scope: me,
                handler: me._addByHtmlTemplate
            }
        );

        retVal.push('-',{
            iconCls: 'icon-delete',
            tooltip: '删除',
            disabled: me.preview ? true : false,
            itemId: 'delete',
            scope: this,
            handler: me._removeModel
        });

        retVal.push('-',{
            type: 'button',
            tooltip: '设置签署角色',
            itemId:'setCheckRole',
            disabled: true,
            handler: me._setAssigners,
            scope: me,
            iconCls: 'icon-setSignRole'
        });

        retVal.push({
            tooltip: '设置备注',
            itemId: 'setRemark',
            disabled: true,
            iconCls: 'icon-update',
            handler: function () {
                me._setRemark();
            }
        });
        return retVal;
    }
});

