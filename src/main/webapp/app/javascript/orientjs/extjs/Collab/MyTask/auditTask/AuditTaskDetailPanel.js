/**
 * Created by Seraph on 16/8/3.
 */
Ext.define('OrientTdm.Collab.MyTask.auditTask.AuditTaskDetailPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientTabPanel',
    config: {
        taskInfo: null,
        isHistory: false,
        taskType: TDM_SERVER_CONFIG.AUDIT_TASK,
        submitPanel: null
    },
    iconCls: 'icon-auditTask',
    // 标签页的标签在底部显示
    //tabPosition: 'bottom',
    requires: [
        'OrientTdm.Collab.MyTask.auditTask.ModelDataAuditDetailPanel',
        'OrientTdm.Collab.MyTask.auditTask.Opinion.AuditTaskOpinionPanel',
        'OrientTdm.Collab.MyTask.auditTask.SubmitAuditFlowTaskPanel'
    ],
    initComponent: function () {
        var me = this;
        //var tBar = me.getTbar();
        Ext.apply(me, {
            id: "auditTaskDetailPanel"
            //dockedItems: [tBar]
        });
        this.callParent(arguments);

        me.initDefaultComponent();
    },

    /**
     * 按钮
     * @returns {*}
     */
    getTbar: function () {
        var me = this;
        var btns = [];
        if (me.isHistory) {
            return null;
        }
        //提交任务
        btns.push({
            text: '提交任务',
            iconCls: 'icon-submitproject',
            handler: me._submitTask,
            scope: me
        });

        // 审批任务设置了多个执行人时，会有【接受任务】按钮
        if (me.taskInfo.groupTask) {
            btns.push({
                text: '接受任务',
                iconCls: 'icon-takeTask',
                disabled: !me.taskInfo.groupTask,
                handler: Ext.bind(me.onAcceptTask, me)
            });
        }
        return {
            xtype: 'toolbar',
            items: btns
        };
    },

    /**
     * 初始化组件
     */
    initDefaultComponent: function () {
        var me = this;
        var params = {piId: me.taskInfo.piId};

        // var toolbar = me.getDockedItems('toolbar[dock="top"]')[0];
        OrientExtUtil.AjaxHelper.doRequest("flow/info/bindDatas.rdm", params, false, function (response) {
            var retV_ = response.decodedData.results;
            var retV = [];
            for (var i = 0; i < retV_.length; i++) {
                if(retV_[i].mainType != 'LastExecutor'){
                    retV.push(retV_[i]);
                }
            }
            me.bindDatas = retV;
            me.taskInfo.auditType = retV.length > 0 ? retV[0].mainType : '';

            var auditDataPanelItems = [];
            me.saveBtnClick = true;
            me.issavebtn = false;
            if (me.taskInfo.auditType === 'ModelDataAudit') {
                if(me.taskInfo.name == '申请人发起审批'){
                    me.saveBtnClick = false;
                }

                auditDataPanelItems.push({
                    xtype: 'fieldset',
                    style : {
                        padding: '0',
                        margin: '0'
                    },
                    items: [Ext.create('OrientTdm.Collab.MyTask.auditTask.ModelDataAuditDetailPanel', {
                        anchor: '100%',
                        bindDatas: retV,
                        piId: me.taskInfo.piId,
                        taskName: me.taskInfo.name,
                        upScope: me
                    })]
                });

            }else if (me.taskInfo.auditType === 'FILE') {
                // 获取文件审批信息
                // 原始数据结构：[nodeid|[fileId1][fileId2]][fileId3]
                var dataId = retV[0].dataId;
                while(dataId.indexOf('][', ',') > -1){
                    dataId = dataId.replace('][', ',');
                }
                var filePanelInfo = dataId.replace('[', '').replace(']', '').split('|');

                auditDataPanelItems.push({
                    xtype: 'fieldset',
                    style : {
                        padding: '0',
                        margin: '0'
                    },
                    items: [Ext.create("OrientTdm.Collab.MyTask.auditTask.File.AuditFileGridpanel", {
                        title: '审批附件',
                        height: 300,
                        upAttribute: me,
                        nodeId: filePanelInfo[0],
                        fileFilter : filePanelInfo[1],
                        piId: me.taskInfo.piId,
                        groupTask: me.taskInfo.groupTask,
                        taskName: me.taskInfo.name,
                        listeners: {
                            activate: function () {
                                this.fireEvent('refreshGrid');
                            }
                        }
                    })]
                });
            }

            // 审批意见信息
            var opinionSetting = null;
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/AuditFlowOpinionSetting/init.rdm', {
                pdId: me.taskInfo.pdId,
                taskName: me.taskInfo.name
            }, false, function (resp) {
                if (resp.decodedData && resp.decodedData.results) {
                    //有且只有一条意见描述
                    var opinionDesc = resp.decodedData.results[0];
                    opinionSetting = opinionDesc.opinion;
                    if (!Ext.isEmpty(opinionSetting) && me.isHistory == false) {
                        auditDataPanelItems.push({
                            xtype: 'fieldset',
                            style : {
                                padding: '0',
                                margin: '0'
                            },
                            items: [Ext.create('OrientTdm.Collab.MyTask.auditTask.Opinion.AuditTaskOpinionForm', {
                                title: '当前意见',
                                height: 300,
                                opinion: opinionSetting
                            })]
                        });
                    }
                }
            });

            // 按钮栏：提交、驳回、接受任务
            var btnArr = ['->'];

            // 按钮：接受任务
            if (me.taskInfo.groupTask) {
                btnArr.push({
                    text: '接受任务',
                    iconCls: 'icon-takeTask',
                    disabled: !me.taskInfo.groupTask,
                    handler: Ext.bind(me.onAcceptTask, me)
                });
            }

            var transitions = me._getOutTransitions();
            var submitPanel = Ext.create("OrientTdm.Collab.MyTask.auditTask.SubmitAuditFlowTaskPanel", {
                piId: me.taskInfo.piId,
                transitions: transitions
            });
            me.submitPanel = submitPanel;
            var buttons = [];
            Ext.each(transitions, function (transition) {
                btnArr.push({
                    text: transition.nextTaskInfo.transition.indexOf('驳回') > -1 ? '驳回' : '提交',
                    iconCls: "icon-workGroup",
                    handler: Ext.bind(me._submitTaskByTranstions, me, [transition], false),
                    scope: me,
                    transition: transition,
                    currentTaskName: me.taskInfo.name,
                    listeners: {
                        click: function () {
                            // 审批发起人节点提交任务前需要成功保存表单
                            if(me.saveBtnClick == false){
                                OrientExtUtil.Common.err('提示', '未保存表单，无法提交！');
                                return false;
                            }

                            if (me.down('auditTaskOpinionForm')) {
                                var form = me.down('auditTaskOpinionForm').getForm();
                                if (form.isValid() == false) {
                                    OrientExtUtil.Common.info('提醒', '审批意见不能为空！');
                                    return false;
                                }
                            }
                        }
                    }
                });
            });
            btnArr.push('->');

            auditDataPanelItems.push({
                xtype:'fieldset',
                style : {
                    padding: '0',
                    margin: '10px 0'
                },
                items: [{
                    xtype: 'panel',
                    tbar: btnArr
                }]
            });

            // 历史审批意见
            auditDataPanelItems.push({
                xtype: 'fieldset',
                style : {
                    padding: '0',
                    margin: '0'
                },
                items: [Ext.create('OrientTdm.Collab.MyTask.auditTask.Opinion.AuditTaskHisOpinionList', {
                    id: 'AuditTaskHisOpinionList',
                    title: '历史意见',
                    multiSelect: false,
                    selType: 'rowmodel',
                    split: true,
                    height: 300,
                    piId: me.taskInfo.piId,
                    taskName: me.taskInfo.name,
                    taskId: me.taskInfo.flowTaskId
                })]
            });

            // 第一个标签页
            me.add(Ext.create('Ext.form.Panel', {
                title: '审批数据',
                items: auditDataPanelItems,
                autoScroll: true
            }));

            // 流程图标签页
            me.add(Ext.create("OrientTdm.Collab.common.auditFlow.MonitAuditFlowPanel",{
                title: '流程图',
                iconCls: 'icon-flow',
                piId: me.taskInfo.piId
            }));

            // 激活第一个标签页
            me.setActiveTab(0);
        });
    },

    onAcceptTask: function () {
        var me = this;

        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/flow/task/take.rdm', {flowTaskId: me.taskInfo.flowTaskId}, false, function (response) {
            var respJson = response.decodedData;

            if (respJson.success) {
                var toolbar = me.getDockedItems('toolbar[dock="top"]');
                var btns = toolbar[0].items.items;
                for (var i = 0; i < btns.length; i++) {
                    if (btns[i].getText() === '接受任务') {
                        btns[i].setDisabled(true);

                        var auditFileGridpanel = me.down('AuditFileGridpanel');
                        if (auditFileGridpanel) {
                            auditFileGridpanel.fireEvent('changeCollabToolbarDisable');
                        }
                        continue;
                    }
                    btns[i].setDisabled(false);
                }
                me.taskInfo.groupTask = false;
            }
        });
    },

    /*_submitTask: function () {
        var me = this;

        // 校验审批文件是否已全部审批完毕，待审批的文件必须全部通过或驳回
        var auditFileGridPanel = me.down('AuditFileGridpanel');
        var tipStr = "";
        if(auditFileGridPanel != null){
            var fileList = auditFileGridPanel.store.data.items;
            for(var i = 0; i < fileList.length; i++){
                var item = fileList[i].data;
                var fileState = item['fileState'];
                if(fileState != '已完成' && fileState != '已驳回'){
                    tipStr += '<b>文件名</b>：' + item['filename'] + '-' + item['edition'] + '<br/>';
                }
            }
        }
        if(tipStr.length > 0){
            tipStr += '文件未审批，是否确认提交任务?';
            Ext.Msg.confirm('提示', tipStr, function (btn, text) {
                if (btn == 'yes') {
                    me.__submitTask();
                }
            })
        }else{
            me.__submitTask();
        }
    },*/

    _submitTask: function(){
        var me = this;

        //判断是否有未填的意见信息
        var validateFlag = true;
        if (me.down('auditTaskOpinionForm')) {
            var auditTaskOpinionForm = me.down('auditTaskOpinionForm');
            var form = auditTaskOpinionForm.getForm();
            if (form.isValid() == false) {
                validateFlag = false;
                OrientExtUtil.Common.err(OrientLocal.prompt.error, OrientLocal.prompt.opinionnotnull, function () {
                    // 跳转到【审批】标签页
                    var items = me.items.items;
                    for(var i = 0; i < items.length; i++){
                        if(items[i].title === '审批'){
                            me.setActiveTab(i);
                        }
                    }
                });
            }
        }
        if (validateFlag == true) {
            //提交任务
            var transitions = me._getOutTransitions();
            //if (transitions.length == 1) {
            //    //直接提交
            //    me._submitTaskByTranstions(transitions[0]);
            //} else {
            //弹出选择任务面板
            var submitPanel = Ext.create("OrientTdm.Collab.MyTask.auditTask.SubmitAuditFlowTaskPanel", {
                piId: me.taskInfo.piId,
                transitions: transitions
            });
            me.submitPanel = submitPanel;
            var buttons = [];
            Ext.each(transitions, function (transition) {
                buttons.push({
                    text: transition.nextTaskInfo.transition.indexOf('驳回') > -1 ? '驳回' : '提交',
                    iconCls: "icon-workGroup",
                    handler: Ext.bind(me._submitTaskByTranstions, me, [transition], false),
                    scope: me,
                    transition: transition,
                    currentTaskName: me.taskInfo.name,
                    listeners: {
                       // mouseover: me._highLightTransition,
                       // mouseout: me._clearHighLightTransition,
                        scope: me
                    }
                });
            });
            OrientExtUtil.WindowHelper.createWindow(submitPanel, {
                title: '提交任务',
                buttons: buttons,
                buttonAlign: "center"
            });
        }
    },

    _getOutTransitions: function () {
        var me = this;
        var params = {flowTaskId: me.taskInfo.flowTaskId};
        var items = [];
        OrientExtUtil.AjaxHelper.doRequest("flow/info/nextFlowNodes.rdm", params, false, function (response) {
            var retV = Ext.decode(response.responseText).results;
            for (var i = 0; i < retV.length; i++) {
                var nextTaskInfo = retV[i];
                items.push({
                    text: retV[i].name,
                    nextTaskInfo: retV[i],
                    type: retV[i].type//用于判断节点类型
                });

            }
        });
        return items;
    },

    /**
     * 提交审批任务
     * @param transition
     * @private
     */
    _submitTaskByTranstions: function (transition) {
        var me = this;
        //准备历史信息
        var filePanelInfo =  me.filePanelInfo;
        var piId = me.taskInfo.piId;
        var taskName = me.taskInfo.name;
        var taskId = me.taskInfo.flowTaskId;
        var taskType = me.taskType;
        var auditType = me.taskInfo.auditType;
        var opinions = [];
        var auditTaskPortal = me.ownerCt.down('auditTaskPortal');

        if (me.down('auditTaskOpinionForm')) {
            var auditTaskOpinionForm = me.down('auditTaskOpinionForm');
            var form = auditTaskOpinionForm.getForm();
            var formValues = form.getFieldValues();
            for (var opinionName in formValues) {
                opinions.push({
                    flowid: me.taskInfo.piId,
                    flowTaskId: me.taskInfo.flowTaskId,
                    activity: me.taskInfo.name,
                    label: opinionName,
                    handlestatus: transition.nextTaskInfo.transition,
                    value: formValues[opinionName]
                });
            }
        }

        var nextTasksUserAssign = {};//nextTasksUserAssign[transition.text]
        var gridPanel = me.submitPanel.southPanelComponent;
        var gridData = [];
        var store = gridPanel.getStore();
        for(var i=0; i<store.getCount(); i++) {
            var record = store.getAt(i);
            gridData.push(record.data);
        }
        var retData = {};
        for (var i in gridData) {
            if (gridData[i].nodeName === transition.text && "end" !== transition.type && "end-error" !== transition.type) {//节点类型不为end
                if (gridData[i].realNames.indexOf(',') != -1) {
                    //用户组
                    nextTasksUserAssign[transition.text] = {
                        candidateUsers: gridData[i].realNames
                    };
                } else {
                    //单用户
                    nextTasksUserAssign[transition.text] = {
                        currentUser: gridData[i].realNames
                    };
                }
            }
        }

        OrientExtUtil.Common.confirm(OrientLocal.prompt.confirm, "您确定要提交该任务吗？", function (btn) {
            if (btn == 'yes') {
                OrientExtUtil.AjaxHelper.doRequest("auditFlow/control/commitTask.rdm", {
                    flowTaskId: me.taskInfo.flowTaskId,
                    transitionName: transition.nextTaskInfo.transition,
                    opinions: opinions,
                    nextTasksUserAssign: nextTasksUserAssign
                }, true, function (response) {
                    var retV = response.decodedData;
                    var success = retV.success;
                    if (success) {
                        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/hisTask/saveHisAuditTaskInfo.rdm', {
                            piId:piId,
                            taskName:taskName,
                            taskId:taskId,
                            taskType:taskType,
                            auditType:auditType
                        }, true, function (resp) {
                            //保存历史任务信息
                        }, true);
                        if (me.submitWin) {
                            me.submitWin.close();
                        }

                        // 审批结束以后变更文件状态
                        if(transition.nextTaskInfo.transition.indexOf("结束") > -1){
                            if(auditType === 'FILE' && filePanelInfo != undefined &&
                                filePanelInfo.length == 2 && filePanelInfo[1].length > 0){
                                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/FileMngController/onlyChangeFileInfoState.rdm', {
                                    fileIds: filePanelInfo[1],
                                    state: '3'
                                }, true);
                            }

                            var bindDatas = me.bindDatas;
                            if(bindDatas != undefined && bindDatas != null){
                                for(var i = 0; i < bindDatas.length; i++){
                                    var bindData = bindDatas[i];
                                    if(bindData.mainType === 'ModelDataAudit'){
                                        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/ModelController/updateStateByTableIdAndDataId.rdm', {
                                            modelId: bindData.tableName,
                                            dataId: bindData.dataId,
                                            val: '已完成'
                                        }, true);
                                    }
                                }
                            }
                        }

                        var myTaskDashboard = Ext.getCmp("myTaskDashboard");
                        if (myTaskDashboard) {
                            var rootTab = myTaskDashboard.ownerCt;
                            rootTab.remove(me);
                            //刷新表格面板
                            var taskMainPanel = myTaskDashboard.down('taskMainPanel');
                            var taskListGridPanel = taskMainPanel.layout.activeItem;
                            var gridPanel = taskListGridPanel.down('orientGrid');
                            if (gridPanel) {
                                gridPanel.fireEvent('refreshGrid');
                            }
                        } else {
                            if (auditTaskPortal != undefined && auditTaskPortal != null) {
                                auditTaskPortal.fireEvent('refreshGrid');
                            }
                            me.ownerCt.remove(me);
                        }
                    }
                }, true);
            }
        });
    },

    _highLightTransition: function (btn) {
        var me = this;
        if (!me.submitWin) {
            me.submitWin = btn.up('window');
        }
        var currentTaskName = btn.currentTaskName;
        var endTaskName = btn.transition.nextTaskInfo.name;
        btn.up('window').down('submitAuditFlowTaskPanel')._highLightTransition(currentTaskName, endTaskName);
    },

    _clearHighLightTransition: function (btn) {
        btn.up('window').down('submitAuditFlowTaskPanel')._clearHighLightTransition();
    }

});