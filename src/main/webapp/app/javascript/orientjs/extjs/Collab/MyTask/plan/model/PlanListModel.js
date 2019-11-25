/**
 * Created by Seraph on 16/7/25.
 */
Ext.define('OrientTdm.Collab.MyTask.plan.model.PlanListModel', {
    extend : 'Ext.data.Model',
    fields : [
        'id',
        { name : 'name'},
        { name : 'plannedStartDate'},
        { name : 'plannedEndDate'},
        'actualStartDate',
        'belongedProject'
    ]
});