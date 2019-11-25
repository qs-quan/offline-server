/**
 * Bom节点角色权限配置
 * Created by dailin on 2019/4/1 11:14.
 */

Ext.define('OrientTdm.RoleBomMgr.RoleBomMgrDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.roleBomMgrDashBord',

    initComponent: function () {
        var me = this;

        //创建中间面板
        var centerPanel = Ext.create("OrientTdm.RoleBomMgr.Panel.TabPanel.RoleBomTabPanel", {
            region: 'center',
            padding: '0 0 0 5'
        });
        //Tbom
        var tbomPanel = Ext.create("OrientTdm.RoleBomMgr.Tree.RoleBomTree", {
            width: 280,
            minWidth: 280,
            maxWidth: 400,
            region: 'west',
            useArrows: false,
            itemId: "roleBomTree",
            rootVisible: false
        });
        Ext.apply(me, {
            layout: 'border',
            items: [centerPanel, tbomPanel],
            westPanel: tbomPanel,
            centerPanel: centerPanel
        });
        me.callParent(arguments);
    }
});