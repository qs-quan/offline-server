/**
 * 我发起的审批任务
 */
Ext.define('OrientTdm.Collab.MyTask.mineAuditTask.MineAuditTaskOpinionPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.auditTaskOpinionPanel',
    layout: 'border',
    config: {
        piId: '',
        pdId: '',
        taskName: '',
        taskId: '',
        isHistory: false,
        //保存历史任务时 是否需要序列化至数据库
        isHistoryAble: true,
        filePanelInfo: ''
    },
    requires: [
        'OrientTdm.Collab.MyTask.auditTask.Opinion.AuditTaskHisOpinionList',
        'OrientTdm.Collab.MyTask.auditTask.Opinion.AuditTaskOpinionForm',
        'OrientTdm.Collab.MyTask.auditTask.File.AuditFileGridpanel'
    ],
    initComponent: function () {
        var me = this;
        var params = {
            pdId: me.pdId,
            taskName: me.taskName
        };

        var items = [];
        if (me.retV[0]['mainType'] === 'ModelDataAudit') {
            // 表单审批
            items.push({
                title: '审批表单',
                region: 'north',
                height: 300,
                items: [
                    Ext.create('OrientTdm.Collab.MyTask.auditTask.ModelDataAuditDetailPanel', {
                        anchor: '100%',
                        bindDatas: me.retV,
                        piId: me.piId,
                        taskName: '申请人发起审批',
                        upScope: me,
                        isNotMine: true
                    })
                ]
            });

        }else if (me.retV[0]['mainType'] === 'FILE') {
            // 获取文件审批信息
            // 原始数据结构：[nodeid|[fileId1][fileId2]][fileId3]
            var dataId = me.retV[0].dataId;
            while(dataId.indexOf('][', ',') > -1){
                dataId = dataId.replace('][', ',');
            }
            var filePanelInfo = dataId.replace('[', '').replace(']', '').split('|');

            // 文档审批文件列表
            items.push(Ext.create("OrientTdm.Collab.MyTask.mineAuditTask.MineAuditFileGridpanel", {
                title: '审批附件',
                nodeId: filePanelInfo[0],
                fileFilter : filePanelInfo[1],
                region: 'north',
                height: 300,
                piId: me.piId,
                listeners: {
                    activate: function () {
                        this.fireEvent("refreshGrid");
                    }
                }
            }));
        }

        // 历史审批意见
        items.push(Ext.create('OrientTdm.Collab.MyTask.mineAuditTask.MineAuditTaskHisOpinionList', {
            piId: me.piId,
            taskName: me.taskName,
            taskId: me.taskId,
            title: '审批意见',
            region: 'center',
            split: true
        }));

        Ext.apply(me, {
            items: items
        });
        this.callParent(arguments);
    },

    initEvents: function () {
        this.callParent(arguments);
    }

});