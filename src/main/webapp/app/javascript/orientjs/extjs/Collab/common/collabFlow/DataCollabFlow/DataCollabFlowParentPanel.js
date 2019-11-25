/**
 * 测试数据导入记录标签页
 */

Ext.define('OrientTdm.Collab.common.collabFlow.DataCollabFlow.DataCollabFlowParentPanel',{
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.DataCollabFlowParentPanel',

    initComponent: function () {
        var me = this;

        // 上半部分项目表单、仪器
       //var proInfoPanel = Ext.create('OrientTdm.Collab.common.collabFlow.DataCollabFlow.DataCollabFlowPrjInfoPanel', me);
        var modelDesc,modelData;
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelData/getGridModelDescAndData.rdm', {
            modelId: me.rwModelId,
            dataId: me.dataId
        }, false, function (response) {
            modelDesc = response.decodedData.results.orientModelDesc;
            modelData = response.decodedData.results.modelData;
        });
        var proInfoPanel = Ext.create("OrientTdm.Common.Extend.Form.OrientDetailModelForm", {
            title: '查看【' + modelData['M_BH_' + modelDesc.modelId ] + '】数据',
            bindModelName: modelDesc.dbName,
            itemId: "tab_" + me.testDataObj.nodeId,
            modelDesc: modelDesc,
            originalData: modelData,
            region: 'north'
        });

        // 下半部分
        var tabPanel = Ext.create('OrientTdm.Common.Extend.Panel.OrientTabPanel',{
            id: 'collabFlowCustomPrjTestRecordTab',
            region: 'center',
            items: [
                // 项目测试记录表
                {
                    layout: 'border',
                    title: '项目测试记录表',
                    listeners:{
                        activate: function () {
                            var thisComponent = Ext.create('Ext.panel.Panel', {
                                layout: 'border',
                                title: "项目测试记录表",
                                items: [
                                    Ext.create('OrientTdm.TestBomBuild.Panel.GridPanel.TestDataRecord', {
                                        rwDataId: me.dataId,
                                        testDataColums: modelData['M_TEST_RECROD_COLUMN_' + me.rwModelId] != null ?
                                            modelData['M_TEST_RECROD_COLUMN_' + me.rwModelId].split(',') : [],
                                        btnPower: true,
                                        isCollab: true,
                                        nodeId: me.testDataObj.nodeId,
                                        source: 'collab'
                                    })
                                ]
                            });

                            var collabFlowCustomPrjTestRecordTab = Ext.getCmp('collabFlowCustomPrjTestRecordTab');
                            collabFlowCustomPrjTestRecordTab.remove(this);
                            collabFlowCustomPrjTestRecordTab.insert(0, thisComponent);
                            collabFlowCustomPrjTestRecordTab.setActiveTab(thisComponent);
                        }
                    }
                },
                // 测试数据导入及导入列表
                Ext.create('OrientTdm.Collab.common.collabFlow.DataCollabFlow.DataCollabFlowPanel', me.testDataObj)
            ]
        });

        Ext.apply(me, {
            title: '数据填写',
            layout: 'border',
            items: [proInfoPanel, tabPanel],
            northPanel: proInfoPanel,
            centerPanel: tabPanel
        });
        me.callParent(arguments);
    }

});