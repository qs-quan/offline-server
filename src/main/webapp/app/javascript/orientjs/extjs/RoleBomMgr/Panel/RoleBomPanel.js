/**
 * bom角色权限配置中间的三个部分组合成一个panel
 * Created by dailin on 2019/4/2 9:07.
 */

Ext.define('OrientTdm.RoleBomMgr.Panel.RoleBomPanel',{
    extend: 'OrientTdm.RoleBomMgr.Panel.RoleBomButtonPanel',
    alias: 'widget.roleBomPanel',
    initComponent: function () {
        var me = this;
        me.getRoleBomIds(me.nodeId);
        var leftRoleBomGridpanel = Ext.create("OrientTdm.RoleBomMgr.Panel.GridPanel.RoleBomGridpanel", {
            title: "未分配权限角色",
            region: 'west',
            flex: 10,
            padding: '0 0 0 5',
            operate: "not in",
            ids: me.roleIds
        });
        var tbomPanel = me.createButtonPanel();
        var rightRoleBomGridpanel = Ext.create("OrientTdm.RoleBomMgr.Panel.GridPanel.RoleBomGridpanel", {
            title: "已分配权限",
            flex: 10,
            region: 'east',
            padding: '0 0 0 5',
            operate: "in",
            ids: me.roleIds
        });

        Ext.apply(me, {
            layout: 'border',
            items: [leftRoleBomGridpanel,tbomPanel, rightRoleBomGridpanel],
            westPanel: leftRoleBomGridpanel,
            centerPanel: tbomPanel,
            eastPanel: rightRoleBomGridpanel
            // eastPanel: rightRoleBomGridpanel
        });
        me.callParent(arguments);
        me.mon(me,'getRoleBomIds',me.getRoleBomIds, me);
    },
    // 根据nodeId获取到所有有权限的角色的Id
    getRoleBomIds: function (nodeId) {
        var me = this;
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomRoleController/getRoleIdsByNodeId.rdm',{
            nodeId: nodeId
        }, false, function (response) {
            if (response.decodedData.success) {
                me.roleIds = response.decodedData.results;
            }
        })
    }

});