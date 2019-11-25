/**
 * Created by Seraph on 16/7/9.
 */
Ext.define('OrientTdm.Collab.common.team.model.RoleUserGridModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'roleId',
        'roleName',
        'userName',
        'userId',
        'deptName'
    ],
    proxy: {
        type: 'ajax',
        api: {
            'read': serviceName + '/collabTeam/roleUsers/grid.rdm'
        },
        reader: {
            type: 'json',
            successProperty: 'success',
            totalProperty: 'totalProperty',
            root: 'results',
            messageProperty: 'msg'
        }
    }
});