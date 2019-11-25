/**
 * Created by Administrator on 2016/9/7 0007.
 */
Ext.define('OrientTdm.Collab.common.collabFlow.HorizontalFlowStatusPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.horizontalFlowStatusPanel',
    config: {},
    requires: [
        'OrientTdm.FlowCommon.flowDiagram.process.flowConstants'
    ],
    initComponent: function () {
        var me = this;
        var sid = new Date().getTime();
        Ext.apply(me, {
            html: '<div id="mxIntroduce_' + sid + '" style="position:absolute; overflow:hidden; left:0px; top:0px;' +
            ' right:0px; bottom:0px; z-index:100;border-style:none;border-color:#e9e9e9;background-color:#e9e9e9;"></div>',
            listeners: {
                boxready: function (panel) {
                    me._createStatusIntroduce(document.getElementById('mxIntroduce_' + sid));
                }
            }
        });
        this.callParent(arguments);
    },
    _createStatusIntroduce: function (container) {
        var me = this;
        if (!mxClient.isBrowserSupported()) {
            mxUtils.error('浏览器不支持MXGraph！', 200, false);
        }
        if (mxClient.IS_IE) {
            new mxDivResizer(container);
        }
        mxRectangleShape.prototype.crisp = true;
        var graph = new mxGraph(container);
        graph.setEnabled(false);
        //整体移动
        graph.setPanning(false);
        //设置样式
        var style = graph.getStylesheet().getDefaultVertexStyle();
        style[mxConstants.STYLE_FONTSIZE] = '12';
        style[mxConstants.STYLE_FONTCOLOR] = 'black';
        style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
        style[mxConstants.STYLE_STROKECOLOR] = 'gray';
        style[mxConstants.STYLE_FILLCOLOR] = '#adc5ff';
        style[mxConstants.STYLE_GRADIENT_DIRECTION] = mxConstants.DIRECTION_EAST;
        style[mxConstants.STYLE_ROUNDED] = true;
        style[mxConstants.STYLE_SHADOW] = true;
        style[mxConstants.STYLE_GLASS] = true;
        style[mxConstants.STYLE_FONTSTYLE] = 1;
        graph.getStylesheet().putCellStyle('task', style);

        var panelWidth = me.body.el.getWidth() * 0.95;
        var width = 150;
        var height = 30;
        var widthStep = (panelWidth - 3 * width) / 4;
        var parent = graph.getDefaultParent();
        graph.model.beginUpdate();
        graph.insertVertex(parent, null, FlowConstants.STATUS_COMPLETED_CN, widthStep, 4, width, height, 'fillColor=' + FlowConstants.COLOR_COMPLETED);
        graph.insertVertex(parent, null, FlowConstants.STATUS_PROCESSING_CN, widthStep * 2 + width, 4, width, height, 'fillColor=' + FlowConstants.COLOR_PROCESSING);
        graph.insertVertex(parent, null, FlowConstants.STATUS_UNSTARTED_CN, (widthStep + width) * 2 + widthStep, 4, width, height, 'fillColor=' + FlowConstants.COLOR_UNSTARTED);
        graph.model.endUpdate();
    }
});