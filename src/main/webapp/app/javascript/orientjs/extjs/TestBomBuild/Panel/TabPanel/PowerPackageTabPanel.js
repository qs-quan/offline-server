/**
 * 构造关联节点
 */
Ext.define("OrientTdm.TestBomBuild.Panel.TabPanel.PowerPackageTabPanel", {
    extend: 'Ext.Base',

    constructor: function (config) {
        var treeNode = config.treeNode;
        var me = config.scope;

        // 空，不显示
        if (treeNode.raw.bj == 'syjd' || treeNode.raw.text == '数据（汇总）' || treeNode.raw.text == '数据' || treeNode.parentNode.raw.text == '数据（汇总）') {
            return;
        }

        var modelId = treeNode.raw.tableId;
        var retVal = "";

        // 实施人员
        if (treeNode.raw.text == '实施人员') {
            retVal = Ext.create('OrientTdm.TestBomBuild.Panel.GridPanel.TaskUserList', {
                // 试验任务节点
                nodeId: treeNode.raw.id,
                cj: treeNode.raw.cj,
                title : '【实施人员】'
            });

            // 仪器
        } else if (treeNode.raw.tableName == "T_DEVICE") {
            retVal =Ext.create('OrientTdm.TestBomBuild.Panel.GridPanel.TaskDeviceGridpanel', {
                nodeId:treeNode.parentNode.raw.id,
                treeNode:treeNode.parentNode,
                //modelId : deviceModelId,
                isShow : true,
                isView : '0',
                title : '查看【仪器】数据列表',
                region : 'center',
                usePage : true
            });

            // 试验类型
        }else if(treeNode.raw.tableName == 'T_SYLX') {
            // 列表加统计图表
            retVal =Ext.create('OrientTdm.TestBomBuild.Panel.Panel.PrjStatuslStatisticsPanel', {
                treeNode: treeNode,
                modelId: modelId
            });

            // 结构化的项目测试记录表
        }else if(treeNode.raw.tableName == 'T_XMCSJL') {
            var rwNode = treeNode.parentNode.parentNode.parentNode;
            var node = treeNode;
            var btnPower = false;
            while (node.parentNode != rwNode.getOwnerTree().getRootNode()) {
                node = node.parentNode;
            }
            // 判断是否有操作权限
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomRoleController/getCollabPower.rdm', {
                thDataId: node.raw.dataId,
                rwNodeId: rwNode.raw.id
            }, false, function (response) {
                if (response.decodedData.results != '-1') {
                    btnPower = true;
                }
            });

            var modelData;
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelData/getGridModelDescAndData.rdm', {
                modelId: rwNode.raw.tableId,
                dataId: rwNode.raw.dataId
            }, false, function (response) {
                modelData = response.decodedData.results.modelData;
            });

            retVal =Ext.create('Ext.panel.Panel', {
                layout: 'border',
                title: '查看【' + treeNode.raw.text + '】数据列表',
                items: [
                    Ext.create('OrientTdm.TestBomBuild.Panel.GridPanel.TestDataRecord', {
                        rwDataId: rwNode.raw.dataId,
                        testDataColums: modelData['M_TEST_RECROD_COLUMN_' + rwNode.raw.tableId] != null ?
                            modelData['M_TEST_RECROD_COLUMN_' + rwNode.raw.tableId].split(',') : [],
                        btnPower: btnPower,
                        treeNode: treeNode,
                        source: 'swbsNode'
                    })
                ]
            });

        }else {
            retVal = Ext.create('OrientTdm.TestBomBuild.Panel.GridPanel.TestProjectGridpanel', {
                region: 'center',
                treeNode: treeNode,
                tableName: treeNode.raw.tableName,
                tableId: modelId,
                showAnalysisBtns: true,
                modelId: modelId,
                isView: 0,
                padding: '0 0 0 5',
                title: '查看【' + treeNode.raw.text + '】数据列表'
            });
        }
        if(retVal != ''){
            me.insert(0, retVal);
            me.setActiveTab(retVal);
        }

        // 构建第二个以上标签页
        // 试验类型-文件
        if(treeNode.raw.tableName == 'T_SYLX') {
            // 附件管理
            me.insert(1, {
                xtype: 'panel',
                layout: 'border',
                title: '文件',
                listeners: {
                    activate: function () {
                        var thisComponent = Ext.create('OrientTdm.TestBomBuild.Panel.TabPanel.FileTabPanel', {
                            modelId: modelId,
                            dataId: '',
                            layout: 'fit',
                            nodeId: treeNode.raw.id,
                            title: '文件'
                        });
                        me.remove(this);
                        me.add(thisComponent);
                        me.setActiveTab(thisComponent);
                    }
                }
            });
        }
    }

});