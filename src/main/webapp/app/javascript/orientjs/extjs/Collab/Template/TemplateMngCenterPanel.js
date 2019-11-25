/**
 * Created by Seraph on 16/9/26.
 */
Ext.define('OrientTdm.Collab.Template.TemplateMngCenterPanel', {
    extend : 'OrientTdm.Common.Extend.Panel.OrientPanel',
    config : {
        schemaId : null,
        modelName : null
    },
    initComponent: function () {
        var me = this;

        var northPanel = Ext.create("OrientTdm.Collab.Template.TemplateMngQueryPanel", {
            title: '查询',
            collapsible: true,
            region : 'north',
            layout : 'fit',
            height : 100
        });

        var centerPanel = Ext.create("OrientTdm.Collab.common.template.TemplateListPanel", {
            title: '模板列表',
            region: 'center',
            layout: 'fit',
            personal : false,
            schemaId : me.schemaId,
            modelName : me.modelName
        });

        Ext.apply(this, {
            layout: 'border',
            items: [northPanel, centerPanel],
            northPanel: northPanel,
            centerPanel: centerPanel,
            listeners: {
                afterrender: function (ct) {
                    centerPanel.mainTab = ct.ownerCt.ownerCt.ownerCt;
                }
            }
        });

        this.callParent(arguments);
    }
});