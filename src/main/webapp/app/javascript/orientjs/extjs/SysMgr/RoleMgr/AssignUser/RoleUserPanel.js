/**
 * Created by enjoy on 2016/5/25 0025.
 */
Ext.define("OrientTdm.SysMgr.RoleMgr.AssignUser.RoleUserPanel", {
    extend: 'OrientTdm.SysMgr.RoleMgr.Common.AssignPanel',
    alias: 'widget.roleUserPanel',
    iconCls:'icon-assignUser',
    config: {
        roleId: ''
    },
    requires: [
        "OrientTdm.SysMgr.RoleMgr.AssignUser.AssignUserGrid"
    ],
    initComponent: function () {
        var me = this;
        //创建按钮操作区域
        var buttonPanel = me.createButtonPanel();
        var unSelectedGrid = Ext.create("OrientTdm.SysMgr.RoleMgr.AssignUser.AssignUserGrid", {
            roleId: me.roleId,
            title: '未分配用户',
            assigned: false
        });
        var selectedGrid = Ext.create("OrientTdm.SysMgr.RoleMgr.AssignUser.AssignUserGrid", {
            roleId: me.roleId,
            title: '已分配用户'
        });
        Ext.apply(me, {
            title: '分配用户',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [unSelectedGrid, buttonPanel, selectedGrid]
        });
        this.callParent(arguments);
    }
});