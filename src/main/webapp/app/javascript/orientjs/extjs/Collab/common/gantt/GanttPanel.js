/**
 * Created by Seraph on 16/7/18.
 */
//Ext.Loader.setConfig({enabled: true, disableCaching : true });
//Ext.Loader.setPath('Sch', '../../../ExtScheduler2.x/js/Sch');
//Ext.Loader.setPath('Gnt', '../../js/Gnt');
Ext.define('OrientTdm.Collab.common.gantt.GanttPanel', {
        extend: 'Gnt.panel.Gantt',
        alias: 'widget.ganttPanel',
        requires: [
            'Gnt.plugin.TaskEditor',
            'Gnt.column.StartDate',
            'Gnt.column.EndDate',
            'Gnt.column.Duration',
            'Gnt.column.PercentDone',
            // 'Gnt.column.ResourceAssignment',
            'OrientTdm.Collab.common.gantt.assignment.ResourceAssignmentColumn',
            'Sch.plugin.TreeCellEditing',
            'Sch.plugin.Pan',
            'OrientTdm.Collab.common.gantt.model.Plan',
            'OrientTdm.Collab.common.gantt.model.Dependency',
            'OrientTdm.Collab.common.gantt.Toolbar',
            'OrientTdm.Collab.common.gantt.TaskContextMenu'
        ],
        config: {
            localMode: false,
            localData: null,
            modelName: null,
            dataId: null,
            controlStatus: null,
            readOnly: null,
            enableControl: null,
            //保存历史任务时 是否需要序列化至数据库
            isHistoryAble: true,
            //历史任务描述
            hisTaskDetail: null,
            projectPlannedStartDate : null,
            projectPlannedEndDate : null
        },
        initComponent: function () {
            Ext.QuickTips.init();
            var me = this;
            if (me.hisTaskDetail) {
                me._prepareHisData();
            }
            var taskStore = me.localMode ? me.localData.taskStore : Ext.create("Gnt.data.TaskStore", {
                model: 'OrientTdm.Collab.common.gantt.model.Plan',
                autoLoad: true,
                autoSync: true,
                listeners: {
                    beforeLoad: function (store, operation) {
                        var node = operation.node;
                        if (node.isRoot()) {
                            store.getProxy().setExtraParam("parModelName", me.modelName);
                            store.getProxy().setExtraParam("parDataId", me.dataId);
                        } else {
                            if (node.raw.parentNode) {
                                node.raw.parentNode = null;
                            }
                            store.getProxy().setExtraParam("parModelName", 'CB_PLAN');
                            store.getProxy().setExtraParam("parDataId", node.data.Id);
                        }
                    },
                    beforesync: function (options, eOpts) {
                        me.taskStore.getProxy().setExtraParam("rootModelName", me.modelName);
                        me.taskStore.getProxy().setExtraParam("rootDataId", me.dataId);

                        var notSyncModels = me.taskStore.getNewRecords();
                        for (var i = 0; i < notSyncModels.length; i++) {
                            notSyncModels[i].data.newCreate = true;
                            //设置默认值
                            Ext.apply(notSyncModels[i].data, {
                                plannedStartDate: new Date(),
                                plannedEndDate: new Date(Date.now()+24*3600*1000),
                                Duration: 1,
                                principal: window.userId,
                                resourceName: window.userAllName
                            });

                            if (!Ext.isEmpty(notSyncModels[i].previousSibling)) {
                                notSyncModels[i].data.preSib = notSyncModels[i].previousSibling.data.Id;
                            }

                            if (!Ext.isEmpty(notSyncModels[i].nextSibling)) {
                                notSyncModels[i].data.nextSib = notSyncModels[i].nextSibling.data.Id;
                            }
                        }

                    },
                    update: function(store, record, operation, eOpts){
                        /*
                        //计划未启动不要加上实际开始和结束时间
                        if(operation === "edit"){
                            if(record.modified.Duration === null) {
                                if(!Ext.isEmpty(me.projectPlannedStartDate)){
                                    record.data.actualStartDate = me.projectPlannedStartDate;
                                    record.data.actualEndDate = Ext.Date.add(me.projectPlannedStartDate, Ext.Date.DAY, record.data.Duration);
                                }
                            }
                        }
                        */
                    }
                },
                root: {
                    text: 'Root',
                    id: '-1',
                    expanded: true
                },
                proxy: {
                    type: 'ajax',
                    method: 'POST',
                    reader: {
                        type: 'json'
                    },
                    api: {
                        read: serviceName + '/gantt/plans/cascade.rdm',
                        create: serviceName + '/gantt/plans.rdm',
                        destroy: serviceName + '/gantt/plans/delete.rdm',
                        update: serviceName + '/gantt/plans.rdm'
                    },
                    writer: {
                        type: 'json',
                        root: 'data',
                        encode: true,
                        allowSingle: false
                    }
                }
            });

            var dependencyStore = me.localMode ? me.localData.dependencyStore : Ext.create("Gnt.data.DependencyStore", {
                model: 'OrientTdm.Collab.common.gantt.model.Dependency',
                autoLoad: true,
                autoSync: true,
                listeners: {
                    beforeLoad: function (store, operation) {
                        store.getProxy().setExtraParam("rootModelName", me.modelName);
                        store.getProxy().setExtraParam("rootDataId", me.dataId);
                        store.getProxy().setExtraParam("baseLine", false);
                    }
                },
                root: {
                    text: 'Root',
                    id: '-1',
                    expanded: true
                },
                proxy: {
                    type: 'ajax',
                    method: 'POST',
                    reader: {
                        type: 'json'
                    },
                    api: {
                        read: serviceName + '/gantt/dependencies/cascade.rdm',
                        create: serviceName + '/gantt/dependencies.rdm',
                        destroy: serviceName + '/gantt/dependencies/delete.rdm',
                        update: serviceName + '/gantt/dependencies.rdm'
                    },
                    writer: {
                        type: 'json',
                        root: 'data',
                        encode: true,
                        allowSingle: false
                    }
                }
            });

            var resourceStore = me.localMode ? me.localData.resourceStore : Ext.create('Gnt.data.ResourceStore', {
                model: 'Gnt.model.Resource'
            });

            var assignmentStore = me.localMode ? me.localData.assignmentStore : Ext.create('Gnt.data.AssignmentStore', {
                autoLoad: true,
                autoSync: true,
                // Must pass a reference to resource store
                resourceStore: resourceStore,
                proxy: {
                    type: 'ajax',
                    api: {
                        read: serviceName + '/gantt/resources.rdm',
                        update: serviceName + '/gantt/resources/assignment.rdm',
                        create: serviceName + '/gantt/resources/assignment.rdm'
                    },
                    method: 'GET',
                    reader: {
                        type: 'json',
                        root: 'assignments'
                    }
                },
                listeners: {
                    load: function () {
                        resourceStore.loadData(this.proxy.reader.jsonData.resources);
                    }
                }
            });
            assignmentStore.getProxy().setExtraParam("rootModelName", me.modelName);
            assignmentStore.getProxy().setExtraParam("rootDataId", me.dataId);

            var readOnly;
            if (!me.localMode) {
                var params = {
                    rootModelName: me.modelName,
                    rootDataId: me.dataId
                };
                OrientExtUtil.AjaxHelper.doRequest(serviceName + "/gantt/controlStatus.rdm", params, false, function (response) {
                    me.controlStatus = response.decodedData;
                });

                readOnly = me.readOnly || (me.controlStatus.canEditBaseline || !me.controlStatus.canSetBaseline );
            } else {
                readOnly = true;
            }

            Ext.apply(this, {
                readOnly: readOnly,
                region: 'center',
                height: 800,
                width: 800,
                rowHeight: 26,
                leftLabelField: 'Name',
                highlightWeekends: false,
                showTodayLine: true,
                enableBaseline: true,
                baselineVisible: true,
                enableDependencyDragDrop: true,
                enableDragCreation: true,
                enableTaskDragDrop: true,
                loadMask: false,
                viewPreset: 'weekAndDayLetter',
                startDate: Ext.isEmpty(this.projectPlannedStartDate)? new Date() : this.projectPlannedStartDate,
                endDate: Sch.util.Date.add(Ext.isEmpty(this.projectPlannedEndDate)? new Date() : this.projectPlannedEndDate, Sch.util.Date.WEEK, 20),

                // Setup your static columns
                columns: [
                    {
                        text: '名称',
                        xtype: 'namecolumn',
                        width: 150
                    },
                    {
                        text: '持续时间',
                        xtype: 'durationcolumn'
                    },
                    {
                        text: '进度',
                        xtype: 'percentdonecolumn',
                        width: 50
                    },
                    new OrientTdm.Collab.common.gantt.assignment.ResourceAssignmentColumn({
                        text: '人员'
                    })
                    // {
                    //     text: '人员',
                    //     showUnits : false,
                    //     xtype : 'resourceassignmentcolumn'
                    // }
                ],
                taskStore: taskStore,
                dependencyStore: dependencyStore,
                assignmentStore: assignmentStore,
                resourceStore: resourceStore,
                plugins: [
                    Ext.create("OrientTdm.Collab.common.gantt.TaskContextMenu"),
                    Ext.create("Sch.plugin.Pan"),
                    Ext.create('Sch.plugin.TreeCellEditing', {clicksToEdit: 1}),
                    //Ext.create('Gnt.plugin.TaskEditor'),

                    // Lazy style definition using 'ptype'
                    {
                        ptype: 'scheduler_lines',
                        innerTpl: '<span class="line-text">{Text}</span>',
                        store: new Ext.data.JsonStore({
                            fields: ['Date', 'Text', 'Cls'],
                            data: [
                                {
                                    Date: new Date(2010, 0, 13),
                                    Text: 'Project kickoff',
                                    Cls: 'kickoff' // A CSS class
                                }
                            ]
                        })
                    }
                ],
                tbar: Ext.create("OrientTdm.Collab.common.gantt.Toolbar", {gantt: me}),
                listeners : {
                    timeheaderdblclick : function(column, startDate, endDate, e, eOpts){

                    }
                }
            });

            this.callParent(arguments);

            me.taskStore.on({
                'filter-set': function () {
                    this.down('[iconCls=icon-collapseall]').disable();
                    this.down('[iconCls=icon-expandall]').disable();
                },
                'filter-clear': function () {
                    this.down('[iconCls=icon-collapseall]').enable();
                    this.down('[iconCls=icon-expandall]').enable();
                },
                scope: this
            })
        },
        refresh: function () {
            var me = this;
            var ct = me.ownerCt;
            var config = {
                region: 'center',
                modelName: me.modelName,
                dataId: me.dataId,
                controlStatus: null,
                readOnly: me.readOnly,
                enableControl: me.enableControl
            };
            ct.remove(me);

            var newPanel = Ext.create("OrientTdm.Collab.common.gantt.GanttPanel", config);
            ct.add(newPanel);
            ct.doLayout();

        },
        /**
         *
         * 为后台历史任务引擎，提供输入参数，历史引擎根据参数保存相关历史信息至数据库
         * 保存甘特信息 包括了任务信息、资源信息、人员信息以及依赖信息
         * {
     *      key:value
     * }
         */
        getHistoryData: function () {
            var me = this;
            var retVal = {
                modelDataRequestList: [],
                extraData: {}
            };
            //获取计划模型ID
            OrientExtUtil.AjaxHelper.doRequest(serviceName + "/gantt/getModelIdByName.rdm", {
                modelNames: [TDM_SERVER_CONFIG.PLAN_DEPENDENCY]
            }, false, function (response) {
                var planInfo = {
                    dataList: []
                };
                //1.保存任务信息
                var rootNode = me.taskStore.getRootNode();
                rootNode.cascadeBy(function (tree, view) {
                    //保存首层节点
                    if (!this.isRoot() && this.getDepth() == 1) {
                        var copyNode = Ext.decode(Ext.encode(this.raw));
                        //拷贝子节点信息
                        copyNode.children = Ext.decode(Ext.encode(this.data.children));
                        planInfo.dataList.push(copyNode);
                    }
                });
                //2.保存任务间关联信息
                var depencyModelId = response.decodedData.results[TDM_SERVER_CONFIG.PLAN_DEPENDENCY];
                var depencyModelDataRequest = {
                    modelId: depencyModelId,
                    dataList: []
                };
                me.dependencyStore.each(function (record) {
                    depencyModelDataRequest.dataList.push(record.raw);
                });
                //3.保存人员分配信息 数据库中并不存在此模型
                var resourceInfo = {
                    dataList: []
                };
                me.resourceStore.each(function (record) {
                    resourceInfo.dataList.push(record.raw);
                });
                retVal.modelDataRequestList.push(depencyModelDataRequest);
                retVal.extraData.resourceInfo = Ext.encode(resourceInfo);
                retVal.extraData.planInfo = Ext.encode(planInfo);
            });
            return retVal;
        },
        _prepareHisData: function () {
            //从历史任务中恢复甘特图
            var me = this;
            //获取模型数据
            OrientExtUtil.AjaxHelper.doRequest(serviceName + "/gantt/getModelIdByName.rdm", {
                modelNames: [TDM_SERVER_CONFIG.PLAN_DEPENDENCY]
            }, false, function (response) {
                //修改初始化参数
                me.setLocalMode(true);
                me.setEnableControl(false);
                var planInfos = me.hisTaskDetail.getExtraData('planInfo');
                var depencyModelId = response.decodedData.results[TDM_SERVER_CONFIG.PLAN_DEPENDENCY];
                var depencyModelDataInfo = me.hisTaskDetail.getModelDataInfo(depencyModelId);
                var resourceInfo = me.hisTaskDetail.getExtraData('resourceInfo');
                var taskStore = Ext.create("Gnt.data.TaskStore", {
                    model: 'OrientTdm.Collab.common.gantt.model.Plan',
                    listeners: {},
                    root: {
                        text: 'Root',
                        id: '-1',
                        expanded: true,
                        children: Ext.decode(planInfos).dataList
                    }
                });
                var dependencyStore = Ext.create("Gnt.data.DependencyStore", {
                    model: 'OrientTdm.Collab.common.gantt.model.Dependency',
                    root: {
                        text: 'Root',
                        id: '-1',
                        expanded: true
                    },
                    data: depencyModelDataInfo.modelDataList
                });
                var resourceStore = Ext.create('Gnt.data.ResourceStore', {
                    model: 'Gnt.model.Resource'
                });
                var assignmentStore = Ext.create('Gnt.data.AssignmentStore', {
                    // Must pass a reference to resource store
                    resourceStore: resourceStore,
                    data: Ext.decode(resourceInfo).dataList
                });
                me.setLocalData({
                    taskStore: taskStore,
                    dependencyStore: dependencyStore,
                    resourceStore: resourceStore,
                    assignmentStore: assignmentStore
                });
            });
        },
        _transformModelDataToTaskInfo: function (modelDataList) {
            //将模型数据转化为节点数据
            return [];
        }
    }
)
;