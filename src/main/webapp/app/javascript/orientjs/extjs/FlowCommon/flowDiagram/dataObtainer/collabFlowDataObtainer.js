/**
 * the qms's flow data obtainer
 */
Ext.define('OrientTdm.FlowCommon.flowDiagram.dataObtainer.collabFlowDataObtainer', {
    extend: 'Ext.Base',

    getFlowInitData: function (reqParam, reqSuccessCb) {

        var params = {
            flowTaskId: reqParam.flowTaskId,
            piId: reqParam.piId,
            pdId: reqParam.pdId
        };

        OrientExtUtil.AjaxHelper.doRequest("flowDiagramContent/JPDLContent.rdm", params, true, reqSuccessCb);
    },

    getTaskNodeStatus: function (reqParam, reqSuccessCb) {
        var params = {
            flowTaskId: reqParam.flowTaskId,
            piId: reqParam.piId
        };

        OrientExtUtil.AjaxHelper.doRequest("collabFlow/monitorInfo.rdm", params, true, reqSuccessCb);
    },

    getFlowTrackInfos: function (reqParam, reqSuccessCb) {
        var params = {
            flowTaskId: reqParam.flowTaskId,
            piId: reqParam.piId
        };

        OrientExtUtil.AjaxHelper.doRequest("flowDiagramContent/trackInfos.rdm", params, false, reqSuccessCb);
    },
    getTaskAssign: function (reqParam, reqSuccessCb) {
        OrientExtUtil.AjaxHelper.doRequest("flowDiagramContent/taskAssign.rdm", reqParam, false, reqSuccessCb);
    }

});
