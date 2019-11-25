/**
 *  display the flow track in an independent layer
 */
Ext.define('OrientTdm.FlowCommon.flowDiagram.process.flowTrackDisplayCtrl', {
    extend: 'Ext.Base',
    requires: [
        "OrientTdm.FlowCommon.flowDiagram.process.graphManager",
        "OrientTdm.FlowCommon.flowDiagram.process.flowConstants"
    ],

    config: {
        graphManager: null,
        graph: null,
        layer: null,
        idAppendix: "track",
        //clone the task node and set to hidden stype
        taskNodesCloned: null,
        cached: false
    },

    init: function () {
        var me = this;
        me.cached = false;
        me.graphManager = new OrientTdm.FlowCommon.flowDiagram.process.graphManager();
    },

    showFlowTrack: function (flowTaskTrackInfos) {
        var me = this;
        if (me.cached) {
            me.graphManager.setSpecificLayerVisibility(true, FlowConstants.FLOWTRACK_LAYER);
            me.graphManager.setSpecificLayerVisibility(false, FlowConstants.FLOWDIAGRAM_LAYER);
            return;
        }

        me.taskNodesCloned = [];

        me.graph = me.graphManager.getGraph();
        me.layer = me.graphManager.getSpecificLayer(FlowConstants.FLOWTRACK_LAYER);

        me.cloneTaskNodes(me.graph, flowTaskTrackInfos);

        me.graph.getModel().beginUpdate();
        try {
            me.graph.addCells(me.taskNodesCloned, me.layer);

            var edgeStyle = 'informationEdgeStyle';
            for (var infoIndex = 0; infoIndex < flowTaskTrackInfos.length; infoIndex++) {
                var taskTrackInfo = flowTaskTrackInfos[infoIndex];
                var source = getClonedTaskNodeByTaskNameAndIndex(taskTrackInfo.taskName, taskTrackInfo.index);
                source.trackInfo = taskTrackInfo;
                for (var desIndex = 0; desIndex < taskTrackInfo.transitionInfos.length; desIndex++) {
                    var transitionInfo = taskTrackInfo.transitionInfos[desIndex];
                    var target = getClonedTaskNodeByTaskNameAndIndex(transitionInfo.destName);
                    me.graph.insertEdge(me.layer, null, transitionInfo.transInfo, source, target, edgeStyle);
                }
            }

        } finally {
            me.graph.getModel().endUpdate();
        }
        me.graphManager.setSpecificLayerVisibility(false, FlowConstants.FLOWDIAGRAM_LAYER);
        me.cached = true;
    },

    //if the index is not supplied, then return the first one with vague id
    getClonedTaskNodeByTaskNameAndIndex: function (taskName, index) {
        for (var i = 0; i < me.taskNodesCloned.length; i++) {
            if (typeof index != 'undefined' && index != null) {
                var clonedId = taskName + idAppendix + index;
                if (me.taskNodesCloned[i].getId() === clonedId) {
                    return me.taskNodesCloned[i];
                }
            } else {
                var vagueId = taskName + idAppendix;
                if (me.taskNodesCloned[i].getId().indexOf(vagueId) === 0) {
                    return me.taskNodesCloned[i];
                }
            }
        }
        return null;
    },

    cloneTaskNodes: function (graph, flowTaskTrackInfos) {
        var me = this;
        var flowDiagramLayer = me.graphManager.getSpecificLayer(FlowConstants.FLOWDIAGRAM_LAYER);//graph.getDefaultParent();
        var flowDiagramCells = flowDiagramLayer.children;
        for (var i = 0; i < flowDiagramCells.length; i++) {
            if (!flowDiagramCells[i].isVertex()) {
                continue;
            }

            var copied = false;
            for (var infoIndex = 0; infoIndex < flowTaskTrackInfos.length; infoIndex++) {
                var taskTrackInfo = flowTaskTrackInfos[infoIndex];
                if (taskTrackInfo.taskName === flowDiagramCells[i].id) {
                    var nodeCloned = flowDiagramCells[i].clone();
                    nodeCloned.setId(flowDiagramCells[i].id + idAppendix + taskTrackInfo.index);
                    // nodeCloned.setStyle("hiddenOne");
                    me.taskNodesCloned.push(nodeCloned);
                    copied = true;
                }
            }
            if (!copied) {
                var nodeCloned = flowDiagramCells[i].clone();
                nodeCloned.setId(flowDiagramCells[i].id + idAppendix);
                me.taskNodesCloned.push(nodeCloned);
            }
        }
    }

});