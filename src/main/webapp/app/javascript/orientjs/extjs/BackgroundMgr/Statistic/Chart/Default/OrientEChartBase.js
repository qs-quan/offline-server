/**
 * Created by panduanduan on 08/04/2017.
 */
Ext.define('OrientTdm.BackgroundMgr.Statistic.Chart.Default.OrientEChartBase', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.orientEChartBase',
    config: {
        purpose: 'example',
        chartData: null,
        chartSet: null
    },
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            layout: 'fit',
            listeners:{
                afterlayout:function(){
                    me.chart = echarts.init(me.body.dom);
                    var option = me.purpose == 'example' ? me.constructExampleOption() : me.constructRealDataOption();
                    me.fireEvent('afterConstructOption', me, me.chart, option);
                    me.chart.setOption(option);
                }
            }
        });
        //me.on('boxready', function () {
        //    me.chart = echarts.init(me.getEl().dom);
        //    var option = me.purpose == 'example' ? me.constructExampleOption() : me.constructRealDataOption();
        //    me.fireEvent('afterConstructOption', me, me.chart, option);
        //    me.chart.setOption(option);
        //});
        me.callParent(arguments);
        //初始化设置项后提供事件扩展机制 方便定制
        me.addEvents('afterConstructOption');
    },
    constructExampleOption: function () {
        //用于创建统计图形预览
        throw('子类必须实现该方法');
    },
    constructRealDataOption: function () {
        //用于创建统计预览
        throw('子类必须实现该方法');
    }
});