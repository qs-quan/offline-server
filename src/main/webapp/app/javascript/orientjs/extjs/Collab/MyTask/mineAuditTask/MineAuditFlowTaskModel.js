/**
 * 我发起的审批任务列表
 */
Ext.define('OrientTdm.Collab.MyTask.mineAuditTask.MineAuditFlowTaskModel', {
    extend : 'Ext.data.Model',
    fields : [
        { name : 'id'},
        { name : 'piId'},
        { name : 'name'},
        { name : 'pdName'},
        { name : 'createTime'},
        { name : 'fileIds'}
    ]
});