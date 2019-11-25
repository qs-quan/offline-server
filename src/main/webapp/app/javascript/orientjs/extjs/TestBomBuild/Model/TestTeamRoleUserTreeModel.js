/**
 * Created by dailin on 2019/8/12 18:20.
 */

Ext.define('OrientTdm.TestBomBuild.Model.TestTeamRoleUserTreeModel', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        'roleId',
        'roleName',
        'userName',
        'userId',
        'power',  //权限显示
        'sign',   //标记
        'relationId', //关系表的id
        'deptName',
        'isLeaf',
        'children',
        'defaultRole'
    ]
});