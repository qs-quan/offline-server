/**
 * 堆积折线图
 */
Ext.define('OrientTdm.BackgroundMgr.Statistic.Chart.Default.Bar.EChartLinePanel', {
    extend: 'OrientTdm.BackgroundMgr.Statistic.Chart.Default.OrientEChartBase',
    alias: 'widget.eChartLinePanel',
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
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : ['周一','周二','周三','周四','周五','周六','周日']
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [{
                    name:'邮件营销',
                    type:'line',
                    stack: '总量',
                    data:[120, 132, 101, 134, 90, 230, 210]
                },{
                    name:'联盟广告',
                    type:'line',
                    stack: '总量',
                    data:[220, 182, 191, 234, 290, 330, 310]
                },{
                    name:'视频广告',
                    type:'line',
                    stack: '总量',
                    data:[150, 232, 201, 154, 190, 330, 410]
                },{
                    name:'直接访问',
                    type:'line',
                    stack: '总量',
                    data:[320, 332, 301, 334, 390, 330, 320]
                },{
                    name:'搜索引擎',
                    type:'line',
                    stack: '总量',
                    data:[820, 932, 901, 934, 1290, 1330, 1320]
                }
            ]
        };

        return retVal;
    },
    constructRealDataOption: function () {
        var me = this;
        var retVal = {
            title: {
                text: me.chartData.title
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: me.chartData.legendData
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            xAxis: [{
                type : 'category',
                boundaryGap : false,
                data: me.chartData.xAxis
            }],
            yAxis : [{
                type : 'value'
            }],
            series: me.chartData.seriesVal
        };

        return retVal;
    }
});