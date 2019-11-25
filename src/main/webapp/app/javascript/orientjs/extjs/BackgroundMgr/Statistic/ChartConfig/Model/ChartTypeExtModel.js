/**
 * Created by enjoy on 2016/4/29 0029.
 */
Ext.define('OrientTdm.BackgroundMgr.Statistic.ChartConfig.Model.ChartTypeExtModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'name'
    ],
    proxy: {
        type: 'ajax',
        api: {
            'read': serviceName + '/StatisticChartType/list.rdm',
            'create': serviceName + '/StatisticChartType/create.rdm',
            'destroy': serviceName + '/StatisticChartType/delete.rdm',
            'update': serviceName + '/StatisticChartType/update.rdm'
        },
        reader: {
            type: 'json',
            successProperty: 'success',
            totalProperty: 'totalProperty',
            root: 'results',
            messageProperty: 'msg'
        },
        writer: {
            type: 'json',
            allowSingle: true
        }
    }
});