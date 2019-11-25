/**
 * Created by Seraph on 16/7/29.
 */
Ext.define('OrientTdm.Collab.common.collabFlow.collabFlowPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.collabFlowPanel',
    requires: [
        "OrientTdm.FlowCommon.flowDiagram.flowDiagram",
        "OrientTdm.FlowCommon.flowDiagram.dataObtainer.simpleFlowDataObtainer",
        "OrientTdm.FlowCommon.flowDiagram.dataObtainer.collabFlowDataObtainer",
        'OrientTdm.Collab.common.collabFlow.HorizontalFlowStatusPanel',
        'OrientTdm.Collab.common.collabFlow.FlowOverViewPanel',
        "OrientTdm.Common.Util.HtmlTriggerHelper"
    ],
    config: {
        modelName: null,
        dataId: null,
        readOnly: false,
        flowDiagram: null,
        flowInfo: null,
        sid: null,
        localMode: false,
        localData: null,
        hisTaskDetail: null
    },
    initComponent: function () {
        var me = this;
        var sid = new Date().getTime();
        me.sid = sid;
        var overViewContainedId = 'overViewContainer_' + sid;
        me.overViewContainedId = overViewContainedId;
        var centerPanel = Ext.create("OrientTdm.Common.Extend.Panel.OrientPanel", {
            region: 'center',
            padding: '0 0 0 0',
            border: false,
            listeners: {
                afterrender: function (panel) {
                    me.doLoadFlowDiagram();
                }
            },
            html: '<div id="curflowContainer_' + sid + '" style="z-index:1;position:relative;overflow:hidden;top:0px;right:0px;width:100%;height:100%;border-style:none;border-color:lightgray;"></div>'
        });

        var westPanel = Ext.create("OrientTdm.Common.Extend.Panel.OrientPanel", {
            region: 'west',
            width: 38,
            border: false,
            listeners: {
                afterrender: function (panel) {

                }
            },
            html: '<div id="flowDiagCtrl_' + sid + '"  style="z-index:1;position:relative;overflow:hidden;top:0px;right:0px;width:100%;' +
            'height:100%;border-style:none;border-color:#e9e9e9;background-color:#e9e9e9;"></div>'

        });
        var southPanel = Ext.create("OrientTdm.Collab.common.collabFlow.HorizontalFlowStatusPanel", {
            region: 'south',
            height: 38,
            margin: '0 0 0 38',
            border: false

        });

        var toolbarItems = me.createToolbar.call(me);
        var toolBar = toolbarItems && toolbarItems.length > 0 ? Ext.create('Ext.toolbar.Toolbar', {
            items: toolbarItems
        }) : null;
        Ext.apply(this, {
            layout: 'border',
            items: [centerPanel, westPanel, southPanel],
            centerPanel: centerPanel,
            westPanel: westPanel,
            southPanel: southPanel,
            tbar: toolBar,
            listeners: {
                removed: function () {

                }
            }
        });

        this.callParent(arguments);
    },
    createToolbar: function () {
        var me = this;

        if(me.unShowToolbarBtn){
            return ['->', '<span style="color:red;">双击节点即可设置人员</span>'];
        }else if (me.readOnly || null != me.hisTaskDetail || me.localMode || me._readOny_ || (me.rwNodeId && me.title == "所属流程")) {
            return [];
        } else {
            return [{
                    iconCls: 'icon-flowDesigner',
                    text: '流程设计器',
                    scope: this,
                    itemId: 'startFlowDesigner',
                    hidden: me.isHiddenBtn == true ? true: false,
                    handler: Ext.bind(me.doStartFlowDesigner, me)
                }, {
                    iconCls: 'icon-startCollabFlow',
                    text: '启动',
                    itemId: 'startPi',
                    scope: this,
                    handler: Ext.bind(me.doStart, me)
                }, {
                    iconCls: 'icon-suspendFlow',
                    text: '暂停',
                    itemId: 'suspendPi',
                    scope: this,
                    handler: Ext.bind(me.doSuspend, me)
                }, {
                    iconCls: 'icon-resumeFlow',
                    text: '恢复',
                    itemId: 'resumePi',
                    scope: this,
                    handler: Ext.bind(me.doResume, me)
                }, {
                    iconCls: 'icon-stopFlow',
                    text: '关闭',
                    itemId: 'closeFlow',
                    scope: this,
                    handler: Ext.bind(me.doClose, me)
                },'->', '<span style="color:red;">双击节点即可设置人员</span>'];
        }
    },

    doRefresh: function () {},

    doStart: function () {
        var me = this;
        var url = '/' + me.modelName.toLowerCase() + '/start.rdm';
        var params = {
            dataId: me.dataId
        };
        // 启动计划
        OrientExtUtil.AjaxHelper.doRequest(serviceName + url, params, false, function (response) {
            var retV = Ext.decode(response.responseText);
            if (retV.success) {
                // 启动成功后刷新控制流标签页
                me.doReloadFlowDiagram();
            }
        });
    },

    doSuspend: function () {
        var me = this;
        var url = '/' + me.modelName.toLowerCase() + '/suspend.rdm';

        var params = {
            dataId: me.dataId
        };
        OrientExtUtil.AjaxHelper.doRequest(serviceName + url, params, false, function (response) {
            var retV = Ext.decode(response.responseText);
            if (retV.success) {
                Ext.Msg.alert("提示", "暂停成功");
            } else {

            }

        });
    },
    doResume: function () {
        var me = this;
        var url = '/' + me.modelName.toLowerCase() + '/resume.rdm';

        var params = {
            dataId: me.dataId
        };
        OrientExtUtil.AjaxHelper.doRequest(serviceName + url, params, false, function (response) {
            var retV = Ext.decode(response.responseText);
            if (retV.success) {
                Ext.Msg.alert("提示", "恢复成功");
            } else {

            }
        });
    },
    doClose: function () {
        var me = this;
        var url = '/' + me.modelName.toLowerCase() + '/close.rdm';

        var params = {
            dataId: me.dataId
        };
        OrientExtUtil.AjaxHelper.doRequest(serviceName + url, params, false, function (response) {
            var retV = Ext.decode(response.responseText);
            if (retV.success) {
                Ext.Msg.alert("提示", "关闭成功");
                me.doReloadFlowDiagram();
            }
        });
    },
    doReloadFlowDiagram: function () {
        var me = this;
        var ct = me.ownerCt;
        var config = {
            region: 'center',
            modelName: me.modelName,
            dataId: me.dataId
        };
        if (me.filterValue) {
            config.filterValue = me.filterValue;
        }
        if (me.filterType) {
            config.filterType = me.filterType;
        }
        if (me.filterTH) {
            config.filterTH = me.filterTH;
        }
        if (me.rwNodeId) {
            config.rwNodeId = me.rwNodeId;
        }
        if (me.title) {
            config.title = me.title;
        }
        if (me.iconCls) {
            config.iconCls = me.iconCls;
        }
        if (me.readOnly) {
            config.readOnly = me.readOnly;
        }
        ct.remove(me);
        var newCollabFlowPanel = Ext.create("OrientTdm.Collab.common.collabFlow.collabFlowPanel", config);
        ct.add(newCollabFlowPanel);
        ct.doLayout();
        if (ct.id.indexOf('collabTaskCenterPanel') > -1) {
            ct.setActiveTab(newCollabFlowPanel);
        }
    },
    doLoadFlowDiagram: function () {
        var me = this;

        if (me.localMode && me.localData.hasPd) {
            me.centerPanel.removeAll();
            me.westPanel.removeAll();
            me.flowDiagram = new OrientTdm.FlowCommon.flowDiagram.flowDiagram();
            me.flowDiagram.initByLocal(document.getElementById('curflowContainer_' + me.sid), me.localData.jpdl);
            me.flowDiagram.addListener(mxEvent.DOUBLE_CLICK, Ext.bind(me.doSetAssignee, me));
            me.flowDiagram.updateOverView(document.getElementById(me.overViewContainedId));
            me.flowDiagram.createGraphCtrlToolbar(document.getElementById('flowDiagCtrl_' + me.sid));
            return;
        }

        if (me.hisTaskDetail != null) {
            var flowMonitData = me.hisTaskDetail.getFlowMonitData();
            var jpdlDesc = flowMonitData.jpdlDesc;
            var flowTaskNodeModelList = flowMonitData.flowTaskNodeModelList;
            me.centerPanel.removeAll();
            me.westPanel.removeAll();
            me.flowDiagram = new OrientTdm.FlowCommon.flowDiagram.flowDiagram();
            me.flowDiagram.initByLocal(document.getElementById('curflowContainer_' + me.sid), jpdlDesc);
            me.flowDiagram.addListener(mxEvent.DOUBLE_CLICK, Ext.bind(me.doSetAssignee, me));
            me.flowDiagram.createGraphCtrlToolbar(document.getElementById('flowDiagCtrl_' + me.sid));
            me.flowDiagram.updateOverView(document.getElementById(me.overViewContainedId));
            me.flowDiagram.updateNodeStatusByLocal(flowTaskNodeModelList);
        } else {
            var params = {
                modelName: me.modelName,
                dataId: me.dataId
            };
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/collabFlow/flowInfo.rdm', params, false, function (response) {
                me.centerPanel.removeAll();
                me.westPanel.removeAll();
                me.flowInfo = Ext.decode(response.responseText);
                if ((Ext.isEmpty(me.flowInfo.piId)) && (Ext.isEmpty(me.flowInfo.pdId))) {
                    return;
                }
                me.flowDiagram = new OrientTdm.FlowCommon.flowDiagram.flowDiagram();
                var flowDataObtainer = new OrientTdm.FlowCommon.flowDiagram.dataObtainer.collabFlowDataObtainer();
                me.flowDiagram.init(document.getElementById('curflowContainer_' + me.sid), flowDataObtainer, me.flowInfo);
                me.flowDiagram.addListener(mxEvent.DOUBLE_CLICK, Ext.bind(me.doSetAssignee, me));
                me.flowDiagram.updateOverView(document.getElementById(me.overViewContainedId));
                if ((!Ext.isEmpty(me.flowInfo.piId)) || (!Ext.isEmpty(me.flowInfo.flowTaskId))) {
                    me.flowDiagram.updateNodeStatus(me.flowInfo);
                }
                me.flowDiagram.createGraphCtrlToolbar(document.getElementById('flowDiagCtrl_' + me.sid));
            });
        }

    },
    doSetAssignee: function () {
        var me = this;
        if (me.readOnly) {
            return;
        }
        if (Ext.isEmpty(me.flowDiagram)) {
            Ext.Msg.alert('提示', '流程未启动或未定义');
            return;
        }

        var selectedTaskInfo = me.flowDiagram.getCurSelNodeAttr();
        if (Ext.isEmpty(selectedTaskInfo)) {
            Ext.Msg.alert('提示', '未选择待设置节点');
            return;
        }
        // 无法设置进行中的任务
        if(selectedTaskInfo.status == '正在进行' || selectedTaskInfo.nodeType == "start" || selectedTaskInfo.nodeType == "end"){
            return;
        }

        var collabPower = "";
        if (me.rwNodeId) {
            // 试验经理xxx 节点人员不可变更
            if (selectedTaskInfo.taskName.indexOf("试验经理") > -1) {
                OrientExtUtil.Common.info('提示', '该节点人员固定，无法设置人员');
                return;
            }

            //判断用户权限
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomRoleController/getCollabPower.rdm',{
                thDataId : me.filterTH,
                rwNodeId: me.rwNodeId
            }, false, function (response) {
                collabPower = response.decodedData.results;
            });

            // 当前人员不是试验团队的试验经理或试验项的被试品负责人
            if (collabPower == "-1") {
                OrientExtUtil.Common.info('提示', '权限不足，无法设置人员');
                return;

            // 试验项的被试品负责人不能设置 设计师xxx 或 部门经理xxx 节点执行人
            }else if (
                    collabPower == "0" && selectedTaskInfo.taskName.indexOf("设计师") > -1 || selectedTaskInfo.taskName.indexOf("部门经理") > -1
                ) {
                OrientExtUtil.Common.info('提示', '权限不足，无法设置人员');
                return;

            }/* else if (collabPower == "1") {
                // 当前任务为试验经理可以设置部门经理
                var canSetDepManger = false;
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/getCurrentTaskNode.rdm',{
                    planId : me.dataId
                }, false, function (response) {
                    var taskNameList = response.decodedData.results;
                    Ext.each(taskNameList, function (taskName) {
                        if (taskName.indexOf('试验经理') > -1) {
                            canSetDepManger = true;
                        }
                    });
                });
                if ((selectedTaskInfo.taskName.indexOf("部门经理") > -1 || selectedTaskInfo.taskName.indexOf("设计师") > -1) && canSetDepManger == false) {
                    OrientExtUtil.Common.info('提示', '任务进行中，不能设置人员');
                    return;
                }
                if (selectedTaskInfo.taskName.indexOf("设计师") > -1 && canSetDepManger == false) {
                    OrientExtUtil.Common.info('提示', '当前任务进程下，无法设置该节点执行人');
                    return;
                }
            }*/
        }


        var win = Ext.create('Ext.Window', {
            plain: true,
            height: 600,
            width: 800,
            layout: 'fit',
            maximizable: false,
            title: '设置执行人',
            modal: true
        });
        var userSelectorPanel = Ext.create('OrientTdm.Common.Extend.Form.Selector.ChooseUserPanel', {
            multiSelect: false,
            filterValue: me.filterValue,
            filterType: me.filterType,
            filterTH: me.filterTH,
            filterValue: OrientExtUtil.SysMgrHelper.getCustomRoleIds(),
            selectedValue: selectedTaskInfo.assignee,
            saveAction: function (saveData, callback) {
                Ext.getBody().mask("请稍后...", "x-mask-loading");
                var showValues = Ext.Array.pluck(saveData, 'name').join(',');
                var realValues = Ext.Array.pluck(saveData, 'userName').join(',');
                var selectedIds = Ext.Array.pluck(saveData, 'id');

                if(selectedTaskInfo.nodeType === 'custom'){
                    var params = {
                        piId: me.flowInfo.piId,
                        parModelName: me.modelName,
                        parDataId: me.dataId,
                        taskName: selectedTaskInfo.name,
                        assignee: realValues,
                        assigneeIds: selectedIds.join(',')
                    };

                    OrientExtUtil.AjaxHelper.doRequest(serviceName + '/collabCounterSign/assignee/set.rdm', params, false, function (response) {
                        var retV = response.decodedData;
                        var success = retV.success;
                        me._setAssigneeSuccessCb(success, retV.msg, selectedTaskInfo, selectedIds, callback);
                    });
                }else{
                    var params = {
                        taskName: selectedTaskInfo.name,
                        piId: me.flowInfo.piId,
                        assignee: realValues
                    };

                    OrientExtUtil.AjaxHelper.doRequest(serviceName + '/flow/task/assignee/set.rdm', params, false, function (response) {
                        var retV = response.decodedData;
                        var success = retV.success;
                        me._setAssigneeSuccessCb(success, retV.msg, selectedTaskInfo, selectedIds, callback);
                    });
                }
            }
        });

        win.add(userSelectorPanel);
        win.show();
    },
    doStartFlowDesigner: function () {
        var me = this;
        var params = {
            modelName: me.modelName,
            dataId: me.dataId,
            WebServices: contextPath
        };
        HtmlTriggerHelper.startUpTool("workFlow", "null", params, "=");
    },
    _setAssigneeSuccessCb : function (success, msg, selectedTaskInfo, selectedIds, callback) {
        var me = this;
        if (success) {
            if (callback) {
                callback.call(this);
            }
            //将选中的人员加入到对应任务的执行人中
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/collabTeam/saveAssignedUsersByRolename.rdm', {
                modelName: me.modelName,
                dataId: me.dataId,
                taskName: selectedTaskInfo.name == undefined ? selectedTaskInfo.taskName : selectedTaskInfo.name,
                selectedIds: selectedIds,
                roleName: '执行人'
            }, false, function (response) {
                var retV = response.decodedData;
                var success = retV.success;
                var taskName = selectedTaskInfo.taskName;
                if (!success) {
                    Ext.Msg.alert('提示', retV.msg);
                } else if (taskName.indexOf("试验经理") == -1 && taskName.indexOf("部门经理") == -1 && taskName.indexOf("设计师") == -1 && me.rwNodeId) {
                    var pid = OrientExtUtil.TreeHelper.getChildNode('', me.rwNodeId, '实施人员');
                    OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomInsertController/setTestUserNode.rdm',{
                        pid: pid,
                        tableName: 'CWM_SYS_USER',
                        taskName: selectedTaskInfo.taskName,
                        userId: selectedIds.join(',')
                    },false);
                }
                // todo 2019年10月26日 不知道什么逻辑，参数也对不上
                /* else if (taskName.indexOf("部门经理") > -1) {
                    // 更新被试品负责人
                    OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomUpdateController/updateRwINfo.rdm',{
                        rwNodeId: me.rwNodeId,
                        fieldName: "M_ZRR",  //M_ZRR
                        userId: selectedIds.join(",")
                    }, false);

                } else if (taskName.indexOf("设计师") > -1) {
                    OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomUpdateController/updateRwINfo.rdm',{
                        rwNodeId: me.rwNodeId,
                        fieldName: "M_ZRR",   //M_HJ_FZR
                        userId: selectedIds.join(",")
                    }, false);
                }*/
            });

            // 重新加载流程图
            me.doReloadFlowDiagram();
        } else {
            Ext.Msg.alert('提示', msg);
        }
    }
});
