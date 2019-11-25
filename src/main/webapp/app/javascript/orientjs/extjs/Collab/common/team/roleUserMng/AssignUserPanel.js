/**
 * Created by Seraph on 16/7/11.
 */
Ext.define("OrientTdm.Collab.common.team.roleUserMng.AssignUserPanel", {
    extend: 'OrientTdm.SysMgr.RoleMgr.Common.AssignPanel',
    requires: [
        "OrientTdm.Collab.common.team.roleUserMng.AssignUserGrid"
    ],
    config : {
        assignCallback : Ext.emptyFn
    },
    initComponent: function () {
        var me = this;

        //创建按钮操作区域
        var buttonPanel = me.createButtonPanel();
        var unSelectedParams = {
            roleId: me.roleId,
            title: '未分配用户',
            assigned: false
        };
        var SelectedParams = {
            roleId: me.roleId,
            title: '已分配用户'
        };
        if (me.ids) {
            unSelectedParams.ids = me.ids;
            SelectedParams.ids = me.ids;
        }
        var unSelectedGrid = Ext.create("OrientTdm.Collab.common.team.roleUserMng.AssignUserGrid", unSelectedParams);
        var selectedGrid = Ext.create("OrientTdm.Collab.common.team.roleUserMng.AssignUserGrid", SelectedParams);
        Ext.apply(me, {
            header: false,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [unSelectedGrid, buttonPanel, selectedGrid]
        });

        unSelectedGrid.getStore().load();
        selectedGrid.getStore().load();
        this.callParent(arguments);
        me.addEvents("showDetail");
    },
    initEvents: function () {
        var me = this;
        me.callParent(arguments);
        me.mon(me, 'showDetail', me.showDetail, me);
    },
    showDetail: function () {
        var me = this;
        this.expand(true);
    }
});