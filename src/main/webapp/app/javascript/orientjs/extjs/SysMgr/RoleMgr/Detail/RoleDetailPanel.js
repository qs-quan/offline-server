/**
 * Created by enjoy on 2016/5/25 0025.
 */
Ext.define("OrientTdm.SysMgr.RoleMgr.Detail.RoleDetailPanel", {
    extend: 'OrientTdm.SysMgr.RoleMgr.Common.AssignPanel',
    alias: 'widget.roleDetailPanel',
    config: {
        roleId: ""
    },
    requires: [
        "OrientTdm.SysMgr.RoleMgr.AssginSchema.AssignSchemaGrid",
        "OrientTdm.SysMgr.RoleMgr.AssignUser.AssignUserGrid",
        "OrientTdm.SysMgr.RoleMgr.AssignRight.AssignRightGrid"
    ],
    initComponent: function () {
        var me = this;
        var selectedRightsGrid = Ext.create("OrientTdm.SysMgr.RoleMgr.AssignRight.AssignRightGrid", {
            roleId: me.roleId,
            title: '已分配权限'
        });
        var selectedSchemasGrid = Ext.create("OrientTdm.SysMgr.RoleMgr.AssginSchema.AssignSchemaGrid", {
            roleId: me.roleId,
            title: '已分配schema'
        });
        var selectedUsersGrid = Ext.create("OrientTdm.SysMgr.RoleMgr.AssignUser.AssignUserGrid", {
            roleId: me.roleId,
            title: '已分配用户'
        });
        Ext.apply(me, {
            title: '角色信息',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [selectedUsersGrid, selectedSchemasGrid, selectedRightsGrid]
        });
        this.callParent(arguments);
    }
});