/**
 * Created by Seraph on 16/8/5.
 */
Ext.define('OrientTdm.Collab.MyTask.auditTask.AuditFlowTaskSubmitPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    config: {
        taskInfo : null,
        bindDatas : null
    },
    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            items: [
                {
                    xtype: 'fieldset',
                    title: '详情',
                    collapsible: true,
                    defaults: {
                        labelWidth: 89,
                        anchor: '100%',
                        layout: {
                            type: 'vbox',
                            defaultMargins: {top: 15, right: 15, bottom: 0, left: 15}
                        }
                    },
                    items: [
                        Ext.bind(me.getTransitionSelectRadioBox, me)()
                    ]
                }
            ],
            buttons: [{
                text: '提交',
                iconCls: 'icon-saveSingle',
                handler: function () {
                    var transition = me.down("radiogroup[name=flowTransition]").getChecked();
                    if(transition.length<1){
                        Ext.Msg.alert('提示', '未选择用户');
                    }

                    var assignedUsers = me.queryBy(function (item) {
                        if(Ext.isEmpty(item.name) || item.name.indexOf("selectUserField")<0){
                            return false;
                        }
                    });
                    me.commitTask(transition[0].nextTaskInfo, assignedUsers, function () {
                        var myTaskDashboard = Ext.getCmp("myTaskDashboard");
                        var rootTab = myTaskDashboard.ownerCt;
                        rootTab.remove(me);
                    })

                }
            }
            ]
        });
        this.callParent(arguments);
    },
    getTransitionSelectRadioBox : function () {

        var me = this;
        var params = { flowTaskId : me.taskInfo.flowTaskId };
        var items = [];

        OrientExtUtil.AjaxHelper.doRequest("flow/info/nextFlowNodes.rdm", params, false, function (response) {
            var retV = response.decodedData.results;

            for(var i=0; i<retV.length; i++){

                items.push({
                    boxLabel : retV[i].name,
                    name : me.taskInfo.flowTaskId,
                    inputValue : retV[i],
                    nextTaskInfo : retV[i]
                });
            }
        });

        return {
            xtype      : 'radiogroup',
            name : 'flowTransition',
            fieldLabel : '流向',
            items: items,
            columns: 3,
            listeners : {
                change : Ext.bind(me.taskTransitionSelected, me)
            }
        };
    },
    taskTransitionSelected : function (radioBox, newValue, oldValue) {
        var me = this;

        var nextFlowNode = newValue[me.taskInfo.flowTaskId];

        var ct = radioBox.ownerCt;
        var oldUserFields = ct.queryBy(function (component) {
            if(component.name !== 'handleUser'){
                return false;
            }
        });

        for(var i=0; i<oldUserFields.length; i++){
            ct.remove(oldUserFields[i]);
        }
        if(nextFlowNode.type == 'fork' || nextFlowNode.type == 'join'){
            var nextFlowNodes = nextFlowNode.nextFlowNodes;
            for(var i=0; i<nextFlowNodes.length; i++){
                if(nextFlowNodes[i].type !== 'task'){
                    continue;
                }
                ct.add(me.getUserSelectField('selectUserField' + nextFlowNodes[i].name, nextFlowNodes[i].name));
            }
        }else if(nextFlowNode.type == 'task'){
            ct.add(me.getUserSelectField('selectUserField', nextFlowNode.name));
        }

        radioBox.ownerCt.doLayout();
    },
    getUserSelectField : function (fieldName, taskName, callBack) {
        var me = this;
        return Ext.create("Ext.form.TextField", {
            name: fieldName,
            fieldLabel: '任务"' + taskName + '"处理人',
            margin: '0 5 5 0',
            allowBlank: false,
            grow: true,
            labelWidth: 100,
            width:300,
            taskName : taskName,
            listeners : {
                focus : function (field) {
                    var win = Ext.create('Ext.Window', {
                        plain: true,
                        height: 600,
                        width: 800,
                        layout: 'fit',
                        maximizable: false,
                        title: '选择用户',
                        modal: true
                    });
                    
                    var userSelectorPanel = Ext.create('OrientTdm.Common.Extend.Form.Selector.ChooseUserPanel', {
                        multiSelect: false,
                        saveAction: function (saveData, callBack) {
                            var showValues = Ext.Array.pluck(saveData, 'name').join(',');
                            var realValues = Ext.Array.pluck(saveData, 'userName').join(',');

                            field.setValue(showValues);
                            field.userName = realValues;

                            if (callBack) {
                                callBack.call(this);
                            }
                            win.close();
                        }
                    });
                    
                    win.add(userSelectorPanel);
                    win.show();
                }
            }
        });
    },
    commitTask : function (nextTaskInfo, assignUsers, callback) {
        Ext.getBody().mask("请稍后...", "x-mask-loading");

        var me = this;
        var nextTasksUserAssign = {};

        for(var i=0; i<assignUsers.length; i++){
            nextTasksUserAssign[assignUsers[i].taskName] = {
                currentUser : assignUsers[i].userName
            };
        }

        var params = {
            flowTaskId : me.taskInfo.flowTaskId,
            transitionName : nextTaskInfo.transition,
            nextTasksUserAssign : nextTasksUserAssign
        };


        Ext.Ajax.request({
            "url": "auditFlow/control/commitTask.rdm",
            "timeout": 100000000,
            "async": false,
            jsonData : params,
            "success": function (response) {
                Ext.getBody().unmask();
                var retV = response.decodedData;
                var success = retV.success;
                if(success){
                    if (Ext.isFunction(callback)) {
                        callback.call(me);
                    }
                }
            },
            failure: function (response, opts) {

            }
        });
    }
});