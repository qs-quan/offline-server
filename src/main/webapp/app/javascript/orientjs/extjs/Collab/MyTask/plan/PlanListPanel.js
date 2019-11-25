/**
 * Created by Seraph on 16/7/25.
 */
Ext.define('OrientTdm.Collab.MyTask.plan.PlanListPanel', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
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

          MyTaskPanelDisplayHelper.showInMainTab(thePanel);
      }
    },
    initComponent: function () {
        var me = this;
        this.callParent(arguments);

        me.initEvents();
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
        var me = this;

        var retVal = [];

        return retVal;
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
            flex: 1,
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