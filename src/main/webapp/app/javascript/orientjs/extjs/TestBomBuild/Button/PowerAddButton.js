/**
 * 新增按钮
 * Created by dailin on 2019/4/4 16:11.
 */
Ext.define("OrientTdm.TestBomBuild.Button.PowerAddButton", {
    extend: 'OrientTdm.Common.Extend.Button.OrientButton',

    // 按钮点击时触发事件
    triggerClicked: function (modelGridPanel) {
        var me = this;
        if (modelGridPanel.treeNode) {
            var treeNode = modelGridPanel.treeNode;
        } else {
            var treeNode = modelGridPanel.ownerCt.ownerCt.ownerCt.down("#leftBomTreePanel").getSelectionModel().getSelection()[0];
        }
        if(modelGridPanel.tableId == "" || modelGridPanel.tableName == ""){
            OrientExtUtil.Common.info('提示','节点信息数据错误！');
        }

        var createForm = Ext.create('OrientTdm.TestBomBuild.Panel.FormPanel.LeftBomAddFormPanel', {
            treeNode: treeNode,
            modelId: modelGridPanel.tableId,
            tableName: modelGridPanel.tableName,
            tableId: modelGridPanel.tableId,
            testTypeDataId: modelGridPanel.testTypeDataId == undefined ? undefined : modelGridPanel.testTypeDataId,
            modelGridDataId: modelGridPanel.dataId == undefined ? undefined : modelGridPanel.dataId,
            nodeId: treeNode.raw.id,
            buttonAlign: 'center',
            supportSuccessCallBack: me.btnDesc.supportSuccessCallBack == null ? undefined : me.btnDesc.supportSuccessCallBack,
            supportTemplateId: me.btnDesc.supportTemplateId == null ? undefined : me.btnDesc.supportTemplateId,
            formPanelValue: me.btnDesc.formPanelValue == null ? undefined : me.btnDesc.formPanelValue
        });

        var params = {
            title: '手动新增',
            autoWidth: true,
            autoHeight: true,
            // layout: 'fit',
            modal: true,
            buttonAlign: 'center',
            // items: [createForm],
            listeners: {
                beforeclose: function () {
                    if (modelGridPanel.tableName != "") {
                        // 更新过滤条件
                        modelGridPanel.customerFilter = modelGridPanel.getCustomerFilter();
                        modelGridPanel.store.getProxy().setExtraParam("customerFilter", Ext.encode(modelGridPanel.customerFilter));
                    }
                    modelGridPanel.fireEvent("refreshGrid");
                }
            }
        };

        // 被试品存在子表，自动高度子表会显示不全
        if (modelGridPanel.tableName == "T_SYJ") {
            // params.autoHeight = false;
            params.height = 500;
        }
        params.items = [createForm];
        var addWindow = Ext.create('widget.window', params/*{
            title: '手动新增',
            autoWidth: true, 
            autoHeight: true,
            layout: 'fit',
            modal: true,
            buttonAlign: 'center',
            items: [createForm],
            listeners: {
                beforeclose: function () {
                    if (modelGridPanel.tableName != "") {
                        // 更新过滤条件
                        modelGridPanel.customerFilter = modelGridPanel.getCustomerFilter();
                        modelGridPanel.store.getProxy().setExtraParam("customerFilter",Ext.encode(modelGridPanel.customerFilter));
                    }
                    modelGridPanel.fireEvent("refreshGrid");
                }
            }
        }*/).show();
    }

});