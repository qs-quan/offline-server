Ext.define('OrientTdm.FlowCommon.flowDiagram.flowDiagram', {
    extend: 'Ext.Base',
    requires: [
        "OrientTdm.FlowCommon.flowDiagram.process.graphManager",
        "OrientTdm.FlowCommon.flowDiagram.process.flowXmlProcess",
        "OrientTdm.FlowCommon.flowDiagram.process.flowUserInteraction",
        "OrientTdm.FlowCommon.flowDiagram.process.flowConstants",
        "OrientTdm.FlowCommon.flowDiagram.dataObtainer.flowDataObtainer",
        "OrientTdm.FlowCommon.flowDiagram.process.flowDiagramCtrl",
        "OrientTdm.FlowCommon.flowDiagram.process.flowTrackDisplayCtrl"
    ],
    config: {
        graph: null,
        graphManager: null,
        flowXmlParser: null,
        flowUserInteraction: null,
        flowDataObtainer: null,
        flowDiagramCtrl: null,
        flowTrackDisplayCtrl: null
    },

    /**
     *    initial the flow diagram
     *    @param container, the dom element
     *    @param dataRequestParam, your paramater to request the data,
     *            cooperate with your data obtainer implementation
     *    @param dataObtainerPath, your data obtainer implementation
     */
    init: function (container, dataObtainerImpl, dataRequestParam) {
        var me = this;
        me.graphManager = new OrientTdm.FlowCommon.flowDiagram.process.graphManager();
        me.flowUserInteraction = new OrientTdm.FlowCommon.flowDiagram.process.flowUserInteraction();
        me.flowDataObtainer = new OrientTdm.FlowCommon.flowDiagram.dataObtainer.flowDataObtainer();
        me.flowDiagramCtrl = new OrientTdm.FlowCommon.flowDiagram.process.flowDiagramCtrl({
            graphManager: me.graphManager
        });
        me.flowXmlParser = new OrientTdm.FlowCommon.flowDiagram.process.flowXmlProcess({
            flowDiagramCtrl: me.flowDiagramCtrl
        });
        me.flowTrackDisplayCtrl = new OrientTdm.FlowCommon.flowDiagram.process.flowTrackDisplayCtrl();

        // Checks if the browser is supported
        if (!mxClient.isBrowserSupported()) {
            // Displays an error message if the browser is not supported.
            mxUtils.error('Browser is not supported!', 200, false);
        } else {
            // Creates the graph inside the given container
            me.graph = me.graphManager.createGraph(container);
            me.flowDataObtainer.init(dataObtainerImpl, dataRequestParam, Ext.bind(me.initFlowDiagWithJPDLContent, me));
            me.flowTrackDisplayCtrl.init();
        }
    },
    initByLocal: function (container, jpdlDesc) {
        var me = this;
        me.graphManager = new OrientTdm.FlowCommon.flowDiagram.process.graphManager();
        me.flowUserInteraction = new OrientTdm.FlowCommon.flowDiagram.process.flowUserInteraction();
        me.flowDataObtainer = new OrientTdm.FlowCommon.flowDiagram.dataObtainer.flowDataObtainer();
        me.flowDiagramCtrl = new OrientTdm.FlowCommon.flowDiagram.process.flowDiagramCtrl({
            graphManager: me.graphManager
        });
        me.flowXmlParser = new OrientTdm.FlowCommon.flowDiagram.process.flowXmlProcess({
            flowDiagramCtrl: me.flowDiagramCtrl
        });
        if (!mxClient.isBrowserSupported()) {
            // Displays an error message if the browser is not supported.
            mxUtils.error('Browser is not supported!', 200, false);
        } else {
            // Creates the graph inside the given container
            me.graph = me.graphManager.createGraph(container);
            me.flowXmlParser.initFlowDiagFromXml({responseText: jpdlDesc}, me.graph);
            me.flowUserInteraction.registerSelChangeHandler(me.graph);
            me.graph.zoomActual();
            me.graph.refresh();
        }
    },
    updateOverView: function (container) {
        var me = this;
        me.flowDiagramCtrl.updateOverView(me.graph, container);
    },
    updateNodeStatus: function (reqParam) {
        var me = this;

        function updateDataGotCallback(response) {
            // console.log("updateDataGo
            var statusList = response.decodedData;
            me.flowDiagramCtrl.updateNodeStatus(me.graph, statusList);
            // flowXmlParser.updateNodeStatus(graph, statusList);
        }

        // flowDiagramCtrl.createDiagramInstruction(graph);
        me.flowDataObtainer.getTaskNodeStatusAsync(reqParam, updateDataGotCallback);
    },

    updateNodeStatusByLocal: function (statusList) {
        var me = this;
        me.flowDiagramCtrl.updateNodeStatus(me.graph, statusList);
    },

    highLightTransition: function (currentTaskName, endTaskName) {
        var me = this;
        me.flowDiagramCtrl.highLightTransition(me.graph, currentTaskName, endTaskName);
    },

    _clearHighLightTransition: function () {
        var me = this;
        me.flowDiagramCtrl._clearHighLightTransition(me.graph);
    },

    showRealName: function (reqParam) {
        var me = this;
        // flowDiagramCtrl.createDiagramInstruction(graph);
        me.flowDataObtainer.getTaskAssignAsync(reqParam, function (resp) {
            var taskUserList = resp.decodedData.results;
            me.flowDiagramCtrl.updateNodeAssign(me.graph, taskUserList);
        });
    },

    updateNodeAssigner: function (newValue, cell) {
        var me = this;
        me.flowDiagramCtrl.updateNodeAssigner(me.graph, newValue, cell);
    },

    addListener: function (eventName, listener) {
        var me = this;
        me.graph.addListener(eventName, listener);
    },

    getGraph: function () {
        var me = this;
        return me.graph;
    },

    getAllCells: function () {
        var me = this;
        //获取所有任务节点信息
        return me.flowDiagramCtrl.getAllCells(me.graph);
    },

    getCurSelNodeAttr: function () {
        var me = this;
        return me.flowUserInteraction.getCurSelectedCellAttr();
    },

    createGraphCtrlToolbar: function (container) {
        var me = this;
        me.graphManager.createGraphCtrlToolbar(container);
    },

    //supply the flow tracking function in the matter of button
    createFlowInfoCtrlButton: function (params) {
        var me = this;

        function flowTrackInfoDisplayHandler() {
            // graphManager.setSpecificLayerVisibility(false, flowConstants.FLOWDIAGRAM_LAYER);
            me.graphManager.setSpecificLayerVisibility(false, FlowConstants.TASKINFO_LAYER);
            var flowTrackDisplayCtrl = require("./process/flowTrackDisplayCtrl");
            me.flowDataObtainer.getFlowTrackInfos(params, flowTrackDisplayCtrl.showFlowTrack);
        }

        graphManager.addButtonToToolbar("轨迹跟踪",
            FlowConstants.IMAGE_ROOTPATH + 'flowTrack.png', flowTrackInfoDisplayHandler);

        function backToFlowDiagramHandler() {
            // graphManager.setSpecificLayerVisibility(true, flowConstants.INSTRUCTION_LAYER);
            me.graphManager.setSpecificLayerVisibility(true, FlowConstants.FLOWDIAGRAM_LAYER);
            me.graphManager.setSpecificLayerVisibility(true, FlowConstants.TASKINFO_LAYER);
            me.graphManager.setSpecificLayerVisibility(false, FlowConstants.FLOWTRACK_LAYER);

        }

        me.graphManager.addButtonToToolbar("流程图",
            FlowConstants.IMAGE_ROOTPATH + 'flowDiagram.png', backToFlowDiagramHandler);
    },

    initFlowDiagWithJPDLContent: function (xmlContent) {
        var me = this;
        me.flowXmlParser.initFlowDiagFromXml(xmlContent, me.graph);
        me.flowUserInteraction.registerSelChangeHandler(me.graph);
        me.graph.zoomActual();
        me.flowDataObtainer.initCompleted();
    }

});