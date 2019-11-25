/**
 * Created by enjoy on 2016/4/30 0030.
 */
Ext.define('OrientTdm.BackgroundMgr.Statistic.ChartConfig.ChartInstanceList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.chartInstanceList',
    requires: [
        'OrientTdm.BackgroundMgr.Statistic.ChartConfig.Model.ChartInstanceExtModel',
        'OrientTdm.BackgroundMgr.Statistic.ChartConfig.Common.ChartInstanceForm'
    ],
    config: {
        belongChartTypeId: ''
    },
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        this.addEvents('filterByTypeId', 'filterByFilter');
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'filterByTypeId', me.filterByTypeId, me);
        me.mon(me, 'filterByFilter', me.filterByFilter, me);
    },
    //视图初始化
    createToolBarItems: function () {
        var me = this;
        var updateConfig = {
            title: '修改图形实例',
            height: 0.12 * globalHeight,
            width: 0.5 * globalWidth,
            formConfig: {
                formClassName: 'OrientTdm.BackgroundMgr.Statistic.ChartConfig.Common.ChartInstanceForm',
                appendParam: function () {
                    return {
                        bindModelName: 'CF_CHART_INSTANCE',
                        actionUrl: serviceName + '/StatisticChartInstance/update.rdm',
                        originalData: this.getSelectedData()[0],
                        successCallback: function () {
                            me.fireEvent('refreshGrid');
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
            handler: me.customCreate
        }, {
            iconCls: 'icon-delete',
            text: '批量删除',
            disabled: false,
            itemId: 'delete',
            scope: this,
            handler: this.onDeleteClick
        }];
        me.actionItems = [{
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
        }];
        return retVal;
    },
    createColumns: function () {
        return [
            {
                header: '名称',
                width: 150,
                sortable: true,
                dataIndex: 'name',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '图形前端处理类',
                flex: 1,
                sortable: true,
                dataIndex: 'handler',
                filter: {
                    type: 'string'
                }
            }
        ];
    },
    createStore: function () {
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.BackgroundMgr.Statistic.ChartConfig.Model.ChartInstanceExtModel',
            proxy: {
                type: 'ajax',
                api: {
                    'read': serviceName + '/StatisticChartInstance/list.rdm',
                    'create': serviceName + '/StatisticChartInstance/create.rdm',
                    'update': serviceName + '/StatisticChartInstance/update.rdm',
                    'delete': serviceName + '/StatisticChartInstance/delete.rdm'
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
    filterByTypeId: function (belongChartTypeId) {
        this.setBelongChartTypeId(belongChartTypeId);
        this.getStore().getProxy().setExtraParam('belongChartTypeId', belongChartTypeId);
        this.getStore().load({
            page: 1
        });
    },
    filterByFilter: function (filter) {
        var me = this;
        for (var proName in filter) {
            this.getStore().getProxy().setExtraParam(proName, filter[proName]);
        }
        this.getStore().getProxy().setExtraParam('belongChartTypeId', me.belongChartTypeId);
        this.getStore().loadPage(1);
    },
    customCreate: function () {
        var me = this;
        var addConfig = {
            title: '新增图形实例',
            height: 0.12 * globalHeight,
            width: 0.5 * globalWidth,
            formConfig: {
                formClassName: 'OrientTdm.BackgroundMgr.Statistic.ChartConfig.Common.ChartInstanceForm',
                appendParam: function () {
                    return {
                        bindModelName: 'CF_CHART_INSTANCE',
                        originalData: {
                            belongChartTypeId: me.getBelongChartTypeId()
                        },
                        actionUrl: serviceName + '/StatisticChartInstance/create.rdm',
                        successCallback: function (resp, callBackArguments) {
                            me.fireEvent('refreshGrid');
                            if (callBackArguments) {
                                this.up('window').close();
                            }
                        }
                    }
                }
            }
        };
        me.onCreateClick.call(me, addConfig);
    },
    onPreviewClick: function () {
        var me = this;
        var selectRecord = OrientExtUtil.GridHelper.getSelectedRecord(me)[0];
        var item = Ext.create(selectRecord.get('handler'));
        OrientExtUtil.WindowHelper.createWindow(item, {
            title: '预览',
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
    }
});