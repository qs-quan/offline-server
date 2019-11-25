/**
 * Created by enjoy on 2016/5/17 0017.
 */
Ext.define('OrientTdm.DataMgr.SchemaData.Model.SchemaNodeModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'text'
    ],
    proxy: {
        type: 'ajax',
        api: {
            "read": serviceName + "/modelTree/getNodesBySchemaId.rdm"
        },
        reader: {
            type: 'json',
            successProperty: 'success',
            totalProperty: 'totalProperty',
            root: 'results',
            messageProperty: 'msg'
        }
    }
});