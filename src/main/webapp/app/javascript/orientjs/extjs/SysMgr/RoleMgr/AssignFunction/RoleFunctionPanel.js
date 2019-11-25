/**
 * Created by enjoy on 2016/5/25 0025.
 */
Ext.define("OrientTdm.SysMgr.RoleMgr.AssignFunction.RoleFunctionPanel", {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.roleFunctionPanel',
    requires: [
        "OrientTdm.SysMgr.RoleMgr.AssignFunction.AssignFunctionTree"
    ],
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            layout: 'fit',
            collapsible: true
        });
        me.callParent(arguments);
        me.addEvents("showRoleFunction");
    },
    initEvents: function () {
        var me = this;
        me.mon(me, "showRoleFunction", me.showRoleFunction, me);
    },
    showRoleFunction: function (roleId) {
        var me = this;
        this.expand(true);
        if (Ext.isEmpty(me.roleId)) {
            //加载树
            me.add(Ext.create("OrientTdm.SysMgr.RoleMgr.AssignFunction.AssignFunctionTree", {
                roleId: roleId
            }));
            me.roleId = roleId;
        } else {
            //刷新树
            var treePanel = me.down("assignFunctionTree");
            treePanel.roleId = roleId;
            treePanel.getStore().getProxy().setExtraParam("roleId", roleId);
            treePanel.getStore().load();
        }
    }
});
