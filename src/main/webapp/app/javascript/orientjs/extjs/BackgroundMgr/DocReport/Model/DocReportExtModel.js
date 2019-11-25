Ext.define('OrientTdm.BackgroundMgr.DocReport.Model.DocReportExtModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'reportName',
        'modelId',
        'isView',
        'filePath',
        'createUser',
        'createTime',
        //just for display
        'modelId_display',
        'nodeId',
        'modelDesc'
    ]
});