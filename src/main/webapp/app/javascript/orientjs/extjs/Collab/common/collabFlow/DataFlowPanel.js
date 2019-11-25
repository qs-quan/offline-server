/**
 * Created by Seraph on 16/7/29.
 */
Ext.define('OrientTdm.Collab.common.collabFlow.DataFlowPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.dataFlowPanel',
    requires: [
        "OrientTdm.FlowCommon.flowDiagram.process.flowConstants"
    ],
    autoDestroy: true,
    config: {
        modelName: '',
        dataId: 21,
        readOnly: false,
        isHistoryAble: true,
        //历史任务描述
        hisTaskDetail: null,
        //是否是历史
        isHistory: false,
        localMode: false,
        localData: null,
        dataDirty: false,
        //高亮展现节点
        highLightKey: ''
    },
    initComponent: function () {
        var me = this;
        me.activityCache = {};
        me.edgeCache = {};
        me.currentNodeStyle = 'strokeColor=red;strokeWidth=4;fillColor=red';
        me.sid = new Date().getTime();
        var tbar = me.readOnly || me.isHistory || me.localMode ? null : [
            {
                xtype: 'button',
                text: '保存',
                iconCls: 'icon-save',
                scope: me,
                handler: me._saveDataFlow
            }, {
                xtype: 'button',
                text: '自动布局',
                iconCls: 'icon-autoLayout',
                scope: me,
                handler: me._autolayout
            }, '->', '<span style="color: red;">右击连线，可删除连线</span>'
        ];
        Ext.apply(me, {
            layout: 'border',
            tbar: tbar,
            items: [
                {
                    html: '<div id="dataFlowDiagCtrl_' + me.sid + '"  class="dataFlow"></div>',
                    region: 'center',
                    border: false
                }, {
                    region: 'west',
                    width: 38,
                    border: false,
                    frame: false,
                    boder: false,
                    html: '<div id="toolBarContainer_' + me.sid + '" style="z-index:1;position:relative;overflow:hidden;' +
                            'top:0px;right:0px;width:100%;height:100%;border-style:none;border-color:#e9e9e9;background-color:#e9e9e9;"></div>',
                    layout: 'fit'
                }
            ],
            listeners: {
                afterrender: me._initDiag,
                scope: me
            }
        });
        this.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent(arguments);
        //me.mon(me,'afterrender',me._initDiag,me);
    },
    _initDiag: function () {
        var me = this;
        if (!mxClient.isBrowserSupported()) {
            mxUtils.error('Browser is not supported!', 200, false);
        } else {
            mxRectangleShape.prototype.crisp = true;
            mxConnectionHandler.prototype.connectImage = new mxImage(serviceName + '/app/images/mxgraph/connector.gif', 16, 16);
            var extContainer = Ext.get('dataFlowDiagCtrl_' + me.sid);
            var container = extContainer.dom;
            if (mxClient.IS_IE) {
                me.resizer = new mxDivResizer(container);
            }
            var graph = new mxGraph(container);
            me.graph = graph;
            me._initMxGraph();
            me._initToolBar();
            var graphDesc;
            if (me.isHistory) {
                var resourceInfo = me.hisTaskDetail.getExtraData('hisDataFlowInfo');
                graphDesc = Ext.decode(resourceInfo).hisData;
            }
            else if (me.localMode) {
                graphDesc = me.localData;
            } else {
                //初始化
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/DataFlow/initDataFlow.rdm', {
                    dataId: me.dataId,
                    modelName: me.modelName
                }, false, function (resp) {
                    graphDesc = resp.decodedData.results;
                    //保存至变量
                    me.hisData = graphDesc;
                });
            }
            graph.getModel().beginUpdate();
            try {
                var activits = graphDesc.activities;
                Ext.each(activits, function (activity) {
                    me._insertActivity(activity, graph);
                });
                var edges = graphDesc.transitions;
                Ext.each(edges, function (edge) {
                    me._insertEdges(edge, graph);
                });
            }
            finally {
                graph.getModel().endUpdate();
                me.dataDirty = false;
            }

        }
    },
    _insertActivity: function (activity, graph) {
        var me = this;
        var parent = graph.getDefaultParent();
        var v;
        if(me.highLightKey && me.highLightKey == activity.modelId + '_' + activity.dataId){
            v = graph.insertVertex(parent, activity.id, activity.dispalyName, parseInt(activity.xPos), parseInt(activity.yPos), parseInt(activity.width), parseInt(activity.height),me.currentNodeStyle);
        }else{
            v = graph.insertVertex(parent, activity.id, activity.dispalyName, parseInt(activity.xPos), parseInt(activity.yPos), parseInt(activity.width), parseInt(activity.height));
        }

        v.constructFromSource = activity;
        me.activityCache[activity.id] = v;
    },
    _insertEdges: function (edge, graph) {
        var me = this;
        var parent = graph.getDefaultParent();
        var source = me._getactivityByDataId(edge.srcid);
        var target = me._getactivityByDataId(edge.destnyid);
        if (source && target) {
            var e = graph.insertEdge(parent, edge.id, '', source, target);
            e.constructFromSource = edge;
            me.edgeCache[edge.id] = e;
        }
    },
    _getactivityByDataId: function (dataId) {
        var me = this;
        var retVal = null;
        for (var activityId in me.activityCache) {
            var tmpActivity = me.activityCache[activityId];
            if (tmpActivity.constructFromSource.dataId == dataId) {
                retVal = tmpActivity;
            }
        }
        return retVal;
    },
    _initMxGraph: function () {
        var me = this;
        var graph = me.graph;
        //整体移动
        graph.setPanning(true);
        graph.panningHandler.useLeftButtonForPanning = true;
        graph.setAllowDanglingEdges(false);
        graph.setMultigraph(false);
        graph.setAllowLoops(false);
        graph.setConnectable(true);
        graph.setEnabled(true);
        graph.setAllowLoops(false);
        graph.setCellsEditable(false);
        graph.setCellsResizable(false);

        var layout = new mxParallelEdgeLayout(graph);
        var layoutMgr = new mxLayoutManager(graph);
        layoutMgr.getLayout = function (cell) {
            if (cell.getChildCount() > 0) {
                return layout;
            }
        };
        var rubberband = new mxRubberband(graph);
        var keyHandler = new mxKeyHandler(graph);
        //样式控制
        var highlight = new mxCellTracker(graph, '#00D800');
        var style = graph.stylesheet.getDefaultVertexStyle();
        style[mxConstants.STYLE_SHAPE] = 'label';
        style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_CENTER;
        style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
        style[mxConstants.STYLE_FONTCOLOR] = '#333333';//'#1d258f';
        style[mxConstants.STYLE_FONTFAMILY] = '微软雅黑';//'Verdana';
        style[mxConstants.STYLE_FONTSIZE] = '12';
        style[mxConstants.STYLE_FONTSTYLE] = '1';
        style[mxConstants.STYLE_SHADOW] = '1';
        style[mxConstants.STYLE_ROUNDED] = '1';
        style = graph.stylesheet.getDefaultEdgeStyle();
        style[mxConstants.STYLE_ROUNDED] = true;//圆角连线
        style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR] = '#FFFFFF';
        style[mxConstants.STYLE_FONTCOLOR] = 'gray';
        style[mxConstants.STYLE_EDGE] = mxEdgeStyle.ElbowConnector;
        style[mxConstants.STYLE_STROKEWIDTH] = 2;
        //style[mxConstants.STYLE_EXIT_X] = 0.5; // center
        //style[mxConstants.STYLE_EXIT_Y] = 1.0; // bottom
        //style[mxConstants.STYLE_EXIT_PERIMETER] = 0; // disabled
        //style[mxConstants.STYLE_ENTRY_X] = 0.5; // center
        //style[mxConstants.STYLE_ENTRY_Y] = 0; // top
        //style[mxConstants.STYLE_ENTRY_PERIMETER] = 0; // disabled
        style[mxConstants.STYLE_STROKECOLOR] = '#333333';
        graph.alternateEdgeStyle = 'elbow=vertical';
        mxEvent.disableContextMenu(graph.container);
        //弹出菜单
        graph.panningHandler.factoryMethod = function (menu, cell, evt) {
            return me._createPopupMenu(graph, menu, cell, evt);
        };
        graph.addListener(mxEvent.CLICK, me._mxGraphCellClicked);
        graph.addListener(mxEvent.MOUSE_UP, me._mxGraphCellDisConnect);
        //事件监控
        graph.addListener(mxEvent.ADD_CELLS, function (fatherGraph, eventObj) {
            var cell = eventObj.getProperty('cells')[0];
            if (cell.isEdge() == true) {
                var target = eventObj.getProperty('target');
                var source = eventObj.getProperty('source');
                if (target == null || source == null) {
                    fatherGraph.removeCells([cell]);
                }
            }
        });

        function setDataDirty(sender, evt) {
            me.dataDirty = true;
        }

        graph.addListener(mxEvent.REMOVE_CELLS, setDataDirty);
        graph.addListener(mxEvent.CELLS_REMOVED, setDataDirty);
        graph.addListener(mxEvent.SPLIT_EDGE, setDataDirty);
        graph.addListener(mxEvent.CELLS_MOVED, setDataDirty);
        graph.addListener(mxEvent.CELL_CONNECTED, setDataDirty);

        graph.isCellFoldable = function (cell, collapse) {
            return false;
        };


        //graph.isCellMovable = function (cell) {
        //    if (cell.isEdge() == true) {
        //        //判断x y 是否在连线的范围内
        //    } else
        //        return true;
        //}
    },
    _createPopupMenu: function (graph, menu, cell, evt) {
        var model = graph.getModel();
        if (cell != null && cell.isEdge() == true) {
            menu.addItem('删除', serviceName + '/app/images/mxgraph/clear.png', function () {
                graph.removeCells([cell]);
            });
        }
    },
    _initToolBar: function () {
        var me = this;
        var graph = me.graph;
        var toolbarContainer = Ext.get('toolBarContainer_' + me.sid).dom;
        var tb = new mxToolbar(toolbarContainer);

        tb.addBreak();

        tb.addItem('自适应', FlowConstants.IMAGE_ROOTPATH+'zoom_fit32.png', function (evt) {
            if (mxClient.IS_IE) {
                me.resizer.resize();
            }
            graph.fit();
        });

        tb.addItem('放大', FlowConstants.IMAGE_ROOTPATH+'zoom_in32.png', function (evt) {
            graph.zoomIn();
        });

        tb.addItem('缩小', FlowConstants.IMAGE_ROOTPATH+'zoom_out32.png', function (evt) {
            graph.zoomOut();
        });

        tb.addItem('实际大小', FlowConstants.IMAGE_ROOTPATH+'view_1_132.png', function (evt) {
            var y = graph.view.translate.y;
            graph.zoomActual();
            graph.view.setTranslate(15, y);
        });
    },
    _mxGraphCellClicked: function (sender, evt) {
        var model = sender.getModel();
        var cell = evt.getProperty('cell');
        model.beginUpdate();
        if (cell != null) {
            for (var cellId in model.cells) {
                var curCell = model.getCell(cellId);
                curCell.customHighlight = false;
                sender.removeCellOverlays(curCell);
            }
            var overlays = sender.getCellOverlays(cell);
            var overlay = new mxCellOverlay(
                new mxImage(serviceName + '/app/images/mxgraph/check.png', 16, 16),
                'Overlay tooltip');
            //增加选中标记
            if (overlays == null) {
                curCell.customHighlight = true;
                sender.addCellOverlay(cell, overlay);
            }
            else {
                sender.removeCellOverlays(cell);
            }
            evt.consume();
        }
        model.endUpdate();
        sender.refresh();
    },
    _mxGraphCellDisConnect: function () {

    },
    _autolayout: function () {
        var me = this;
        //自动布局
        var graph = me.graph;
        var layout = new mxHierarchicalLayout(graph);
        layout.resizeParent = true;
        graph.getModel().beginUpdate();
        try {
            var parent = graph.getDefaultParent();
            layout.execute(parent);
        }
        finally {
            graph.getModel().endUpdate();
            //graph.fit();
        }
    },
    _saveDataFlow: function () {
        //保存数据流关系
        var me = this;
        var graph = me.graph;
        var model = graph.getModel();
        var existEdgeIds = [];
        var toSaveData = {
            activities: [],
            transitions: []
        };
        var toRemoveEdgeIds = [];
        for (var cellId in model.cells) {
            var curCell = model.getCell(cellId);
            if (curCell.isVertex() == true) {
                //更新坐标 大小
                var constructFromSource = curCell.constructFromSource;
                var geometry = curCell.getGeometry();
                constructFromSource.xPos = geometry.x;
                constructFromSource.yPos = geometry.y;
                constructFromSource.width = geometry.width;
                constructFromSource.height = geometry.height;
                toSaveData.activities.push(constructFromSource);
            } else if (curCell.isEdge() == true) {
                var constructFromSource = curCell.constructFromSource;
                if (!constructFromSource) {
                    //新增连线
                    toSaveData.transitions.push({
                        srcid: curCell.source.constructFromSource.dataId,
                        destnyid: curCell.target.constructFromSource.dataId
                    });
                } else {
                    constructFromSource.srcid = curCell.source.constructFromSource.dataId;
                    constructFromSource.destnyid = curCell.target.constructFromSource.dataId;
                    toSaveData.transitions.push(constructFromSource);
                    existEdgeIds.push(curCell.id);
                }
            }
        }
        for (var edgeId in me.edgeCache) {
            var contains = false;
            Ext.each(existEdgeIds, function (existEdgeId) {
                if (parseInt(existEdgeId) == parseInt(edgeId)) {
                    contains = true;
                    return false;
                }
            });
            if (contains == false) {
                toRemoveEdgeIds.push(edgeId);
            }
        }
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/DataFlow/saveDataFlow.rdm', {
            dataId: me.dataId,
            modelName: me.modelName,
            toSaveData: toSaveData,
            toRemoveEdgeIds: toRemoveEdgeIds
        }, true, null, true);
        me.dataDirty = false;
    },
    /**
     *
     * 为后台历史任务引擎，提供输入参数，历史引擎根据参数保存相关历史信息至数据库
     */
    getHistoryData: function () {
        var me = this;
        var hisData = me.hisData;
        var hisDataInfo = {
            hisData: hisData
        };
        var retVal = {
            extraData: {}
        };
        retVal.extraData.hisDataFlowInfo = Ext.encode(hisDataInfo);
        return retVal;
    },
    clearDirty: function () {
        this.dataDirty = false;
    }
});