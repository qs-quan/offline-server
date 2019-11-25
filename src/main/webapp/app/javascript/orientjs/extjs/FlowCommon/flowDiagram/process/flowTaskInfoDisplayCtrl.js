/**
 *  display the flow information in the second layer
 */
Ext.define('OrientTdm.FlowCommon.flowDiagram.process.flowTaskInfoDisplayCtrl', {
	extend: 'Ext.Base',
	requires: [
		"OrientTdm.FlowCommon.flowDiagram.process.graphManager",
		"OrientTdm.FlowCommon.flowDiagram.process.flowConstants"
	],

	displayLastestInfo : function(decorCell, info){
		var graphManager = new OrientTdm.FlowCommon.flowDiagram.process.graphManager();
		var graph = graphManager.getGraph();
		var layer = graphManager.getSpecificLayer(FlowConstants.TASKINFO_LAYER);

		var refGeometry = decorCell.geometry;
		var height = 35;
		var x = refGeometry.x + 100;
		var y = refGeometry.y - height;
		
		var vertexValue = "";
		if(info.assRealName){
			var assRealName = decorCell.flowAttrs.assRealName ;//+ '/' + decorCell.flowAttrs.assignee;
			vertexValue += "["+assRealName+"]";
		}
		if(info.endTime){
			var endTime = decorCell.flowAttrs.endTime.split(".")[0];
//			graph.insertVertex(layer, null, endTime, x, y, 50, 30, 
//				'shape=image;image='+flowConstants.IMAGE_ROOTPATH+'clock48.png;' +
//				'labelPosition=right;align=left');
//			y = y - height;
			vertexValue += "["+endTime+"]";
		}
		graph.insertVertex(layer, null, vertexValue, x, y, 30, 20, 
			'shape=image;image='+FlowConstants.IMAGE_ROOTPATH+'person48.png;' +
			'labelPosition=right;align=left');
	}

});