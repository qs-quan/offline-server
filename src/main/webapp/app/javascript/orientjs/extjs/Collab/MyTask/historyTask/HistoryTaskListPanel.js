/**
 * Created by Seraph on 16/8/24.
 */
Ext.define('OrientTdm.Collab.MyTask.historyTask.HistoryTaskListPanel', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    config: {
        usePage: true,
        useGroup: false,
        taskType: null
    },
    requires: [
        'OrientTdm.Collab.MyTask.historyTask.audit.HisAuditTaskDetailPanel',
        'OrientTdm.Collab.MyTask.historyTask.model.HistoryTaskListModel',
        'OrientTdm.Collab.MyTask.util.PanelDisplayHelper',
        'OrientTdm.Collab.MyTask.historyTask.util.HisTaskDetailHelper'
    ],
    statics:{
        showDetail:function(itemId,recordId) {
            var record = Ext.getCmp(itemId).getStore().getById(recordId);
            var detailPanel = {};
            var param = {
                taskId: record.data.flowTaskId || record.data.dataId,
                taskType: HisTaskHelper.getTaskType(record.data.type)
            };
            var hisTaskDetail;
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/hisTask/getHisTaskInfo.rdm', param, false, function (resp) {
                hisTaskDetail = Ext.create('OrientTdm.Collab.MyTask.historyTask.util.HisTaskDetailHelper', resp.decodedData.results);
            });
            if (record.data.type === 'audit') {
                var jsClass = 'OrientTdm.Collab.MyTask.auditTask.AuditTaskDetailPanel';
                var config = {
                    title: '历史审批任务[' + record.data.name + ']详情',
                    closable: true,
                    isHistory: true
                };
                if (!hisTaskDetail.isNull()) {
                    config.hisTaskDetail = hisTaskDetail;
                    jsClass = 'OrientTdm.Collab.MyTask.historyTask.audit.HisAuditTaskDetailPanel';
                } else {
                    config.taskInfo = record.data;
                }
                detailPanel = Ext.create(jsClass, config);

            } else if (record.data.type === 'collab') {
                var config = {
                    title: '历史协同任务[' + record.data.name + ']详情',
                    closable: true,
                    isHistory: true
                };
                if (!hisTaskDetail.isNull()) {
                    config.hisTaskDetail = hisTaskDetail;
                }/* else {
                }*/
                Ext.apply(config, {
                    rootDataId: record.data.dataId,
                    rootModelName: 'CB_TASK',
                    rootData: record.data
                });
                detailPanel = Ext.create('OrientTdm.Collab.MyTask.collabTask.CollabTaskDetailPanel', config);

            } else if (record.data.type === 'CB_PLAN') {
                var config = {
                    title: '历史计划[' + record.data.name + ']详情',
                    closable: true,
                    isHistory: true
                };
                if (!hisTaskDetail.isNull()) {
                    config.hisTaskDetail = hisTaskDetail;
                    config.parentDataId = record.data.dataId;
                } else {
                    Ext.apply(config, {
                        rootDataId: record.data.id,
                        rootModelName: 'CB_PLAN',
                        rootData: record.data,
                        parentDataId : record.data.dataId
                    });
                }
                detailPanel = Ext.create('OrientTdm.Collab.MyTask.plan.PlanDetailPanel', config);
            }
            else if (record.data.type === 'dataTask') {
                var config = {
                    title: '历史数据任务[' + record.data.name + ']详情',
                    closable: true,
                    isHistory: true
                };
                if (!hisTaskDetail.isNull()) {
                    config.hisTaskDetail = hisTaskDetail;
                } else {
                    Ext.apply(config, {
                        modelId: record.data.modelId,
                        dataId: record.data.dataId,
                        taskName: record.data.name
                    });
                }
                detailPanel = Ext.create('OrientTdm.Collab.MyTask.dataTask.DataTaskHisDetailPanel', config);
            }
            MyTaskPanelDisplayHelper.showInMainTab(detailPanel);
        }
    },

    initComponent: function () {
        var me = this;
        if(me.useGroup) {
            Ext.apply(me, {
                features : [{
                 id : 'group',
                 ftype : 'grouping',
                 groupHeaderTpl : '{name}',
                 hideGroupedHeader: true,
                 enableGroupingMenu : false
                 }]
            });
        }

        this.callParent(arguments);

        me.initEvents();
        //me.on('cellclick', me.cellClickListener, me);cellClick的方式在ext4.2下存在bug
        this.addEvents('filterByFilter');
    },

    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'filterByFilter', me.filterByFilter, me);
    },

    createStore: function () {
        var me = this;
        var retVal = Ext.create('Ext.data.Store', {
            autoLoad: true,
            model: 'OrientTdm.Collab.MyTask.historyTask.model.HistoryTaskListModel',
            groupField : 'group',
            proxy: {
                type: 'ajax',
                api: {
                    'read': serviceName + '/myTask/historyTasks/currentUser.rdm' + (me.taskType ? ('?groupType='+me.taskType) : '')
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'message'
                }
            }
        });

        this.store = retVal;
        return retVal;
    },

    createToolBarItems: function () {
        var me = this;

        var retVal = [];

        return retVal;
    },

    createColumns: function () {
        var me = this;

        var retVal = [
            {
                header: '名称',
                flex : 1,
                sortable: true,
                dataIndex: 'name',
                renderer: Ext.bind(me.renderName, me)
            },
            {
                header: '开始时间',
                flex : 1,
                sortable: true,
                dataIndex: 'actualStartDate'
            },
            {
                header: '结束时间',
                flex : 1,
                sortable: true,
                dataIndex: 'actualEndDate'
            }
        ];
        if(me.useGroup) {
            Ext.Array.insert(retVal, 0, [{
                header: '分组',
                width: 180,
                sortable: true,
                dataIndex: 'group'
            }]);
        }
        return retVal;
    },

    renderName: function (value, p, record) {
        //return '<span class="taskSpan">' + value + '</span>';
        //\'{id}\',\'' + itemId + '\'   ',\'' + record.getId()+
        var me = this;
        var recordId = record.getId();
        return '<span href="javascript:;" class="taskSpan" onclick="OrientTdm.Collab.MyTask.historyTask.HistoryTaskListPanel.showDetail(\''+me.getId()+'\''+',\''+recordId+'\');">'+value+'</span>';
    },

    filterByFilter: function (filter) {
        for (var proName in filter) {
            var proValue = filter[proName];
            if (proName === 'startDate' || proName === 'endDate') {
                proValue = proValue.replace(/[年月日]/g, '-');
            }
            this.getStore().getProxy().setExtraParam(proName, proValue);
        }
        this.getStore().loadPage(1);
    }

});
