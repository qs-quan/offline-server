/**
 * Created by Administrator on 2016/9/29 0029.
 */
Ext.define('OrientTdm.Collab.MyTask.historyTask.audit.HisAuditTaskDetailPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientTabPanel',
    config: {
        hisTaskDetail: null
    },
    //tabPosition: 'bottom',
    requires: [
        'OrientTdm.Collab.MyTask.historyTask.audit.HisAuditTaskOpinionForm',
        'OrientTdm.Collab.MyTask.historyTask.audit.MonitHisAuditFlowPanel',
        'OrientTdm.Collab.MyTask.historyTask.audit.HisModelDataAuditDetailPanel',
        'OrientTdm.Collab.common.gantt.GanttPanel'
    ],
    initComponent: function () {
        var me = this;
        //后台请求任务详细信息
        if (me.hisTaskDetail) {
            var items = [];
            //绑定审批信息
            var auditType = me.hisTaskDetail.auditType();
            if(auditType === 'FILE'){
                // 不知道都是些什么数据，干什么用的，只是从不知道的数据里面找了需要用的
                var filePanelInfo = '';
                Ext.each(me.hisTaskDetail.taskBindDataList, function (item) {
                    if(item['taskBindType'] == 'sysData'){
                        filePanelInfo = item['oriSysDataList'][0]['DATA_ID'].replace('][', ',').replace('[', '').replace(']', '').split('|');
                    }
                })
                items.push(me._auditFileList(filePanelInfo));
            }

            //固化panel 审批进度panel
            var flowMonitData = me.hisTaskDetail.getFlowMonitData();
            if (flowMonitData) {
                items.push({
                    xtype: 'monitHisAuditFlowPanel',
                    flowMonitData: flowMonitData,
                    iconCls:'icon-flow'
                });
            }

            var auditObjPanel;
            if (auditType === 'ModelDataAudit') {
                //模型数据审批
                auditObjPanel = me._initHisModelDataPanel();
            } else if (auditType === 'WbsBaseLineAudit') {
                //项目基线审批
                auditObjPanel = me._initHisGanttPanel();
            }
            items.push(auditObjPanel);

            //固化panel 意见panel
            var opinion = me.hisTaskDetail.getOpinionData();
            if (opinion) {
                items.push({
                    xtype: 'hisAuditTaskOpinionForm',
                    opinion: opinion
                });
            }
            Ext.apply(me, {
                items: items
            });
        }
        this.callParent(arguments);
    },
    _initHisModelDataPanel: function () {
        var me = this;
        //初始化历史模型数据面板
        //任务绑定信息
        var taskBindInfo = me.hisTaskDetail.getTaskBindInfo();
        //任务设置信息
        var taskSetInfo = me.hisTaskDetail.getTaskSetInfo();
        //任务模型信息
        var modelDataInfo = me.hisTaskDetail.getModelDataInfo();
        //freemarker信息
        var freemarkerInfo = me.hisTaskDetail.getHtmlDataInfo();
        var retVal = {
            xtype: 'hisModelDataAuditDetailPanel',
            taskSetInfo: taskSetInfo,
            taskBindInfo: taskBindInfo,
            modelDataInfo: modelDataInfo,
            freemarkerInfo: freemarkerInfo
        };
        return retVal;
    },
    _initHisGanttPanel: function () {
        var me = this;
        var retVal = {
            xtype: 'ganttPanel',
            iconCls: 'icon-gantt',
            hisTaskDetail: me.hisTaskDetail,
            title: '甘特图'
        };
        return retVal;
    },

    /**
     * 审批文件列表
     * @private
     */
    _auditFileList: function (filePanelInfo) {
        var me = this;
        return Ext.create("OrientTdm.Collab.MyTask.auditTask.File.AuditFileGridpanel", {
            title: '审批附件',
            nodeId: filePanelInfo[0],
            fileFilter : filePanelInfo[1],
            showTbar: false,
            listeners: {
                activate: function () {
                    this.fireEvent("refreshGrid");
                }
            }
        })
    }

});