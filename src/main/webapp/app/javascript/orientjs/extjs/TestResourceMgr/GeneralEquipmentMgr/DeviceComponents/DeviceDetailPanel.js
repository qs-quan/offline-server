/**
 * Created by Administrator on 2016/7/20 0020.
 * 设备类型树
 */
Ext.define('OrientTdm.TestResourceMgr.GeneralEquipmentMgr.DeviceComponents.DeviceDetailPanel', {
    extend: 'OrientTdm.Common.Extend.Form.OrientDetailModelForm',
    alias: 'widget.DeviceDetailPanel',
    requires: [],
    config: {
        modelId: null,
        isView: 0,
        templateId: null,
        rowNum: 1,
        successCallBack: Ext.emptyFn
    },
    initComponent: function () {
        var me = this;

        var modelDesc;
        OrientExtUtil.AjaxHelper.doRequest(serviceName + "/modelData/getGridModelDesc.rdm", {
            modelId: me.modelId,
            templateId: me.templateId,
            isView: me.isView
        }, false, function (response) {
            modelDesc = response.decodedData.results.orientModelDesc;
        });

        Ext.apply(me, {
            title: '查看【<span style="color: red; ">' + modelDesc.text + '</span>】数据',
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    itemId: 'back',
                    text: '返回',
                    iconCls: 'icon-back',
                    scope: me,
                    handler: function() {
                        me.collapse();
                    }
                }]
            }],
            buttonAlign: 'center',
            successCallback: me.successCallBack,
            bindModelName: modelDesc.dbName,
            modelDesc: modelDesc,
            originalData: {}
        });
        me.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
    },
    loadDeviceRecord: function(record) {
        var me = this;
        me.getForm().loadRecord(record);
        me.expand();
    }
});
