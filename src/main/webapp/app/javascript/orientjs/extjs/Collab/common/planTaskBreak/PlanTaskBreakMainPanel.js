/**
 * Created by Seraph on 16/8/19.
 */
Ext.define('OrientTdm.Collab.common.planTaskBreak.PlanTaskBreakMainPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.planTaskBreakMainPanel',
    config : {
        rootModelName : null,
        rootDataId : null
    },
    initComponent: function () {
        var me = this;

        var centerPanel = Ext.create("OrientTdm.Common.Extend.Panel.OrientPanel", {
            region: 'center',
            layout: 'fit',
            itemId:'taskRespRegion',
            configInfo: me.configInfo,
            padding: '0 0 0 5'
        });

        var leftPanel = Ext.create("OrientTdm.Collab.common.planTaskBreak.PlanTaskBreakTree", {
            collapsible: true,
            width: 280,
            minWidth: 280,
            maxWidth: 400,
            region: 'west',
            configInfo: me.configInfo,
            rootModelName : me.rootModelName,
            rootDataId : me.rootDataId
        });

        Ext.apply(this, {
            id : 'planTaskBreak',
            layout: 'border',
            items: [leftPanel, centerPanel],
            westPanel: leftPanel,
            centerPanel: centerPanel
        });

        this.callParent(arguments);
    }
});