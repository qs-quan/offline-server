/**
 * Created by enjoy on 2016/4/29 0029.
 */
Ext.define('OrientTdm.SysMgr.UserToolMgr.Model.UserToolExtModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'userId',
        'toolGroupId',
        'toolId',
        'toolPath',
        'toolIcon',
        'toolName',
        'toolVersion',
        'toolDescription',
        'toolCode',
        'toolType'
    ]
});