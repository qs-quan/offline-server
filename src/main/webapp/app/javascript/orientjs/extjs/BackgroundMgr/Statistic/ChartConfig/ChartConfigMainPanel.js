/**
 * Created by Administrator on 2017/4/4 0004.
 */
Ext.define('OrientTdm.BackgroundMgr.Statistic.ChartConfig.ChartConfigMainPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.chartConfigMainPanel',
    requires: [
        'OrientTdm.BackgroundMgr.Statistic.ChartConfig.ChartTypeTree',
        'OrientTdm.BackgroundMgr.Statistic.ChartConfig.ChartInstanceList',
        'OrientTdm.BackgroundMgr.Statistic.ChartConfig.Query.ChartInstanceQueryForm'
    ],
    initComponent: function () {
        var me = this;
        var queryPanel = Ext.create('OrientTdm.BackgroundMgr.Statistic.ChartConfig.Query.ChartInstanceQueryForm', {
            region: 'north',
            title: '查询',
            padding: '0 0 0 5',
            height: 100,
            collapsible: true
        });
        //创建中间面板
        var listPanel = Ext.create('OrientTdm.BackgroundMgr.Statistic.ChartConfig.ChartInstanceList', {
            region: 'center',
            padding: '0 0 0 5',
            title: '图形实例'
        });
        var centerPanel = Ext.create('OrientTdm.Common.Extend.Panel.OrientPanel', {
            layout: 'border',
            region: 'center',
            items: [
                queryPanel, listPanel
            ]
        });
        //左侧文件分组tree
        var chartTypeTree = Ext.create('OrientTdm.BackgroundMgr.Statistic.ChartConfig.ChartTypeTree', {
            width: 290,
            minWidth: 290,
            maxWidth: 290,
            region: 'west'
        });
        Ext.apply(me, {
            layout: 'border',
            items: [centerPanel, chartTypeTree]
        });
        me.callParent(arguments);
    }
});