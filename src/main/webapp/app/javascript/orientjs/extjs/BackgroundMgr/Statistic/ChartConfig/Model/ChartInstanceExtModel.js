/**
 * Created by enjoy on 2016/4/29 0029.
 */
Ext.define('OrientTdm.BackgroundMgr.Statistic.ChartConfig.Model.ChartInstanceExtModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'name',
        'handler'
    ],
    proxy: {
        type: 'ajax',
        api: {
            'read': serviceName + '/StatisticChartInstance/list.rdm',
            'create': serviceName + '/StatisticChartInstance/create.rdm',
            'destroy': serviceName + '/StatisticChartInstance/delete.rdm',
            'update': serviceName + '/StatisticChartInstance/update.rdm'
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
            encode: true,
            root: 'formData',
            allowSingle: true
        }
    }
});