/**
 * Created by enjoy on 2016/5/17 0017.
 */
Ext.define('OrientTdm.DataMgr.TBom.Model.TBomNodeModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'text',
        'modelId'
    ],
    proxy: {
        type: 'ajax',
        api: {
            "read": serviceName + "/modelTree/getNodesByPId.rdm"
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