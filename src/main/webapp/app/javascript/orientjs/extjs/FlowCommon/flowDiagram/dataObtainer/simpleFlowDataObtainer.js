/**
 * a simple flow data obtainer, can be used in most cases
 */
Ext.define('OrientTdm.FlowCommon.flowDiagram.dataObtainer.simpleFlowDataObtainer', {

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

        OrientExtUtil.AjaxHelper.doRequest("flowDiagramContent/monitorInfo.rdm", params, true, reqSuccessCb);
    },

    getFlowTrackInfos: function (reqParam, reqSuccessCb) {
        var params = {
            flowTaskId: reqParam.flowTaskId,
            piId: reqParam.piId
        };

        OrientExtUtil.AjaxHelper.doRequest("flowDiagramContent/trackInfos.rdm", params, false, reqSuccessCb);
    }

});
