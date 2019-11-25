/**
 * Created by panduanduan on 13/07/2017.
 */
Ext.define('OrientTdm.BackgroundMgr.Quantity.Instance.ModelPathPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.modelPathPanel',
    requires: [],
    config: {
       modelPath:[],
       startNodeStyle: 'strokeColor=green;strokeWidth=4;fillColor=green',
       endNodeStyle: 'strokeColor=red;strokeWidth=4;fillColor=red',
       normalStyle: 'strokeColor=white;strokeWidth=4;fillColor=white',
       startModelId:'',
       endModelId:''
    },
    initComponent: function () {
        var me = this;
        me.sid = new Date().getTime();
        Ext.apply(me, {
            items: [
                {
                    html: '<div id="modelPathDiagCtrl_' + me.sid + '"></div>',
                    border: false,
                    height:480
                }
            ],
            listeners: {
                afterrender: me._initDiag,
                scope: me
            }
        });
        me.addEvents('highLightTransition','clearHighLightTransition');
        me.callParent(arguments);
    },
    initEvents:function(){
        var me = this;
        me.callParent();
        me.mon(me, 'highLightTransition', me._highLightTransition, me);
        me.mon(me, 'clearHighLightTransition', me._clearHighLightTransition, me);
    },
    _initDiag:function(){
        var me = this;
        if (!mxClient.isBrowserSupported()) {
            mxUtils.error('Browser is not supported!', 200, false);
        } else {
            mxRectangleShape.prototype.crisp = true;
            mxConnectionHandler.prototype.connectImage = new mxImage(serviceName + '/app/images/mxgraph/connector.gif', 16, 16);
            var extContainer = Ext.get('modelPathDiagCtrl_' + me.sid);
            var container = extContainer.dom;
            if (mxClient.IS_IE) {
                me.resizer = new mxDivResizer(container);
            }
            var graph = new mxGraph(container);
            me.graph = graph;
            me._initMxGraph();
            var parent = graph.getDefaultParent();
            var layout = new mxHierarchicalLayout(graph);
            layout.resizeParent = true;
            graph.getModel().beginUpdate();
            try {
                me._initContent();
                layout.execute(parent);
            }
            finally {
                graph.getModel().endUpdate();
                graph.fit();
            }
        }
    },
    _initMxGraph:function(){
        var me = this;
        var graph = me.graph;
        graph.setEnabled(false);
        graph.setPanning(true);
        graph.panningHandler.useLeftButtonForPanning = true;
        graph.isCellFoldable = function (cell, collapse) {
                return false;
        };
         //节点和边的样式
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
        style[mxConstants.STYLE_EDGE] = mxEdgeStyle.TopToBottom;
        style[mxConstants.STYLE_STROKEWIDTH] = 2;
        style[mxConstants.STYLE_EXIT_X] = 0.5; // center
        style[mxConstants.STYLE_EXIT_Y] = 1.0; // bottom
        style[mxConstants.STYLE_EXIT_PERIMETER] = 0; // disabled
        style[mxConstants.STYLE_ENTRY_X] = 0.5; // center
        style[mxConstants.STYLE_ENTRY_Y] = 0; // top
        style[mxConstants.STYLE_ENTRY_PERIMETER] = 0; // disabled
        style[mxConstants.STYLE_STROKECOLOR] = '#333333';

        var modelGetStyle = me.graph.model.getStyle;
        graph.model.getStyle = function (cell) {
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
    },
    _initContent:function(){
        var me = this;
        var modelPath = me.modelPath;
        var cells = {};
        Ext.each(modelPath,function(model){
            me._createVertex(model,cells);
        });
    },
    _createVertex:function(model,cells,parentModel){
        var me = this;
        var graph = me.graph;
        var parent = graph.getDefaultParent();
        var SIZE = {x: 90, y: 30};
        var modelId = model.modelId;
        if(!cells[modelId]){
            var v = graph.insertVertex(parent, modelId, model.modelName, 0, 0, SIZE.x, SIZE.y, 'fillColor=' + me._getColor(modelId));
            v.desc = model;
            cells[modelId] = v;
        }
        if(parentModel && !me._containtEdge(parentModelId,modelId)){
            var parentModelId = parentModel.modelId;
            var e = graph.insertEdge(parent, parentModelId + '_' + modelId, '', cells[parentModelId], cells[modelId]);
        }
        if(null != model.nextModel){
            parentModel = model;
            me._createVertex(model.nextModel,cells,parentModel);
        }
    },
    _getColor:function(modelId){
        var me = this;
        if(modelId == me.startModelId){
            return me.startNodeStyle;
        }else if(modelId == me.endModelId){
            return me.endNodeStyle;
        }else{
            return me.normalStyle;
        }
    },
    _highLightTransition:function(modelPath){
        var me = this;
        var graph = me.graph;
        var model = graph.getModel();
        model.beginUpdate();
        var modelIds = [];
        me._extraModelPath(modelPath,modelIds);
        try {
             //寻找连线
            var toHightTranstions = [];
            for (var cellId in model.cells) {
                var curCell = model.getCell(cellId);
                curCell.customHighlight = false;
                graph.removeCellOverlays(curCell);
                if (curCell.isEdge()) {
                    if ((curCell.source && Ext.Array.contains(modelIds,curCell.source.id)) &&  
                        (curCell.target && Ext.Array.contains(modelIds,curCell.target.id))) {
                        toHightTranstions.push(curCell);
                    }
                }
            }
            Ext.each(toHightTranstions,function(toHightTranstion){
                var overlay = new mxCellOverlay(
                    new mxImage(serviceName + '/app/images/mxgraph/check.png', 16, 16),
                    '所选路径');
                graph.addCellOverlay(toHightTranstion, overlay);
                toHightTranstion.customHighlight = true;
            });
        } finally {
            model.endUpdate();
            graph.refresh();
        }
    },
    _clearHighLightTransition:function(modelPath){
        var me = this;
        var graph = me.graph;
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
    _containtEdge:function(sourceId,targetId){
        var me = this;
        var graph = me.graph;
        var model = graph.getModel();
        var retVal = false;
        for (var cellId in model.cells) {
            var curCell = model.getCell(cellId);
            if (curCell.isEdge()) {
                if (curCell.source && curCell.source.id == sourceId && curCell.target && curCell.target.id == targetId) {
                    retVal = true;
                }
            }
        }
        return retVal;
    },
    _extraModelPath:function(modelPath,modelIds){
        var me = this;
        var startModelId = modelPath.modelId;
        if(!Ext.Array.contains(modelIds,startModelId)){
            modelIds.push(startModelId);
        }
        if(modelPath.nextModel){
            me._extraModelPath(modelPath.nextModel,modelIds);
        }
    }
});