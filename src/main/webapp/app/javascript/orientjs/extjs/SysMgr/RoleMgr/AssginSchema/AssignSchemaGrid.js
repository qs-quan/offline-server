/**
 * Created by enjoy on 2016/5/26 0026.
 */
Ext.define("OrientTdm.SysMgr.RoleMgr.AssginSchema.AssignSchemaGrid", {
    extend: 'OrientTdm.SysMgr.RoleMgr.Common.AssignGrid',
    alias: 'widget.assignSchemaGrid',
    //查询url
    queryUrl: serviceName + '/role/listSchemas.rdm',
    //保存url
    saveUrl: serviceName + '/role/saveAssignSchema.rdm',
    initComponent: function () {
        var me = this;
        Ext.apply(me, {});
        this.callParent(arguments);
    },
    createGridColumns: function () {
        return [
            {
                header: '名称',
                flex: 1,
                sortable: true,
                dataIndex: 'name'
            }
        ];
    },
    createGridToolBar: function () {
        return [];
    }
});