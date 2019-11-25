/**
 * Created by Administrator on 2016/7/6 0006.
 */
Ext.define("OrientTdm.DevDataTypeMgr.ExtendDataType.HisExtendDataTypeList", {
    extend: 'OrientTdm.DevDataTypeMgr.Common.BaseDataTypeList',
    alias: 'widget.hisExtendDataTypeList',
    remoteUrls: {
        "read": 'DataType/getHistoryDataType.rdm'
    },
    afterInitComponent: function () {

    },
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
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
    _unDisableSonPanel: function (disable) {
        return true;
    }
});