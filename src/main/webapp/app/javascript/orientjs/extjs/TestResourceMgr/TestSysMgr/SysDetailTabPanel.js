/**
 * Created by Administrator on 2016/7/6 0006.
 */
Ext.define('OrientTdm.TestResourceMgr.TestSysMgr.SysDetailTabPanel', {
    extend: 'Ext.tab.Panel',
    alias: 'widget.SysDetailTabPanel',
    loadMask: true,
    config: {
        TPL_SB: TDM_SERVER_CONFIG.TPL_SB,
        TPL_SYJ: TDM_SERVER_CONFIG.TPL_SYJ,
        TPL_SYYP: TDM_SERVER_CONFIG.TPL_SYYP,
        TPL_SYTD: TDM_SERVER_CONFIG.TPL_SYTD,
        deviceIds: "",
        unitIds: "",
        sampleIds: "",
        teamTypeIds: ""
    },
    defaults: {
        icon: 'app/images/orient.ico'
    },
    initComponent: function () {
        var me = this;
        var deviceGrid = me.createDeviceGrid(me.deviceIds);
        var unitGrid = me.createUnitGrid(me.unitIds);
        var sampleGrid = me.createSampleGrid(me.sampleIds);
        var teamTypeGrid = me.createTeamTypeGrid(me.teamTypeIds);
        Ext.apply(me, {
            activeTab: 0,
            items: [deviceGrid, unitGrid, sampleGrid, teamTypeGrid]
        });
        this.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
    },
    createDeviceGrid: function(deviceIds) {
        var me = this;
        var schemaId = TDM_SERVER_CONFIG.DEVICE_SCHEMA_ID;
        var customerFilter = [];
        if(deviceIds) {
            customerFilter.push(new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.In, "", deviceIds));
        }
        else {
            customerFilter.push(new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.IsNull, "", ""));
        }
        var modelId = OrientExtUtil.ModelHelper.getModelId("T_DEVICE", schemaId);
        var templateId = OrientExtUtil.ModelHelper.getTemplateId(modelId, me.TPL_SB);
        var modelGrid = Ext.create("OrientTdm.Common.Extend.Grid.OrientModelGrid", {
            title: '设备',
            modelId: modelId,
            isView: 0,
            templateId: templateId,
            customerFilter: customerFilter,
            afterInitComponent: function () {
                var me = this;
                var toolbar = me.dockedItems[0];
                toolbar.removeAll();
            }
        });

        return modelGrid;
    },
    createUnitGrid: function(unitIds) {
        var me = this;
        var schemaId = TDM_SERVER_CONFIG.DEVICE_SCHEMA_ID;
        var customerFilter = [];
        if(unitIds) {
            customerFilter.push(new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.In, "", unitIds));
        }
        else {
            customerFilter.push(new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.IsNull, "", ""));
        }
        var modelId = OrientExtUtil.ModelHelper.getModelId("T_SYJ", schemaId);
        var templateId = OrientExtUtil.ModelHelper.getTemplateId(modelId, me.TPL_SYJ);
        var modelGrid = Ext.create("OrientTdm.Common.Extend.Grid.OrientModelGrid", {
            title: '试验件',
            modelId: modelId,
            isView: 0,
            templateId: templateId,
            customerFilter: customerFilter,
            afterInitComponent: function () {
                var me = this;
                var toolbar = me.dockedItems[0];
                toolbar.removeAll();
            }
        });

        return modelGrid;
    },
    createSampleGrid: function(sampleIds) {
        var me = this;
        var schemaId = TDM_SERVER_CONFIG.DEVICE_SCHEMA_ID;
        var customerFilter = [];
        if(sampleIds) {
            customerFilter.push(new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.In, "", sampleIds));
        }
        else {
            customerFilter.push(new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.IsNull, "", ""));
        }
        var modelId = OrientExtUtil.ModelHelper.getModelId("T_SYYP", schemaId);
        var templateId = OrientExtUtil.ModelHelper.getTemplateId(modelId, me.TPL_SYYP);
        var modelGrid = Ext.create("OrientTdm.Common.Extend.Grid.OrientModelGrid", {
            title: '试验样品',
            region: 'center',
            modelId: modelId,
            isView: 0,
            templateId: templateId,
            customerFilter: customerFilter,
            afterInitComponent: function () {
                var me = this;
                var toolbar = me.dockedItems[0];
                toolbar.removeAll();
            }
        });

        return modelGrid;
    },
    createTeamTypeGrid: function(teamTypeIds) {
        var me = this;
        var schemaId = TDM_SERVER_CONFIG.DEVICE_SCHEMA_ID;
        var customerFilter = [];
        if(teamTypeIds) {
            customerFilter.push(new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.In, "", teamTypeIds));
        }
        else {
            customerFilter.push(new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.IsNull, "", ""));
        }
        var modelId = OrientExtUtil.ModelHelper.getModelId("T_SYTD", schemaId);
        var templateId = OrientExtUtil.ModelHelper.getTemplateId(modelId, me.TPL_SYTD);
        var modelGrid = Ext.create("OrientTdm.Common.Extend.Grid.OrientModelGrid", {
            title: '试验团队',
            region: 'center',
            modelId: modelId,
            isView: 0,
            templateId: templateId,
            customerFilter: customerFilter,
            afterInitComponent: function () {
                var me = this;
                var toolbar = me.dockedItems[0];
                toolbar.removeAll();
            }
        });

        return modelGrid;
    }
});
