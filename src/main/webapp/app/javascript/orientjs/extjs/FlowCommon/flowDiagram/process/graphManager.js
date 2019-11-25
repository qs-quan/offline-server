/**
 *  manage the graph
 */
Ext.define('OrientTdm.FlowCommon.flowDiagram.process.graphManager', {
    extend: 'Ext.Base',
    requires: [
        "OrientTdm.FlowCommon.flowDiagram.process.flowConstants"
    ],
    config: {
        graph: null,
        tb: null
    },
    getGraph: function () {
        var me = this;
        return me.graph;
    },

    getSpecificLayer: function (layerType) {
        var me = this;
        var model = me.graph.getModel();
        return this.getSpecificLayerInModel(model, layerType);
    },

    getSpecificLayerInModel: function (model, layerType) {
        var layer = model.getRoot().children[layerType];
        return layer;
    },

    setSpecificLayerVisibility: function (visible, layerType) {
        var me = this;
        var model = me.graph.getModel();
        var layer = me.getSpecificLayerInModel(model, layerType);

        var curVisibility = model.isVisible(layer);
        if (curVisibility === visible) {
            return;
        }

        model.beginUpdate();
        try {
            model.setVisible(layer, visible);

            me.graph.view.invalidate();
        } finally {
            model.endUpdate();
        }
    },

    createGraph: function (container) {
        var me = this;
        var root = new mxCell();
        var instructionLayer = root.insert(new mxCell());
        var flowDiagLayer = root.insert(new mxCell());
        var flowInfolayer = root.insert(new mxCell());
        var flowTrackLayer = root.insert(new mxCell());
        var model = new mxGraphModel(root);

        me.graph = new mxGraph(container, model);
        //	var graph = new mxGraph(container);
        me.graph.setTooltips(false);
        me.graph.setEnabled(true);
        me.graph.setConnectable(false);

        // Highlights the vertices when the mouse enters
        var highlight = new mxCellTracker(me.graph, '#00FF00');

        // Disables folding
        me.graph.isCellFoldable = function (cell, collapse) {
            return false;
        };

        me.graph.cellsDeletable = false;
        me.graph.cellsMovable = false;
        me.graph.cellsEditable = false;
        me.graph.cellsSelectable = true;
        me.graph.EdgeLabelsMovable = false;

        me.graph.keepEdgesInBackground = true;

        me.graph.setAllowDanglingEdges(false);
        me.graph.setCellsEditable(false);
        me.graph.setCellsResizable(false);
        // Enables automatic sizing for vertices after editing and
        // panning by using the left mouse button.
        me.graph.setCellsMovable(false);
        me.graph.setAutoSizeCells(true);
        me.graph.setPanning(true);

        me.graph.setCellsBendable(false);

        me.graph.panningHandler.useLeftButtonForPanning = true;

        me.graph.htmlLabels = true;
        me.graph.isWrapping = function () {
            return true;
        };

        var modelGetStyle = me.graph.model.getStyle;
        me.graph.model.getStyle = function (cell) {
            if (cell != null) {
                var style = modelGetStyle.apply(this, arguments);
                if (cell.isEdge()) {
                    if (cell.customHighlight) {
                        style = style + ';strokeColor=#C00000';
                    }
                    return style;
                } else if (cell.isVertex()) {
                    if (cell.customHighlight) {
                        style = style + ';fontColor=#C00000';
                    }
                    return style;
                }
            }
            return null;
        };

//		me.graph.getLabel = function(cell) {
//			if(cell.edge) return;
//			if(cell.style == 'start' || cell.style == 'end')
//				return "";
//			var label = (this.labelsVisible)
//					? this.convertValueToString(cell)
//					: '';
//			var geometry = cell.geometry;
//			var width = geometry.width;
//			var height = geometry.height;
//			var nodeType = cell.flowAttrs.nodeType;
//			var assign = cell.flowAttrs.taskAssignee;
//			var title = cell.taskName;
//			return "<div style='width:"+width+"px;height:"+height+"px;' class='vertexDiv' title='"+title+"' assign='"+assign+"' type='"+nodeType+"' id='"+cell.id+"'>"+label+"</div>";
//		};

        // Enables rubberband selection
        new mxRubberband(me.graph);

        this.createStyles();
        return me.graph;
    },

    createGraphCtrlToolbar: function (container) {
        var me = this;
        me.tb = new mxToolbar(container);

        //me.tb.addSeparator(FlowConstants.IMAGE_ROOTPATH + 'zoom_fit32.png');

        me.tb.addBreak();

        me.tb.addItem('自适应', FlowConstants.IMAGE_ROOTPATH + 'zoom_fit32.png', function (evt) {
            me.graph.fit();
            var y = me.graph.view.translate.y;
            me.graph.view.setTranslate(15, y + 30);
        });

        me.tb.addItem('放大', FlowConstants.IMAGE_ROOTPATH + 'zoom_in32.png', function (evt) {
            me.graph.zoomIn();
        });

        me.tb.addItem('缩小', FlowConstants.IMAGE_ROOTPATH + 'zoom_out32.png', function (evt) {
            me.graph.zoomOut();
        });

        me.tb.addItem('实际大小', FlowConstants.IMAGE_ROOTPATH + 'view_1_132.png', function (evt) {
            me.graph.zoomActual();
        });

    },

    addButtonToToolbar: function (label, icon, handler) {
        var me = this;
        me.tb.addItem(label, icon, handler);
    },

    // Creates the stylesheet for the process display
    createStyles: function () {
        var me = this;
        var style = me.graph.getStylesheet().getDefaultVertexStyle();

        style[mxConstants.STYLE_FONTSIZE] = '11';
        style[mxConstants.STYLE_FONTCOLOR] = 'black';
        style[mxConstants.STYLE_FONTFAMILY] = "tahoma,arial,verdana,sans-serif";
        style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
        style[mxConstants.STYLE_STROKECOLOR] = 'gray';
        style[mxConstants.STYLE_FILLCOLOR] = '#adc5ff';
        style[mxConstants.STYLE_GRADIENT_DIRECTION] = mxConstants.DIRECTION_EAST;
        style[mxConstants.STYLE_ROUNDED] = true;
        style[mxConstants.STYLE_SHADOW] = true;
        style[mxConstants.STYLE_GLASS] = true;
        //style[mxConstants.STYLE_FONTSTYLE] = 1;
        me.graph.getStylesheet().putCellStyle('task', style);

        style = mxUtils.clone(style);
        style[mxConstants.STYLE_FILLCOLOR] = '#568881';
        me.graph.getStylesheet().putCellStyle('custom', style);

        //default edge style
        style = me.graph.getStylesheet().getDefaultEdgeStyle();
        style[mxConstants.STYLE_EDGE] = mxEdgeStyle.SideToSide;
        style[mxConstants.STYLE_BENDABLE] = 1;
        style[mxConstants.STYLE_STROKEWIDTH] = 1.5;
        style[mxConstants.STYLE_STROKECOLOR] = 'black';
        style[mxConstants.STYLE_ROUNDED] = true;
        style[mxConstants.STYLE_FONTSIZE] = '11';
        me.graph.getStylesheet().putCellStyle('defaultEdgeStyle', style);

        //information edge style
        mxEdgeStyle.InformationEdgeStyle = function (state, source, target, points, result) {
            if (source != null && target != null) {
                // var count = (source.cell.getEdgeCount()>target.cell.getEdgeCount())?
                // 		target.cell.getEdgeCount():source.cell.getEdgeCount();
                var count = source.cell.trackInfo.index;
                if (count <= 0) {
                    return;
                }

                var y = target.getCenterY() + target.height * count;
                var xTor = 0;
                if (source.getCenterX() <= target.getCenterX()) {
                    xTor = 10;
                } else {
                    xTor = -10;
                }
                var pt1 = new mxPoint(source.getCenterX() + xTor, y);

                if (mxUtils.contains(source, pt1.x, pt1.y)) {
                    pt1.y = target.y + target.height;
                }

                result.push(pt1);

                var pt2 = new mxPoint(target.getCenterX() - xTor, y);

                if (mxUtils.contains(source, pt2.x, pt2.y)) {
                    pt2.y = source.y + source.height;
                }
                result.push(pt2);
            }
        };
        mxStyleRegistry.putValue('theInformationEdgeStyle', mxEdgeStyle.InformationEdgeStyle);
        style = [];
        style[mxConstants.STYLE_EDGE] = mxEdgeStyle.InformationEdgeStyle;
        style[mxConstants.STYLE_STROKECOLOR] = 'red';
        style[mxConstants.STYLE_FONTSIZE] = '13';
        style[mxConstants.STYLE_FONTCOLOR] = 'red';
        style[mxConstants.STYLE_ROUNDED] = true;
        style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_BOTTOM;
        style[mxConstants.STYLE_VERTICAL_LABEL_POSITION] = mxConstants.ALIGN_BOTTOM;
        me.graph.getStylesheet().putCellStyle('informationEdgeStyle', style);

        style = [];
        style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_SWIMLANE;
        style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
        style[mxConstants.STYLE_STROKECOLOR] = 'gray';
        style[mxConstants.STYLE_FONTCOLOR] = 'black';
        style[mxConstants.STYLE_FILLCOLOR] = '#E0E0DF';
        style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
        style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
        style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
        style[mxConstants.STYLE_STARTSIZE] = 24;
        style[mxConstants.STYLE_FONTSIZE] = '11';
        style[mxConstants.STYLE_FONTFAMILY] = "tahoma,arial,verdana,sans-serif";
        //style[mxConstants.STYLE_FONTSTYLE] = 1;
        style[mxConstants.STYLE_HORIZONTAL] = true;
        me.graph.getStylesheet().putCellStyle('swimlane', style);

        style = [];
        style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RHOMBUS;
        style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RhombusPerimeter;
        style[mxConstants.STYLE_STROKECOLOR] = 'gray';
        style[mxConstants.STYLE_FONTCOLOR] = 'gray';
        style[mxConstants.STYLE_FILLCOLOR] = '#91BCC0';
        style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
        style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
        style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
        style[mxConstants.STYLE_FONTSIZE] = '11';
        style[mxConstants.STYLE_FONTFAMILY] = "tahoma,arial,verdana,sans-serif";
        me.graph.getStylesheet().putCellStyle('step', style);
        me.graph.getStylesheet().putCellStyle('decision', style);

        style = [];
        style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RHOMBUS;
        // style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RhombusPerimeter;
        style[mxConstants.STYLE_OPACITY] = '0';
        style[mxConstants.STYLE_TEXT_OPACITY] = '0';
        style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
        style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
        style[mxConstants.STYLE_NOEDGESTYLE] = true;
        style[mxConstants.STYLE_FONTSIZE] = '11';
        style[mxConstants.STYLE_FONTFAMILY] = "tahoma,arial,verdana,sans-serif";
        me.graph.getStylesheet().putCellStyle('hiddenOne', style);

        style = [];
        style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
        style[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
        style[mxConstants.STYLE_STROKECOLOR] = 'gray';
        style[mxConstants.STYLE_FILLCOLOR] = '#A0C88F';
        style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
        style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
        style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
        style[mxConstants.STYLE_NOLABEL] = true;
        style[mxConstants.STYLE_VERTICAL_LABEL_POSITION] = mxConstants.ALIGN_TOP;
        style[mxConstants.STYLE_FONTSIZE] = '11';
        style[mxConstants.STYLE_FONTFAMILY] = "tahoma,arial,verdana,sans-serif";
        me.graph.getStylesheet().putCellStyle('start', style);

        style = mxUtils.clone(style);
        style[mxConstants.STYLE_FILLCOLOR] = '#DACCBC';
        style[mxConstants.STYLE_STROKECOLOR] = '#AF7F73';
        style[mxConstants.STYLE_STROKEWIDTH] = 3;
        style[mxConstants.STYLE_NOLABEL] = true;
        style[mxConstants.STYLE_VERTICAL_LABEL_POSITION] = mxConstants.ALIGN_TOP;
        style[mxConstants.STYLE_FONTSIZE] = '11';
        style[mxConstants.STYLE_FONTFAMILY] = "tahoma,arial,verdana,sans-serif";
        me.graph.getStylesheet().putCellStyle('end', style);


        style = [];
        style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_ELLIPSE;
        style[mxConstants.STYLE_PERIMETER] = mxPerimeter.EllipsePerimeter;
        style[mxConstants.STYLE_STROKECOLOR] = 'gray';
        style[mxConstants.STYLE_FONTCOLOR] = 'black';
        style[mxConstants.STYLE_FONTSIZE] = '11';
        style[mxConstants.STYLE_FONTFAMILY] = "tahoma,arial,verdana,sans-serif";
        style[mxConstants.STYLE_FILLCOLOR] = '#DACCBC';
        style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
        style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
        style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
        me.graph.getStylesheet().putCellStyle('end-error', style);
        me.graph.getStylesheet().putCellStyle('end-cancel', style);

        style = mxUtils.clone(style);
        style[mxConstants.STYLE_FILLCOLOR] = '#83C045';
        style[mxConstants.STYLE_STROKECOLOR] = '#AF7F73';
        style[mxConstants.STYLE_STROKEWIDTH] = 3;
        style[mxConstants.STYLE_NOLABEL] = false;
        style[mxConstants.STYLE_VERTICAL_LABEL_POSITION] = mxConstants.ALIGN_MIDDLE;
        style[mxConstants.STYLE_FONTSIZE] = '11';
        style[mxConstants.STYLE_FONTFAMILY] = "tahoma,arial,verdana,sans-serif";
        me.graph.getStylesheet().putCellStyle('sub-process', style);

        style = [];
        style[mxConstants.STYLE_MOVABLE] = false;
        style[mxConstants.STYLE_FONTCOLOR] = 'black';
        style[mxConstants.STYLE_NOLABEL] = false;
        style[mxConstants.STYLE_ROUNDED] = false;
        style[mxConstants.STYLE_STROKECOLOR] = 'black';
        style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
        style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_TOP;
        style[mxConstants.STYLE_FONTSIZE] = '11';
        style[mxConstants.STYLE_FONTFAMILY] = "tahoma,arial,verdana,sans-serif";
        style[mxConstants.STYLE_FILLCOLOR] = 'white';
        me.graph.getStylesheet().putCellStyle('instruction', style);

    }

});