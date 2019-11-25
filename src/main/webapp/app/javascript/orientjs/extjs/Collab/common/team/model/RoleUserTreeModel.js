/**
 * Created by Seraph on 16/7/9.
 */
Ext.define('OrientTdm.Collab.common.team.model.RoleUserTreeModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'roleId',
        'roleName',
        'userName',
        'userId',
        'deptName',
        'isLeaf',
        'children',
        'defaultRole'
    ]
});