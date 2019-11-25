/**
 * Created by enjoy on 2016/4/30 0030.
 */
Ext.define('OrientTdm.BackgroundMgr.PVMHtml.PVMHtmlDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.pvmHtmlDashBord',
    requires: [
        'OrientTdm.BackgroundMgr.PVMHtml.PVMHtmlList',
        'OrientTdm.BackgroundMgr.PVMHtml.Query.PVMHtmlQueryForm'
    ],
    initComponent: function () {
        var me = this;
        var queryPanel = Ext.create('OrientTdm.BackgroundMgr.PVMHtml.Query.PVMHtmlQueryForm', {
            region: 'north',
            title: '查询',
            height: 110,
            collapsible: true,
            bodyStyle:{background:'#ffffff'}
        });
        //创建中间面板
        var listPanel = Ext.create('OrientTdm.BackgroundMgr.PVMHtml.PVMHtmlList', {
            region: 'center',
            padding: '0 0 0 5',
            title: '检查模型Html模板'
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