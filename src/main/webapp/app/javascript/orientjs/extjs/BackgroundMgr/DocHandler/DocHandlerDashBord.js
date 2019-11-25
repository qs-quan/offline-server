/**
 * Created by enjoy on 2016/4/30 0030.
 */
Ext.define('OrientTdm.BackgroundMgr.DocHandler.DocHandlerDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.docHandlerDashBord',
    requires: [
        'OrientTdm.BackgroundMgr.DocHandler.DocHandlerList',
        'OrientTdm.BackgroundMgr.DocHandler.Query.DocHandlerQueryForm'
    ],
    initComponent: function () {
        var me = this;
        var queryPanel = Ext.create('OrientTdm.BackgroundMgr.DocHandler.Query.DocHandlerQueryForm', {
            region: 'north',
            title: '查询',
            height: 110,
            collapsible: true,
            bodyStyle:{background:'#ffffff'}
        });
        //创建中间面板
        var listPanel = Ext.create('OrientTdm.BackgroundMgr.DocHandler.DocHandlerList', {
            region: 'center',
            padding: '0 0 0 5',
            title: '报告处理器'
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