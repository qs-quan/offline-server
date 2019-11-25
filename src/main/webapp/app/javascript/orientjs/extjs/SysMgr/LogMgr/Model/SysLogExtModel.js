/**
 * Created by enjoy on 2016/4/29 0029.
 */
Ext.define('OrientTdm.SysMgr.LogMgr.Model.SysLogExtModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'opTypeId',
        'opUserId',
        'opIpAddress',
        'opDate',
        'opTarget',
        'opRemark',
        'opResult'
    ]
});