/**
 * Created by Seraph on 16/8/4.
 */
Ext.define('OrientTdm.Collab.MyTask.auditTask.SubmitAuditFlowTaskPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.submitAuditFlowTaskPanel',
    requires: [
        "OrientTdm.FlowCommon.flowDiagram.flowDiagram",
        "OrientTdm.FlowCommon.flowDiagram.dataObtainer.simpleFlowDataObtainer",
        'OrientTdm.Collab.common.collabFlow.FlowStatusPanel',
        'OrientTdm.Collab.common.collabFlow.FlowOverViewPanel'
    ],
    config: {
        flowTaskId: null,
        piId: null,
        pdId: null,
        transitions: []
    },

    initComponent: function () {
        var me = this;
        var sid = new Date().getTime();
        var overViewContainedId = 'overViewContainer_' + sid;
        var flowDiagParams = {
            flowTaskId: me.flowTaskId,
            piId: me.piId,
            pdId: me.pdId
        };

        var flowDiagram = new OrientTdm.FlowCommon.flowDiagram.flowDiagram();
        me.flowDiagram = flowDiagram;

        var centerPanel = Ext.create("OrientTdm.Common.Extend.Panel.OrientPanel", {
            region: 'center',
            padding: '0 0 0 0',
            listeners: {
                afterrender: function (panel) {
                    panel.doLayout();
                    var flowDataObtainer = new OrientTdm.FlowCommon.flowDiagram.dataObtainer.simpleFlowDataObtainer();
                    flowDiagram.init(document.getElementById('curflowContainer_' + sid), flowDataObtainer, flowDiagParams);
                    flowDiagram.updateOverView(document.getElementById(overViewContainedId));
                    if ((!Ext.isEmpty(me.piId)) || (!Ext.isEmpty(me.flowTaskId))) {
                        flowDiagram.updateNodeStatus(flowDiagParams);
                    }
                }
            },
            html: '<div id="curflowContainer_' + sid + '" style="z-index:1;position:relative;overflow:hidden;top:0px;right:0px;width:100%;height:100%;border-style:none;border-color:lightgray;"></div>'
        });

        var southPanel = Ext.create("OrientTdm.Common.Extend.Panel.OrientPanel", {
            region: 'south',
            height: 50,
            listeners: {
                afterrender: function (panel) {
                    flowDiagram.createGraphCtrlToolbar(document.getElementById('flowDiagCtrl_' + sid));
                }
            },
            html: '<div id="flowDiagCtrl_' + sid + '" style="z-index:1;position:relative;overflow:hidden;top:0px;right:0px;width:100%;height:100%;border-style:none;border-color:lightgray;"></div>'

        });

        var userGridPanel = Ext.create("OrientTdm.Collab.MyTask.auditTask.SubmitAuditUserList",{
            region:'south',
            height:180,
            title:"设置执行人",
            transitions:me.transitions,
            flowTaskId: me.flowTaskId,
            piId: me.piId,
            hidden: true
        });

        var flowStatusPanel = Ext.create('OrientTdm.Collab.common.collabFlow.FlowStatusPanel', {
            width: 150,
            height: 200,
            title: '状态说明',
            region: 'north'
        });

        var overViewPanel = Ext.create('OrientTdm.Collab.common.collabFlow.FlowOverViewPanel', {
            containId: overViewContainedId,
            title: '鹰眼',
            width: 150,
            region: 'center'
        });

        var eastPanel = Ext.create('OrientTdm.Common.Extend.Panel.OrientPanel', {
            region: 'east',
            width: 150,
            items: [flowStatusPanel, overViewPanel],
            layout: 'border'
        });

        var containPanel = Ext.create('OrientTdm.Common.Extend.Panel.OrientPanel',{
            region:'center',
            layout:'border',
            items:[centerPanel,southPanel,eastPanel]
        });


        Ext.apply(this, {
            layout: 'border',
            items: [containPanel, userGridPanel]
        });
        this.callParent(arguments);
    },
    _highLightTransition: function (currentTaskName, endTaskName) {
        var me = this;
        me.flowDiagram.highLightTransition(currentTaskName, endTaskName);
    },
    _clearHighLightTransition: function () {
        var me = this;
        me.flowDiagram._clearHighLightTransition();
    }
});