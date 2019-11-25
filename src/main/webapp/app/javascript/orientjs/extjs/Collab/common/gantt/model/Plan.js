/**
 * Created by Seraph on 16/7/18.
 */
Ext.define('OrientTdm.Collab.common.gantt.model.Plan', {
    extend : 'Gnt.model.Task',
    nameField : 'name',
    startDateField : 'plannedStartDate',
    endDateField : 'plannedEndDate',
    baselineStartDateField : 'actualStartDate',
    baselineEndDateField : 'actualEndDate',
    percentDoneField : 'progress',
    fields : [
        { name : 'actualStartDate', type : 'date', dateFormat : 'Y-m-d' },
        { name : 'actualEndDate', type : 'date', dateFormat : 'Y-m-d' },
        { name : 'plannedStartDate', type : 'date', dateFormat : 'Y-m-d' },
        { name : 'plannedEndDate', type : 'date', dateFormat : 'Y-m-d' },
        'resourceName',
        'preSib',
        'nextSib',
        'newCreate',
        'iconCls'
    ]
});