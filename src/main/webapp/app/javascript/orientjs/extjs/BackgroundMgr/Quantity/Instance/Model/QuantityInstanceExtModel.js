/**
 *
 */
Ext.define('OrientTdm.BackgroundMgr.Quantity.Instance.Model.QuantityInstanceExtModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'quantityName',
        'quantityDataType',
        'unitId',
        'unitName',
        'quantityId'
    ],
    proxy: {
        type: 'ajax',
        api: {
            'read': serviceName + '/QuantityInstance/list.rdm',
            'create': serviceName + '/QuantityInstance/create.rdm',
            'update': serviceName + '/QuantityInstance/update.rdm',
            'delete': serviceName + '/QuantityInstance/delete.rdm'
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