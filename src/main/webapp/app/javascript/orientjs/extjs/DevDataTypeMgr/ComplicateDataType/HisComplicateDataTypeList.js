/**
 * Created by Administrator on 2016/7/6 0006.
 */
Ext.define("OrientTdm.DevDataTypeMgr.ComplicateDataType.HisComplicateDataTypeList", {
    extend: 'OrientTdm.DevDataTypeMgr.Common.BaseDataTypeList',
    alias: 'widget.hisComplicateDataTypeList',
    remoteUrls: {
        "read": serviceName + '/DataType/getHistoryDataType.rdm'
    },
    afterInitComponent: function () {

    },
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        me.getSelectionModel().on('selectionchange', me._rowselect, me);
    },
    createToolBarItems: function () {
        var me = this;
        var retVal = [{
            iconCls: 'icon-back',
            text: '返回',
            itemId: 'back',
            scope: this,
            handler: Ext.Function.createInterceptor(me._onBackClick, me._unDisableSonPanel, me)
        }];
        return retVal;
    },
    createColumn: function () {
        var me = this;
        var columns = DataTypeHelper.getEditableDataTypeColumns.call(me);
        var newColumns = [];
        Ext.each(columns,function(column){
            if(column.xtype != 'actioncolumn'){
                newColumns.push(column);
            }
        });
        return newColumns;
    },
    _rowselect: function (sm, records) {
        var me = this;
        var subEnumPanel = me.ownerCt.eastPanel;
        if (subEnumPanel && records.length > 0) {
            subEnumPanel.fireEvent("loadByFatherId", records[0].get("id"));
        }
    },
    _unDisableSonPanel: function (disable) {
        var me = this;
        var subEnumPanel = me.ownerCt.eastPanel;
        if (subEnumPanel) {
            subEnumPanel._controlBtnDisAble(disable || false);
        }
        return true;
    }
});