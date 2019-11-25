/**
 * Created by Administrator on 2016/7/6 0006.
 */
Ext.define("OrientTdm.DevDataTypeMgr.ExtendDataType.ExtendDataTypeList", {
    extend: 'OrientTdm.DevDataTypeMgr.Common.BaseDataTypeList',
    alias: 'widget.extendDataTypeList',
    remoteUrls: {
        "read": serviceName + '/ExtendDataType/getExtendDataType.rdm',
        "create": serviceName + '/DataType/createDataType.rdm',
        "update": serviceName + '/DataType/updateDataType.rdm',
        "destroy": serviceName + '/DataType/deleteDataType.rdm'
    },
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
    },
    createColumn: function () {
        var me = this;
        var columns = DataTypeHelper.getEditableDataTypeColumns.call(me);
        return columns;
    },
    _onCreateClick: function () {
        var me = this;
        var rec = Ext.create("OrientTdm.DevDataTypeMgr.Model.DataType", {
            status: 0,
            version: 1,
            datatype:'string',
            rank:2


        });
        this.getStore().insert(0, rec);
        this.cellEditing.startEditByPosition({
            row: 0,
            column: 0
        });
    }
});