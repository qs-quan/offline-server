/**
 * Created by enjoy on 2016/4/18 0018.
 */
Ext.define("OrientTdm.Common.Extend.Button.Override.QueryModelDataButton", {
    extend: 'OrientTdm.Common.Extend.Button.OrientButton',
    //按钮点击时触发事件
    triggerClicked: function (modelGridPanel) {
        var me = this;
        //构建操作成功函数
        me.successCallBack = function () {
            modelGridPanel.fireEvent("refreshGrid");
            me.doBack();
        };
        //创建新增表单面板
        me.customPanel = me.createModelForm(modelGridPanel, me.btnDesc);
        me.callParent(arguments);
    },
    createModelForm: function (modelGridPanel, btnDesc) {
        var me = this;
        var retVal = Ext.create("OrientTdm.Common.Extend.Form.OrientQueryModelForm", {
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
            title: '查询【<span style="color: red; ">' + modelGridPanel.modelDesc.text + '</span>】数据',
            rowNum: 2,
            buttonAlign: 'center',
            buttons: [
                {
                    itemId: 'doQuery',
                    text: '查询',
                    iconCls: 'icon-query',
                    scope: me,
                    handler: Ext.bind(me.doQuery, me, [modelGridPanel], true)
                },
                {
                    itemId: 'back',
                    text: '关闭',
                    iconCls: 'icon-close',
                    scope: me,
                    handler: Ext.bind(me.doBack, me, [modelGridPanel], true)
                }
            ],
            successCallback: me.successCallBack,
            bindModelName: modelGridPanel.modelDesc.dbName,
            modelDesc: modelGridPanel.modelDesc
        });
        return retVal;
    },
    doQuery: function (btn, event, modelGridPanel) {
        var me = this;
        btn.up("form").fireEvent("doQuery", function () {
            modelGridPanel.fireEvent("refreshGridByQueryFilter");
            me.doBack(btn);
        }, modelGridPanel);
    }
})
;