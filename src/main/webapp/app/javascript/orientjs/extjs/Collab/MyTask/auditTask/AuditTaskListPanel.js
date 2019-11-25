/**
 * Created by Seraph on 16/8/1.
 */
Ext.define('OrientTdm.Collab.MyTask.auditTask.AuditTaskListPanel', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    requires: [
        "OrientTdm.Collab.MyTask.auditTask.model.AuditFlowTaskModel",
        "OrientTdm.Collab.MyTask.util.PanelDisplayHelper"
    ],
    statics:{
      showDetail:function(itemId,recordId) {
          var record = Ext.getCmp(itemId).getStore().getById(recordId);

          var detailPanel = Ext.create("OrientTdm.Collab.MyTask.auditTask.AuditTaskDetailPanel",{
              title: "审批任务["+record.data.name + "]详情",
              closable : true,
              taskInfo : record.data

          });

          MyTaskPanelDisplayHelper.showInMainTab(detailPanel);
      }
    },
    initComponent: function () {
        var me = this;

        /*Ext.apply(me, {
            features : [{
                id : 'modelDisplayName',
                ftype : 'grouping',
                groupHeaderTpl : '{name}',
                hideGroupedHeader: true,
                enableGroupingMenu : false
            }]
        });*/
        
        this.callParent(arguments);

        me.initEvents();
        //me.on("cellclick", me.cellClickListener, me);
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
            model: 'OrientTdm.Collab.MyTask.auditTask.model.AuditFlowTaskModel',
            groupField : 'modelDisplayName',
            proxy: {
                type: 'ajax',
                api: {
                    "read": "auditFlow/info/tasks/my.rdm"
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
        return [/*{
                header: '分组',
                width: 180,
                sortable: true,
                dataIndex: 'modelDisplayName'
            },*/
            {
                xtype:'actioncolumn',
                header: '操作',
                width: 50,
                dataIndex: 'groupTask',
                items: ['->', {
                    iconCls: 'icon-takeTask',
                    tooltip: '接受任务',
                    handler: function(grid, rowIndex, colIndex, item, e, record) {
                        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/flow/task/take.rdm', {flowTaskId : record.data.flowTaskId}, false, function (response) {
                            var respJson = response.decodedData;

                            if(respJson.success){
                                record.data.groupTask = false;
                                grid.fireEvent("actionShowDetail", me.getId(),record.getId());
                            }
                        });
                    },
                    isDisabled : function (view, rowIndex, colIndex, item, record) {
                        if(record.data.groupTask){
                            return false;
                        }else{
                            return true;
                        }
                    }
                }, '->']
            },{
                header: '名称',
                flex : 1,
                sortable: true,
                dataIndex: 'name',
                renderer: Ext.bind(me.renderName, me)
            },{
                header: '审批流程名称',
                flex : 1,
                sortable: true,
                dataIndex: 'pdName'
            },{
                header: '开始日期',
                flex : 1,
                sortable: true,
                dataIndex: 'createTime'
            },{
                header: '任务来源',
                flex: 1,
                sortable: true,
                dataIndex: 'currentNodeInfo'
            }];
    },
    cellClickListener: function (table, td, cellIndex, record, tr, rowIndex, e, eopts) {
        if(cellIndex !== 1 && 'take' !== eopts){
            return;
        }

        var detailPanel = Ext.create("OrientTdm.Collab.MyTask.auditTask.AuditTaskDetailPanel",{
            title: "审批任务["+record.data.name + "]详情",
            closable : true,
            taskInfo : record.data

        });

        MyTaskPanelDisplayHelper.showInMainTab(detailPanel);
    },
    renderName: function(value, p, record) {
        var me = this;
        var recordId = record.getId();
        // 使用定制名称替换默认任务名称
        var val = record.raw.cutomName ? record.raw.cutomName : value;
        return '<span href="javascript:;" class="taskSpan" onclick="OrientTdm.Collab.MyTask.auditTask.AuditTaskListPanel.showDetail(\'' + me.getId() + '\'' + ',\'' + recordId+'\');">' + val + '</span>';
    },
    filterByFilter: function (filter) {
        for (var proName in filter) {
            var proValue = filter[proName];
            if (proName === 'startDate' || proName === 'endDate') {
                proValue = proValue.replace(/[年月日]/g, '-');
                proValue = proValue.substr(0,proValue.length-1);
            }
            this.getStore().getProxy().setExtraParam(proName, proValue);
        }
        this.getStore().loadPage(1);
    }
});