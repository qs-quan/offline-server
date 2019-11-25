/**
 * 知识库管理
 * Created by dailin on 2019/5/5 13:47.
 */

Ext.define('OrientTdm.KnowledgeBaseMgr.KnowledgeBaseMgrDashBoard', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.knowledgeBaseMgrDashBoard',

    initComponent: function () {
        var me = this;
        var functionId = me.itemId;
        if (functionId) {
            //截取ID
            functionId = functionId.substr(functionId.indexOf("-") + 1, functionId.length);
        }
        // 获取该用户的下的这个功能点所包含的schema
        OrientExtUtil.AjaxHelper.doRequest(serviceName + "/modelTree/getSchemaCombobox.rdm", {
            belongFunctionId: functionId
        }, false, function (response) {
            var retV = response.decodedData;
            var success = retV.success;
            if (success) {
                var results = retV.results;
                me.schemaId = results instanceof Array ? results[0]["id"] : results["id"];
            }
        });
        // 获取知识库的modelId和模板id
        var modelId = OrientExtUtil.ModelHelper.getModelId("T_ZSK", me.schemaId);
        var templateId = OrientExtUtil.ModelHelper.getTemplateId(modelId,"知识库管理-知识库管理");
        var mainPanel = Ext.create('OrientTdm.Common.Extend.Grid.OrientModelGrid', {
            modelId: modelId,
            isView: 0,
            region: 'center',
            padding: '0 0 0 5',
            layout: 'fit',
            templateId: templateId
        });

        Ext.apply(me, {
            layout: 'fit',
            items: [mainPanel]
        });
        me.callParent(arguments);
    }
});


