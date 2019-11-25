/**
 * Created by enjoy on 2016/4/6 0006.
 */
Ext.define('OrientTdm.BackgroundMgr.Quantity.Instance.QuantityInstanceList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.quantityInstanceList',
    requires: [
        'OrientTdm.BackgroundMgr.Quantity.Instance.Model.QuantityInstanceExtModel',
        'OrientTdm.BackgroundMgr.Quantity.Template.QuantityTemplateDashBord',
        'OrientTdm.BackgroundMgr.Quantity.Meta.QuantityDashBord',
        'OrientTdm.BackgroundMgr.Quantity.Instance.ChooseEndPointFormPanel'
    ],
    config: {
        modelId: '',
        dataId: '',
        readOnly: false,
        isHistory: false
    },
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
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'celldblclick', me._celldblclick, me);
    },
    //视图初始化
    createToolBarItems: function () {
        var me = this;
        var retVal = [
            {
                text: '从模板导入',
                iconCls: 'icon-import',
                scope: me,
                handler: me._importFromTemplate
            },
            {
                text: '手动导入',
                iconCls: 'icon-add',
                scope: me,
                handler: me._importByManual
            }, {
                iconCls: 'icon-delete',
                text: '批量删除',
                disabled: false,
                itemId: 'delete',
                scope: this,
                handler: this.onDeleteClick
            }, {
                iconCls: 'icon-export',
                text: '导出采集设置',
                disabled: false,
                itemId: 'export',
                scope: this,
                handler: this._exportWithOds
            }
        ];
        retVal.push('->', {
            xtype: 'tbtext',
            text: '<span style="color: red">★所在列可双击编辑</span>'
        });
        me.actionItems.push(retVal[2]);
        return retVal;
    },
    createColumns: function () {
        var me = this;
        var editMarker = me.readOnly == true ? '' : '(★)';
        return [
            {
                header: '测试变量名称',
                flex: 1,
                sortable: true,
                dataIndex: 'quantityName',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '测试变量类型',
                width: 150,
                sortable: true,
                dataIndex: 'quantityDataType',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '单位' + editMarker,
                width: 150,
                sortable: true,
                dataIndex: 'unitName',
                filter: {
                    type: 'string'
                },
                editor: {
                    xtype: 'textfield'
                }
            }
        ];
    },
    createStore: function () {
        var me = this;
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.BackgroundMgr.Quantity.Instance.Model.QuantityInstanceExtModel',
            autoLoad: true,
            listeners: {
                beforeLoad: function (store) {
                    store.getProxy().setExtraParam("modelId", me.modelId);
                    store.getProxy().setExtraParam("dataId", me.dataId);
                }
            }
        });
        this.store = retVal;
        return retVal;
    },
    _importFromTemplate: function () {
        var me = this;
        var templateGrid = Ext.create('OrientTdm.BackgroundMgr.Quantity.Template.QuantityTemplateDashBord');
        OrientExtUtil.WindowHelper.createWindow(templateGrid, {
            title: '从模板导入',
            buttons: [
                {
                    text: '导入',
                    iconCls: 'icon-save',
                    handler: function () {
                        var btn = this;
                        var grid = this.up('window').down('quantityTemplateList');
                        if (OrientExtUtil.GridHelper.hasSelected(grid)) {
                            var ids = OrientExtUtil.GridHelper.getSelectRecordIds(grid);
                            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/QuantityInstance/createByTemplate.rdm', {
                                templateIds: ids,
                                modelId: me.modelId,
                                dataId: me.dataId
                            }, true, function () {
                                me.fireEvent('refreshGrid');
                                btn.up('window').close();
                            });
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
        });
    },
    _importByManual: function () {
        var me = this;
        var existIds = [];
        me.getStore().each(function (record) {
            existIds.push(record.get('quantityId'));
        });
        var templateGrid = Ext.create('OrientTdm.BackgroundMgr.Quantity.Meta.QuantityDashBord', {
            queryUrl: serviceName + '/Quantity/list.rdm?excludeIds=' + existIds.join(','),
            canOperate: false
        });
        OrientExtUtil.WindowHelper.createWindow(templateGrid, {
            title: '手动导入',
            buttons: [
                {
                    text: '导入',
                    iconCls: 'icon-save',
                    handler: function () {
                        var btn = this;
                        var grid = this.up('window').down('quantityList');
                        if (OrientExtUtil.GridHelper.hasSelected(grid)) {
                            var ids = OrientExtUtil.GridHelper.getSelectRecordIds(grid);
                            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/QuantityInstance/createByManual.rdm', {
                                quantityIds: ids,
                                modelId: me.modelId,
                                dataId: me.dataId
                            }, true, function () {
                                me.fireEvent('refreshGrid');
                                btn.up('window').close();
                            });
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
        });
    },
    _exportWithOds: function () {
        var me = this;
        Ext.create('OrientTdm.BackgroundMgr.Quantity.Instance.ChooseEndPointFormPanel', {
            modelId: me.modelId,
            dataId: me.dataId
        });
    },
    _celldblclick: function (view, td, cellIndex, record, tr, rowIndex) {
        var me = this;
        if (me.isHistory == true) {
            //历史数据只能查看 不可修改
            return false;
        }
        if (me.readOnly == true) {
            //只读数据
            return false;
        }
        var belongGrid = view.up('quantityInstanceList');
        var clickedColumn = belongGrid.columns[cellIndex - 1];
        if (clickedColumn) {
            var clickedcolumnIndex = clickedColumn.dataIndex;
            if ('unitName' == clickedcolumnIndex) {
                //类型选择器
                me._popUnitSelectorSelectorWin(record);
                return false;
            }
        }
    },
    _popUnitSelectorSelectorWin: function (record) {
        var me = this;
        var selectWin = Ext.create('OrientTdm.BackgroundMgr.Quantity.Unit.DataUnitSelectorWin', {
            afterSelected: function (unitInfo) {
                for (var key in unitInfo) {
                    record.set(key, unitInfo[key]);
                }
                if (record.dirty) {
                    record.save({
                        success: function (record, opt) {
                            record.commit();
                        },
                        failure: function (e, op) {
                            record.reject();
                            OrientExtUtil.Common.err(OrientLocal.prompt.error, op.error);
                        }
                    });
                }
            }
        });
        selectWin.show();
    }
});