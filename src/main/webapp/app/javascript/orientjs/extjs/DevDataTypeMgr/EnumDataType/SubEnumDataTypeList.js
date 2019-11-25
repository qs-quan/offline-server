/**
 * Created by Administrator on 2016/7/6 0006.
 */
Ext.define("OrientTdm.DevDataTypeMgr.EnumDataType.SubEnumDataTypeList", {
    extend: 'OrientTdm.DevDataTypeMgr.Common.BaseDataTypeList',
    alias: 'widget.subEnumDataTypeList',
    disabled: true,
    remoteUrls: {
        "read": 'DataSubType/getDataSubType.rdm',
        "create": 'DataSubType/createEnumDataSubType.rdm',
        "update": 'DataSubType/updateDataSubType.rdm',
        "destroy": 'DataSubType/deleteDataSubType.rdm'
    },
    subType: true,
    successCallBack: function () {
        var me = this;
        //子类型保存成功后 刷新父类型 并选中
        var mainPanel = me.ownerCt.centerPanel;
        if (mainPanel) {
            mainPanel.fireEvent("refreshAndSelectOne", me.dataTypeId);
        }
    },
    initComponent: function () {
        var me = this;
        me.addEvents("loadByFatherEnum");
        me.callParent(arguments);
    },
    createColumn: function () {
        var me = this;
        var columns = DataTypeHelper.getSubEnumEditableDataTypeColumns.call(me);
        return columns;
    },
    initEvents: function () {
        var me = this;
        me.callParent(arguments);
        me.mon(me, 'loadByFatherEnum', me._loadByFatherEnum, me);
    },
    _onCreateClick: function () {
        var me = this;
        var rec = Ext.create("OrientTdm.DevDataTypeMgr.Model.DataSubType", {
            status: 0,
            datatypeId: me.dataTypeId
        });
        this.getStore().insert(0, rec);
        this.cellEditing.startEditByPosition({
            row: 0,
            column: 0
        });
    },
    _loadByFatherEnum: function (fatherEnumId) {
        var me = this;
        me.setDisabled(false);
        me.getStore().getProxy().setExtraParam("dataTypeID", fatherEnumId);
        me.dataTypeId = fatherEnumId;
        me._onRefreshClick.call(me);
    }
});