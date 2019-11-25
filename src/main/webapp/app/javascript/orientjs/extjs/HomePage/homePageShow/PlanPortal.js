/**
 * copy from 【OrientTdm.HomePage.homePageShow.CollabTaskPortal】
 */
Ext.define('OrientTdm.HomePage.homePageShow.PlanPortal', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.PlanPortal',
    requires: [
        "OrientTdm.Collab.MyTask.plan.model.PlanListModel",
        "OrientTdm.Collab.MyTask.util.PanelDisplayHelper"
    ],
    statics:{
        showDetail:function(itemId,recordId) {
            var record = Ext.getCmp(itemId).getStore().getById(recordId);
            var thePanel = Ext.create("OrientTdm.Collab.MyTask.plan.PlanDetailPanel",{
                title: "计划["+record.data.name + "]详情",
                closable : true,
                rootDataId : record.data.id,
                rootModelName : 'CB_PLAN',
                rootData : record.data,
                parentDataId : record.raw.parProjectId
            });

            MyTaskPanelDisplayHelper.showInCenterTab(thePanel);
        }
    },
    initComponent: function () {
        var me = this;
        me.frame = false;
        //不显示翻页
        me.usePage = false;

        this.callParent(arguments);
        me.initEvents();
        me.on("actionShowDetail",me.itemClickListener,me);
        this.addEvents('filterByFilter');
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'filterByFilter', me.filterByFilter, me);
    },
    createStore: function () {
        var retVal = Ext.create("Ext.data.Store", {
            autoLoad: true,
            model: 'OrientTdm.Collab.MyTask.plan.model.PlanListModel',
            proxy: {
                type: 'ajax',
                api: {
                    "read": serviceName + "/myTask/plans/currentUser.rdm"
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                }
            }
        });

        this.store = retVal;
        return retVal;
    },

    createToolBarItems: function () {
        return [];
    },
    createColumns: function () {
        var me = this;
        return [{
            header: '计划名称',
            flex: 1,
            sortable: true,
            dataIndex: 'belongedProject',
            renderer: Ext.bind(me.renderName, me)
        },{
            header: '计划开始时间',
            flex : 1,
            sortable: true,
            dataIndex: 'actualStartDate'
        },{
            header: '状态',
            flex : 1,
            dataIndex: 'id',
            renderer: function (value, p, record) {
                var state = "执行中";
                OrientExtUtil.AjaxHelper.doRequest(serviceName + "/TaskController/checkTaskState.rdm", {
                    prjId: value
                }, false, function (response) {
                    state = response.responseText == true ?
                        "执行完成" : "执行中";
                });

                return state;
            }
        }];
    },
    itemClickListener: function (view, record, item, index, e, eOpts) {
        var thePanel = Ext.create("OrientTdm.Collab.MyTask.plan.PlanDetailPanel",{
            title: "计划["+record.data.name + "]详情",
            closable : true,
            rootDataId : record.data.id,
            rootModelName : 'CB_PLAN',
            rootData : record.data,
            parentDataId : record.raw.parProjectId
        });

        MyTaskPanelDisplayHelper.showInMainTab(thePanel);
    },
    renderName: function(value, p, record) {
        var me = this;
        var recordId = record.getId();
        value = value == null ? '' : value;
        return '<span href="javascript:;" class="taskSpan" onclick="OrientTdm.HomePage.homePageShow.PlanPortal.showDetail(\''+me.getId()+'\''+',\''+recordId+'\');">' + value + '</span>';
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