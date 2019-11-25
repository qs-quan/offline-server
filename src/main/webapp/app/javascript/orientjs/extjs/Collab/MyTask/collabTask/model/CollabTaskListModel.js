/**
 * Created by Seraph on 16/8/11.
 */
Ext.define('OrientTdm.Collab.MyTask.collabTask.model.CollabTaskListModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        {name: 'name'},
        {name: 'actualStartDate'},
        'flowTaskId',
        'groupTask',
        'piId',
        'group',
        'currentNodeInfo'
    ]
});