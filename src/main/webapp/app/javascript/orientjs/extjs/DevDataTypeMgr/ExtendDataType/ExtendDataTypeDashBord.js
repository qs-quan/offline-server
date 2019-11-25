/**
 * Created by Administrator on 2016/7/6 0006.
 */
Ext.define("OrientTdm.DevDataTypeMgr.ExtendDataType.ExtendDataTypeDashBord", {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.extendDataTypeDashBord',
    iconCls :'icon-extendDataType',
    requires: [
        'OrientTdm.DevDataTypeMgr.ExtendDataType.ExtendDataTypeList',
        'OrientTdm.DevDataTypeMgr.ExtendDataType.HisExtendDataTypeList'
    ],
    initComponent: function () {
        var me = this;
        var mainPanel = Ext.create("OrientTdm.DevDataTypeMgr.ExtendDataType.ExtendDataTypeList", {});
        var hisPanel = Ext.create("OrientTdm.DevDataTypeMgr.ExtendDataType.HisExtendDataTypeList", {});
        var centerPanel = Ext.create('OrientTdm.Common.Extend.Panel.OrientPanel', {
            region: 'center',
            layout: 'card',
            items: [mainPanel, hisPanel]
        });
        Ext.apply(me, {
            layout: 'border',
            title: '扩展类型',
            items: [
                centerPanel
            ],
            centerPanel: mainPanel
        });
        me.callParent(arguments);
    }
});