/**
 * Created by Seraph on 16/7/6.
 */
Ext.define('OrientTdm.Collab.ProjectMng.mainFrame.model.ProjectGridModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'name',
        'status',
        'plannedEndDate',
        'plannedStartDate',
        'principal',
        'actualStartDate',
        'actualEndDate'
    ]
});