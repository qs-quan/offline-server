/**
 * Created by Administrator on 2016/7/6 0006.
 */
Ext.define("OrientTdm.DevDataTypeMgr.EnumDataType.EnumDataTypeDashBord", {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.enumDataTypeDashBord',
    iconCls :'icon-enumDataType',
    requires: [
        'OrientTdm.DevDataTypeMgr.EnumDataType.EnumDataTypeList',
        'OrientTdm.DevDataTypeMgr.EnumDataType.HisEnumDataTypeList',
        'OrientTdm.DevDataTypeMgr.EnumDataType.SubEnumDataTypeList'
    ],
    initComponent: function () {
        var me = this;
        var mainPanel = Ext.create("OrientTdm.DevDataTypeMgr.EnumDataType.EnumDataTypeList", {});
        var hisPanel = Ext.create("OrientTdm.DevDataTypeMgr.EnumDataType.HisEnumDataTypeList", {});
        var eastPanel = Ext.create("OrientTdm.DevDataTypeMgr.EnumDataType.SubEnumDataTypeList", {
            region: 'east',
            width: "30%"
        });
        var centerPanel = Ext.create('OrientTdm.Common.Extend.Panel.OrientPanel', {
            region: 'center',
            layout: 'card',
            items: [mainPanel, hisPanel],
            eastPanel: eastPanel
        });

        Ext.apply(me, {
            layout: 'border',
            title: '枚举类型',
            items: [
                centerPanel, eastPanel
            ],
            centerPanel: mainPanel
        });
        me.callParent(arguments);
    }
});