Ext.define('OrientTdm.FlowCommon.flowDiagram.process.flowDiagramCtrl', {
    extend: 'Ext.Base',
    requires: [
        "OrientTdm.FlowCommon.flowDiagram.process.flowTaskInfoDisplayCtrl",
        "OrientTdm.FlowCommon.flowDiagram.process.graphManager",
        "OrientTdm.FlowCommon.flowDiagram.process.flowConstants",
        "OrientTdm.FlowCommon.flowDiagram.process.flowNodeTip"
    ],
    config: {
        graphManager: null
    },
    constructor: function (config) {
        this.initConfig(config);
    },
    createVertex: function (geoArray, xmlNode, type, style) {
        var value = $(xmlNode).attr("name");
        var taskAssignee = '', assigneeType = '';
        if ("TASK" == $(xmlNode).context.nodeName) {
            taskAssignee = $(xmlNode).attr(FlowConstants.USERS);
            assigneeType = FlowConstants.USERS;
            if (taskAssignee == null || typeof taskAssignee === "undefined") {
                taskAssignee = $(xmlNode).attr(FlowConstants.GROUP);
                assigneeType = FlowConstants.GROUP;
                if (taskAssignee == null || typeof taskAssignee === "undefined") {
                    taskAssignee = $(xmlNode).attr(FlowConstants.SWIMLANE);
                    assigneeType = FlowConstants.SWIMLANE;
                    if (taskAssignee == null || typeof taskAssignee === "undefined") {
                        taskAssignee = $(xmlNode).attr(FlowConstants.ASSIGNEE);
                        assigneeType = FlowConstants.ASSIGNEE;
                    }
                }
            }
        }


        var vertex = new mxCell(null, new mxGeometry(
            parseInt(geoArray[0]), parseInt(geoArray[1]), parseInt(geoArray[2])
            , parseInt(geoArray[3])), style);
        vertex.setVertex(true);
        vertex.setStyle(type);
        switch (type) {
            case "decision":
                vertex.setValue("X");
                break;
            case "fork":
                vertex.setStyle("decision");
                vertex.setValue("+");
                //vertex.setGeometry(new mxGeometry(parseInt(geoArray[0]),parseInt(geoArray[1]),1,1));
                break;
            case "join":
                vertex.setStyle("decision");
                vertex.setValue("-");
                //vertex.setGeometry(new mxGeometry(parseInt(geoArray[0]),parseInt(geoArray[1]),1,1));
                break;
            case "start":
                vertex.setValue(value);
                break;
            case "end":
                vertex.setValue(value);
                break;
            case "end-error":
                vertex.setValue("E");
                break;
            case "end-cancel":
                vertex.setValue("C");
                break;
            case "task":
                vertex.setValue(value);
                break;
            case "custom":
                vertex.setValue(value);
                break;
            case "sub-process":
                vertex.setValue(value);
                break;
            default:
                break;
        }

        vertex.setId(value);
        vertex.flowAttrs = {};
        vertex.flowAttrs.nodeType = type;
        vertex.flowAttrs.taskName = value;
        vertex.flowAttrs.taskAssignee = taskAssignee;
        vertex.flowAttrs.assigneeType = assigneeType;

        return vertex;
    },


    insertEdge: function (graph, value, source, target, geometry) {
        var me = this;
        // Gets the default parent for inserting new cells. This
        // is normally the first child of the root (ie. layer 0).
        // var parent = graph.getDefaultParent();
        var layer = me.graphManager.getSpecificLayer(FlowConstants.FLOWDIAGRAM_LAYER);
        // Adds cells to the model in a single step
        graph.getModel().beginUpdate();
        try {
            var style = 'defaultEdgeStyle';
            var edge = graph.insertEdge(layer, null, value, source, target, style);
            var geoArray = geometry.split(/;|:/);

            if (geoArray.length > 1) {
                var bendPoints = new Array();
                $.each(geoArray, function (i, item) {
                    if (i < geoArray.length - 1) {
                        var coord = item.split(",");
                        var x = parseInt(coord[0]);
                        if (x > 0) {
                            bendPoints.push(new mxPoint(x, parseInt(coord[1])));
                        }
                    }

                });
                edge.geometry.points = bendPoints;
                //be careful with the mxEdgeStyle
            }
        } finally {
            // Updates the display
            graph.getModel().endUpdate();
        }
    },

    insertVertex: function (graph, vertex) {
        var me = this;
        // Gets the default parent for inserting new cells. This
        // is normally the first child of the root (ie. layer 0).
        // var parent = graph.getDefaultParent();
        var layer = me.graphManager.getSpecificLayer(FlowConstants.FLOWDIAGRAM_LAYER);
        // Adds cells to the model in a single step
        graph.getModel().beginUpdate();
        try {
            if (vertex instanceof Array) {
                graph.addCells(vertex, layer);
            } else {
                // graph.insertVertex(parent, id, value, x, y, w, h, style);
                graph.addCell(vertex, layer);
            }

        } finally {
            // Updates the display
            graph.getModel().endUpdate();
        }
    },

    updateNodeAssign: function (graph, taskAssigns) {
        var model = graph.getModel();
        model.beginUpdate();
        try {
            Ext.each(taskAssigns, function (taskAssign) {
                var cell = model.getCell(taskAssign['taskName']);
                if (cell != null) {
                    Ext.apply(cell.flowAttrs, taskAssign);
                    var cellContent = taskAssign['taskName'] + '</br>';
                    var cellAssignerDisplayName = taskAssign['taskAssignerDisplayNames'].join(',');
                    if (cellAssignerDisplayName.length > 10) {
                        cellAssignerDisplayName = cellAssignerDisplayName.substr(0, 10) + "...";
                    }
                    cellContent += '(' + cellAssignerDisplayName + ')';
                    cell.setValue(cellContent);
                }
            });
        } finally {
            graph.refresh();
            model.endUpdate();
        }
    },

    updateNodeAssigner: function (graph, newValue, customCell) {
        var model = graph.getModel();
        model.beginUpdate();
        try {
            if(customCell != undefined){
                if (newValue.length > 10) {
                    newValue = newValue.substr(0, 10) + "...";
                }
                customCell.setValue(customCell.id + '</br>(' + newValue + ')');
            }
            var cell = graph.getSelectionCell();
            if (newValue.length > 10) {
                newValue = newValue.substr(0, 10) + "...";
            }
            cell.setValue(cell.id + '</br>(' + newValue + ')');
        } finally {
            graph.refresh();
            model.endUpdate();
        }
    },

    getAllCells: function (graph) {
        var retVal = [];
        var model = graph.getModel();
        for (var cellId in model.cells) {
            var curCell = model.getCell(cellId);
            if (curCell.isVertex() == true) {
                //更新坐标 大小
                retVal.push(curCell);
            }
        }
        return retVal;
    },

    highLightTransition: function (graph, currentTaskName, endTaskName) {
        //移除其他节点的特殊显示
        var model = graph.getModel();
        model.beginUpdate();
        try {
            //寻找连线
            var toHightTranstion;
            //清除所有高亮信息
            for (var cellId in model.cells) {
                var curCell = model.getCell(cellId);
                curCell.customHighlight = false;
                graph.removeCellOverlays(curCell);
                if (curCell.isEdge()) {
                    if (curCell.source && curCell.source.id == currentTaskName &&
                        curCell.target && curCell.target.id == endTaskName) {
                        toHightTranstion = curCell;
                    }
                }
            }
            if (toHightTranstion) {
                var overlay = new mxCellOverlay(
                    new mxImage(serviceName + '/app/images/mxgraph/check.png', 16, 16),
                    '所选路径');
                graph.addCellOverlay(toHightTranstion, overlay);
                toHightTranstion.customHighlight = true;
            }
        } finally {
            model.endUpdate();
            graph.refresh();
        }
    },

    _clearHighLightTransition: function (graph) {
        var model = graph.getModel();
        model.beginUpdate();
        try {
            //清除所有高亮信息
            for (var cellId in model.cells) {
                var curCell = model.getCell(cellId);
                curCell.customHighlight = false;
                graph.removeCellOverlays(curCell);
            }
        } finally {
            model.endUpdate();
            graph.refresh();
        }
    },

    updateOverView: function (graph, container) {
        var model = graph.getModel();
        model.beginUpdate();
        try {
            new mxOutline(graph, container);
        } finally {
            model.endUpdate();
            graph.refresh();
        }
    },

    /**
     * Updates the display of the given graph using the status data
     */
    updateNodeStatus: function (graph, oldStatusList) {
        var me = this;
        // console.log("statusList:");
        var statusList = new Array();
        for (var i = 0; i < oldStatusList.length; i++) {
            if (statusList.length == 0) {
                statusList.push(oldStatusList[i]);
            }
            else {
                //判断是否有同名节点
                var flag = false;
                var newListPointer = 0;
                for (var j = 0; j < statusList.length; j++) {
                    if (statusList[j].name == oldStatusList[i].name) {
                        flag = true;
                        newListPointer = j;
                    }
                }
                if (flag) {
                    //比较开始时间
                    var oldListNodeStartTime = new Date(oldStatusList[i].startTime);
                    var newListNodeStartTime = new Date(statusList[newListPointer].startTime);
                    if (oldListNodeStartTime.getTime() > newListNodeStartTime.getTime()) {
                        //删除完成时间较早的节点
                        statusList.remove(statusList[newListPointer]);
                        //插入完成时间较晚的节点
                        statusList.push(oldStatusList[i]);
                    }
                    else {
                        //不插入
                    }
                }
                else {
                    statusList.push(oldStatusList[i]);
                }
            }
        }

        if (statusList != null && statusList.length > 0) {
            var flowTaskInfoDisplayCtrl = new OrientTdm.FlowCommon.flowDiagram.process.flowTaskInfoDisplayCtrl();
            var model = graph.getModel();
            model.beginUpdate();
            try {
                for (var i = 0; i < statusList.length; i++) {
                    var id = statusList[i].name;

                    // Gets the cell for the given activity name from the model
                    var cell = model.getCell(id);

                    // Updates the cell color and adds task's information
                    if (cell != null) {
                        // Resets the fillcolor and the overlay
                        graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, 'white', [cell]);
                        graph.removeCellOverlays(cell);
                        Ext.apply(cell.flowAttrs, statusList[i]);
                        var status = statusList[i].status;
                        if (status === FlowConstants.STATUS_COMPLETED) {
                            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, FlowConstants.COLOR_COMPLETED, [cell]);//2DFF2C
                            cell.flowAttrs.status = FlowConstants.STATUS_COMPLETED_CN;

//						flowTaskInfoDisplayCtrl.displayLastestInfo(
//							cell, {assRealName : true, endTime : true});
                        } else if (status === FlowConstants.STATUS_PROCESSING) {
                            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, FlowConstants.COLOR_PROCESSING, [cell]);
                            cell.flowAttrs.status = FlowConstants.STATUS_PROCESSING_CN;

                            graph.addCellOverlay(cell
                                , this.createOverlay(new mxImage(FlowConstants.IMAGE_ROOTPATH + 'warning.gif', 16, 16), '状态: ' + status));

//						flowTaskInfoDisplayCtrl.displayLastestInfo(
//							cell, {assRealName : true});
                        } else if (status === FlowConstants.STATUS_UNSTARTED) {
                            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, FlowConstants.COLOR_UNSTARTED, [cell]);//adc5ff
                            cell.flowAttrs.status = FlowConstants.STATUS_UNSTARTED_CN;
                        }

                        //update cell content
                        var label = (graph.labelsVisible)
                            ? graph.convertValueToString(cell)
                            : '';
                        var geometry = cell.geometry;
                        var width = geometry.width;
                        var height = geometry.height;

                        var cellContent = "<div style='width:" + width + "px;height:" + height + "px;' class='vertexDiv' " +
                            "title='" + cell.value + "' " +
                            "id='" + cell.id + "'>" +"<div style='height:"+(height/2-7)+"px;'"+"></div>"+label
                             "</div>";
                        cell.setValue( cellContent);
                    }
                }
            } finally {
                model.endUpdate();
                var flowNodeTip = new OrientTdm.FlowCommon.flowDiagram.process.flowNodeTip({
                    graphManager: me.graphManager
                });
                flowNodeTip.init(graph);
            }
        }
    },

    createDiagramInstruction: function (graph) {
        var me = this;
        var layer = me.graphManager.getSpecificLayer(FlowConstants.INSTRUCTION_LAYER);
        // Adds cells to the model in a single step
        graph.getModel().beginUpdate();
        try {

            var instructionArray = [];

            var containerOne = new mxCell("状态说明", new mxGeometry(20, 20, 100, 200), 'instruction');
            containerOne.setVertex(true);
            var completedOne = new mxCell("已完成", new mxGeometry(30, 60, 80, 40), 'task');
            completedOne.setVertex(true);
            var processingOne = new mxCell("进行中", new mxGeometry(30, 110, 80, 40), 'task');
            processingOne.setVertex(true);
            var unstartedOne = new mxCell("未开始", new mxGeometry(30, 160, 80, 40), 'task');
            unstartedOne.setVertex(true);

            instructionArray.push(containerOne);
            instructionArray.push(completedOne);
            instructionArray.push(processingOne);
            instructionArray.push(unstartedOne);
            graph.addCells(instructionArray, layer);

            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, FlowConstants.COLOR_COMPLETED, [completedOne]);//2DFF2C
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, FlowConstants.COLOR_PROCESSING, [processingOne]);//2DFF2C
            graph.setCellStyles(mxConstants.STYLE_FILLCOLOR, FlowConstants.COLOR_UNSTARTED, [unstartedOne]);//2DFF2C


        } finally {
            // Updates the display
            graph.getModel().endUpdate();
        }
    },

    /**
     * Creates an overlay object using the given tooltip and text for the alert window
     * which is being displayed on click.
     */
    createOverlay: function (image, tooltip) {
        var overlay = new mxCellOverlay(image, tooltip);

        // Installs a handler for clicks on the overlay
        overlay.addListener(mxEvent.CLICK, function (sender, evt) {
            mxUtils.alert(tooltip + '\n' + 'Last update: ' + new Date());
        });

        return overlay;
    }

});