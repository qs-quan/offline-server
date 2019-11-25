/**
 * Created by enjoy on 2016/4/30 0030.
 */
Ext.define('OrientTdm.SysMgr.PortalMgr.PortalDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.portalDashBord',
    requires: [
        'OrientTdm.SysMgr.PortalMgr.PortalList',
        'OrientTdm.SysMgr.PortalMgr.Query.PortalQueryForm'
    ],
    initComponent: function () {
        var me = this;
        var queryPanel = Ext.create("OrientTdm.SysMgr.PortalMgr.Query.PortalQueryForm", {
            region: 'north',
            title: '查询',
            height: 100,
            collapsible: true
        });
        //创建中间面板
        var listPanel = Ext.create("OrientTdm.SysMgr.PortalMgr.PortalList", {
            region: 'center',
            padding: '0 0 0 5',
            title: '磁帖列表'
        });
        Ext.apply(me, {
            layout: 'border',
            items: [
                queryPanel, listPanel
            ],
            northPanel: queryPanel,
            centerPanel: listPanel
        });
        me.callParent(arguments);
    }
});