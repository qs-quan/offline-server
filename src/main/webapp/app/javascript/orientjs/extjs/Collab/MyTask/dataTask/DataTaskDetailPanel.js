/**
 * Created by mengbin on 16/8/29.
 */

Ext.define('OrientTdm.Collab.MyTask.dataTask.DataTaskDetailPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientTabPanel',
    alias: 'widget.dataTaskDetailPanel',
    config: {
        dataTaskId: '',
        modelId: '',
        dataId: '',
        taskName: '',
        taskType: TDM_SERVER_CONFIG.DATA_TASK
    },
    iconCls: 'icon-dataTask',
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
        this.addEvents({
            afterSubmitDataTask: true
        });
        this.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.mon(me, 'afterSubmitDataTask', me._afterSubmitDataTask, me);
        me.callParent(arguments);
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
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/projectTree/nodeInfo/parent.rdm', {
            modelName: 'CB_TASK',
            dataId: me.dataId
        }, false, function (response) {
            var respJson = response.decodedData;
            var parentModelName = respJson.modelName;
            var parentDataId = respJson.dataId;
            var highLightKey = me.modelId + '_' + me.dataId;
            config = {
                modelName: parentModelName,
                dataId: parentDataId,
                readOnly: true,
                highLightKey: highLightKey
            };

            var dataFlowPanel = Ext.create("OrientTdm.Collab.common.collabFlow.DataFlowPanel", Ext.apply({
                title: '数据流程图',
                iconCls: 'icon-dataFlow'
            }, config));
            me.add(dataFlowPanel);

        });
        config = {
            modelId: me.modelId,
            dataId: me.dataId,
            initPrivateData: true
        };
        var dataObjPanel = Ext.create("OrientTdm.Collab.Data.DevData.DevDataDashBord", Ext.apply({
            title: '设计数据',
            iconCls: 'icon-offlinedata'
        }, config));
        //点击数据任务，将设计数据放在第一个Tab界面。
        me.insert(0,dataObjPanel);
        var preDataObjPanel = Ext.create('OrientTdm.Collab.MyTask.dataTask.PreData.PreDataDashPanel', {
            title: '参考数据',
            iconCls: 'icon-offlinedata',
            modelId: me.modelId,
            dataId: me.dataId
        });
        me.add(preDataObjPanel);

        //获取自己所在的数据Tab页面

        //获取前驱节点所有的数据Tab页面

        // me.add(flowDiagPanel);
        // me.add(taskSubmitPanel);
        me.setActiveTab(0);


    },
    _afterSubmitDataTask: function () {
        var me = this;
        //保存历史任务信息
        var params = {
            taskType:me.taskType,
            taskId:me.dataTaskId,
            modelName: 'CB_TASK',
            dataId: me.dataId
        };
        HisTaskHelper.saveHisAuditTaskInfo(serviceName + '/hisTask/saveHisDataTaskInfo.rdm', params, function () {
            //关闭当前面板
            var myTaskDashboard = Ext.getCmp("myTaskDashboard");
            var rootTab = myTaskDashboard.ownerCt;
            rootTab.remove(me);
            //刷新数据任务面板
            var dataTaskListPanel = myTaskDashboard.down('dataTaskListPanel');
            if (dataTaskListPanel) {
                dataTaskListPanel.fireEvent('refreshGrid');
            }
        });
    }
});