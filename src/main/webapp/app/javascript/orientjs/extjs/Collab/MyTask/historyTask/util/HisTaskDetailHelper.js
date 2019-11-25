/**
 * Created by Seraph on 16/8/24.
 */
Ext.define('OrientTdm.Collab.MyTask.historyTask.util.HisTaskDetailHelper', {
    extend: 'Ext.Base',
    config: {
        taskAssigner: '',
        taskBeginTime: '',
        taskBindDataList: [],
        taskEndTime: '',
        taskId: '',
        taskName: '',
        taskType: ''
    },
    constructor: function (config) {
        for (key in config) {
            this[key] = config[key];
        }
    },
    getOpinionData: function () {
        var me = this;
        var retVal;
        if (me && me.taskBindDataList) {
            Ext.each(me.taskBindDataList, function (bindData) {
                var taskBindType = bindData.taskBindType;
                if (taskBindType == 'opinionData') {
                    retVal = bindData.opinions;
                }
            });
        }
        return retVal;
    },

    getFlowMonitData: function () {
        var me = this;
        var retVal;
        if (me && me.taskBindDataList) {
            Ext.each(me.taskBindDataList, function (bindData) {
                var taskBindType = bindData.taskBindType;
                if (taskBindType == 'controlFlowData') {
                    retVal = bindData;
                }
            });
        }
        return retVal;
    },
    auditType: function () {
        //获取审批类型
        var me = this;
        var retVal;
        if (me && me.taskBindDataList) {
            Ext.each(me.taskBindDataList, function (bindData) {
                var taskBindType = bindData.taskBindType;
                if (taskBindType == 'sysData' && bindData.sysTableName == 'FLOW_DATA_RELATION') {
                    retVal = bindData.oriSysDataList[0].MAIN_TYPE;
                }
            });
        }
        return retVal;
    },
    getTaskBindInfo: function () {
        //获取任务绑定信息
        var me = this;
        var retVal;
        if (me && me.taskBindDataList) {
            Ext.each(me.taskBindDataList, function (bindData) {
                var taskBindType = bindData.taskBindType;
                if (taskBindType == 'sysData' && bindData.sysTableName == 'FLOW_DATA_RELATION') {
                    retVal = bindData;
                }
            });
        }
        return retVal;
    },
    getTaskSetInfo: function () {
        //获取任务绑定信息
        var me = this;
        var retVal;
        if (me && me.taskBindDataList) {
            Ext.each(me.taskBindDataList, function (bindData) {
                var taskBindType = bindData.taskBindType;
                if (taskBindType == 'sysData' && bindData.sysTableName == 'AUDIT_FLOW_TASK_SETTING') {
                    retVal = bindData;
                }
            });
        }
        return retVal;
    },
    getModelDataInfo: function (modelId) {
        var me = this;
        var retVal = [];
        if (me && me.taskBindDataList) {
            Ext.each(me.taskBindDataList, function (bindData) {
                var taskBindType = bindData.taskBindType;
                var flag = taskBindType == 'modelData';
                if (modelId) {
                    flag = flag && bindData.modelId == modelId;
                }
                if (flag) {
                    retVal.push(bindData);
                }
            });
        }
        return retVal;
    },
    getHtmlDataInfo: function () {
        var me = this;
        var retVal = [];
        if (me && me.taskBindDataList) {
            Ext.each(me.taskBindDataList, function (bindData) {
                var taskBindType = bindData.taskBindType;
                if (taskBindType == 'freeMarker') {
                    retVal.push(bindData);
                }
            });
        }
        return retVal;
    },
    getExtraData: function (extraKey) {
        var me = this;
        var retVal = extraKey ? null : [];
        if (me && me.taskBindDataList) {
            Ext.each(me.taskBindDataList, function (bindData) {
                var taskBindType = bindData.taskBindType;
                var flag = taskBindType == 'extraData';
                if (flag) {
                    if (extraKey) {
                        if (bindData.extraMap[extraKey]) {
                            //返回第一个符合key的值
                            retVal = bindData.extraMap[extraKey];
                            return false;
                        }
                    } else {
                        retVal.push(bindData);
                    }
                }
            });
        }
        return retVal;
    },
    isNull: function () {
        var me = this;
        return Ext.isEmpty(me.taskId);
    },
    getSysData: function (sysTableName) {
        //获取任务绑定信息
        var me = this;
        var retVal = sysTableName ? null : [];
        if (me && me.taskBindDataList) {
            Ext.each(me.taskBindDataList, function (bindData) {
                var taskBindType = bindData.taskBindType;
                if (taskBindType == 'sysData') {
                    if (bindData.sysTableName) {
                        if (bindData.sysTableName == sysTableName) {
                            retVal = bindData;
                            return false;
                        }
                    } else {
                        retVal.push(bindData);
                    }
                }
            });
        }
        return retVal;
    }
});
