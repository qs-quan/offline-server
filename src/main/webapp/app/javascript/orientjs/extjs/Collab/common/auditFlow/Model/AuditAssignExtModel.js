/**
 * Created by Administrator on 2016/8/24 0024.
 */
Ext.define('OrientTdm.Collab.common.auditFlow.Model.AuditAssignExtModel', {
    extend: 'Ext.data.Model',
    fields: [
        'taskName',
        'canChooseOther',
        'assign',
        'assign_display',
        'assign_username'
    ]
});