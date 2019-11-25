/**
 * 详细按钮
 * Created by dailin on 2019/4/8 8:44.
 */

Ext.define("OrientTdm.TestBomBuild.Button.PowerDetailButton", {
    extend: 'OrientTdm.Common.Extend.Button.OrientButton',
    //按钮点击时触发事件
    triggerClicked: function (modelGridPanel) {
        var me = this;
        // 检查是否选中了事件
        if (modelGridPanel.getSelectedData().length == 0 || modelGridPanel.getSelectedData().length > 1) {
            OrientExtUtil.Common.info('提示', "请选择一条记录！");
            return;
        } else {
            var retVal = me.createDetailPanel(modelGridPanel);
            var detailWindow = Ext.create('widget.window', {
                width: 600,
                autoHeight: true,
                layout: 'fit',
                modal: true,
                buttonAlign:'center',
                buttons: [{
                    xtype: 'button',
                    text: '关闭',
                    handler: function () {
                        detailWindow.close();
                    }
                }],
                items:[retVal]
            });
            detailWindow.show();
        }
    },

    // 创建详细信息的panel
    createDetailPanel: function (modelGridPanel) {
        var selectData = modelGridPanel.getSelectedData()[0];
        var modelDesc = modelGridPanel.modelDesc;
        var modelData = selectData.raw;
        var retVal = Ext.create("OrientTdm.Common.Extend.Form.OrientDetailModelForm", {
            // title: '查看【<span style="color: red; ">' + modelDesc.text + '</span>】数据',
            bindModelName: modelDesc.dbName,
            itemId: "win_" + selectData.data.id,
            modelDesc: modelDesc,
            originalData: modelData
        });

        if (!modelGridPanel.isFromData) {
            return retVal;
        } else {
            // 如果将来其他情况也有类似操作，所以不直接将两个判断放在一个if里面
            if (modelGridPanel.tableName == "T_HK_AUTO_RECORD") {
                var resultModelId = OrientExtUtil.ModelHelper.getModelId("T_HK_AUTO_RESULT",
                    OrientExtUtil.FunctionHelper.getTestDataSchemaId(),false);
                var customerFilter = [new CustomerFilter("M_RECORD_ID_" + resultModelId, "Equal", "", selectData.data.id)];
                var gridpanel = Ext.create('OrientTdm.Common.Extend.Grid.OrientModelGrid',{
                    height: 300,
                    modelId: resultModelId,
                    isView: 0,
                    customerFilter: customerFilter,
                    createToolBarItems: function () {}
                });
                // 不给定布局时默认使用上下布局，如果用vbox不指定height或者flex任意一个的话效果可能会出错
                var panel = Ext.create('OrientTdm.Common.Extend.Panel.OrientPanel',{
                    items : [retVal, gridpanel]
                });
                return panel;
            } else {
                return retVal;
            }
        }
    }

});