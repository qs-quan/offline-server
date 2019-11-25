/**
 * Created by Administrator on 2016/7/6 0006.
 */
Ext.define("OrientTdm.DevDataTypeMgr.BaseDataType.BaseDataTypeList", {
    extend: 'Ext.grid.Panel',
    alias: 'widget.baseDataTypeList',
    iconCls : 'icon-basicDataType',
    stripeRows: true,
    loadMask: true,
    initComponent: function () {
        var me = this;
        var store = me.createStore.call(me);
        store.pageSize = globalPageSize;
        var columns = DataTypeHelper.getDefaultDataTypeColumns.call(me);
        Ext.apply(me, {
            columns: columns,
            store: store
        });
        me.callParent(arguments);
    },
    createStore: function () {
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.DevDataTypeMgr.Model.DataType',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {

                    "read": serviceName + '/BaseDataType/getBaseDataType.rdm'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                }
            }
        });
        this.store = retVal;
        return retVal;
    }
});