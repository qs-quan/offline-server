/**
 * Created by enjoy on 2016/4/29 0029.
 */
Ext.define('OrientTdm.SysMgr.BackupMgr.Model.BackupMgrExtModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'remark',
        'userId',
        'backDate',
        'filePath',
        'schemaId',
        'tableId',
        'backModel',
        'backData',
        'autoBack',
        'autoBackDate',
        'autoBackZq',
        'type'
    ]
});