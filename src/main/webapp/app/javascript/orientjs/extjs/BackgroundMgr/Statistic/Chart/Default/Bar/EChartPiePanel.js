/**
 * Created by panduanduan on 08/04/2017.
 */
Ext.define('OrientTdm.BackgroundMgr.Statistic.Chart.Default.Bar.EChartPiePanel', {
    extend: 'OrientTdm.BackgroundMgr.Statistic.Chart.Default.OrientEChartBase',
    alias: 'widget.eChartPiePanel',
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
    },
    constructExampleOption: function () {
        var retVal = {
            title: {
                text: '某站点用户访问来源',
                subtext: '纯属虚构',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: [
                        {value: 335, name: '直接访问'},
                        {value: 310, name: '邮件营销'},
                        {value: 234, name: '联盟广告'},
                        {value: 135, name: '视频广告'},
                        {value: 1548, name: '搜索引擎'}
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        return retVal;
    },
    constructRealDataOption: function () {
        var me = this;
        var title = me.chartData.title;
        //必须实现的方法
        var retVal = {
            // 动画效果默认是开启，开启动画效果多个饼图在js上呈现可能有些卡
            animation: me.chartData.animation ? true: false,
            title: {
                text: title == undefined ? me.chartSet.title : title,
                subtext: me.chartSet.subTitle || '',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: me.chartData.legendData
            },
            series: [
                {
                    name: '',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: me.chartData.postProcessResult || me.chartData.preProcessResult || me.chartData.data,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        return retVal;
    }
});