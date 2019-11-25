/**
 * 查询矩阵数据的面板
 * Created by GNY on 2018/6/8
 */
Ext.define('OrientTdm.Mongo.Query.QueryConditionInputGrid', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.matrixDataQueryConditionInputGrid',
    config: {
        originalGrid: null,
        originalGridColumns: null,
        modelId: null,
        dataId: null,
        tabName: null,
        showVersionId: null,
        queryUrl: null
    },
    initComponent: function () {
        var me = this;
        var columns = me.createColumns();
        var store = Ext.create('Ext.data.Store', {
            fields: ['conditionRelation', 'columnName', 'operation', 'compareValue'],
            data: null
        });

        var toolbar = me.createToolbar();

        var editQueryConditionGrid = Ext.create('Ext.grid.Panel', {
            region: 'center',
            tbar: toolbar,
            plugins: [
                new Ext.grid.plugin.CellEditing({
                    clicksToEdit: 2
                })
            ],
            selModel: {
                mode: 'MULTI'
            },
            selType: 'checkboxmodel',
            columns: columns,
            store: store
        });

        Ext.apply(me, {
            layout: 'border',
            items: [editQueryConditionGrid],
            grid: editQueryConditionGrid
        });

        me.renderGrid(editQueryConditionGrid.columns);
        me.callParent(arguments);

    },
    createColumns: function () {
        var me = this;
        var originalGridColumns = me.originalGridColumns;
        var originalColumnNameArray = [];
        for (var i = 0; i < originalGridColumns.length; i++) {
            originalColumnNameArray.push(
                {
                    'displayField': originalGridColumns[i].dataIndex,
                    'value': originalGridColumns[i].dataIndex
                });
        }
        return [
            {
                header: '条件连接符号',
                dataIndex: 'conditionRelation',
                flex: 1,
                editor: {
                    xtype: 'combo',
                    editable: false,
                    triggerAction: 'all',
                    displayField: 'relationField',
                    valueField: 'relationValue',
                    queryMode: 'local',
                    store: {
                        fields: ['relationField', 'relationValue'],
                        proxy: {
                            type: 'memory',
                            data: [
                                {relationField: '并且', relationValue: '$and'},
                                {relationField: '或者', relationValue: '$or'}
                            ],
                            reader: 'json'
                        },
                        autoLoad: true
                    }
                }
            },
            {
                header: '列名',
                dataIndex: 'columnName',
                flex: 1,
                itemId: 'addColumnName',
                editor: {  //列名选择框
                    xtype: 'combo',
                    editable: false,
                    triggerAction: 'all',
                    displayField: 'displayField',
                    valueField: 'value',
                    queryMode: 'local',
                    store: {
                        fields: ['displayField', 'value'],
                        proxy: {
                            type: 'memory',
                            data: originalColumnNameArray,
                            reader: 'json'
                        },
                        autoLoad: true
                    }
                }
            },
            {
                header: '比较符号',
                dataIndex: 'operation',
                flex: 1,
                editor: {  //操作符选择下拉框
                    xtype: 'combo',
                    editable: false,
                    triggerAction: 'all',
                    displayField: 'operationField',
                    valueField: 'operationValue',
                    queryMode: 'local',
                    store: {
                        fields: ['operationField', 'operationValue'],
                        proxy: {
                            type: 'memory',
                            data: [
                                {operationField: '=', operationValue: '$eq'},
                                {operationField: '<', operationValue: '$lt'},
                                {operationField: '>', operationValue: '$gt'},
                                {operationField: '<=', operationValue: '$lte'},
                                {operationField: '>=', operationValue: '$gte'}
                            ],
                            reader: 'json'
                        },
                        autoLoad: true
                    }
                }
            },
            {
                header: '比较值',
                dataIndex: 'compareValue',
                flex: 1,
                editor: {
                    xtype: 'textfield',
                    emptyText: '请输入比较值'
                }
            }
        ];
    },
    createToolbar: function () {
        var me = this;
        return Ext.create('Ext.toolbar.Toolbar', {
            items: [
                {
                    iconCls: 'icon-create',
                    text: '新增',
                    handler: function () {
                        me.addRow();
                    }
                },
                {
                    iconCls: 'icon-delete',
                    text: '删除',
                    handler: function () {
                        me.deleteRow();
                    }
                },
                {
                    iconCls: 'icon-query',
                    text: '开始查询',
                    handler: function () {
                        me.startQuery();
                    }
                },
                {
                    iconCls: 'icon-close',
                    text: '关闭',
                    handler: function () {
                        me.up('window').close();
                    }
                },
                '->', {
                    xtype: 'tbtext',
                    style: 'color:red',
                    text: '双击单元格即可编辑',
                    iconCls: 'x-status-error'
                }
            ]
        })
    },
    addRow: function () {
        var me = this;
        var grid = me.grid;
        var store = grid.store;
        var record = {
            columnName: me.originalGridColumns[0].dataIndex,
            operation: '$eq',
            compareValue: 0,
            conditionRelation: '$and'
        };
        store.insert(store.getCount(), record);
    },
    deleteRow: function () {
        var me = this;
        var grid = me.grid;
        var store = grid.store;
        store.remove(OrientExtUtil.GridHelper.getSelectedRecord(grid));
    },
    renderGrid: function (columns) {
        for (var i = 0; i < columns.length; i++) {
            var column = columns[i];
            if (i == 2) {
                column.renderer = function (val) {
                    switch (val) {
                        case '$lt':
                            return '<';
                        case '$eq':
                            return '=';
                        case '$gt':
                            return '>';
                        case '$gte':
                            return '>=';
                        case '$lte':
                            return '<=';
                        default :
                            break;
                    }
                }
            } else if (i == 0) {
                column.renderer = function (val) {
                    switch (val) {
                        case '$and':
                            return '并且';
                        case '$or':
                            return '或者';
                        default :
                            break;
                    }
                }
            }
        }
    },
    startQuery: function () {
        var me = this;
        var grid = me.grid;
        var store = grid.store;
        var items = store.data.items;
        if (items.length == 0) {
            OrientExtUtil.Common.err(OrientLocal.prompt.info, '请至少添加一条查询条件');
            return;
        }
        var queryObj = {};
        var filterJson;
        for (var i = 0; i < items.length; i++) {
            var record = items[i].data;
            var filterName = record['columnName'];
            var operation = record['operation'];
            var filterValue = parseFloat(record['compareValue']);
            var relation = record['conditionRelation'];
            //如果查询条件有不完整的，提示用户补充条件
            if (!filterName || !operation || !filterValue) {
                OrientExtUtil.Common.err(OrientLocal.prompt.info, '查询条件不完整，请补充完整后再进行查询');
            } else {
                //临时对象，用于中间转换
                var temObj = {};
                var arr = [];
                var obj = {};
                var obj1 = {};
                temObj[relation] = arr;
                obj[filterName] = obj1;
                obj1[operation] = filterValue;
                arr.push(obj);
                if (i > 0) {
                    arr.push(queryObj);
                }
                queryObj = temObj;
            }
        }
        filterJson = JSON.stringify(queryObj);
        //把filterJson当做条件重新查询数据，刷新上一层grid，关闭查询面板
        var params = {
            modelId: me.modelId,
            dataId: me.dataId,
            tabName: me.tabName,
            filterJson: filterJson
        };

        var matrixDataGrid = me.originalGrid;
        matrixDataGrid.filterJson = filterJson;
        var matrixDataGridStore = matrixDataGrid.getStore();
        matrixDataGridStore.proxy.extraParams = params;
        matrixDataGridStore.load();
        me.up('window').close();
        /* OrientExtUtil.AjaxHelper.doRequest(serviceName + me.queryUrl, params, false, function (resp) {
         if (resp.decodedData.success) {
         var gridInfo = resp.decodedData.results;

         var result = GridDataHandler.gridShow.dataHandle(gridInfo);
         store.loadData(result.datas);

         }
         });*/
    }
});