/**
 * Created by enjoy on 2016/4/6 0006.
 */
Ext.define('OrientTdm.Collab.ProjectMng.mainFrame.ProjectList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.projectList',
    requires: [
        'OrientTdm.Collab.ProjectMng.mainFrame.model.ProjectGridModel'
    ],
    config: {
        dirId: ''
    },
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    usePage: false,
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
    },
    //视图初始化
    createToolBarItems: function () {
        var me = this;
        return [{
            xtype: 'datefield',
            id: 'startDate',
            emptyText: '项目开始时间'
        },{
            xtype: 'datefield',
            id: 'endDate',
            emptyText: '项目结束时间'
        },{
            text : "统计",
            iconCls: 'icon-query',
            itemId: 'query',
            handler:function () {
                var startDate = Ext.getCmp('startDate').value;
                if(startDate != undefined){
                    startDate = new Date(startDate).getTime();
                }
                var endDate = Ext.getCmp('endDate').value;
                if(endDate != undefined){
                    endDate = new Date(endDate).getTime();
                }
                if(startDate > endDate){
                    OrientExtUtil.Common.info("项目时间", "项目结束时间不能大于开始时间");
                    return;
                }
                me._showStatisticsList(startDate, endDate);
            }
        }];
    },
    createColumns: function () {
        return [
            {
                header: '项目名称',
                width: 150,
                sortable: true,
                dataIndex: 'name',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '项目状态',
                width: 100,
                sortable: true,
                dataIndex: 'status',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '项目负责人',
                width: 100,
                sortable: true,
                dataIndex: 'principal',
                filter: {
                    type: 'string'
                }
            }, {
                header: '计划开始时间',
                flex: 1,
                sortable: true,
                dataIndex: 'plannedStartDate',
                filter: {
                    type: 'string'
                }
            }, {
                header: '计划结束时间',
                flex: 1,
                sortable: true,
                dataIndex: 'plannedEndDate',
                filter: {
                    type: 'string'
                }
            }, {
                header: '实际开始时间',
                flex: 1,
                sortable: true,
                dataIndex: 'actualStartDate',
                filter: {
                    type: 'string'
                }
            }, {
                header: '实际结束时间',
                flex: 1,
                sortable: true,
                dataIndex: 'actualEndDate',
                filter: {
                    type: 'string'
                }
            }
        ];
    },
    createStore: function () {
        var me = this;
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.Collab.ProjectMng.mainFrame.model.ProjectGridModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    'read': serviceName + '/projectTree/listPrjAsGrid.rdm'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                },
                extraParams: {
                    dirId: me.dirId
                }
            }
        });
        this.store = retVal;
        return retVal;
    },

    /**
     * 展示统计数据列表
     * @private
     */
    _showStatisticsList: function (startDate, endDate) {
        var me = this;
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TaskController/getPrjList.rdm', {
            startDate : startDate,
            endDate : endDate
        }, false, function (response) {
            var result = response.decodedData;

            if(result.success == true){
                var projectStatisticsList = Ext.create('OrientTdm.Collab.ProjectMng.mainFrame.ProjectStatisticsList',{
                    data : result.results,
                    startDate : startDate,
                    endDate : endDate
                });

                Ext.create('widget.window', {
                    itemId: "statisticsListWindow",
                    title: '项目统计信息',
                    width: 400,
                    autoHeight: true,
                    layout: 'fit',
                    modal: true,
                    items:[projectStatisticsList]
                }).show();
            }
        })
    }

});