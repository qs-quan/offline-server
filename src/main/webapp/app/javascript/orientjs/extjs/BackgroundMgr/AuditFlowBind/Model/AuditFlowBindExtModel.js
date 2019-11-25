/**
 * Created by enjoy on 2016/4/9 0009.
 */
Ext.define('OrientTdm.BackgroundMgr.AuditFlowBind.Model.AuditFlowBindExtModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'schemaId',
        'modelId',
        'flowName',
        'flowVersion',
        'userName',
        'lastUpdateDate',
        'remark'
    ]
});