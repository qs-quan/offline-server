/**
 * Created by qjs on 2016/10/26.
 */
Ext.define('OrientTdm.SysMgr.DeptMgr.Model.DeptTreeModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'text',
        'pid',
        'name',
        'function',
        'deptName',
        'notes',
        'iconCls',
        'expanded',
        'leaf',
        'order'
    ]
});