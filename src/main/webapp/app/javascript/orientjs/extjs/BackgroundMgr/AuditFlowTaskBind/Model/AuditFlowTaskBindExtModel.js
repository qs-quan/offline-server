/**
 * Created by enjoy on 2016/4/9 0009.
 */
Ext.define('OrientTdm.BackgroundMgr.AuditFlowTaskBind.Model.AuditFlowTaskBindExtModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'taskName',
        'formId',
        'customPath',
        'canAssignOther',
        'belongAuditBind',
        {name: 'formId_display', type: 'string', persist: false}
    ]
});