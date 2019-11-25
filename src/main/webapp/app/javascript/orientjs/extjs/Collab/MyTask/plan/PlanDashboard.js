/**
 * Created by Seraph on 16/8/29.
 */
Ext.define('OrientTdm.Collab.MyTask.plan.PlanDashboard', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    requires: [
    ],
    initComponent: function () {
        var me = this;
        var queryPanel = Ext.create("OrientTdm.Collab.MyTask.plan.PlanQueryPanel", {
            region: 'north',
            title: '查询',
            height: 120,
            collapsible: true,
            bodyStyle:{background:'#ffffff'}
        });

        var listPanel = Ext.create("OrientTdm.Collab.MyTask.plan.PlanListPanel", {
            region: 'center',
            padding: '0 0 0 5',
            title: '计划'
        });
        Ext.apply(me, {
            layout: 'border',
            items: [
                queryPanel, listPanel
            ],
            iconCls:'icon-planTask',
            northPanel: queryPanel,
            centerPanel: listPanel
        });
        me.callParent(arguments);
    }
});