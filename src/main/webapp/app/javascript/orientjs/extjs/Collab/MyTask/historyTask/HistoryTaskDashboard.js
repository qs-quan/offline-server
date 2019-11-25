/**
 * Created by Seraph on 16/8/29.
 */
Ext.define('OrientTdm.Collab.MyTask.historyTask.HistoryTaskDashboard', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    requires: [
    ],
    config: {
        useGroup: false,
        taskType: null
    },
    initComponent: function () {
        var me = this;
        var queryPanel = Ext.create("OrientTdm.Collab.MyTask.historyTask.HistoryTaskQueryPanel", {
            region: 'north',
            title: '查询',
            height: 150,
            collapsible: true,
            bodyStyle:{background:'#ffffff'},
            taskType: me.taskType
        });

        var listPanel = Ext.create("OrientTdm.Collab.MyTask.historyTask.HistoryTaskListPanel", {
            region: 'center',
            padding: '0 0 0 5',
            title: '历史任务',
            useGroup: me.useGroup,
            taskType: me.taskType
        });
        Ext.apply(me, {
            layout: 'border',
            items: [
                queryPanel, listPanel
            ],
            iconCls:'icon-hisTask',
            northPanel: queryPanel,
            centerPanel: listPanel
        });
        me.callParent(arguments);
    }
});