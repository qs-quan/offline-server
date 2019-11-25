/**
 * Created by Seraph on 16/7/29.
 */
Ext.define("OrientTdm.Collab.common.util.RightControlledPanelHelper", {
    extend: 'Ext.Base',
    alternateClassName: 'CollabRightControlledPanelHelper',
    requires:[
      'OrientTdm.Collab.common.TaskHandler.TaskHandlerPanel'
    ],
    statics: {
        getPanelByTitle: function (title, params, customParams) {
            var panel = null;

            var config = this.getConfigParams(title, params, customParams);

            if (title == '工作组') {
                panel = Ext.create("OrientTdm.Collab.common.team.TeamPanel", Ext.apply({}, config));
            } else if (title == '甘特图') {
                panel = Ext.create("OrientTdm.Collab.common.gantt.GanttPanel", Ext.apply({}, config));
            } else if (title == '控制流') {
                panel = Ext.create("OrientTdm.Collab.common.collabFlow.collabFlowPanel", Ext.apply({}, config));
            } else if (title == '工作包分解') {
                panel = Ext.create("OrientTdm.Collab.common.planBreak.PlanBreakPanel", Ext.apply({}, config));
            } else if (title == '设计数据') {
                panel = Ext.create("OrientTdm.Collab.Data.DevData.DevDataDashBord", Ext.apply({}, config));
            } else if (title == '离线数据') {
                panel = Ext.create("OrientTdm.Collab.Data.PVMData.PVMDataDashBord", Ext.apply({}, config));
            } else if (title == '数据流') {
                panel = Ext.create("OrientTdm.Collab.common.collabFlow.DataFlowPanel", Ext.apply({}, config));
            } else if (title == '采集数据') {
                panel = Ext.create("OrientTdm.Collab.Data.MeasureData.CollabMeasureMentPanel", Ext.apply({}, config));
            } else if (title == '任务处理') {
                panel = Ext.create("OrientTdm.Collab.common.TaskHandler.TaskHandlerPanel", Ext.apply({}, config));
            }
            return panel;

        },
        getConfigParams: function (title, params, customParams) {
            var retV = params;
            if (!Ext.isEmpty(customParams)) {
                if (!Ext.isEmpty(customParams[title])) {
                    retV = Ext.apply(retV, customParams[title]);
                }
            }

            return retV;
        }
    }
});