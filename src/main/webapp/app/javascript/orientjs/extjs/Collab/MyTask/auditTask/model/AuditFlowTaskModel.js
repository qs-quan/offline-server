/**
 * Created by Seraph on 16/8/1.
 */
Ext.define('OrientTdm.Collab.MyTask.auditTask.model.AuditFlowTaskModel', {
    extend : 'Ext.data.Model',
    fields : [
        { name : 'flowTaskId'},
        'piId',
        { name : 'name'},
        { name : 'pdName'},
        { name : 'auditType'},
        { name : 'auditTypeDescription'},
        'groupTask',
        'pdId',
        'id',
        { name : 'modelDisplayName'},
        { name : 'modelKeyShowValue'},
        'createTime',
        'currentNodeInfo',
        'currentNodeInfo'
    ]
});