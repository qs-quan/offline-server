/**
 * bom角色权限配置中间面板
 * Created by dailin on 2019/4/1 17:13.
 */

Ext.define('OrientTdm.RoleBomMgr.Panel.TabPanel.RoleBomTabPanel',{
    extend: 'OrientTdm.Common.Extend.Panel.OrientTabPanel',
    alias: 'widget.powerTabPanel',
    config: {},
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        me.addEvents("initModelDataByNode");
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'initModelDataByNode', me.initModelDataByNode, me);
    },
    initModelDataByNode: function (node) {
        var me = this;
        me.items.each(function (item, index) {
            me.remove(item);
        });

        var roleBomGridpanel = Ext.create("OrientTdm.RoleBomMgr.Panel.RoleBomPanel", {
            title: '配置【' + node.raw.text + '】节点角色',
            nodeId: node.raw.id
        });
        me.insert(0,roleBomGridpanel);
        me.setActiveTab(roleBomGridpanel);
    }
});