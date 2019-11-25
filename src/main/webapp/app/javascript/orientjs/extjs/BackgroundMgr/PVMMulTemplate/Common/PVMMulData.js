/**
 * Created by qjs on 2016/12/23.
 */
Ext.define('OrientTdm.BackgroundMgr.PVMMulTemplate.Common.PVMMulData', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.pvmMulData',
    requires: [],
    layout: 'fit',
    config: {
        modelId:'',
        templateId:'',
        preview:false
    },
    initComponent: function () {
        var me = this;
        var modelGrid = null;

        var modelId = me.modelId;

        modelGrid = Ext.create("OrientTdm.BackgroundMgr.PVMMulTemplate.Common.PVMMulOrientModelGrid", {
            usePage: false,
            modelId: modelId,//针对taskmulcheckrelation表查询modeldata只需要checkmodelid
            isView: 0,
            templateId:me.templateId,
            customerFilter: [],//[customerFilter],
            queryUrl:serviceName + '/PVMMulCheckRelation/getModelGridData.rdm',
            createUrl:serviceName + '/PVMMulCheckRelation/createModelGridData.rdm',
            updateUrl:serviceName + '/PVMMulCheckRelation/updateModelGridData.rdm',
            deleteUrl: serviceName + '/PVMMulCheckRelation/deleteModelGridData.rdm',
            preview:me.preview,
            afterInitComponent: function () {
                me._customGrid(this);
            }
        });
        modelGrid.on("customRefreshGrid", function () {
            if (me.up('pvmMulTemplateDataDashBord').westPanelComponent) {
                me.up('pvmMulTemplateDataDashBord').westPanelComponent.fireEvent("reconfigPVMData");
            }
        });

        Ext.apply(me, {
            items: [
                modelGrid
            ]
        });
        this.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.mon(me, 'activate', me.reconfig, me);
        me.callParent();
    },
    _createCustomIdFilter: function (dataIds) {
        var customerFilter = dataIds.join(',');
        return customerFilter;
    },
    reconfig: function () {
        var me = this;
        var params = {
            modelId: me.modelId,
            templateId: me.templateId
        };
        var modelGrid = me.down('orientPVMMulModelGrid');
        modelGrid.fireEvent('refreshGrid');
        //OrientExtUtil.AjaxHelper.doRequest(serviceName + '/CheckModel/getBusinessModelDesc.rdm', params, false, function (resp) {
        //    var respData = resp.decodedData.results;
        //    var dataIds = respData.dataIds;
        //    var customerFilter = me._createCustomIdFilter(dataIds);
        //    var modelGrid = me.down('orientModelGrid');
        //    modelGrid.setCustomerFilter([customerFilter]);
        //    modelGrid.fireEvent('refreshGridByCustomerFilter', [customerFilter]);
        //});
    },
    _customGrid: function (gridPanel) {
        var me = this;

        var keepDictionart = ['详细', '附件', '导出'];
        //增加按钮
        var toolBar = gridPanel.dockedItems[0] || gridPanel.dockedItems.get(0);

        var toRemoveItems = [];

        var operatDictionart = Ext.Array.clone(keepDictionart);
        operatDictionart.push('新增', '修改', '删除');
        Ext.each(toolBar.items.items, function (btn) {
            if (!Ext.Array.contains(operatDictionart, btn.text)) {
                toRemoveItems.push(btn);
            }
        });

        if(me.preview) {
            Ext.each(toolBar.items.items,function(btn) {
                if(btn.text=="新增") toRemoveItems.push(btn);
                if(btn.text=="修改") toRemoveItems.push(btn);
                if(btn.text=="删除") toRemoveItems.push(btn);
                if(btn.text=="附件") toRemoveItems.push(btn);
            });
        }

        Ext.each(toRemoveItems, function (toRemoveItem) {
            toolBar.remove(toRemoveItem);
        });
        //定制新增按钮 新增后增加绑定关系
        var addButton = gridPanel.dockedItems[0].down('button[text=新增]');
        if (addButton) {
            Ext.Function.interceptAfter(addButton,'handler',function(button) {
                //新增表单
                var customPanel = button.orientBtnInstance.customPanel;
                var btnSave = customPanel.down("#save");
                var btnSaveAndClose = customPanel.down("#saveAndClose");
                btnSaveAndClose.handler = Ext.bind(me.saveModelGridData,me,[customPanel],true);
                btnSave.handler = Ext.bind(me.saveModelGridData,me,[customPanel],true);
            });
        }

        //定制修改按钮
        var editButton = gridPanel.dockedItems[0].down('button[text=修改]');
        if (editButton) {
            Ext.Function.interceptAfter(editButton,'handler',function(button) {
                var customPanel = button.orientBtnInstance.customPanel;
                var btnSave = customPanel.down("#save");
                //var btnSaveAndClose = customPanel.down("#saveAndClose");
                btnSave.handler = Ext.bind(me.updateModelGridData,me,[gridPanel],true);
            });
        }

        //定制详细按钮 详细按钮不需要定制

        //定制删除按钮 DeleteModelDataButton 有问题 暂放
        var deleteButton = gridPanel.dockedItems[0].down('button[text=删除]');
        if (deleteButton) {
            deleteButton.handler = Ext.bind(me.deleteModelData,me,[gridPanel],true);
        }

        //定制附件按钮 ShowFileButton
        //var fileButton = gridPanel.dockedItems[0].down('button[text=附件]');
        //if(fileButton) {
        //    fileButton.handler = Ext.bind(me.showFile,me,[gridPanel],true);
        //}

        //定制导出按钮 ExportModelDataButton
        var exportButton = gridPanel.dockedItems[0].down('button[text=导出]');
        if(exportButton) {
            exportButton.handler = Ext.bind(me.exportModelData,me,[gridPanel],true);
        }


    },
    saveModelGridData:function (btn, event, modelGridPanel) {
        var me = this;
        btn.up("form").fireEvent("saveOrientForm", {
            modelId: me.modelId,
            templateId: me.templateId
        }, [btn]);
    },
    deleteModelData:function(btn, event,modelGridPanel) {
        //var me = this;
        var selections = modelGridPanel.getSelectionModel().getSelection();
        if (selections.length === 0) {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.atleastSelectOne);
        } else {
            //执行删除询问
            Ext.MessageBox.confirm(OrientLocal.prompt.confirm, OrientLocal.prompt.deleteConfirm, function (btn) {
                if (btn == 'yes') {
                    //获取待删除数据ID
                    var toDelIds = OrientExtUtil.GridHelper.getSelectRecordIds(modelGridPanel);
                    Ext.getBody().mask("请稍后...", "x-mask-loading");
                    Ext.Ajax.request({
                        url: modelGridPanel.getStore().getProxy().api["delete"],
                        params: {
                            toDelIds: toDelIds,
                            modelId: modelGridPanel.modelId,
                            templateId:modelGridPanel.templateId
                        },
                        success: function (response) {
                            Ext.getBody().unmask();
                            modelGridPanel.fireEvent('refreshGrid');
                        }
                    });
                }
            });
        }
    },
    updateModelGridData:function(btn, event,modelGridPanel) {
        var me = this;
        var selections = modelGridPanel.getSelectionModel().getSelection();
        var dataId = selections[0].data.ID;
        btn.up("form").fireEvent("saveOrientForm", {
            dataId: dataId,
            modelId: me.modelId,
            templateId: me.templateId
        }, [btn]);
    },
    exportModelData:function(btn, event,modelGridPanel) {
        var me = this;
        var selections = modelGridPanel.getSelectionModel().getSelection();
        var modelId = modelGridPanel.modelId;
        var templateId = modelGridPanel.templateId;
        if (selections.length === 0) {
            //执行导出询问
            Ext.MessageBox.confirm(OrientLocal.prompt.confirm, OrientLocal.prompt.exportAll, function (btn) {
                if (btn == 'yes') {
                    me.doExport(modelId,templateId);
                }
            });
        } else {
            toExportDataIds = OrientExtUtil.GridHelper.getSelectRecordIds(modelGridPanel);
            me.doExport(modelId, templateId,toExportDataIds);
        }
    },
    doExport:function(modelId,templateId,toExportDataIds) {
        OrientExtUtil.AjaxHelper.doRequest(serviceName + "/PVMMulCheckRelation/preapareExportData.rdm", {
            'modelId': modelId,
            'templateId':templateId,
            'toExportDataIds': Ext.isEmpty(toExportDataIds) ? "" : toExportDataIds
        }, true, function (resp) {
            window.location.href = serviceName + "/orientForm/downloadByName.rdm?fileName=" + resp.decodedData.results;
        });
    },
    showFile:function(btn,event,modelGridPanel) {
        var me = btn;


    }
});