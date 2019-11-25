/**
 * 模板管理面板
 * Created by dailin on 2019/7/9 11:30.
 */

Ext.define('OrientTdm.DataDictionaryMgr.Template.Center.TemplateShowRegion',{
    extend: 'OrientTdm.Common.Extend.Panel.OrientTabPanel',
    alias: 'widget.templateShowRegion',
   /* requires: [
        'OrientTdm.DataDictionaryMgr.Template.Center.TesterGridpanel'
    ],*/
    config: {
        belongFunctionId: ''
    },
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        me.addEvents('initUserDataByTypeNode');
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'initUserDataByTypeNode', me.initUserDataByTypeNode, me);
    },
    initUserDataByTypeNode: function (node) {
        var me = this;
        if (!me.down("#SYMBGL_" + node.ID)) {
            var modelId = OrientExtUtil.ModelHelper.getModelId("T_SYMB", OrientExtUtil.FunctionHelper.getSchemaId(), false);
            var modelGrid = Ext.create('OrientTdm.DataDictionaryMgr.Template.Center.TemplateGridpanel', {
                nodeId: node.ID,
                modelId: modelId,
                modelName: "T_SYMB",
                customerFilter: [new CustomerFilter("T_SYLX_" + OrientExtUtil.FunctionHelper.getSYZYSchemaId() + "_ID",
                    CustomerFilter.prototype.SqlOperation.Equal, "", node.ID)],
                region: 'center'
            });
            me.add( {
                itemId: 'SYMBGL_' + node.ID,
                layout: 'border',
                title: "【" + node.text + "】" + "试验模板配置",
                closable: true,
                items: [modelGrid]
            });
        }
        me.setActiveTab(me.down("#SYMBGL_" + node.ID));
    }

});

