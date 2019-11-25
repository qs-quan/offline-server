Ext.define('OrientTdm.FlowCommon.flowDiagram.process.flowConstants', {
	extend: 'Ext.Base',
	alternateClassName: 'FlowConstants',
	statics: {
		STATUS_COMPLETED : "completed",
		STATUS_COMPLETED_CN : "已完成",
		STATUS_PROCESSING : "processing",
		STATUS_PROCESSING_CN : "正在进行",
		STATUS_UNSTARTED : "unstarted",
		STATUS_UNSTARTED_CN : "未开始",
		COLOR_COMPLETED : '#2DFF2C',
		COLOR_PROCESSING : '#F12E41',
		COLOR_UNSTARTED : '#adc5ff',
		USERS : "candidate-users",
		GROUP : "candidate-groups",
		SWIMLANE : "swimlane",
		ASSIGNEE : "assignee",
		SUB_PROCESS : "sub-process",
		INSTRUCTION_LAYER : "0",
		FLOWDIAGRAM_LAYER : "1",
		TASKINFO_LAYER : "2",
		FLOWTRACK_LAYER : "3",
		IMAGE_ROOTPATH : serviceName + '/app/javascript/orientjs/extjs/FlowCommon/flowDiagram/assets/img/'

	}
});
