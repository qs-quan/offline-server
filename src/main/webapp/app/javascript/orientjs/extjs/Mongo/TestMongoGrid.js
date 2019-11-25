/**
 * 测试Mongo面板
 * Created by GNY on 2018/5/29
 */
Ext.define('OrientTdm.Mongo.TestMongoGrid', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.testMongoGrid',
    config: {
        schemaId: 680,
        templateName: 'Mongo',
        modelName: 'T_TEST'
    },
    initComponent: function () {
        var me = this;
        var modelId = OrientExtUtil.ModelHelper.getModelId(me.modelName, me.schemaId);
        var templateId = OrientExtUtil.ModelHelper.getTemplateId(modelId, me.templateName);
        var modelGrid = Ext.create('OrientTdm.Common.Extend.Grid.OrientModelGrid', {
            region: 'center',
            modelId: modelId,
            isView: 0,
            templateId: templateId,
            afterInitComponent: function () {
            }
        });
        Ext.apply(me, {
            layout: 'border',
            items: [modelGrid],
            modelGrid: modelGrid
        });
        me.callParent(arguments);
    }
});