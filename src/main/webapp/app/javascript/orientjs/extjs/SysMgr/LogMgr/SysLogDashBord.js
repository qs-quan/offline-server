/**
 * Created by enjoy on 2016/4/30 0030.
 */
Ext.define('OrientTdm.SysMgr.LogMgr.SysLogDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.sysLogDashBord',
    requires: [
        "OrientTdm.SysMgr.LogMgr.SysLogList",
        "OrientTdm.SysMgr.LogMgr.Query.SysLogQuery"
    ],
    initComponent: function () {
        var me = this;
        var queryPanel = Ext.create("OrientTdm.SysMgr.LogMgr.Query.SysLogQuery", {
            region: 'north',
            title: '查询',
            height: 160,
            collapsible: true
        });
        //创建中间面板
        var listPanel = Ext.create("OrientTdm.SysMgr.LogMgr.SysLogList", {
            region: 'center',
            padding: '0 0 0 5',
            title: '系统日志'
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