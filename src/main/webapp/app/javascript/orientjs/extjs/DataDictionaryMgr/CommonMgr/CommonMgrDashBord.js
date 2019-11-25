/**
 * 普通的一个功能点对应一个gridpanel通用的js
 * Created by dailin on 2019/5/31 11:26.
 */

Ext.define('OrientTdm.DataDictionaryMgr.CommonMgr.CommonMgrDashBord',{
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.commonMgrDashBord',

    initComponent: function () {
        var me = this;
        var functionId = me.itemId;
        if (functionId) {
            //截取ID
            functionId = functionId.substr(functionId.indexOf("-") + 1, functionId.length);
        }
        var modelId = "";
        var templateId = "";
        OrientExtUtil.AjaxHelper.doRequest(serviceName + "/modelTree/getCurrentUserTBomInfo.rdm", {
            belongFunctionId: functionId
        }, false, function (response) {
            var retV = response.decodedData;
            if (retV.success) {
                modelId = retV.results[0].TABLE_ID;
                templateId = retV.results[0].TEMPLATE_ID;
            }
        });

        var mainPanel = Ext.create('OrientTdm.Common.Extend.Grid.OrientModelGrid', {
            modelId: modelId,
            isView: 0,
            region: 'center',
            showAnalysisBtns: false,
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