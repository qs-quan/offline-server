Ext.define('OrientTdm.SysMgr.RoleMgr.RoleMain', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.RoleMain',
    requires: [
        'OrientTdm.SysMgr.RoleMgr.RoleList',
        'OrientTdm.SysMgr.RoleMgr.RoleInfo',
        'OrientTdm.SysMgr.RoleMgr.AssignFunction.RoleFunctionPanel'
    ],
    initComponent: function () {
        var me = this;
        var centerItems = [];
        var roleList = Ext.create('OrientTdm.SysMgr.RoleMgr.RoleList', {
            region: 'center'
        });
        centerItems.push(roleList);
        var southPanel = Ext.create('OrientTdm.SysMgr.RoleMgr.RoleInfo', {
            region: 'south',
            height: 0.5 * globalHeight,
            collapsed: true
        });
        centerItems.push(southPanel);
        var centerPanel = Ext.create('OrientTdm.Common.Extend.Panel.OrientPanel', {
            layout: 'border',
            region: 'center',
            items: centerItems
        });
        var eastPanel = Ext.create('OrientTdm.SysMgr.RoleMgr.AssignFunction.RoleFunctionPanel', {
            title: '分配功能点',
            region: 'east',
            width: '35%',
            collapsed: true
        });

        Ext.apply(me, {
            layout: 'border',
            items: [centerPanel, eastPanel],
            centerPanel: roleList,
            southPanel: southPanel,
            eastPanel: eastPanel
        });
        me.callParent(arguments);
    }
});