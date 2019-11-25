/**
 * 查询按钮
 * Created by dailin on 2019/4/8 10:42.
 */

Ext.define("OrientTdm.TestBomBuild.Button.PowerQueryButton", {
    extend: 'OrientTdm.Common.Extend.Button.OrientButton',
    //按钮点击时触发事件
    triggerClicked: function (modelGridPanel) {
        var me = this;
        //构建操作成功函数
       /* me.successCallBack = function () {
            modelGridPanel.fireEvent("refreshGrid");
            me.doBack();
        };*/
        // //创建新增表单面板
        // me.customPanel = me.createModelForm(modelGridPanel, me.btnDesc);
        var modifyWindow = Ext.create('widget.window', {
            // width: 380,
            autoWidth: true,
            autoHeight: true,
            layout: 'fit',
            modal: true,
            buttonAlign: 'center',
            items: [me.createModelForm(modelGridPanel, me.btnDesc)]
        });
        modifyWindow.show();
        // me.callParent(arguments);
    },
    createModelForm: function (modelGridPanel, btnDesc) {
        var me = this;
        var retVal = Ext.create("OrientTdm.Common.Extend.Form.OrientQueryModelForm", {
            title: '查询【' + modelGridPanel.modelDesc.text + '】数据',
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
    },
    doBack: function (btn) {
        var me = this;
        btn.up("window").close();
    }
});