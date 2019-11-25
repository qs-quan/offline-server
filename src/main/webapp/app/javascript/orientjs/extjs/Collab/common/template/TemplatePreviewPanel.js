/**
 * Created by Seraph on 16/9/26.
 */
Ext.define('OrientTdm.Collab.common.template.TemplatePreviewPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    config : {
        templateId : null,
        title : null
    },
    initComponent: function () {
        var me = this;

        var centerPanel = Ext.create("OrientTdm.Common.Extend.Panel.OrientPanel", {
            region: 'center',
            layout: 'fit'
        });

        var westPanel = Ext.create("OrientTdm.Collab.common.template.TemplatePreviewTree", {
            dataPrincipal: me.dataPrincipal,
            region: 'west',
            layout: 'fit',
            templateId : me.templateId,
            collapsible: true,
            width: 250,
            minWidth: 250,
            maxWidth: 400
        });

        Ext.apply(this, {
            id : 'collabTemplatePreviewPanel',
            title : me.title,
            layout : 'border',
            items : [centerPanel, westPanel],
            centerPanel : centerPanel,
            westPanel : westPanel,
            tbar : me._getToolbar()
        });

        this.callParent(arguments);
    },
    _getToolbar : function (params) {
        var tools = [];
        return tools;
    }
});