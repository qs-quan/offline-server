/**
 * 修改按钮
 * Created by dailin on 2019/4/8 9:40.
 */

Ext.define("OrientTdm.TestBomBuild.Button.PowerModifyButton", {
    extend: 'OrientTdm.Common.Extend.Button.OrientButton',
    /**
     * 按钮点击时触发事件
     * @param modelGridPanel
     * @param isSetFzr 是否是设置负责人
     */
    triggerClicked: function (modelGridPanel) {
        var me = this;
        // 检查是否选中了事件
        if (modelGridPanel.getSelectedData().length == 0) {
            OrientExtUtil.Common.info('提示', '请选择一条记录！');
            return;
        } else if (modelGridPanel.getSelectedData().length > 1 && !modelGridPanel.isSetFzr) {
            OrientExtUtil.Common.info('提示', '请选择一条记录！');
            return;
        } else {
            var selectData = modelGridPanel.getSelectedData()[0];
            var modelDesc = modelGridPanel.modelDesc;
            var modelData = selectData.raw;
            if(modelDesc.text = '试验项'){
                if(modelGridPanel.initModifyColumnDesc == undefined){
                    modelGridPanel.initModifyColumnDesc = modelDesc.modifyColumnDesc;
                }

                var modifiColumn = [];
                if(modelGridPanel.isSetFzr == true){
                    Ext.each(modelDesc.columns, function (item) {
                        if(item.text.indexOf('负责人') > -1 && item.text.indexOf('环境负责人') < 0) {
                            modifiColumn.push(item.id);
                        }
                    });

                    modelDesc.modifyColumnDesc = modifiColumn;
                }else{
                    modelDesc.modifyColumnDesc = modelGridPanel.initModifyColumnDesc;
                }
            }

            var retVal = Ext.create('OrientTdm.TestBomBuild.Panel.FormPanel.PowerModifyFormPanel', {
                // title: '修改【<span style="color: red; ">' + modelDesc.text + '</span>】数据',
                bindModelName: modelDesc.dbName,
                itemId: "panel_" + modelGridPanel.tableName + selectData.data.id,
                modelDesc: modelDesc,
                treeNode: modelGridPanel.treeNode == undefined ? undefined : modelGridPanel.treeNode,
                nodeId: modelGridPanel.treeNode == undefined ? undefined : modelGridPanel.treeNode.raw.id,
                tableName: modelGridPanel.tableName,
                modelId: modelGridPanel.tableId,
                tableId: modelGridPanel.tableId,
                actionUrl: serviceName + "/modelData/updateModelData.rdm",
                originalData: modelGridPanel.isSetFzr ? {} : modelData,
                getSuccessCallback: function() {
                    modelGridPanel.refreshGrid();
                    modifyWindow.close();
                },
                buttons: [
                    {
                        itemId: 'save',
                        text: '保存',
                        scope: me,
                        iconCls: 'icon-save',
                        handler: function (btn) {
                            var me = this;
                            if (modelGridPanel.isSetFzr) {
                                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomUpdateController/updateRWInfo.rdm',{
                                    modelId: modelGridPanel.modelId,
                                    formValue: Ext.encode(OrientExtUtil.FormHelper.generateFormData(btn.up('form'))),
                                    dataIds: OrientExtUtil.GridHelper.getSelectRecordIds(modelGridPanel).join(",")
                                },false, function (response) {
                                    if (response.decodedData.success) {
                                        retVal.getSuccessCallback();
                                    }
                                });
                            } else {
                                btn.up('form').fireEvent('saveOrientForm', {
                                    modelId: modelGridPanel.tableId
                                });
                            }
                        }
                    },
                    {
                        itemId: 'back',
                        text: '取消',
                        scope: me,
                        iconCls: 'icon-close',
                        handler: function (btn) {
                            btn.up("window").close();
                        }
                    }
                ]
            });

            var modifyWindow = Ext.create('widget.window', {
                // width: 380,
                autoWidth: true,
                autoHeight: true,
                layout: 'fit',
                modal: true,
                buttonAlign: 'center',
                listeners : {
                    'beforeclose': function () {
                        if (modelGridPanel.isSetFzr) {
                            modelGridPanel.isSetFzr = false;
                        }
                    }
                },
                items: [retVal]
            });
            modifyWindow.show();
        }
    }
});