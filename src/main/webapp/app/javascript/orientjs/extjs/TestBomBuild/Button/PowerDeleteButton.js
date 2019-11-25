/**
 * 删除按钮
 * Created by dailin on 2019/4/8 15:03.
 */
Ext.define("OrientTdm.TestBomBuild.Button.PowerDeleteButton", {
        extend: 'OrientTdm.Common.Extend.Button.OrientButton',
        //按钮点击时触发事件
        triggerClicked: function (modelGridPanel) {
            var me = this;
            var selections = modelGridPanel.getSelectionModel().getSelection();

            if(selections.length == 0){
                OrientExtUtil.Common.info('提示', '请至少选择一条数据！');
                return;
            }

            Ext.MessageBox.confirm(OrientLocal.prompt.confirm, OrientLocal.prompt.deleteConfirm, function (btn) {
                if (btn == 'yes') {
                    if (modelGridPanel.treeNode &&
                        (modelGridPanel.treeNode.raw.cj == 2 &&
                            (OrientExtUtil.IEHelper.indexOf(["T_SYTJ", 'T_RW_INFO'], modelGridPanel.tableName) == -1)
                        )
                    ) {

                        for (var i = 0; i < selections.length; i++) {
                            if(selections[i].data['M_BH_' + me.modeId] != '未开始'){
                                OrientExtUtil.Common.info('提示', '请至少选择一条数据！');
                                return;
                            }
                        }
                        return;

                        // 使用产品的方法单独删除某条试验项目的数据，不级联删除
                        OrientExtUtil.ModelHelper.deleteModelData(modelGridPanel.tableId,
                        OrientExtUtil.GridHelper.getSelectRecordIds(modelGridPanel), false);

/*                            } else if (modelGridPanel.treeNode.raw.cj == 2 && modelGridPanel.tableName == "T_SYTJ") {
                        var testConditionId = OrientExtUtil.TreeHelper.getChildNode(2, modelGridPanel.treeNode.raw.id, ["工况"]);
                        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomDeleteController/deleteShadowByPnodeAndMasterIds.rdm',{
                            nodeId : testConditionId,
                            type: "T_SYTJ",
                            dataIds : OrientExtUtil.GridHelper.getSelectRecordIds(modelGridPanel).join(",")
                        }, false, function (response) {
                            if (response.decodedData.success) {
                                if (modelGridPanel.treeNode) {
                                    var childNodes = modelGridPanel.treeNode.childNodes;
                                    for (var i = childNodes.length -1; i >= 0; i--) {
                                        modelGridPanel.treeNode.removeChild(childNodes[i]);
                                    }
                                    modelGridPanel.treeNode.store.reload({node: modelGridPanel.treeNode});
                                }
                            }
                        });

                        OrientExtUtil.ModelHelper.deleteModelData(modelGridPanel.tableId,
                        OrientExtUtil.GridHelper.getSelectRecordIds(modelGridPanel), false);*/

                    } else {
                        var nodeInfo;

                        // 获取所有子节点
                        OrientExtUtil.AjaxHelper.doRequest(serviceName + "/TbomQueryController/getChildBom.rdm", {
                            cj: parseInt(modelGridPanel.treeNode.raw.cj) + 1,
                            nodeId: modelGridPanel.treeNode.raw.id
                        }, false, function (response) {
                            // 遍历子节点列表
                            Ext.each(response.decodedData, function (item) {
                                if (item.id == selections[0].raw["M_NODE_ID_" + modelGridPanel.tableId]) {
                                    nodeInfo = item;
                                    return false;
                                }
                            });
                        });

                        for (var i = 0; i < selections.length; i++) {
                            var selected = selections[i];
                            var zt = selected.raw["M_ZT_" + modelGridPanel.tableId];
                            if(zt != undefined && zt != '未开始'){
                                
                            }
                        }
                        

                        if (nodeInfo.gs == "0") {
                            OrientExtUtil.Common.info('提示', '非人为创建节点的对应数据，无法删除');
                            return;
                        }

                        //todo grid panel 删除数据有的需要判断是否级联删除子孙节点数据，比如试验任务、设备这种删了数据那就得删对应的数据节点，对应的数据节点还存在子节点及关联数据
                        OrientExtUtil.AjaxHelper.doRequest(serviceName + "/TbomDeleteController/deleteNodeRelationInfo.rdm", {
                            nodeId: nodeInfo.id
                        }, false, function (response) {
                            if (response.decodedData.success) {
                                // 删除成功刷新列表
                                modelGridPanel.customerFilter = modelGridPanel.getCustomerFilter();
                                modelGridPanel.store.getProxy().setExtraParam('customerFilter', Ext.encode(modelGridPanel.customerFilter));
                                // 刷新树
                                modelGridPanel.treeNode.store.reload({node: modelGridPanel.treeNode});
                            }
                        });
                    }

                    modelGridPanel.fireEvent('refreshGrid');
                }
            });
        }
    }
);