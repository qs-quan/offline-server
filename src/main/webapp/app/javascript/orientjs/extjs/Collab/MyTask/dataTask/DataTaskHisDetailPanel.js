/**
 * Created by MengBin on 2016/9/1.
 */
/**
 * Created by mengbin on 16/8/29.
 */

Ext.define('OrientTdm.Collab.MyTask.dataTask.DataTaskHisDetailPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientTabPanel',
    config: {
        dataTaskId: '',
        modelId: '',
        dataId: '',
        taskName: '',
        //历史相关
        hisTaskDetail: null,
        isHistory: false
    },
    layout: 'fit',
    requires: [
        'OrientTdm.Collab.MyTask.dataTask.PreData.PreDataDashPanel'
    ],
    initComponent: function () {
        var me = this;
        var tBar = me.getTbar();
        Ext.apply(me, {
            id: "dataTaskDetailPanel",
            dockedItems: [tBar]
        });
        this.callParent(arguments);
    },
    getTbar: function () {
        var me = this;
        var btns = [];
        return btns;
    },
    afterInitComponent: function () {
        var me = this;
        var toolbar = me.getDockedItems('toolbar[dock="top"]')[0];
        //获取自己所在的流程图
        if (me.isHistory && me.hisTaskDetail) {
            //从历史数据加载数据流
            var dataFlowPanel = Ext.create("OrientTdm.Collab.common.collabFlow.DataFlowPanel", {
                title: '数据流程图',
                isHistory: true,
                iconCls: 'icon-dataFlow',
                hisTaskDetail: me.hisTaskDetail
            });
            //任务模型信息
            var modelDataInfo = me.hisTaskDetail.getModelDataInfo();
            if (modelDataInfo.length > 0) {
                me.setModelId(modelDataInfo[0].modelId);
                me.setDataId(modelDataInfo[0].modelDataList[0].ID);
            }
            me.add(dataFlowPanel);
        } else {
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/projectTree/nodeInfo/parent.rdm', {
                modelName: 'CB_TASK',
                dataId: me.config.dataId
            }, false, function (response) {
                var respJson = response.decodedData;
                var parentModelName = respJson.modelName;
                var parentDataId = respJson.dataId;
                var config = {
                    modelName: parentModelName,
                    dataId: parentDataId,
                    readOnly: true
                };
                var dataFlowPanel = Ext.create("OrientTdm.Collab.common.collabFlow.DataFlowPanel", Ext.apply({
                    title: '数据流程图',
                    iconCls: 'icon-dataFlow'
                }, config));
                me.add(dataFlowPanel);
            });
        }

        var config = {
            modelId: me.modelId,
            dataId: me.dataId,
            initPrivateData: true
        };
        var dataObjPanel = Ext.create("OrientTdm.Collab.Data.DevData.DevDataDashBord", Ext.apply({
            title: '设计数据',
            iconCls: 'icon-offlinedata'
        }, config));
        me.add(dataObjPanel);
        me.setActiveTab(0);
    }
});