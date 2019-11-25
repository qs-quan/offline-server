/**
 * 自己发起的审批任务磁贴
 */
Ext.define('OrientTdm.HomePage.homePageShow.MineAuditTaskPortal', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    requires: [
        "OrientTdm.Collab.MyTask.mineAuditTask.MineAuditFlowTaskModel",
        "OrientTdm.Collab.MyTask.util.PanelDisplayHelper",
        'OrientTdm.Collab.MyTask.util.HisTaskHelper'
    ],
    usePage: false,
    statics:{
        showDetail:function(itemId, recordId) {
            var record = Ext.getCmp(itemId).getStore().getById(recordId);
            var detailPanel = Ext.create("OrientTdm.Collab.MyTask.mineAuditTask.MineAuditTaskDetailPanel",{
                title: "我发起的审批任务[" + record.data.name + "]详情",
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
       // me.usePage = false;
        this.callParent(arguments);
        me.initEvents();
        this.addEvents('filterByFilter');
    },

    initEvents: function () {
        var me = this;
        me.callParent();
        //me.mon(me, 'filterByFilter', me.filterByFilter, me);
    },

    createStore: function () {
        var retVal = Ext.create("Ext.data.Store", {
            autoLoad: true,
            model: 'OrientTdm.Collab.MyTask.mineAuditTask.MineAuditFlowTaskModel',
            proxy: {
                type: 'ajax',
                api: {
                    "read": "MineTaskController/myList.rdm"
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
        return [{
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
                header: '开始时间',
                flex : 1,
                sortable: true,
                dataIndex: 'createTime'
        }];
    },

    renderName: function(value, p, record) {
        var me = this;
        return '<span href="javascript:;" class="taskSpan" onclick="OrientTdm.HomePage.homePageShow.MineAuditTaskPortal.showDetail(\'' + me.getId() + '\'' + ',\'' + record.getId() + '\');">' + value + '</span>';
    }

    /*filterByFilter: function (filter) {
        for (var proName in filter) {
            var proValue = filter[proName];
            if (proName === 'startDate' || proName === 'endDate') {
                proValue = proValue.replace(/[年月日]/g, '-');
                proValue = proValue.substr(0 ,proValue.length-1);
            }
            this.getStore().getProxy().setExtraParam(proName, proValue);
        }
        this.getStore().loadPage(1);
    },*/

    /*afterInitComponent: function () {
        var me = this;
        me.selModel = {};
        me.selType = "rowmodel";//不添加复选框
        me.store.getProxy().setExtraParam('start', 0);
        me.store.getProxy().setExtraParam('limit', msgPageCnt);
    }*/

});