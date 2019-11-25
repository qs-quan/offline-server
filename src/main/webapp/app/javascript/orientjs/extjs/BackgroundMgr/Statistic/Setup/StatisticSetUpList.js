/**
 * Created by enjoy on 2016/4/6 0006.
 */
Ext.define('OrientTdm.BackgroundMgr.Statistic.Setup.StatisticSetUpList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.statisticSetUpList',
    requires: [
        'OrientTdm.BackgroundMgr.Statistic.Setup.Model.StatisticExtModel',
        'OrientTdm.BackgroundMgr.Statistic.Setup.Common.StatisticSetUpForm'
    ],
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    usePage: true,
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
    },
    //视图初始化
    createToolBarItems: function () {
        var me = this;
        var addConfig = {
            title: '新增统计设置',
            height: 0.8 * globalHeight,
            width: 0.8 * globalWidth,
            formConfig: {
                formClassName: 'OrientTdm.BackgroundMgr.Statistic.Setup.Common.StatisticSetUpForm',
                appendParam: function () {
                    return {
                        actionUrl: me.store.getProxy().api['create'],
                        successCallback: function (resp, callBackArguments) {
                            me.fireEvent('refreshGrid');
                            me._saveRefChart(resp.results, this);
                            if (callBackArguments) {
                                this.up('window').close();
                            }
                        }
                    }
                }
            }
        };

        var updateConfig = {
            title: '修改统计设置',
            height: 0.8 * globalHeight,
            width: 0.8 * globalWidth,
            formConfig: {
                formClassName: 'OrientTdm.BackgroundMgr.Statistic.Setup.Common.StatisticSetUpForm',
                appendParam: function () {
                    return {
                        actionUrl: me.store.getProxy().api['update'],
                        originalData: this.getSelectedData()[0],
                        successCallback: function (resp) {
                            me.fireEvent('refreshGrid');
                            me._saveRefChart(this.originalData.get('id'), this);
                            this.up('window').close();
                        }
                    }
                }
            }
        };

        var retVal = [{
            iconCls: 'icon-create',
            text: '新增',
            itemId: 'create',
            scope: this,
            handler: Ext.bind(me.onCreateClick, me, [addConfig], false)
        }, {
            iconCls: 'icon-delete',
            text: '批量删除',
            disabled: false,
            itemId: 'delete',
            scope: this,
            handler: this.onDeleteClick
        }];
        me.actionItems.push({
            iconCls: 'icon-update',
            text: '修改',
            itemId: 'update',
            scope: this,
            handler: Ext.bind(me.onUpdateClick, me, [updateConfig], false)
        }, retVal[1], {
            iconCls: 'icon-preview',
            text: '预览',
            itemId: 'preview',
            scope: this,
            handler: me.onPreviewClick
        });
        return retVal;
    },
    createColumns: function () {
        return [
            {
                header: '统计名称',
                flex: 1,
                sortable: true,
                dataIndex: 'name',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '前处理',
                width: 300,
                sortable: true,
                dataIndex: 'preProcessing',
                filter: {
                    type: 'string'
                }
            }
        ];
    },
    createStore: function () {
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.BackgroundMgr.Statistic.Setup.Model.StatisticExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    'read': serviceName + '/StatisticSetUp/list.rdm',
                    'create': serviceName + '/StatisticSetUp/create.rdm',
                    'update': serviceName + '/StatisticSetUp/update.rdm',
                    'delete': serviceName + '/StatisticSetUp/delete.rdm'
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
    _saveRefChart: function (id, formPanle) {
        var me = this;
        var chartGrid = formPanle.up('window').down('statisticChartSetUpGrid');
        var store = chartGrid.getStore();
        var updateRecords = store.getUpdatedRecords();
        var createRecords = store.getNewRecords();
        var removeRecords = store.getRemovedRecords();
        var toSyncData = {
            update: [],
            create: [],
            remove: []
        };

        Ext.each(updateRecords, function (recored) {
            recored.data.belongStatisSetUpId = id;
            toSyncData.update.push(recored.data);
        });

        Ext.each(createRecords, function (recored) {
            recored.data.belongStatisSetUpId = id;
            toSyncData.create.push(recored.data);
        });

        Ext.each(removeRecords, function (recored) {
            recored.data.belongStatisSetUpId = id;
            toSyncData.remove.push(recored.data);
        });

        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/StatisticChartSetUp/doSyncChartSetUp.rdm', toSyncData, true, function () {

        }, true, me);
    },
    onPreviewClick: function () {
        var me = this;
        var selectId = OrientExtUtil.GridHelper.getSelectRecordIds(me)[0];
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/StatisticSetUp/doStatisic.rdm', {
            statisticId: selectId
        }, true, function (resp) {
            var panelItems = [];
            var respData = resp.decodedData.results;
            //get char info
            var charts = respData.statisticEntity.charts;
            Ext.each(charts, function (chart) {
                var chartFrontHandler = chart.customHandler || chart.belongStatisticChartInstanceHandler;
                Ext.require(chartFrontHandler);
                var chartId = chart.id;
                var chartResult = respData.chartResultMap[chartId];
                if (chartId && chartResult) {
                    var chartItem = Ext.create(chartFrontHandler, {
                        chartData: chartResult,
                        chartSet: chart,
                        purpose: 'realData'
                    });
                    panelItems.push(chartItem);
                }

            });
            OrientExtUtil.WindowHelper.createWindow(panelItems, {
                title: '预览',
                autoScroll: true,
                buttons: [
                    {
                        text: '关闭',
                        iconCls: 'icon-close',
                        handler: function () {
                            this.up('window').close();
                        }
                    }
                ]
            });
        });
    }
});