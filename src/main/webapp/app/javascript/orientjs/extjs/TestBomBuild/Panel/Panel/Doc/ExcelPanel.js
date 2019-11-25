/**
 * excel文档预览或编辑界面
 */

Ext.define('OrientTdm.TestBomBuild.Panel.Panel.Doc.ExcelPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.ExcelPanel',
    config: {
        reportName: ''
    },

    initComponent: function () {
        // 文档路径存在
        var me = this;
        Ext.apply(me, {
            xtype: 'orientPanel',
            html: '<iframe width="100%" height="100%" marginwidth="0" framespacing="0" marginheight="0" frameborder="0" style="z-index:100;" src = "' + serviceName +
                '/app/views/doctemplate/excelView.jsp?reportName=' + me.reportName + '"></iframe>',
            layout: 'fit',
            height: 0.9 *globalHeight - 30
        });

        this.callParent(arguments);
    }
});