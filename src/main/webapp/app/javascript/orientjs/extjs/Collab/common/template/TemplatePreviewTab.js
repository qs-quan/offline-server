/**
 * Created by Seraph on 16/9/26.
 */
Ext.define('OrientTdm.Collab.common.template.TemplatePreviewTab', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientTabPanel',
    requires: [
        'OrientTdm.Collab.common.gantt.model.Plan',
        'OrientTdm.Collab.common.gantt.model.Dependency',
        'OrientTdm.Collab.common.team.model.RoleUserTreeModel'
    ],
    config: {},
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.on('tabchange', me.tabChanged, me);
    },
    tabChanged: function (tabPanel, newCard, oldCard) {
        var me = this;
        if (!newCard.compInfo) {
            return;
        }
        var params = {
            dataPrincipal: me.dataPrincipal,
            nodeId: newCard.compInfo.nodeId,
            templateId : newCard.templateId,
            previewType : 'tab'
        };

        var title = newCard.title;
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/templatePreview/comps.rdm', params, false, function (response) {

            var panel;
            if (title == '工作组') {
                var roleUserTreeStore = Ext.create('Ext.data.TreeStore', {
                    model: 'OrientTdm.Collab.common.team.model.RoleUserTreeModel',
                    listeners: {},
                    root: {
                        text: 'root',
                        id: '-1',
                        expanded: true,
                        children : response.decodedData.extraInfo.roleUser
                    }
                });

                var roleFunctionTreeStore = null;

                panel = Ext.create("OrientTdm.Collab.common.team.TeamPanel", {
                    compInfo: newCard.compInfo,
                    templateId : newCard.templateId,
                    region: 'center',
                    localMode : true,
                    localData : {
                        roleUserTreeStore : roleUserTreeStore,
                        roleFunctionData : response.decodedData.extraInfo.roleFunction
                    }
                });
                
            } else if (title == '甘特图') {

                var taskStore = Ext.create("Gnt.data.TaskStore", {
                    model: 'OrientTdm.Collab.common.gantt.model.Plan',
                    listeners: {},
                    root: {
                        text: 'Root',
                        id: '-1',
                        expanded: true,
                        children : response.decodedData.extraInfo.task
                    }
                });

                var dependencyStore = Ext.create("Gnt.data.DependencyStore", {
                    model: 'OrientTdm.Collab.common.gantt.model.Dependency',
                    root: {
                        text: 'Root',
                        id: '-1',
                        expanded: true
                    },
                    data: response.decodedData.extraInfo.dependency
                });

                var resourceStore = Ext.create('Gnt.data.ResourceStore', {
                    model : 'Gnt.model.Resource'
                });

                var assignmentStore =Ext.create('Gnt.data.AssignmentStore', {
                    // Must pass a reference to resource store
                    resourceStore : resourceStore,
                    data : response.decodedData.extraInfo.assignment
                });

                panel = Ext.create("OrientTdm.Collab.common.gantt.GanttPanel", {
                    compInfo: newCard.compInfo,
                    templateId : newCard.templateId,
                    region: 'center',
                    localMode : true,
                    enableControl: false,
                    localData : {
                        taskStore : taskStore,
                        dependencyStore : dependencyStore,
                        resourceStore : resourceStore,
                        assignmentStore : assignmentStore

                    }
                });
            } else if (title == '控制流') {
                panel = Ext.create("OrientTdm.Collab.common.collabFlow.collabFlowPanel", {
                    region: 'center',
                    localMode : true,
                    localData : response.decodedData.extraInfo
                });
            } else if (title == '工作包分解') {
                panel = Ext.create("OrientTdm.Collab.common.planBreak.PlanBreakPanel", Ext.apply({}, config));
            } else if (title == '设计数据') {
                panel = Ext.create("OrientTdm.Collab.Data.DevData.DevDataDashBord", {
                    region: 'center',
                    localMode : true,
                    localData : response.decodedData.extraInfo
                });
            } else if (title == '离线数据') {
                panel = Ext.create("OrientTdm.Collab.Data.PVMData.PVMDataDashBord", {
                    region: 'center',
                    localMode : true,
                    localData : response.decodedData.extraInfo
                });
            } else if (title == '数据流') {
                panel = Ext.create("OrientTdm.Collab.common.collabFlow.DataFlowPanel", {
                    region: 'center',
                    localMode : true,
                    localData : response.decodedData.extraInfo
                });
            } else if (title == '任务处理'  && !newCard.down('baseComponent')) {

                var componentBind = response.decodedData.extraInfo.componentBind;
                if(Ext.isEmpty(componentBind)) {
                    panel = Ext.create("OrientTdm.Common.Extend.Panel.OrientPanel");
                }else{
                    var componentDesc = componentBind.belongComponent;
                    if (componentDesc) {
                        me.componentDesc = componentDesc;
                        Ext.require(componentBind.componentExtJsClass);
                        panel = Ext.create(componentBind.componentExtJsClass, {
                            title: componentDesc.componentname,
                            flowTaskId: null,
                            modelId: componentBind.taskModelId,
                            dataId: null,
                            region: 'center',
                            componentId: componentDesc.id
                        });
                    }
                }

            }

            if (!Ext.isEmpty(panel)) {
                newCard.removeAll(true);
                newCard.add(panel);
                newCard.doLayout();
            }
        });

    }
});