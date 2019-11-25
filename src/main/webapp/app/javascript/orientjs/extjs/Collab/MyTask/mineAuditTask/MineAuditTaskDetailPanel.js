/**
 * 我发起的审批任务
 */
Ext.define('OrientTdm.Collab.MyTask.mineAuditTask.MineAuditTaskDetailPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientTabPanel',
    config: {
        taskInfo: null,
        isHistory: false,
        taskType: TDM_SERVER_CONFIG.AUDIT_TASK,
        submitPanel: null
    },
    iconCls: 'icon-auditTask',
    requires: [
        'OrientTdm.Collab.MyTask.auditTask.ModelDataAuditDetailPanel',
        'OrientTdm.Collab.MyTask.auditTask.Opinion.AuditTaskOpinionPanel',
        'OrientTdm.Collab.MyTask.auditTask.SubmitAuditFlowTaskPanel'
    ],

    initComponent: function () {
        this.callParent(arguments);
        Ext.apply(this, {
            id: "mineAuditTaskDetailPanel"
        });
        this.initDefaultComponent();
    },

    initDefaultComponent: function () {
        var me = this;
        var params = {piId: me.taskInfo.piId};
        OrientExtUtil.AjaxHelper.doRequest("flow/info/bindDatas.rdm", params, false, function (response) {
            var retV = response.decodedData.results;

            //审批意见信息
            me.add(Ext.create('OrientTdm.Collab.MyTask.mineAuditTask.MineAuditTaskOpinionPanel', {
                title: '审批',
                isHistory: me.isHistory,
                taskId: me.taskInfo.flowTaskId,
                piId: me.taskInfo.piId,
                pdId: me.taskInfo.pdId,
                taskName: me.taskInfo.name,
                retV: retV
            }));
            me.add(Ext.create("OrientTdm.Collab.common.auditFlow.MonitAuditFlowPanel", Ext.apply({
                title: '流程图',
                iconCls: 'icon-flow'
            }, {
                piId: me.taskInfo.piId
            })));
            me.setActiveTab(0);
        });
    }

});