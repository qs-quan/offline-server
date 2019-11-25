/**
 * 构造关系节点
 */
Ext.define("OrientTdm.TestBomBuild.Panel.TabPanel.PowerRelationTabPanel", {
    extend: 'Ext.Base',

    constructor: function (config) {
        var me = config.scope;
        var treeNode = config.treeNode;

        var tableId = treeNode.raw.tableId,
            tableName = treeNode.raw.tableName,
            dataId = '',
            nodeId = treeNode.raw.id;

        // 数据（汇总）- 项目测试文件 - 项目测试文件子节点
        // 展示文件预览图片
        if (tableName == "T_XMCSWJ") {
            // 预览EXCEL文件
            me.insert(0,
                Ext.create('OrientTdm.TestBomBuild.Panel.Panel.excel.DocFileViewPanel',{
                    dataId: treeNode.raw.dataId,
                    modelId: treeNode.raw.tableId,
                    autoScroll: true,
                    padding: '0 0 0 5',
                    title: '查看【' + treeNode.raw.text + '】'
                })
            );
            return;
        }

        // 获取不同节点的关联dataId
        if (treeNode.raw.cj == '0') {
            // 图号节点
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomQueryController/getPdmOrMesInfoByTableIdAndNodeId.rdm',{
                nodeId: nodeId
            },false,function (response) {
                if (response.decodedData.success && response.decodedData.results[0]) {
                    dataId = response.decodedData.results[0].id;
                }
            });

        }else  if (treeNode.raw.bj == "yz") {
        // 影子节点，不确定用不用了，仪器不存在子节点以后就不存在影子节点了
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomQueryController/getNodesRelationTableDataIds.rdm', {
                tableId: tableId,
                tableName: tableName,
                nodeId: nodeId,
                isDataId: "1",
                isAll: "0"
            }, false, function (response) {
                if (response.decodedData.success)
                    dataId = response.decodedData.results;
            });

        } else {
            // 其他普通节点
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomQueryController/getNodeRelationTableDataIds.rdm',{
                tableId: treeNode.raw.tableId,
                tableName: treeNode.raw.tableName,
                nodeId: nodeId,
                isAll: '0'
            },false,function (response) {
                if (response.decodedData.success) {
                    dataId = response.decodedData.results;
                }
            });
        }

        // 能够获取对应的 dataId 时加载 tab 页
        if (dataId) {
            // 获取表结构，表数据
            var modelDesc, modelData;
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelData/getGridModelDescAndData.rdm', {
                modelId: tableId,
                dataId: dataId
            }, false, function (response) {
                modelDesc = response.decodedData.results.orientModelDesc;
                modelData = response.decodedData.results.modelData;
            });


            // 构建 tab 页
            var form = Ext.create("OrientTdm.Common.Extend.Form.OrientDetailModelForm", {
                bindModelName: modelDesc.dbName,
                itemId: "tab_" + treeNode.raw.id,
                modelDesc: modelDesc,
                originalData: modelData,
                widhth: "100%",
                heigth: "30%",
                region: "north"
            });


            var grid = Ext.create("OrientTdm.TestBomBuild.Panel.TabPanel.ImageNoGrid", {
                title: "子节点产品编号",
                imageNoId: treeNode.raw.dataId,
                region: "center"
            });

            var retVal = Ext.create("OrientTdm.Common.Extend.Panel.OrientPanel", {
                title: '查看【' + treeNode.raw.text + '】数据',
                layout: "border",
                items: [form, grid]
            });

            me.insert(0, retVal);
            // 根节点图号节点右侧有试验团队标签页
            if (treeNode.raw.cj == '0' && treeNode.parentNode == treeNode.getOwnerTree().getRootNode()) {
                me.insert(1, {
                    xtype: 'panel',
                    layout: 'border',
                    title: '试验团队',
                    listeners:{
                        activate: function () {
                            var thisComponent = Ext.create('OrientTdm.TestBomBuild.Panel.Panel.TestTeamPanel',{
                                dataId: dataId,
                                title: '试验团队'
                            });
                            me.remove(this);
                            me.insert(1, thisComponent);
                            me.setActiveTab(thisComponent);
                        }
                    }
                });
            }
            me.setActiveTab(retVal);

            // 层级2对应试验项目（任务）那一层
            if (treeNode.raw.tableName == 'T_RW_INFO') {
                var btnPower = false;
                var node = treeNode, rootNode = treeNode.getOwnerTree().getRootNode();

                while (node.parentNode != rootNode) {
                    node = node.parentNode;
                }

                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomRoleController/getCollabPower.rdm',{
                    thDataId : node.raw.dataId,
                    rwNodeId: treeNode.raw.id
                }, false, function (response) {
                    if (response.decodedData.results != '-1') {
                        btnPower = true;
                    }
                });

                Ext.each([
                    {tableName: 'T_SYTJ', title: '试验条件'},
                    {tableName: 'T_HGPJ', title: '合格判据'},
                    {tableName: 'T_GC', title: '试验过程'}
                ], function (param, index) {
                    me.insert(index + 1, {
                        id: param.tableName + index,
                        xtype: 'panel',
                        layout: 'border',
                        index: index + 1,
                        title: '查看【' + treeNode.raw.text + '】' + param.title,
                        listeners:{
                            activate: function () {
                                var thisComponent = Ext.create('OrientTdm.TestBomBuild.Panel.Panel.Doc.DocTabPanel',{
                                    syxDataId: dataId,
                                    btnPower: btnPower,
                                    syxModelId: treeNode.raw.tableId,
                                    modelId: OrientExtUtil.ModelHelper.getModelId(param.tableName, OrientExtUtil.FunctionHelper.getSchemaId(), false),
                                    modelName: param.tableName,
                                    padding: '0 0 0 5',
                                    title: '查看【' + treeNode.raw.text + '】' + param.title
                                });
                                me.remove(this);
                                me.insert(this.index, thisComponent);
                                me.setActiveTab(thisComponent);
                            }
                        }
                    });
                });

                // 设备
                me.insert(4, {
                    xtype: 'panel',
                    layout: 'border',
                    title : '【' + treeNode.raw.text + '】设备选择',
                    index: 4,
                    listeners:{
                        activate: function () {
                            var thisComponent = Ext.create('OrientTdm.TestBomBuild.Panel.GridPanel.TaskDeviceGridpanel', {
                                nodeId:treeNode.raw.id,
                                treeNode:treeNode,
                                //modelId : deviceModelId,
                                isShow : true,
                                isView : '0',
                                title : '【' + treeNode.raw.text + '】设备选择',
                                region : 'center',
                                usePage : true
                            });
                            me.remove(this);
                            me.insert(this.index, thisComponent);
                            me.setActiveTab(thisComponent);
                        }
                    }
                });

                me.insert(5, {
                    xtype: 'panel',
                    layout: 'border',
                    index: 5,
                    title : modelData['M_BH_' + tableId] + '-项目测试记录表',
                    listeners:{
                        activate: function () {
                            var thisComponent = Ext.create('Ext.panel.Panel', {
                                layout: 'border',
                                title : modelData['M_BH_' + tableId] + '-项目测试记录表',
                                items: [
                                    Ext.create('OrientTdm.TestBomBuild.Panel.GridPanel.TestDataRecord', {
                                        treeNode: treeNode,
                                        // 试验项modelId
                                        rwModelId: treeNode.raw.tableId,
                                        rwDataId: dataId,
                                        testDataColums: modelData['M_TEST_RECROD_COLUMN_' + tableId] != null ?
                                            modelData['M_TEST_RECROD_COLUMN_' + tableId].split(',') : [],
                                        btnPower: btnPower,
                                        source: 'rwNode'
                                    })
                                ]
                            });
                            me.remove(this);
                            me.insert(this.index, thisComponent);
                            me.setActiveTab(thisComponent);
                        }
                    }
                });
            }
        } else {
            OrientExtUtil.Common.info('提示','查询不到对应数据,请检查数据库');
        }
    }

});