/**
 * Created by enjoy on 2016/5/26 0026.
 */
Ext.define("OrientTdm.SysMgr.RoleMgr.AssignPortal.AssignPortalGrid", {
    extend: 'OrientTdm.SysMgr.RoleMgr.Common.AssignGrid',
    alias: 'widget.assignPortalGrid',
    //查询url
    queryUrl: serviceName + '/role/listPortals.rdm',
    //保存url
    saveUrl: serviceName + '/role/saveAssignPortals.rdm',
    initComponent: function () {
        var me = this;
        Ext.apply(me, {});
        this.callParent(arguments);
    },
    createGridColumns: function () {
        return [
            {
                header: '磁贴名称',
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