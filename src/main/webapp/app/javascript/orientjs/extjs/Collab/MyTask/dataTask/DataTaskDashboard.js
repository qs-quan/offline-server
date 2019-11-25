/**
 * Created by Seraph on 16/8/29.
 */
Ext.define('OrientTdm.Collab.MyTask.dataTask.DataTaskDashboard', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    requires: [
    ],
    initComponent: function () {
        var me = this;
        var queryPanel = Ext.create("OrientTdm.Collab.MyTask.dataTask.DataTaskQueryPanel", {
            region: 'north',
            title: '查询',
            height: 120,
            collapsible: true,
            bodyStyle:{background:'#ffffff'}
        });

        var listPanel = Ext.create("OrientTdm.Collab.MyTask.dataTask.DataTaskListPanel", {
            region: 'center',
            padding: '0 0 0 5',
            title: '数据任务'
        });
        Ext.apply(me, {
            layout: 'border',
            items: [
                queryPanel, listPanel
            ],
            iconCls:'icon-dataTask',
            northPanel: queryPanel,
            centerPanel: listPanel
        });
        me.callParent(arguments);
    }
});