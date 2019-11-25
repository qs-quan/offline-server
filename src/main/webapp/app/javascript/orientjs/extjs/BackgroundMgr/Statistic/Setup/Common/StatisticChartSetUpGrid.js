/**
 * Created by panduanduan on 06/04/2017.
 */
Ext.define('OrientTdm.BackgroundMgr.Statistic.Setup.Common.StatisticChartSetUpGrid', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.statisticChartSetUpGrid',
    config: {
        belongStatisSetUpId: ''
    },
    requires: [
        'OrientTdm.BackgroundMgr.Statistic.Setup.Model.StatisticChartExtModel',
        'OrientTdm.BackgroundMgr.Statistic.ChartConfig.ChartConfigMainPanel'
    ],
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    usePage: false,
    initComponent: function () {
        var me = this;
        me.cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 2
        });
        Ext.apply(me, {
            plugins: [me.cellEditing]
        });
        me.callParent(arguments);
    },
    //视图初始化
    createToolBarItems: function () {
        var me = this;
        var retVal = [{
            iconCls: 'icon-create',
            text: '新增',
            itemId: 'create',
            scope: this,
            handler: me.createChart
        }, {
            iconCls: 'icon-delete',
            text: '批量删除',
            disabled: false,
            itemId: 'delete',
            scope: this,
            handler: this.onDeleteClick
        }, '->', {
            xtype: 'tbtext',
            text: '<span style="color: red">★所在列可双击编辑</span>'
        }];
        me.actionItems.push(retVal[1], {
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
                header: '所属图形实例(★)',
                width: 150,
                sortable: true,
                dataIndex: 'belongStaticChartInstanceName',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '图形标题(★)',
                sortable: true,
                dataIndex: 'title',
                filter: {
                    type: 'string'
                },
                editor: {
                    xtype: 'textfield'
                }
            }, {
                header: '自定义前端处理器(★)',
                flex: 1,
                sortable: true,
                dataIndex: 'customHandler',
                filter: {
                    type: 'string'
                },
                editor: {
                    xtype: 'textfield'
                }
            }, {
                header: '数据前处理器(★)',
                flex: 1,
                sortable: true,
                dataIndex: 'preProcessor',
                filter: {
                    type: 'string'
                },
                editor: {
                    xtype: 'orientComboBox',
                    remoteUrl: serviceName + '/StatisticSetUp/getStatisticPreProcessor.rdm'
                }
            }
        ];
    },
    createStore: function () {
        var me = this;
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.BackgroundMgr.Statistic.Setup.Model.StatisticChartExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    'read': serviceName + '/StatisticChartSetUp/list.rdm',
                    'create': serviceName + '/StatisticChartSetUp/create.rdm',
                    'update': serviceName + '/StatisticChartSetUp/update.rdm',
                    'delete': serviceName + '/StatisticChartSetUp/delete.rdm'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                },
                extraParams: {
                    belongStatisSetUpId: me.belongStatisSetUpId
                }
            }
        });
        this.store = retVal;
        return retVal;
    }
    ,
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'celldblclick', me.celldblclick, me);

    }
    ,
    onPreviewClick: function () {

    }
    ,
    createChart: function () {
        var me = this;
        var store = me.getStore();
        var record = Ext.create('OrientTdm.BackgroundMgr.Statistic.Setup.Model.StatisticChartExtModel', {
            title: '图形标题',
            preProcessor: 'defaultStatisticPerProcessor'
        });
        store.insert(0, record);
    }
    ,
    celldblclick: function (view, td, cellIndex, record, tr, rowIndex) {
        var me = this;
        var belongGrid = view.up('statisticChartSetUpGrid');
        //exists action columns
        var clickedColumn = belongGrid.columns[cellIndex - 1];
        var clickedcolumnIndex = clickedColumn.dataIndex;
        if ('belongStaticChartInstanceName' == clickedcolumnIndex) {
            //类型选择器
            me._popSelectChartWin(record);
            return false;
        }
    }
    ,
    _popSelectChartWin: function (record) {
        var item = Ext.create('OrientTdm.BackgroundMgr.Statistic.ChartConfig.ChartConfigMainPanel');
        OrientExtUtil.WindowHelper.createWindow(item, {
            title: '选择图形实例',
            buttons: [
                {
                    text: '保存',
                    iconCls: 'icon-save',
                    handler: function () {
                        var grid = item.down('chartInstanceList');
                        if (OrientExtUtil.GridHelper.hasSelectedOne(grid)) {
                            var selectedRecord = OrientExtUtil.GridHelper.getSelectedRecord(grid)[0];
                            record.set('belongStaticChartInstanceName', selectedRecord.get('name'));
                            record.set('belongStaticChartInstanceId', selectedRecord.get('id'));
                            this.up('window').close();
                        }
                    }
                },
                {
                    text: '关闭',
                    iconCls: 'icon-close',
                    handler: function () {
                        this.up('window').close();
                    }
                }
            ]
        }, 800, 600);
    }
    ,
    onDeleteClick: function () {
        var me = this;
        var store = me.getStore();
        if (OrientExtUtil.GridHelper.hasSelected(me)) {
            var selectRecords = OrientExtUtil.GridHelper.getSelectedRecord(me);
            store.remove(selectRecords);
        }
    }
});