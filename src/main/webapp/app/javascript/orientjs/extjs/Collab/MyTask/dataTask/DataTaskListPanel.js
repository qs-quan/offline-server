/**
 * Created by mengbin on 16/8/28.
 */
Ext.define('OrientTdm.Collab.MyTask.dataTask.DataTaskListPanel', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.dataTaskListPanel',
    requires: [
        "OrientTdm.Collab.MyTask.dataTask.model.DataTaskListModel",
        "OrientTdm.Collab.MyTask.util.PanelDisplayHelper"
    ],
    statics:{
        showDetail:function(itemId,recordId) {
            var record = Ext.getCmp(itemId).getStore().getById(recordId);

            var detailPanel = Ext.create("OrientTdm.Collab.MyTask.dataTask.DataTaskDetailPanel", {
                title: "数据任务[" + record.data.taskName + "]详情",
                closable: true,
                dataTaskId: record.data.id,
                modelId: record.data.taskmodelid,
                dataId: record.data.dataid,
                taskName: record.data.taskName
            });
            MyTaskPanelDisplayHelper.showInMainTab(detailPanel);
        }
    },
    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            features : [{
                id : 'group',
                ftype : 'grouping',
                groupHeaderTpl : '{name}',
                hideGroupedHeader: true,
                enableGroupingMenu : false
            }]
        });
        this.callParent(arguments);

        me.initEvents();
        //me.on("cellclick", me.cellClickListener, me);
        me.on("actionShowDetail",me.actionShowDetail,me);
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
            model: 'OrientTdm.Collab.MyTask.dataTask.model.DataTaskListModel',
            groupField:'group',
            proxy: {
                type: 'ajax',
                api: {
                    "read": serviceName + "/myTask/dataTasks/currentUser.rdm"
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

        return [
            {
                header: '分组',
                width: 180,
                sortable: true,
                dataIndex: 'group'
            },
            {
                header: '任务名称',
                flex : 1,
                sortable: true,
                dataIndex: 'taskName',
                renderer: Ext.bind(me.renderName, me)
            },
            {
                header: '创建时间',
                width: 180,
                sortable: true,
                dataIndex: 'createtime',
                renderer:function(value){
                    return Ext.util.Format.dateRenderer('Y-m-d H:i:s')(new Date(value))
                }
            },
            {
                xtype: 'actioncolumn',
                header: '操作',
                width: 180,
                dataIndex: 'status',
                items: [{
                    iconCls: 'icon-takeTask',
                    tooltip: '接受数据任务',
                    handler: function (grid, rowIndex, colIndex, item, e, record) {

                        var param = {
                            dataTaskId: record.data.id,
                            dataId: record.data.dataid,
                            modelId: record.data.taskmodelid
                        };
                        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/dataTask/take.rdm', param, false, function (response) {
                            var respJson = response.decodedData;

                            if (respJson.success) {
                                record.data.taskstate = 'accepted';
                                grid.fireEvent("actionShowDetail", me.getId(),record.getId());
                            }
                            else {

                            }
                        });
                    },
                    isDisabled: function (view, rowIndex, colIndex, item, record) {
                        if (record.data.taskstate == 'accepted') {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }, {}, {}, {
                    iconCls: 'icon-taskprocess',
                    tooltip: '处理数据任务',
                    handler: function (grid, rowIndex, colIndex, item, e, record) {
                        grid.fireEvent("actionShowDetail", me.getId(),record.getId());
                    },
                    isDisabled: function (view, rowIndex, colIndex, item, record) {
                        if (record.data.taskstate == 'accepted') {
                            return false;
                        } else {
                            return true;
                        }
                    }
                }]
            }
        ];
    },
    actionShowDetail:function(itemId,recordId) {//代替cellClick
        var record = Ext.getCmp(itemId).getStore().getById(recordId);

        var detailPanel = Ext.create("OrientTdm.Collab.MyTask.dataTask.DataTaskDetailPanel", {
            title: "数据任务[" + record.data.taskName + "]详情",
            closable: true,
            dataTaskId: record.data.id,
            modelId: record.data.taskmodelid,
            dataId: record.data.dataid,
            taskName: record.data.taskName
        });
        MyTaskPanelDisplayHelper.showInMainTab(detailPanel);
    },
    cellClickListener: function (table, td, cellIndex, record, tr, rowIndex, e, eopts) {
        if (cellIndex !== 1 && 'take' !== eopts) {
            return;
        }
        var detailPanel = Ext.create("OrientTdm.Collab.MyTask.dataTask.DataTaskDetailPanel", {
            title: "数据任务[" + record.data.taskName + "]详情",
            closable: true,
            dataTaskId: record.data.id,
            modelId: record.data.taskmodelid,
            dataId: record.data.dataid,
            taskName: record.data.taskName
        });
        MyTaskPanelDisplayHelper.showInMainTab(detailPanel);
    },
    renderName: function (value, p, record) {
        var me = this;
        var recordId = record.getId();
        return '<span href="javascript:;" class="taskSpan" onclick="OrientTdm.Collab.MyTask.dataTask.DataTaskListPanel.showDetail(\''+me.getId()+'\''+',\''+recordId+'\');">'+value+'</span>';
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