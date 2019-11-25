/**
 * Created by enjoy on 2016/4/29 0029.
 */
Ext.define('OrientTdm.SysMgr.FileGroup.Model.FileTypeGroupExtModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'groupName'
    ],
    validations: [{
        type: 'presence',
        field: 'groupName'
    }],
    proxy: {
        type: 'ajax',
        api: {
            'read': serviceName + '/fileGroup/listByPiId.rdm',
            'create': serviceName + '/fileGroup/create.rdm',
            'destroy': serviceName + '/fileGroup/delete.rdm',
            'update': serviceName + '/fileGroup/update.rdm'
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
            allowSingle: false
        }
    }
});