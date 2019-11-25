/**
 * Created by mengbin on 16/8/28.
 */
Ext.define('OrientTdm.Collab.MyTask.dataTask.model.DataTaskListModel', {
    extend : 'Ext.data.Model',
    fields : [
        {name : 'id'},
        'taskName',
        { name : 'createtime'},
        { name : 'message'},
        { name : 'taskstate'},
        {name:'taskmodelid'},
        {name:'dataid'},
        {name:'group'}
    ]
});