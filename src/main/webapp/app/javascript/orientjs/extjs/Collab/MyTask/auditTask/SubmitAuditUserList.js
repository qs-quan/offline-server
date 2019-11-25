/**
 * Created by qjs on 2017/2/13.
 * 提交审批任务时展现的表格
 * 显示和修改当前节点可执行节点的执行人
 */
Ext.define('OrientTdm.Collab.MyTask.auditTask.SubmitAuditUserList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.SubmitAuditUserList',
    requires: [
        "OrientTdm.Collab.MyTask.auditTask.model.SubmitAuditUserModel",
        'OrientTdm.Common.Extend.Form.Field.OrientCheckCombo'
    ],
    config: {
        extraFilter: '',
        transitions:[],
        flowTaskId: '',
        piId: '',
        storeData:null,
        taskAssigns: {}
    },
    usePage: false,
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    initComponent: function () {
        var me = this;
        me.taskAssigns = me.getTaskAssigns(me.piId);

        me.cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 1
        });
        Ext.apply(me, {
            xtype: 'cell-editing',
            multiSelect: false,
            plugins: [me.cellEditing],
            extraFilter: {},
            //fbar: ["->", '<span style="color:red;">点击修改执行人</span>'],
            listeners: {
                cellclick: function(table, td, cellIndex, record, tr, rowIndex) {

                }
            }
        });
        me.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
    },
    getTaskAssigns: function(piId) {
        var me = this;
        var retMap = {};
        var resultList = [];
        OrientExtUtil.AjaxHelper.doRequest("flowDiagramContent/taskAssign.rdm", {piId: piId}, false, function userCallback(response) {
            if(response.decodedData.results) {
                resultList = response.decodedData.results;
            }
        });
        for(var i=0; i<resultList.length; i++) {
            var userNames = resultList[i].taskAssignerNames;
            var displayNames = resultList[i].taskAssignerDisplayNames;
            var userList = [];
            for(var j=0; j<userNames.length; j++) {
                userList.push({userName: userNames[j], displayName: displayNames[j]});
            }
            retMap[resultList[i].taskName] = userList;
        }
        return retMap;
    },
    createColumns: function () {
        var me = this;
        return [
            {
                header: '环节',
                flex: 2,
                sortable: true,
                dataIndex: 'nodeName',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '执行人（<span style="color:red;">点击修改</span>）',
                flex: 2,
                sortable: true,
                dataIndex: 'displayNames',
                filter: {
                    type: 'string'
                },
                editor: Ext.create('OrientTdm.Common.Extend.Form.Field.OrientCheckCombo',{
                    typeAhead: true,
                    triggerAction: 'all',
                    displayField: 'displayName',
                    valueField: 'displayName',
                    initFirstRecord: false,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['displayName', 'userName'],
                        data : []
                    }),
                    listeners: {
                        focus: function(combo, evt) {
                            //evt.stopEvent();
                            var select = me.getSelectionModel().getSelection()[0];
                            var taskName = select.data.nodeName;
                            var assignUsers = me.taskAssigns[taskName];
                            if(!assignUsers) {
                                assignUsers = [];
                            }
                            combo.getStore().loadData(assignUsers, false);
                            combo.expand();
                        },
                        select: function(combo, records) {

                        }
                    }
                })
            }
        ];
    },
    createStore: function () {
        var me = this;
        var transitions = me.transitions;
        var storeData = [];
        //查出执行人
        var params = {
            flowTaskId: me.flowTaskId,
            piId: me.piId
        };
        var oldStatusList = null;
        var statusList = [];
        OrientExtUtil.AjaxHelper.doRequest("flowDiagramContent/monitorInfo.rdm", params, false, function userCallback(response) {
            var retList = response.decodedData;
            oldStatusList = retList;
        });

        for (var i = 0; i < oldStatusList.length; i++) {
            if (statusList.length == 0) {
                statusList.push(oldStatusList[i]);
            }
            else {
                //判断是否有同名节点
                var flag = false;
                var newListPointer = 0;
                for (var j = 0; j < statusList.length; j++) {
                    if (statusList[j].name == oldStatusList[i].name) {
                        flag = true;
                        newListPointer = j;
                    }
                }
                if (flag) {
                    //比较开始时间
                    var oldListNodeStartTime = new Date(oldStatusList[i].startTime);
                    var newListNodeStartTime = new Date(statusList[newListPointer].startTime);
                    if (oldListNodeStartTime.getTime() > newListNodeStartTime.getTime()) {
                        //删除完成时间较早的节点
                        statusList.remove(statusList[newListPointer]);
                        //插入完成时间较晚的节点
                        statusList.push(oldStatusList[i]);
                    }
                    else {
                        //不插入
                    }
                }
                else {
                    statusList.push(oldStatusList[i]);
                }
            }
        }

        for(var i=0;i<transitions.length;i++) {
            var userModel = {};
            userModel.nodeName = transitions[i].text;
            for(var j=0;j<statusList.length;j++) {
                if(userModel.nodeName === statusList[j].name) {
                    userModel.displayNames = statusList[j].assRealName;
                    userModel.realNames = statusList[j].assignee;
                }
            }
            storeData.push(userModel);
        }
        me.storeData = storeData;

        var retVal = Ext.create("Ext.data.JsonStore", {
            autoLoad: true,
            model: 'OrientTdm.Collab.MyTask.auditTask.model.SubmitAuditUserModel',
            proxy: {
                type: 'memory'
            },
            data:storeData,
            listeners: {
                update: function(store, record, operation, modifiedFieldNames) {
                    var nodeName = record.get("nodeName");
                    // 结束节点不需要选择执行人
                    if('结束1' === nodeName){
                        return;
                    }
                    var assignUsers = me.taskAssigns[nodeName];
                    var displayNames = record.get("displayNames");
                    var userNames = [];
                    for(var i=0; i<displayNames.length; i++) {
                        var displayName = displayNames[i];
                        for(var j=0; j<assignUsers.length; j++) {
                            if(assignUsers[j].displayName == displayName) {
                                userNames.push(assignUsers[j].userName);
                            }
                        }
                    }
                    if(userNames.length > 0) {
                        record.set("realNames", userNames.join(","));
                    }
                }
            }
        });

        this.store = retVal;
        return retVal;
    }
});