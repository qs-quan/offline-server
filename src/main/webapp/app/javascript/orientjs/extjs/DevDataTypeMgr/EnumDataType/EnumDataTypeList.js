/**
 * Created by Administrator on 2016/7/6 0006.
 */
Ext.define("OrientTdm.DevDataTypeMgr.EnumDataType.EnumDataTypeList", {
    extend: 'OrientTdm.DevDataTypeMgr.Common.BaseDataTypeList',
    alias: 'widget.enumDataTypeList',
    remoteUrls: {
        "read": serviceName + '/EnumDataType/getEnumDataType.rdm',
        "create": serviceName + '/DataType/createDataType.rdm',
        "update": serviceName + '/DataType/updateDataType.rdm',
        "destroy": serviceName + '/DataType/deleteDataType.rdm',
        "hisUrl": serviceName + '/EnumDataType/getEnumDataType.rdm'
    },
    afterInitComponent: function () {

    },
    successCallBack: function () {
        var me = this;
        //子类型保存成功后 刷新父类型 并选中
        var store = me.getStore();
        var count = store.getCount();
        if (count > 0) {
            me.fireEvent("refreshAndSelectOne", store.getAt(0).get("id"));
        } else {
            //重置子类型面板
            var subEnumPanel = me.ownerCt.eastPanel;
            if (subEnumPanel) {
                subEnumPanel.fireEvent("loadByFatherEnum", "-1");
            }
        }
    },
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        me.getSelectionModel().on('selectionchange', me._rowselect, me);
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
            rank: 4

        });
        this.getStore().insert(0, rec);
        this.cellEditing.startEditByPosition({
            row: 0,
            column: 0
        });
    },
    _rowselect: function (sm, records) {
        var me = this;
        var subEnumPanel = me.ownerCt.eastPanel;
        if (subEnumPanel && records.length > 0) {
            subEnumPanel.fireEvent("loadByFatherEnum", records[0].get("id"), me.isHisGrid);
        }
    },
    _showHisData: function () {
        var me = this;
        var subEnumPanel = me.ownerCt.eastPanel;
        if (subEnumPanel) {
            subEnumPanel._controlBtnDisAble(false);
        }
        this.callParent(arguments);
    }
});