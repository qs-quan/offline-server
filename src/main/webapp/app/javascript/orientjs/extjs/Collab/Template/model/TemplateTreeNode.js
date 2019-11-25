/**
 * Created by Seraph on 16/9/26.
 */
Ext.define('OrientTdm.Collab.Template.model.TemplateTreeNode', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'type',
        'text',
        'modelName',
        'schemaId',
        'bmModel',
        'leaf',
        'iconCls'
    ],
    proxy: {
        type: 'ajax',
        api: {
            "read": serviceName + "/templateInfo/nextLayerNodes.rdm"
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