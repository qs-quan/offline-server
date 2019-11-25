/**
 * Created by Seraph on 16/8/29.
 */
Ext.define('OrientTdm.Collab.MyTask.auditTask.AuditTaskDashboard', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    requires: [
    ],
    initComponent: function () {
        var me = this;
        var queryPanel = Ext.create("OrientTdm.Collab.MyTask.auditTask.AuditTaskQueryPanel", {
            region: 'north',
            title: '查询',
            height: 120,
            collapsible: true,
            bodyStyle:{background:'#ffffff'}
        });

        var listPanel = Ext.create("OrientTdm.Collab.MyTask.auditTask.AuditTaskListPanel", {
            region: 'center',
            padding: '0 0 0 5',
            title: '审批任务'
        });
        Ext.apply(me, {
            layout: 'border',
            items: [
                queryPanel, listPanel
            ],
            iconCls:'icon-auditTask',
            northPanel: queryPanel,
            centerPanel: listPanel
        });
        me.callParent(arguments);
    }
});