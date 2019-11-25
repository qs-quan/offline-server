/**
 * Created by Seraph on 16/8/24.
 */
Ext.define('OrientTdm.Collab.MyTask.historyTask.model.HistoryTaskListModel', {
    extend : 'Ext.data.Model',
    fields : [
        'type',
        'name',
        'actualStartDate',
        'actualEndDate',
        'piId',
        'flowTaskId',
        'modelName',
        'id',
        'description',
        'auditType',
        'modelId',
        'dataId',
        'group'


    ]
});