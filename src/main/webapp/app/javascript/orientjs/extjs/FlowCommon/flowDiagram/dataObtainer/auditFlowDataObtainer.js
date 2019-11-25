/**
* the qms's flow data obtainer
*/
Ext.define('OrientTdm.FlowCommon.flowDiagram.dataObtainer.auditFlowDataObtainer', {
	extend: 'Ext.Base',
	CommonUtil : require("lib/util/CommonUtil"),
	
	auditFlowDataObtainer : {
		getTaskNodeStatus : function(reqParam, callback){
			var	params = {
				flowTaskId : reqParam.flowTaskId,
				piId: reqParam.piId,
				pdId : reqParam.pdId
			};

			CommonUtil.AjaxReq("/auditFlowContent/getAuditFlowDiagDetailContent.rdm", params, callback);
		},
		getFlowInitData : function (reqParam, reqSuccessCb){

			var	params = {
				flowTaskId : reqParam.flowTaskId,
				piId: reqParam.piId,
				pdId : reqParam.pdId
			};

			CommonUtil.AjaxReq("/flowContents/getFlowJPDLContent.rdm", params, reqSuccessCb, null, null, false);
		}
	}

});
