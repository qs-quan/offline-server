/**
 * Created by Seraph on 16/7/25.
 */
Ext.define('OrientTdm.Collab.MyTask.MyTaskDashboard', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    requires: [
        'OrientTdm.Collab.MyTask.util.HisTaskHelper'
    ],
    initComponent: function () {
        var me = this;

        var centerPanel = Ext.create("OrientTdm.Collab.MyTask.mainFrame.MainPanel", {
            region: 'center',
            padding: '0 0 0 5'
        });

        var leftPanel = Ext.create("OrientTdm.Collab.MyTask.mainFrame.MyTaskTree", {
            collapsible: true,
            width: 150,
            minWidth: 150,
            maxWidth: 400,
            title: '任务导航',
            region: 'west'
        });
        Ext.apply(this, {
            id: 'myTaskDashboard',
            layout: 'border',
            items: [leftPanel, centerPanel],
            westPanel: leftPanel,
            centerPanel: centerPanel
        });

        this.callParent(arguments);
    }
});