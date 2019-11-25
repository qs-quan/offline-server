/**
 * 报告预览
 * @Author GreyWolf
 * @Date 2019/8/22 16:21
 * @Version 1.0
 */
Ext.define('OrientTdm.BackgroundMgr.DocReport.Power.PowerDocPreviewPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.powerDocPreviewPanel',
    beforeInitComponent: Ext.emptyFn,
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
    },

    afterInitComponent: function () {
        var me = this;
        me._initDocPreview(me.reportName);
    },
    _initDocPreview: function (reportName) {
        var me = this;
        me.removeAll();
        var itemId = me.getItemId();

        me.add({
            xtype: 'orientPanel',
            html: '<iframe width="100%" height="100%" marginwidth="0" framespacing="0" marginheight="0" frameborder="0" style="z-index:100;" src = "' + serviceName +
                '/app/views/doctemplate/power/wordTemplateCreate.jsp?testTypeNodeId=' + me.testTypeNodeId + '&itemId=' + itemId + '&testTypeId=' + me.testTypeId + '&templateId=' + me.templateId+'"></iframe>',
            layout: 'fit',
            height: 0.9 * globalHeight - 30
        });
    }
});