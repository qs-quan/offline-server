/**
 * Created by enjoy on 2016/5/25 0025.
 */
Ext.define("OrientTdm.SysMgr.RoleMgr.AssignRight.RoleRightPanel", {
    extend: 'OrientTdm.SysMgr.RoleMgr.Common.AssignPanel',
    alias: 'widget.roleRightPanel',
    iconCls:'icon-assignRight',
    config: {
        roleId: ''
    },
    requires: [
        "OrientTdm.SysMgr.RoleMgr.AssignRight.AssignRightGrid"
    ],
    initComponent: function () {
        var me = this;
        //创建按钮操作区域
        var buttonPanel = me.createButtonPanel();
        var unSelectedGrid = Ext.
            create("OrientTdm.SysMgr.RoleMgr.AssignRight.AssignRightGrid", {
            roleId: me.roleId,
            title: '未分配权限',
            assigned: false
        });
        var selectedGrid = Ext.create("OrientTdm.SysMgr.RoleMgr.AssignRight.AssignRightGrid", {
            roleId: me.roleId,
            title: '已分配权限'
        });
        Ext.apply(me, {
            title: '分配权限',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [unSelectedGrid, buttonPanel, selectedGrid]
        });
        this.callParent(arguments);
    }
});