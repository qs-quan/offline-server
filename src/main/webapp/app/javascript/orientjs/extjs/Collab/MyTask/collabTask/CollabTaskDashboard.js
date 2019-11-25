/**
 * Created by Seraph on 16/8/29.
 */
Ext.define('OrientTdm.Collab.MyTask.collabTask.CollabTaskDashboard', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    requires: [
    ],
    initComponent: function () {
        var me = this;
        var queryPanel = Ext.create("OrientTdm.Collab.MyTask.collabTask.CollabTaskQueryPanel", {
            region: 'north',
            title: '查询',
            height: 120,
            collapsible: true,
            bodyStyle:{background:'#ffffff'}
        });

        var listPanel = Ext.create("OrientTdm.Collab.MyTask.collabTask.CollabTaskListPanel", {
            region: 'center',
            padding: '0 0 0 5',
            title: '协同任务'
        });
        Ext.apply(me, {
            layout: 'border',
            items: [
                queryPanel, listPanel
            ],
            iconCls:'icon-collabTask',
            northPanel: queryPanel,
            centerPanel: listPanel
        });
        me.callParent(arguments);
    }
});