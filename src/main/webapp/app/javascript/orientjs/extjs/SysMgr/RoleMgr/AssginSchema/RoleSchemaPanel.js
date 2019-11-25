/**
 * Created by enjoy on 2016/5/25 0025.
 */
Ext.define("OrientTdm.SysMgr.RoleMgr.AssginSchema.RoleSchemaPanel", {
    extend: 'OrientTdm.SysMgr.RoleMgr.Common.AssignPanel',
    alias: 'widget.roleSchemaPanel',
    iconCls:'icon-assignSchema',
    config: {
        roleId: ''
    },
    requires: [
        "OrientTdm.SysMgr.RoleMgr.AssginSchema.AssignSchemaGrid"
    ],
    initComponent: function () {
        var me = this;
        var buttonPanel = me.createButtonPanel();
        var unSelectedGrid = Ext.create("OrientTdm.SysMgr.RoleMgr.AssginSchema.AssignSchemaGrid", {
            roleId: me.roleId,
            title: '未分配业务模型',
            assigned: false
        });
        var selectedGrid = Ext.create("OrientTdm.SysMgr.RoleMgr.AssginSchema.AssignSchemaGrid", {
            roleId: me.roleId,
            title: '已分配业务模型'
        });
        Ext.apply(me, {
            title: '分配业务模型',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [unSelectedGrid, buttonPanel, selectedGrid]
        });
        this.callParent(arguments);
    }
});