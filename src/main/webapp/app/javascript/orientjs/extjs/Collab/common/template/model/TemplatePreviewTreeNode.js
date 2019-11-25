/**
 * Created by Seraph on 16/9/27.
 */
Ext.define('OrientTdm.Collab.common.template.model.TemplatePreviewTreeNode', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'text',
        'data',
        'previewType',
        'extraInfo',
        'compInfos',
        'iconCls'
    ],
    proxy: {
        type: 'ajax',
        api: {
            "read": serviceName + "/templatePreview/nextLayerNodes.rdm"
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