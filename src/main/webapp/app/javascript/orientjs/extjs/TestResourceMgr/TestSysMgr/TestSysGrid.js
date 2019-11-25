/**
 * Created by FZH  on 2016/10/24.
 */
Ext.define('OrientTdm.TestResourceMgr.TestSysMgr.TestSysGrid', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientModelGrid',
    alias: 'widget.TestSysGrid',
    config: {

    },
    requires: [
        "OrientTdm.TestResourceMgr.TestSysMgr.SysDetailTabPanel"
    ],
    initComponent: function () {
        var me = this;
        this.callParent(arguments);
    },
    afterInitComponent: function () {
        var me = this;

        me.on({
            select: me._doSysDetailShow,
            scope: me
        });

        var toolbar = me.dockedItems[0];
    },
    afterRender: function() {
        var me = this;
        this.callParent(arguments);

        var treeNode = me.bindNode;
        var tbomModels = treeNode.raw.tBomModels;
    },
    _doSysDetailShow: function(rowModel, record, index) {
        var me = this;
        var modelId = me.modelId;
        var deviceIds = record.get("C_SB_"+modelId);
        var unitIds = record.get("C_SYJ_"+modelId);
        var sampleIds = record.get("C_SYYP_"+modelId);
        var teamTypeIds = record.get("C_SYTD_"+modelId);
        me.customPanel = Ext.create("OrientTdm.TestResourceMgr.TestSysMgr.SysDetailTabPanel", {
            deviceIds: deviceIds,
            unitIds: unitIds,
            sampleIds: sampleIds,
            teamTypeIds: teamTypeIds
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
    }
});