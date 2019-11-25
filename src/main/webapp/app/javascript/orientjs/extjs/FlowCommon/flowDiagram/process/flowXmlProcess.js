Ext.define('OrientTdm.FlowCommon.flowDiagram.process.flowXmlProcess', {
    extend: 'Ext.Base',
    requires: [
        "OrientTdm.FlowCommon.flowDiagram.process.flowDiagramCtrl"
    ],
    config: {
        flowDiagramCtrl: null
    },
    constructor: function (config) {
        this.initConfig(config);
    },
    initFlowDiagFromXml: function (xmlContent, graph) {
        var me = this;
        // Creates a process display using the activity names as IDs to refer to the elements
        var xml = xmlContent.responseText;
        var root = null;
        if($.browser.msie) {//处理IE兼容
            var ieXml = new ActiveXObject("Microsoft.XMLDOM");
            ieXml.async = false;
            ieXml.loadXML(xml);
            root = $(ieXml).find('process');
            //$(ieXml).each(function (index, element) {
            //    debugger;//documentElement.
            //    if (this.nodeName.toUpperCase() === "PROCESS") {
            //        root = this;
            //        return false;
            //    }
            //});
        } else {
            $(xml).each(function (index, element) {
                if (this.nodeName.toUpperCase() === "PROCESS") {
                    root = this;
                    return false;
                }
            });
        }


        //add vertex
        var allElement = $(root).children();

        var allVertexs = new Array();
        allElement.each(function () {
            var type = this.nodeName.toLowerCase();
            var g = null;

            //process dimension
            switch (type) {
                case "start":
                    g = $(this).attr("g").split(",");
                    if (g) {
                        g[2] = g[3];
                    }
                    break;
                //case "task":

                //case "fork":

                //case "join":

                //case "decision":

                case "end":
                    g = $(this).attr("g").split(",");
                    if (g) {
                        g[2] = g[3];
                    }
                    break;
                case "sub-process":
                    g = $(this).attr("g").split(",");
                    break;
                default:
                    g = $(this).attr("g").split(",");
                    break;
            }
            if (g !== null) {
                var vertex = me.flowDiagramCtrl.createVertex(g, this, type);
                allVertexs.push(vertex);
            }

        });

        me.flowDiagramCtrl.insertVertex(graph, allVertexs);

        //insert edge
        var allCells = graph.getModel().cells;
        allElement.each(function () {
            var sourceName = $(this).attr("name");
            $(this).find("transition").each(function () {
                var desName = $(this).attr("to");
                var srcVertex = null;
                var desVertex = null;
                $.each(allCells, function (property, value) {
                    if (!value.isVertex()) {
                        return;
                    }

                    if (value.id === sourceName) {
                        srcVertex = value;
                    } else if (value.id === desName) {
                        desVertex = value;
                    }
                });

                if (srcVertex !== null && desVertex !== null) {
                    me.flowDiagramCtrl.insertEdge(graph, "", srcVertex, desVertex
                        , $(this).attr("g"));
                }

            });
        });
    }
});