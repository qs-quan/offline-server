/**
 * Created by Seraph on 16/7/5.
 */
Ext.define('OrientTdm.Collab.ProjectMng.ProjectMngDashboard', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.projectMngDashboard',
    initComponent: function () {
        var me = this;

        var centerPanel = Ext.create("OrientTdm.Common.Extend.Panel.OrientPanel", {
            region: 'center',
            layout: 'fit',
            itemId:'prjRespRegion',
            activeTabName : '',
            padding: '0 0 0 5'
        });

        var leftPanel = Ext.create("OrientTdm.Collab.ProjectMng.mainFrame.ProjectTree", {
            collapsible: true,
            width: 280,
            minWidth: 280,
            maxWidth: 400,
            region: 'west'
        });
        Ext.apply(this, {
            layout: 'border',
            items: [leftPanel, centerPanel],
            westPanel: leftPanel,
            centerPanel: centerPanel
        });

        this.callParent(arguments);
    }
});