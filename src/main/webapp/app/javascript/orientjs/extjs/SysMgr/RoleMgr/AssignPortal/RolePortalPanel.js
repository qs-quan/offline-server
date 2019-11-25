/**
 * Created by enjoy on 2016/5/25 0025.
 */
Ext.define("OrientTdm.SysMgr.RoleMgr.AssignPortal.RolePortalPanel", {
    extend: 'OrientTdm.SysMgr.RoleMgr.Common.AssignPanel',
    alias: 'widget.rolePortalPanel',
    iconCls:'icon-assignPortal',
    config: {
        roleId: ''
    },
    requires: [
        'OrientTdm.SysMgr.RoleMgr.AssignPortal.AssignPortalGrid'
    ],
    initComponent: function () {
        var me = this;
        //创建按钮操作区域
        var buttonPanel = me.createButtonPanel();
        var unSelectedGrid = Ext.create("OrientTdm.SysMgr.RoleMgr.AssignPortal.AssignPortalGrid", {
            roleId: me.roleId,
            title: '未分配磁贴',
            assigned: false
        });
        var selectedGrid = Ext.create("OrientTdm.SysMgr.RoleMgr.AssignPortal.AssignPortalGrid", {
            roleId: me.roleId,
            title: '已分配磁贴'
        });
        Ext.apply(me, {
            title: '分配磁贴',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [unSelectedGrid, buttonPanel, selectedGrid]
        });
        this.callParent(arguments);
    }
});