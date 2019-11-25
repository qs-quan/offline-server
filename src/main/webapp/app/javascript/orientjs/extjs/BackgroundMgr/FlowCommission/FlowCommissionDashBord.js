Ext.define('OrientTdm.BackgroundMgr.FlowCommission.FlowCommissionDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.FlowCommissionDashBord',
    requires: [
        'OrientTdm.BackgroundMgr.FlowCommission.FlowListGrid'
    ],
    initComponent: function () {
        var me = this;
        var flowList = Ext.create('OrientTdm.BackgroundMgr.FlowCommission.FlowListGrid', {
            title: '审批流程',
            flex: 2,
            usePage: false,
            multiSelect: false,
            selType: "rowmodel"
        });

        var userList = Ext.create('OrientTdm.BackgroundMgr.FlowCommission.UserListGrid', {
            title: '代办人',
            flex: 3
        });

        Ext.apply(me, {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [flowList, userList],
            flowList: flowList,
            userList: userList
        });
        me.callParent(arguments);
    }
});