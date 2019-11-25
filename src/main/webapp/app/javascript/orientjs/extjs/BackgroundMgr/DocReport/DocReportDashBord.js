/**
 * Created by enjoy on 2016/4/30 0030.
 */
Ext.define('OrientTdm.BackgroundMgr.DocReport.DocReportDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.docReportDashBord',
    requires: [
        'OrientTdm.BackgroundMgr.DocReport.DocReportList',
        'OrientTdm.BackgroundMgr.DocReport.Query.DocReportQueryForm'
    ],
    initComponent: function () {
        var me = this;
        var queryPanel = Ext.create('OrientTdm.BackgroundMgr.DocReport.Query.DocReportQueryForm', {
            region: 'north',
            title: '查询',
            height: 110,
            collapsible: true,
            bodyStyle:{background:'#ffffff'}
        });
        //创建中间面板
        var listPanel = Ext.create('OrientTdm.BackgroundMgr.DocReport.DocReportList', {
            region: 'center',
            padding: '0 0 0 5',
            title: '报告模板'
        });
        Ext.apply(me, {
            layout: 'border',
            items: [
                queryPanel, listPanel
            ]
        });
        me.callParent(arguments);
    }
});