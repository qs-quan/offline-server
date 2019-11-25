/**
 * Created by FZH  on 2016/10/24.
 */
Ext.define('OrientTdm.TestResourceMgr.GeneralEquipmentMgr.EquipmentGrid', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientModelGrid',
    alias: 'widget.EquipmentGrid',
    config: {
        TPL_SBSYJL: TDM_SERVER_CONFIG.TPL_SBSYJL,
        TPL_SBGZJL: TDM_SERVER_CONFIG.TPL_SBGZJL,
        TPL_SBWXJL: TDM_SERVER_CONFIG.TPL_SBWXJL
    },
    requires: [
        'OrientTdm.TestResourceMgr.GeneralEquipmentMgr.LatestRecordTabPanel'
    ],
    initComponent: function () {
        var me = this;
        this.callParent(arguments);
    },
    afterInitComponent: function () {
        var me = this;

        me.on({
            select: me._doLatestRecordShow,
            scope: me
        });

        var toolbar = me.dockedItems[0];
        toolbar.add({
            text: '历史记录',
            handler: me._doHisRecordClicked,
            icon: serviceName + '/app/images/icons/default/modeldata/addCommonCheckItem.png',
            scope: me
        });
    },
    afterRender: function() {
        var me = this;
        this.callParent(arguments);

      /*  var treeNode = me.bindNode;
        var tbomModels = treeNode.raw.tBomModels;*/
    },
    _doLatestRecordShow: function(rowModel, record, index) {
        var me = this;
        var deviceId = record.get("ID");
        me.customPanel = Ext.create("OrientTdm.TestResourceMgr.GeneralEquipmentMgr.LatestRecordTabPanel", {
            deviceId: deviceId
        });
        var sourthPanel = me.ownerCt.down("panel[region=south]");
        if(!sourthPanel) {
            sourthPanel = Ext.create("OrientTdm.Common.Extend.Panel.OrientPanel", {
                region: 'south',
                padding: '0 0 0 0',
                deferredRender: false
            });
            me.ownerCt.add(sourthPanel);
            me.ownerCt.doLayout();
        }
        me.customPanel.maxHeight = (globalHeight - 300) * 0.9;
        me.customPanel.minHeight = (globalHeight - 300) * 0.4;
        sourthPanel.expand(true);
        sourthPanel.removeAll();
        sourthPanel.add(me.customPanel);
        sourthPanel.doLayout();
        sourthPanel.show();
    },
    _doHisRecordClicked: function (toolbar) {
        var me = this;
        var schemaId = TDM_SERVER_CONFIG.DEVICE_SCHEMA_ID;
        if (!OrientExtUtil.GridHelper.hasSelectedOne(me)) {
            return;
        }
        var selectedRecord = OrientExtUtil.GridHelper.getSelectedRecord(me);//选择的数据
        var record = selectedRecord[0];
        var deviceId = record.get('id');//主表ID

        var useRecPanel = me._getUseRecordPanel(deviceId, record);
        var bugRecPanel = me._getBugRecordPanel(deviceId, record);
        var repairRecPanel = me._getRepairRecordPanel(deviceId, record);

        var tabPanel = Ext.create("OrientTdm.Common.Extend.Panel.OrientTabPanel", {
            activeTab: 0,
            items: [useRecPanel, bugRecPanel, repairRecPanel]
        });

        var tableDisplayName = me.modelDesc.text;//表的名称
        OrientExtUtil.WindowHelper.createWindow(tabPanel, {
            title: '查看【<span style="color: red; ">' + tableDisplayName + '</span>】历史记录',
            layout: "fit",
            width: 0.8 * globalWidth,
            height: 0.8 * globalHeight,
            buttonAlign: 'center',
            buttons: [
                {
                    text: '关闭',
                    iconCls: 'icon-back',
                    handler: function (btn) {
                        btn.up('window').close();
                    }
                }
            ]
        });
    },
    _getUseRecordPanel: function (deviceId, record) {
        var me = this;
        var schemaId = TDM_SERVER_CONFIG.DEVICE_SCHEMA_ID;
        var filterColumnName = "T_DEVICE_" + schemaId + "_ID";//主表表名ID
        var customerFilter = new CustomerFilter(filterColumnName, CustomerFilter.prototype.SqlOperation.In, "", deviceId);//过滤条件
        var tableName = "T_SBSYJL";
        var modelId = OrientExtUtil.ModelHelper.getModelId(tableName, schemaId);
        var templateId = OrientExtUtil.ModelHelper.getTemplateId(modelId, me.TPL_SBSYJL);
        var modelGrid = Ext.create("OrientTdm.Common.Extend.Grid.OrientModelGrid", {
            region: 'center',
            modelId: modelId,
            isView: 0,
            templateId: templateId,
            customerFilter: [customerFilter],
            afterInitComponent: function () {
                var that = this;
                that.modelDesc.disAbleModifyColumns = [filterColumnName];
                that.modelDesc.disAbleAddColumns = [filterColumnName];
                var toolbar = that.dockedItems[0];
                var addButton = toolbar.child('[text=新增]');
                if(addButton){
                    Ext.Function.interceptAfter(addButton, 'handler', function (button) {
                        //新增表单出现后 相关定制
                        var customPanel = button.orientBtnInstance.customPanel;
                        if (customPanel) {
                            var formValue = {};
                            var refValue = {
                                name: record.data['C_NAME_' + me.modelDesc.modelId],
                                id: deviceId
                            };
                            formValue[filterColumnName + '_display'] = Ext.encode([refValue]);
                            formValue[filterColumnName] = deviceId;
                            customPanel.getForm().setValues(formValue);
                            //注入额外参数
                            //customPanel.originalData = Ext.apply(customPanel.originalData || {}, {});
                        }
                    });
                }
            }
        });

        var panel = Ext.create("OrientTdm.Common.Extend.Panel.OrientPanel", {
            title: '设备使用记录',
            layout: "border",
            padding: '0 0 0 0',
            deferredRender: false,
            items: [modelGrid]
        });

        return panel;
    },
    _getBugRecordPanel: function (deviceId, record) {
        var me = this;
        var schemaId = TDM_SERVER_CONFIG.DEVICE_SCHEMA_ID;
        var filterColumnName = "T_DEVICE_" + schemaId + "_ID";//主表表名ID
        var customerFilter = new CustomerFilter(filterColumnName, CustomerFilter.prototype.SqlOperation.In, "", deviceId);//过滤条件
        var tableName = "T_SBGZJL";
        var modelId = OrientExtUtil.ModelHelper.getModelId(tableName, schemaId);
        var templateId = OrientExtUtil.ModelHelper.getTemplateId(modelId, me.TPL_SBGZJL);
        var modelGrid = Ext.create("OrientTdm.Common.Extend.Grid.OrientModelGrid", {
            region: 'center',
            modelId: modelId,
            isView: 0,
            templateId: templateId,
            customerFilter: [customerFilter],
            afterInitComponent: function () {
                var that = this;
                that.modelDesc.disAbleModifyColumns = [filterColumnName];
                that.modelDesc.disAbleAddColumns = [filterColumnName];
                var toolbar = that.dockedItems[0];
                var addButton = toolbar.child('[text=新增]');
                if(addButton){
                    Ext.Function.interceptAfter(addButton, 'handler', function (button) {
                        //新增表单出现后 相关定制
                        var customPanel = button.orientBtnInstance.customPanel;
                        if (customPanel) {
                            var formValue = {};
                            var refValue = {
                                name: record.data['C_NAME_' + me.modelDesc.modelId],
                                id: deviceId
                            };
                            formValue[filterColumnName + '_display'] = Ext.encode([refValue]);
                            formValue[filterColumnName] = deviceId;
                            customPanel.getForm().setValues(formValue);
                            //注入额外参数
                            //customPanel.originalData = Ext.apply(customPanel.originalData || {}, {});
                        }
                    });
                }
            }
        });

        var panel = Ext.create("OrientTdm.Common.Extend.Panel.OrientPanel", {
            title: '设备故障记录',
            layout: "border",
            padding: '0 0 0 0',
            deferredRender: false,
            items: [modelGrid]
        });

        return panel;
    },
    _getRepairRecordPanel: function (deviceId, record) {
        var me = this;
        var schemaId = TDM_SERVER_CONFIG.DEVICE_SCHEMA_ID;
        var filterColumnName = "T_DEVICE_" + schemaId + "_ID";//主表表名ID
        var customerFilter = new CustomerFilter(filterColumnName, CustomerFilter.prototype.SqlOperation.In, "", deviceId);//过滤条件
        var tableName = "T_SBWXJL";
        var modelId = OrientExtUtil.ModelHelper.getModelId(tableName, schemaId);
        var templateId = OrientExtUtil.ModelHelper.getTemplateId(modelId, me.TPL_SBWXJL);
        var modelGrid = Ext.create("OrientTdm.Common.Extend.Grid.OrientModelGrid", {
            region: 'center',
            modelId: modelId,
            isView: 0,
            templateId: templateId,
            customerFilter: [customerFilter],
            afterInitComponent: function () {
                var that = this;
                that.modelDesc.disAbleModifyColumns = [filterColumnName];
                that.modelDesc.disAbleAddColumns = [filterColumnName];
                var toolbar = that.dockedItems[0];
                var addButton = toolbar.child('[text=新增]');
                if(addButton){
                    Ext.Function.interceptAfter(addButton, 'handler', function (button) {
                        //新增表单出现后 相关定制
                        var customPanel = button.orientBtnInstance.customPanel;
                        if (customPanel) {
                            var formValue = {};
                            var refValue = {
                                name: record.data['C_NAME_' + me.modelDesc.modelId],
                                id: deviceId
                            };
                            formValue[filterColumnName + '_display'] = Ext.encode([refValue]);
                            formValue[filterColumnName] = deviceId;
                            customPanel.getForm().setValues(formValue);
                            //注入额外参数
                            //customPanel.originalData = Ext.apply(customPanel.originalData || {}, {});
                        }
                    });
                }
            }
        });

        var panel = Ext.create("OrientTdm.Common.Extend.Panel.OrientPanel", {
            title: '设备维护记录',
            layout: "border",
            padding: '0 0 0 0',
            deferredRender: false,
            items: [modelGrid]
        });

        return panel;
    }
});