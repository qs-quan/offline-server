/**
 * Created by Seraph on 16/9/26.
 */
Ext.define('OrientTdm.Collab.Template.TemplateMngDashboard', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    initComponent: function () {
        var me = this;

        var centerPanel = Ext.create("OrientTdm.Common.Extend.Panel.OrientPanel", {
            region: 'center',
            layout: 'fit'
        });

        var leftPanel = Ext.create("OrientTdm.Collab.Template.TemplateMngTreePanel", {
            collapsible: true,
            width: 250,
            minWidth: 250,
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