/**
 * Created by qjs on 2016/10/21.
 */
Ext.define('OrientTdm.SysMgr.UserMgr.UserDashBoard',{
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.UserDashBoard',
    requires:[
        "OrientTdm.SysMgr.UserMgr.UserMain"
    ],
    initComponent: function() {
        var me = this;
        var queryPanel = Ext.create("OrientTdm.SysMgr.UserMgr.UserSearchForm",{
            region:'north',
            title: '用户查询',
            height: 140,
            collapsible: true,
            bodyStyle:{background:'#ffffff'}
        });
        //创建中间面板
        var listPanel = Ext.create("OrientTdm.SysMgr.UserMgr.UserMain", {
            region: 'center',
            padding: '0 0 0 5',
            title: '用户列表'
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