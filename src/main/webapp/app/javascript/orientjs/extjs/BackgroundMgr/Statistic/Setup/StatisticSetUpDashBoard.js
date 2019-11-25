/**
 * Created by qjs on 2016/12/19.
 */
Ext.define('OrientTdm.BackgroundMgr.Statistic.Setup.StatisticSetUpDashBoard', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.statisticSetUpDashBoard',
    requires: [
        'OrientTdm.BackgroundMgr.Statistic.Setup.StatisticSetUpList',
        'OrientTdm.BackgroundMgr.Statistic.Setup.Query.StatisticQueryForm'
    ],
    initComponent: function () {
        var me = this;
        var queryPanel = Ext.create('OrientTdm.BackgroundMgr.Statistic.Setup.Query.StatisticQueryForm', {
            region: 'north',
            title: '查询',
            height: 110,
            collapsible: true,
            bodyStyle: {background: '#ffffff'}
        });
        //创建中间面板
        var listPanel = Ext.create('OrientTdm.BackgroundMgr.Statistic.Setup.StatisticSetUpList', {
            region: 'center',
            padding: '0 0 0 5',
            title: '统计设置'
        });
        Ext.apply(me, {
            layout: 'border',
            items: [
                queryPanel, listPanel
            ]
        });
        me.callParent(arguments);
    }
});