/**
 * Created by Administrator on 2016/7/6 0006.
 */
Ext.define('OrientTdm.TestResourceMgr.GeneralEquipmentMgr.LatestRecordTabPanel', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.LatestRecordTabPanel',
    loadMask: true,
    config: {
        TPL_SBJLJL: TDM_SERVER_CONFIG.TPL_SBJLJL,
        TPL_SBSYJL: TDM_SERVER_CONFIG.TPL_SBSYJL,
        TPL_SBGZJL: TDM_SERVER_CONFIG.TPL_SBGZJL,
        TPL_SBWXJL: TDM_SERVER_CONFIG.TPL_SBWXJL,
        deviceId: null
    },
    defaults: {
        icon: 'app/images/orient.ico'
    },
    initComponent: function () {
        var me = this;
        var calcRecordPanel = me.createCalcRecordPanel(me.deviceId);
        var userRecordPanel = me.createUseRecordPanel(me.deviceId);
        var bugRecordPanel = me.createBugRecordPanel(me.deviceId);
        var repairRecordPanel = me.createRepairRecordPanel(me.deviceId);
        Ext.apply(me, {
            activeTab: 0,
            items: [calcRecordPanel, userRecordPanel, bugRecordPanel, repairRecordPanel]
        });
        this.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
    },
    createCalcRecordPanel: function(deviceId) {
        var me = this;
        var record = [];
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/resourceMgr/getCalcRecordByModelInfo.rdm', {
            tableName: "T_DEVICE",
            schemaId: TDM_SERVER_CONFIG.DEVICE_SCHEMA_ID,
            modelId: "",
            dataId: deviceId,
            single: true
        }, false, function (response) {
            var retV = Ext.decode(response.responseText);
            record = retV.results;
        });
        if(record && record.length>0) {
            record = record[0];
            var dbName = "T_SBJLJL";
            var schemaId = TDM_SERVER_CONFIG.DEVICE_SCHEMA_ID;
            var modelId = OrientExtUtil.ModelHelper.getModelId(dbName, schemaId);
            var templateId = OrientExtUtil.ModelHelper.getTemplateId(modelId, me.TPL_SBJLJL);
            var modelDesc;
            OrientExtUtil.AjaxHelper.doRequest(serviceName + "/modelData/getGridModelDesc.rdm", {
                modelId: modelId,
                templateId: templateId,
                isView: 0
            }, false, function (response) {
                modelDesc = response.decodedData.results.orientModelDesc;
            });
            var form = Ext.create("OrientTdm.Common.Extend.Form.OrientDetailModelForm", {
                title: '设备计量记录',
                bindModelName: modelDesc.dbName,
                modelDesc: modelDesc,
                listeners: {
                    beforerender: function () {
                        form.originalData = Ext.apply(form.originalData || {}, record);
                    }
                }
            });
            return form;
        }
        else {
            var panel = Ext.create('Ext.panel.Panel', {
                title: '设备计量记录',
                html: '<p>无记录</p>'
            });
            return panel;
        }
    },
    createUseRecordPanel: function(deviceId) {
        var me = this;
        var dbName = "T_SBSYJL";
        var schemaId = TDM_SERVER_CONFIG.DEVICE_SCHEMA_ID;
        var modelId = OrientExtUtil.ModelHelper.getModelId(dbName, schemaId);
        var templateId = OrientExtUtil.ModelHelper.getTemplateId(modelId, me.TPL_SBSYJL);
        var record = OrientExtUtil.ModelHelper.createDataQuery(dbName, schemaId, [
            new CustomerFilter("T_DEVICE_"+schemaId+"_ID", CustomerFilter.prototype.SqlOperation.Equal, "", deviceId)
        ], "", "C_JCSJ_"+modelId, true);
        if(record && record.length>0) {
            record = record[0];
            var modelDesc;
            OrientExtUtil.AjaxHelper.doRequest(serviceName + "/modelData/getGridModelDesc.rdm", {
                modelId: modelId,
                templateId: templateId,
                isView: 0
            }, false, function (response) {
                modelDesc = response.decodedData.results.orientModelDesc;
            });
            var form = Ext.create("OrientTdm.Common.Extend.Form.OrientDetailModelForm", {
                title: '设备使用记录',
                bindModelName: modelDesc.dbName,
                modelDesc: modelDesc,
                listeners: {
                    beforerender: function () {
                        form.originalData = Ext.apply(form.originalData || {}, record);
                    }
                }
            });
            return form;
        }
        else {
            var panel = Ext.create('Ext.panel.Panel', {
                title: '设备使用记录',
                html: '<p>无记录</p>'
            });
            return panel;
        }
    },
    createBugRecordPanel: function(deviceId) {
        var me = this;
        var dbName = "T_SBGZJL";
        var schemaId = TDM_SERVER_CONFIG.DEVICE_SCHEMA_ID;
        var modelId = OrientExtUtil.ModelHelper.getModelId(dbName, schemaId);
        var templateId = OrientExtUtil.ModelHelper.getTemplateId(modelId, me.TPL_SBGZJL);
        var record = OrientExtUtil.ModelHelper.createDataQuery(dbName, schemaId, [
            new CustomerFilter("T_DEVICE_"+schemaId+"_ID", CustomerFilter.prototype.SqlOperation.Equal, "", deviceId)
        ], "", "C_GZSJ_"+modelId, true);
        if(record && record.length>0) {
            record = record[0];
            var modelDesc;
            OrientExtUtil.AjaxHelper.doRequest(serviceName + "/modelData/getGridModelDesc.rdm", {
                modelId: modelId,
                templateId: templateId,
                isView: 0
            }, false, function (response) {
                modelDesc = response.decodedData.results.orientModelDesc;
            });
            var form = Ext.create("OrientTdm.Common.Extend.Form.OrientDetailModelForm", {
                title: '设备故障记录',
                bindModelName: modelDesc.dbName,
                modelDesc: modelDesc,
                listeners: {
                    beforerender: function () {
                        form.originalData = Ext.apply(form.originalData || {}, record);
                    }
                }
            });
            return form;
        }
        else {
            var panel = Ext.create('Ext.panel.Panel', {
                title: '设备故障记录',
                html: '<p>无记录</p>'
            });
            return panel;
        }
    },
    createRepairRecordPanel: function(deviceId) {
        var me = this;
        var dbName = "T_SBWXJL";
        var schemaId = TDM_SERVER_CONFIG.DEVICE_SCHEMA_ID;
        var modelId = OrientExtUtil.ModelHelper.getModelId(dbName, schemaId);
        var templateId = OrientExtUtil.ModelHelper.getTemplateId(modelId, me.TPL_SBWXJL);
        var record = OrientExtUtil.ModelHelper.createDataQuery(dbName, schemaId, [
            new CustomerFilter("T_DEVICE_"+schemaId+"_ID", CustomerFilter.prototype.SqlOperation.Equal, "", deviceId)
        ], "", "C_WXSJ_"+modelId, true);
        if(record && record.length>0) {
            record = record[0];
            var modelDesc;
            OrientExtUtil.AjaxHelper.doRequest(serviceName + "/modelData/getGridModelDesc.rdm", {
                modelId: modelId,
                templateId: templateId,
                isView: 0
            }, false, function (response) {
                modelDesc = response.decodedData.results.orientModelDesc;
            });
            var form = Ext.create("OrientTdm.Common.Extend.Form.OrientDetailModelForm", {
                title: '设备维护记录',
                bindModelName: modelDesc.dbName,
                modelDesc: modelDesc,
                listeners: {
                    beforerender: function () {
                        form.originalData = Ext.apply(form.originalData || {}, record);
                    }
                }
            });
            return form;
        }
        else {
            var panel = Ext.create('Ext.panel.Panel', {
                title: '设备维护记录',
                html: '<p>无记录</p>'
            });
            return panel;
        }
    }
});
