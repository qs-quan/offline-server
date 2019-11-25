/**
 * Created by enjoy on 2016/5/26 0026.
 */
Ext.define("OrientTdm.SysMgr.RoleMgr.AssignRight.AssignRightGrid", {
    extend: 'OrientTdm.SysMgr.RoleMgr.Common.AssignGrid',
    alias: 'widget.assignRightGrid',
    //查询url
    queryUrl: serviceName + '/role/listRights.rdm',
    //保存url
    saveUrl: serviceName + '/role/saveAssignRights.rdm',
    initComponent: function () {
        var me = this;
        Ext.apply(me, {});
        this.callParent(arguments);
    },
    createGridColumns: function () {
        return [
            {
                header: '权限名称',
                sortable: true,
                flex: 1,
                dataIndex: 'name'
            }
        ];
    },
    createGridToolBar: function () {
        return [];
    }
});