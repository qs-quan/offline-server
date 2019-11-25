/**
 * Created by Administrator on 2016/7/6 0006.
 */
Ext.define("OrientTdm.DevDataTypeMgr.ComplicateDataType.ComplicateDataTypeDashBord", {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.complicateDataTypeDashBord',
    iconCls :'icon-complexDataType',
    requires: [
        "OrientTdm.DevDataTypeMgr.ComplicateDataType.ComplicateDataTypeList",
        "OrientTdm.DevDataTypeMgr.ComplicateDataType.SubComplicateDataTypeList",
        "OrientTdm.DevDataTypeMgr.ComplicateDataType.HisComplicateDataTypeList"
    ],
    initComponent: function () {
        var me = this;
        var mainPanel = Ext.create("OrientTdm.DevDataTypeMgr.ComplicateDataType.ComplicateDataTypeList", {});
        var hisPanel = Ext.create("OrientTdm.DevDataTypeMgr.ComplicateDataType.HisComplicateDataTypeList", {});
        var eastPanel = Ext.create("OrientTdm.DevDataTypeMgr.ComplicateDataType.SubComplicateDataTypeList", {
            region: 'east',
            width: "60%"
        });
        var centerPanel = Ext.create('OrientTdm.Common.Extend.Panel.OrientPanel', {
            region: 'center',
            layout: 'card',
            items: [mainPanel, hisPanel],
            eastPanel: eastPanel
        });
        Ext.apply(me, {
            layout: 'border',
            title: '复杂类型',
            items: [
                centerPanel, eastPanel
            ],
            centerPanel: mainPanel
        });
        me.callParent(arguments);
    }
})
;