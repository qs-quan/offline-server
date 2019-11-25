Ext.define('OrientTdm.TestInfo.PieChart.StatisticMgrDashboard', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.StatisticMgrDashboard',

    initComponent: function () {
        var me = this;

        var leaderChartPanel = Ext.create('OrientTdm.TestInfo.PieChart.LeaderChart.LeaderChartMgrDashboard', {
            flex: 3,
            width: "100%"
        });

        var userTestDataGridPanel = Ext.create('OrientTdm.TestInfo.PieChart.UserTestDataInfoGrid.UserTesTDataGrid', {
            title: '统计数据【委托单】',
            flex: 2,
            width: "100%",
            autoShow: true,
            autoScroll: true,
            autoRender: true
        });

        Ext.apply(me, {
            layout: 'vbox',
            width: "100%",
            items: [leaderChartPanel, userTestDataGridPanel]
        });
        me.callParent(arguments);
    }
});