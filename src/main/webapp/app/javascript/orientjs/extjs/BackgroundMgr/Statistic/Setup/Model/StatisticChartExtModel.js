/**
 * Created by enjoy on 2016/4/29 0029.
 */
Ext.define('OrientTdm.BackgroundMgr.Statistic.Setup.Model.StatisticChartExtModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'title',
        'customHandler',
        'belongStatisSetUpId',
        'belongStaticChartInstanceId',
        'belongStaticChartInstanceName',
        'preProcessor'
    ]
});