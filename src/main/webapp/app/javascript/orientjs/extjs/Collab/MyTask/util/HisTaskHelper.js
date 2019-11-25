/**
 * Created by Seraph on 16/8/20.
 */
Ext.define("OrientTdm.Collab.MyTask.util.HisTaskHelper", {
    extend: 'Ext.Base',
    alternateClassName: 'HisTaskHelper',
    statics: {
        _prepareHisData: function (scope, taskId) {
            var me = scope;
            var frontViewRequest = {
                taskId: taskId,
                taskType: me.taskType,
                modelDataRequestList: [],
                sysDataRequests: [],
                extraData: {}
            };
            var components = me.query('[isHistoryAble=true]');
            Ext.each(components, function (component) {
                    if (component.getHistoryData) {
                        var historyData = component.getHistoryData.call(component) || {};
                        if(historyData){
                            for (var key in historyData) {
                                if (frontViewRequest[key]) {
                                    //如果已经存在 则需要合并
                                    if (Ext.isArray(frontViewRequest[key])) {
                                        //合并List
                                        if (Ext.isArray(historyData[key])) {
                                            frontViewRequest[key] = Ext.Array.union(frontViewRequest[key], historyData[key]);
                                        } else
                                            frontViewRequest[key].push(historyData[key]);
                                    } else if (Ext.isObject(frontViewRequest[key])) {
                                        //合并map
                                        Ext.apply(frontViewRequest[key], historyData[key]);
                                    }
                                } else {
                                    frontViewRequest[key] = historyData[key];
                                }
                            }
                        }
                    }
                }
            );
            return frontViewRequest;
        },
        saveHisAuditTaskInfo: function (url,frontViewRequest, successCallback, scope) {
            OrientExtUtil.AjaxHelper.doRequest(url, frontViewRequest, true, function (resp) {
                if (resp.decodedData.success) {
                    if (successCallback) {
                        if (scope) {
                            successCallback.call(scope, resp);
                        } else {
                            successCallback.call();
                        }
                    }
                }
            }, true);
        },
        getTaskType:function(frontType){
            var retVal = "";
            if('audit' == frontType){
                retVal = TDM_SERVER_CONFIG.AUDIT_TASK;
            }else if('collab' == frontType){
                retVal = TDM_SERVER_CONFIG.COLLAB_TASK;
            }else if('CB_PLAN' == frontType){
                retVal = TDM_SERVER_CONFIG.PLAN_TASK;
            }else if('dataTask' == frontType){
                retVal = TDM_SERVER_CONFIG.DATA_TASK;
            }
            return retVal;
        }
    }
});