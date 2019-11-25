/**
 * Created by panduanduan on 08/04/2017.
 */
Ext.define('OrientTdm.BackgroundMgr.Statistic.Chart.Default.Bar.EChartBarPanel', {
    extend: 'OrientTdm.BackgroundMgr.Statistic.Chart.Default.OrientEChartBase',
    alias: 'widget.eChartBarPanel',
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
    },
    constructExampleOption: function () {
        //必须实现的方法
        var retVal = {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data: ['销量']
            },
            xAxis: {
                data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        };
        return retVal;
    },
    constructRealDataOption: function () {
        var me = this;
        var retVal = {
            title: {
                text: me.chartSet.title
            },
            tooltip: {},
            legend: {
                data: me.chartData.legendData
            },
            xAxis: {
                data: me.chartData.xaxis
            },
            yAxis: {},
            series: [{
                name: '',
                type: 'bar',
                data: me.chartData.postProcessResult || me.chartData.preProcessResult || me.chartData.data
            }]
        };
        return retVal;
    }
});