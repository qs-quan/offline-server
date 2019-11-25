/**
 * Created by dailin on 2019/8/26 0:31.
 */
Ext.define('OrientTdm.TestInfo.ReportTemplate.Model.ReportTemplateTreeNodeModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'text',
        'pid',
        'iconCls'
    ],
    proxy: {
        type: 'ajax',
        api: {
            "read": serviceName + "/ReportTemplateController/nextReportBaseNodes.rdm"
        },
        extraParams: {
            pid: ''
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