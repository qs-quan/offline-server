/**
 * Created by enjoy on 2016/3/11 0011.
 */
Ext.define('OrientTdm.SysMgr.RoleMgr.RoleInfo', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientTabPanel',
    alias: 'widget.RoleInfo',
    requires: [
        'OrientTdm.SysMgr.RoleMgr.Detail.RoleDetailPanel',
        'OrientTdm.SysMgr.RoleMgr.AssginSchema.RoleSchemaPanel',
        'OrientTdm.SysMgr.RoleMgr.AssignUser.RoleUserPanel',
        'OrientTdm.SysMgr.RoleMgr.AssignRight.RoleRightPanel',
        'OrientTdm.SysMgr.RoleMgr.AssignPortal.RolePortalPanel'
    ],
    initComponent: function () {
        var me = this;
        this.title = '角色信息';
        this.collapsible = true;
        Ext.apply(this, {
            items: []
        });
        me.callParent(arguments);
        me.addEvents('showRoleDetail');
    },
    initEvents: function () {
        var me = this;
        me.callParent(arguments);
        me.mon(me, 'showRoleDetail', me.showRoleDetail, me);
    },
    showRoleDetail: function (roleId) {
        var me = this;
        this.expand(true);
        if (Ext.isEmpty(me.roleId)) {
            //第一次加载
            me.roleId = roleId;
            this.removeAll(true);
            //var infoTab = Ext.create('OrientTdm.SysMgr.RoleMgr.Detail.RoleDetailPanel', {
            //    roleId: roleId
            //});
            var assignSchemaTab = Ext.create('OrientTdm.SysMgr.RoleMgr.AssginSchema.RoleSchemaPanel', {
                roleId: roleId
            });
            var assignUserTab = Ext.create('OrientTdm.SysMgr.RoleMgr.AssignUser.RoleUserPanel', {
                roleId: roleId
            });
            var assignOperationTab = Ext.create('OrientTdm.SysMgr.RoleMgr.AssignRight.RoleRightPanel', {
                roleId: roleId
            });
            var assignPortalTab = Ext.create('OrientTdm.SysMgr.RoleMgr.AssignPortal.RolePortalPanel', {
                roleId: roleId
            });
            this.add([assignSchemaTab, assignUserTab, assignOperationTab,assignPortalTab]);
            this.setActiveTab(0);
            //手动加载数据
            //infoTab.doRefreshStore();
        } else {
            //设置为新的roleId
            var sonPanels = this.query('assignPanel');
            Ext.each(sonPanels, function (sonPanel) {
                sonPanel.setRoleId(roleId);
            });
            this.getActiveTab().fireEvent('activate');
        }
    }
});