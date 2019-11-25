/**
 * Created by mengbin on 16/7/6.
 */
Ext.define('OrientTdm.DevDataTypeMgr.DashBoard', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientTabPanel',
    alias: 'widget.devDataTypeMgrDashboard',
    requires: [
        "OrientTdm.DevDataTypeMgr.Common.BaseDataTypeList",
        "OrientTdm.DevDataTypeMgr.BaseDataType.BaseDataTypeList",
        "OrientTdm.DevDataTypeMgr.EnumDataType.EnumDataTypeDashBord",
        "OrientTdm.DevDataTypeMgr.ExtendDataType.ExtendDataTypeDashBord",
        "OrientTdm.DevDataTypeMgr.ComplicateDataType.ComplicateDataTypeDashBord"
    ],
    initComponent: function () {
        var me = this;
        var baseTypeList = Ext.create("OrientTdm.DevDataTypeMgr.BaseDataType.BaseDataTypeList", {
            title: "基础类型"
        });
        var enumTypeDashBord = Ext.create("OrientTdm.DevDataTypeMgr.EnumDataType.EnumDataTypeDashBord", {
            listeners: {
                activate: me._activateSonPanel,
                deactivate: me._deactivateSonPanel
            }
        });
        var extendTypeDashBord = Ext.create("OrientTdm.DevDataTypeMgr.ExtendDataType.ExtendDataTypeDashBord", {
            listeners: {
                activate: me._activateSonPanel,
                deactivate: me._deactivateSonPanel
            }
        });
        var complicateTypeDashBord = Ext.create("OrientTdm.DevDataTypeMgr.ComplicateDataType.ComplicateDataTypeDashBord", {
            listeners: {
                activate: me._activateSonPanel,
                deactivate: me._deactivateSonPanel
            }
        });
        Ext.apply(this, {
            layout: 'border',
            items: [
                baseTypeList, enumTypeDashBord, extendTypeDashBord, complicateTypeDashBord
            ]
        });
        this.callParent(arguments);
    },
    _activateSonPanel: function () {
        this.centerPanel._onRefreshClick();
    },
    _deactivateSonPanel: function () {
        //判断是否有未保存数据，如果存在 提示保存
    }
});