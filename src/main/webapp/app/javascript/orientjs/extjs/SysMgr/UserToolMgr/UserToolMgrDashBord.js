/**
 * Created by enjoy on 2016/4/30 0030.
 */
Ext.define('OrientTdm.SysMgr.UserToolMgr.UserToolMgrDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.userToolMgrDashBord',
    requires: [
        'OrientTdm.SysMgr.UserToolMgr.UserToolGroupTree',
        'OrientTdm.SysMgr.UserToolMgr.UserToolList',
        'OrientTdm.SysMgr.UserToolMgr.Query.UserToolQueryForm'
    ],
    initComponent: function () {
        var me = this;
        var queryPanel = Ext.create("OrientTdm.SysMgr.UserToolMgr.Query.UserToolQueryForm", {
            region: 'north',
            title: '查询',
            height: 100,
            collapsible: true
        });
        //创建中间面板
        var listPanel = Ext.create("OrientTdm.SysMgr.UserToolMgr.UserToolList", {
            region: 'center',
            padding: '0 0 0 5',
            title: '用户工具列表'
        });
        var centerPanel = Ext.create("OrientTdm.Common.Extend.Panel.OrientPanel", {
            layout: 'border',
            region: 'center',
            items: [
                queryPanel, listPanel
            ],
            northPanel: queryPanel,
            centerPanel: listPanel
        });
        //左侧工具分组tree
        var groupTree = Ext.create("OrientTdm.SysMgr.UserToolMgr.UserToolGroupTree", {
            width: 280,
            minWidth: 280,
            maxWidth: 400,
            region: 'west'
        });
        Ext.apply(me, {
            layout: 'border',
            items: [centerPanel, groupTree],
            westPanel: groupTree,
            centerPanel: listPanel
        });
        me.callParent(arguments);
    }
});