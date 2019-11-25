/**
 * Created by enjoy on 2016/4/29 0029.
 */
Ext.define('OrientTdm.SysMgr.ToolMgr.Model.ToolExtModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'toolIcon',
        'toolName',
        'toolVersion',
        'toolDescription',
        'toolCode',
        'toolType',
        'groupId'
    ]
});