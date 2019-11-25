/**
 * Created by Seraph on 16/8/1.
 * 审批任务磁贴
 */
Ext.define('OrientTdm.HomePage.homePageShow.AuditTaskPortal', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    requires: [
        "OrientTdm.Collab.MyTask.auditTask.model.AuditFlowTaskModel",
        "OrientTdm.Collab.MyTask.util.PanelDisplayHelper",
        'OrientTdm.Collab.MyTask.util.HisTaskHelper'
    ],
    alias: 'widget.auditTaskPortal',
    statics:{
        showDetail:function(itemId,recordId) {
            var record = Ext.getCmp(itemId).getStore().getById(recordId);

            var detailPanel = Ext.create("OrientTdm.Collab.MyTask.auditTask.AuditTaskDetailPanel",{
                title: "审批任务["+record.data.name + "]详情",
                closable : true,
                taskInfo : record.data
            });

            MyTaskPanelDisplayHelper.showInCenterTab(detailPanel);
        }
    },

    initComponent: function () {
        var me = this;
        me.frame = false;
        //不显示翻页
        me.usePage = false;

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
            model: 'OrientTdm.Collab.MyTask.auditTask.model.AuditFlowTaskModel',
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

    createColumns: function () {
        var me = this;
        return [
            {
                header: '名称',
                flex: 1,
                sortable: true,
                dataIndex: 'name',
                renderer: Ext.bind(me.renderName, me)
            },
            // {
            //     header: '审批流程名称',
            //     flex: 1,
            //     sortable: true,
            //     dataIndex: 'pdName'
            // },
            {
                header: '开始日期',
                flex: 1,
                sortable: true,
                dataIndex: 'createTime'
            },{
                header: '任务来源',
                flex: 1,
                sortable: true,
                dataIndex: 'currentNodeInfo'
            }
        ];
    },

    renderName: function(value, p, record) {
        var me = this;
        var recordId = record.getId();
        // 使用定制名称替换默认任务名称
        var val = record.raw.cutomName ? record.raw.cutomName : value;
        return '<span href="javascript:;" class="taskSpan" onclick="OrientTdm.HomePage.homePageShow.AuditTaskPortal.showDetail(\'' + me.getId() + '\'' + ',\'' + recordId + '\');">' + val + '</span>';
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
    },

    afterInitComponent: function () {
        var me = this;
        me.selModel = {};
        me.selType = "rowmodel";//不添加复选框
        me.store.getProxy().setExtraParam('start', 0);
        me.store.getProxy().setExtraParam('limit', msgPageCnt);
    }
});