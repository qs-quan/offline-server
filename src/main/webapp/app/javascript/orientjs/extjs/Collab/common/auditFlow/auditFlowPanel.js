/**
 * Created by Seraph on 16/8/4.
 */
Ext.define('OrientTdm.Collab.common.auditFlow.auditFlowPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    requires: [
        "OrientTdm.FlowCommon.flowDiagram.flowDiagram",
        "OrientTdm.FlowCommon.flowDiagram.dataObtainer.simpleFlowDataObtainer",
        'OrientTdm.Collab.common.collabFlow.HorizontalFlowStatusPanel',
        'OrientTdm.Collab.common.collabFlow.FlowOverViewPanel'
    ],
    config: {
        flowTaskId: null,
        piId: null,
        pdId: null,
        jpdlDesc: null,
        flowTaskNodeModelList: []
    },
    initComponent: function () {
        var me = this;
        var inited = false;
        var sid = me.getItemId() + new Date().getTime();
        var overViewContainedId = 'overViewContainer_' + sid;
        var flowDiagParams = {
            flowTaskId: me.flowTaskId,
            piId: me.piId,
            pdId: me.pdId
        };

        var flowDiagram = Ext.create('OrientTdm.FlowCommon.flowDiagram.flowDiagram', {});
        var centerPanel = Ext.create("OrientTdm.Common.Extend.Panel.OrientPanel", {
            region: 'center',
            padding: '0 0 0 0',
            border: false,
            listeners: {
                afterrender: function (panel) {
                    var flowDataObtainer = Ext.create('OrientTdm.FlowCommon.flowDiagram.dataObtainer.simpleFlowDataObtainer', {});
                    if (Ext.isEmpty(me.jpdlDesc)) {
                        flowDiagram.init(document.getElementById('curflowContainer_' + sid), flowDataObtainer, flowDiagParams);
                        if ((!Ext.isEmpty(me.piId)) || (!Ext.isEmpty(me.flowTaskId))) {
                            flowDiagram.updateNodeStatus(flowDiagParams);
                        }
                    } else {
                        //从本地加载
                        flowDiagram.initByLocal(document.getElementById('curflowContainer_' + sid), me.jpdlDesc);
                    }
                    flowDiagram.updateOverView(document.getElementById(overViewContainedId));
                },
                afterlayout: function () {
                    if (inited == false && me.flowTaskNodeModelList && me.flowTaskNodeModelList.length > 0) {
                        inited = true;
                        flowDiagram.updateNodeStatusByLocal(me.flowTaskNodeModelList);
                    }
                }
            },
            html: '<div id="curflowContainer_' + sid + '" style="z-index:1;position:relative;overflow:hidden;top:0px;right:0px;width:100%;height:100%;border-style:none;border-color:lightgray;"></div>'
        });

        var westPanel = Ext.create("OrientTdm.Common.Extend.Panel.OrientPanel", {
            region: 'west',
            width: 38,
            border: false,
            listeners: {
                afterrender: function (panel) {
                    flowDiagram.createGraphCtrlToolbar(document.getElementById('flowDiagCtrl_' + sid));
                }
            },
            html: '<div id="flowDiagCtrl_' + sid + '" style="z-index:1;position:relative;overflow:hidden;top:0px;' +
                    'right:0px;width:100%;height:100%;border-style:none;border-color:#e9e9e9;background-color:#e9e9e9;"></div>'

        });

        var southPanel = Ext.create("OrientTdm.Collab.common.collabFlow.HorizontalFlowStatusPanel", {
            region: 'south',
            height: 38,
            margin: '0 0 0 38',
            border: false

        });

        Ext.apply(this, {
            layout: 'border',
            items: [centerPanel, westPanel,southPanel],
            centerPanel: centerPanel,
            westPanel: westPanel,
            southPanel:southPanel

        });

        this.callParent(arguments);
    }
});