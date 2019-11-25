/**
 * Created by enjoy on 2016/7/8 0018.
 * 導入模型数据
 */
Ext.define("OrientTdm.Common.Extend.Button.Override.ImportModelDataButton", {
    extend: 'OrientTdm.Common.Extend.Button.OrientButton',
    requires: [
        'OrientTdm.DataMgr.Import.ImportModelPanel'
    ],
    //按钮点击时触发事件
    triggerClicked: function (modelGridPanel) {
        var me = this;
        me.successCallBack = function () {
            if (modelGridPanel.hasListener('customRefreshGrid')) {
                //如果存在自定义刷新事件
                modelGridPanel.fireEvent('customRefreshGrid');
            } else {
                //否则调用默认刷新事件
                modelGridPanel.fireEvent('refreshGridByCustomerFilter');
            }
            me.doBack();
        };
        //创建新增表单面板
        me.customPanel = me.createImportModelPanel(modelGridPanel, me.btnDesc);
        me.callParent(arguments);
    },
    createImportModelPanel: function (modelGridPanel, btnDesc) {
        var me = this;
        var retVal = Ext.create('OrientTdm.DataMgr.Import.ImportModelPanel', {
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    itemId: 'back',
                    text: '返回',
                    iconCls: 'icon-back',
                    scope: me,
                    handler: Ext.bind(me.doBack, me, [modelGridPanel], true)
                }]
            }],
            buttonAlign: 'center',
            successCallback: me.successCallBack,
            needDefaultValue: modelGridPanel.needDefaultValue == undefined ? false : modelGridPanel.needDefaultValue,
            defaultValue: modelGridPanel.swbsArrSelected ? modelGridPanel.swbsArrSelected : "",
            modelDesc: modelGridPanel.modelDesc,
            btnInstance: me
        });
        return retVal;
    }
});