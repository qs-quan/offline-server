/**
 * Created by Seraph on 16/8/1.
 */
Ext.define('OrientTdm.Collab.MyTask.auditTask.model.AuditFlowOpinionExtModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'flowid',
        'activity',
        'handletime',
        'handleuser',
        'handlestatus',
        'label',
        'flowTaskId',
        'value'
    ]
});