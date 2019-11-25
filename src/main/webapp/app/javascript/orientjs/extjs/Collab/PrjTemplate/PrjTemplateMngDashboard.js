/**
 * 试验项目模板管理
 */
Ext.define('OrientTdm.Collab.PrjTemplate.PrjTemplateMngDashboard', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    initComponent: function () {
        var me = this;

        var centerPanel = Ext.create("OrientTdm.Common.Extend.Panel.OrientPanel", {
            region: 'center',
            layout: 'fit'
        });

        var leftPanel = Ext.create("OrientTdm.Collab.PrjTemplate.PrjTemplateMngTreePanel", {
            collapsible: true,
            width: 250,
            minWidth: 250,
            maxWidth: 400,
            region: 'west',
            sysjglParam: me.sysjglParam == undefined ? undefined : me.sysjglParam
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