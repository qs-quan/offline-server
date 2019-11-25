/**
 * Created by Administrator on 2016/7/6 0006.
 */
Ext.define("OrientTdm.DevDataTypeMgr.ComplicateDataType.SubComplicateDataTypeList", {
    extend: 'OrientTdm.DevDataTypeMgr.Common.BaseDataTypeList',
    alias: 'widget.subComplicateDataTypeList',
    remoteUrls: {
        "read": serviceName + '/DataSubType/getDataSubType.rdm',
        "create": serviceName + '/DataSubType/createDataSubType.rdm',
        "update": serviceName + '/DataSubType/updateDataSubType.rdm',
        "destroy": serviceName + '/DataSubType/deleteDataSubType.rdm'
    },
    subType: true,
    disabled: true,
    successCallBack:function(){
        var me = this;
        //子类型保存成功后 刷新父类型 并选中
        var mainPanel = me.ownerCt.centerPanel;
        if (mainPanel) {
            mainPanel.fireEvent("refreshAndSelectOne",me.dataTypeId);
        }
    },
    initComponent: function () {
        var me = this;
        me.addEvents("loadByFatherId");
        me.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent(arguments);
        me.mon(me, 'loadByFatherId', me._loadByFatherId, me);
    },
    createColumn: function () {
        var me = this;
        var columns = DataTypeHelper.getSubCompleteEditableDataTypeColumns.call(me);
        return columns;
    },
    _onCreateClick: function () {
        var me = this;
        var rec = Ext.create("OrientTdm.DevDataTypeMgr.Model.DataSubType", {
            status: 0,
            datatypeId:me.dataTypeId,
            isref:1,
            datatype:'string'

        });
        this.getStore().insert(0, rec);
        this.cellEditing.startEditByPosition({
            row: 0,
            column: 0
        });
    },
    _loadByFatherId: function (fatherId) {
        var me = this;
        me.setDisabled(false);
        me.getStore().getProxy().setExtraParam("dataTypeID", fatherId);
        me.dataTypeId = fatherId;
        me._onRefreshClick.call(me);
    }
});