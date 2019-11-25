/**
 * Created by enjoy on 2016/4/30 0030.
 */
Ext.define('OrientTdm.SysMgr.AccountStrategy.AccountStrategyList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.accountStrategyList',
    requires: [
        'Ext.grid.feature.Grouping',
        'OrientTdm.SysMgr.AccountStrategy.Model.AccountStrategyExtModel',
        'OrientTdm.SysMgr.AccountStrategy.Update.UpdateTimeStrategyForm'
    ],
    config: {},
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: function () {
        this.getSelectionModel().on('selectionchange', this._rowselect, this);
    },
    features: [{
        ftype: 'grouping',
        groupHeaderTpl: [
            '<div>{groupValue:this.formatName}</div>',
            {
                formatName: function (name) {
                    if ('0' == name) {
                        return '密码策略信息';
                    }
                    return '账户锁定信息';
                }
            }
        ],
        hideGroupedHeader: true,
        startCollapsed: false
    }],
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
    },
    //视图初始化
    createToolBarItems: function () {
        return [
            {
                iconCls: 'icon-start',
                text: '启用',
                disabled: false,
                itemId: 'start',
                scope: this,
                handler: this._onStartClick
            }, {
                iconCls: 'icon-close',
                text: '关闭',
                disabled: false,
                itemId: 'close',
                scope: this,
                handler: this._onCloseClick
            }
        ];
    },
    createColumns: function () {
        var me = this;
        return [
            {
                header: '策略名称',
                width: 200,
                sortable: true,
                dataIndex: 'strategyName'
            }, {
                header: '策略说明',
                flex: 1,
                sortable: true,
                dataIndex: 'strategyNote'
            },
            {
                header: '策略值',
                width: 150,
                dataIndex: 'strategyValue'
            },
            {
                header: '启用状态',
                width: 80,
                dataIndex: 'isUse',
                renderer: function (value) {
                    if (value == '0') {
                        return '关闭';
                    }
                    return '启用';
                }
            },
            {
                header: '编辑',
                xtype: 'actioncolumn',
                width: 50,
                items: [{
                    icon: 'app/images/icons/update.png',
                    tooltip: '编辑',
                    handler: function (grid, rowIndex, colIndex) {
                        var id = grid.store.getAt(rowIndex).get('id');
                        me.getSelectionModel().select(grid.store.getAt(rowIndex));
                        if (id == '9') {
                            var updateConfig = {
                                title: '修改策略值',
                                height: 100,
                                formConfig: {
                                    formClassName: 'OrientTdm.SysMgr.AccountStrategy.Update.UpdateTimeStrategyForm',
                                    appendParam: function () {
                                        return {
                                            bindModelName: 'CWM_SYS_ACCOUNT_STRATEGY',
                                            originalData: this.getSelectedData()[0],
                                            successCallback: function () {
                                                me.fireEvent('refreshGrid');
                                                this.up('window').close();
                                            }
                                        }
                                    }
                                }
                            };
                            me.onUpdateClick(updateConfig);
                        } else if (id == '2') {
                            OrientExtUtil.Common.tip(OrientLocal.prompt.info, '无需修改');
                        } else {
                            Ext.MessageBox.prompt('策略值', '请输入策略值:', function (btn, strategyValue) {
                                if ('yes' == btn) {
                                    if (Ext.isEmpty(strategyValue)) {
                                        OrientExtUtil.Common.err(OrientLocal.prompt.error, '请输入策略值');
                                    } else if (isNaN(strategyValue)) {
                                        OrientExtUtil.Common.err(OrientLocal.prompt.error, '请输入正确的数值');
                                    } else {
                                        me._saveStratehyValue(strategyValue, null, id);
                                    }
                                }
                            });
                        }
                    }
                }]
            }
        ];
    },
    createStore: function () {
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.SysMgr.AccountStrategy.Model.AccountStrategyExtModel',
            autoLoad: true,
            groupField: 'type',
            proxy: {
                type: 'ajax',
                api: {
                    'read': serviceName + '/AccountStrategy/list.rdm',
                    'create': serviceName + '/AccountStrategy/create.rdm',
                    'update': serviceName + '/AccountStrategy/update.rdm',
                    'delete': serviceName + '/AccountStrategy/delete.rdm'
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
    _rowselect: function (sm, records) {
        var statusArray = [];
        Ext.each(records, function (record) {
            var status = record.get('isUse');
            if (!Ext.Array.contains(statusArray, status)) {
                statusArray.push(status);
            }
        });
        //禁用按钮
        this.down('button[itemId=close]').setDisabled(true);
        this.down('button[itemId=start]').setDisabled(true);
        if (statusArray.length == 1) {
            var status = statusArray[0];
            if ('1' == status) {
                this.down('button[itemId=close]').setDisabled(false);
            } else if ('0' == status) {
                this.down('button[itemId=start]').setDisabled(false)
            }
        }
    },
    _onStartClick: function () {
        var me = this;
        var selections = this.getSelectionModel().getSelection();
        if (selections.length === 0) {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.atleastSelectOne);
        } else {
            var strategyIds = OrientExtUtil.GridHelper.getSelectRecordIds(me);
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/AccountStrategy/saveStatus.rdm', {
                strategyIds: strategyIds,
                status: '1'
            }, true, function () {
                OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.saveSuccess);
                me.fireEvent('refreshGrid');
            });
        }
    },
    _onCloseClick: function () {
        var me = this;
        var selections = this.getSelectionModel().getSelection();
        if (selections.length === 0) {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.atleastSelectOne);
        } else {
            var strategyIds = OrientExtUtil.GridHelper.getSelectRecordIds(me);
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/AccountStrategy/saveStatus.rdm', {
                strategyIds: strategyIds,
                status: '0'
            }, true, function () {
                OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.saveSuccess);
                me.fireEvent('refreshGrid');
            });
        }
    },
    _saveStratehyValue: function (value1, value2, id) {
        var me = this;
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/AccountStrategy/saveValue.rdm', {
            strategyId: id,
            value1: value1,
            value2: value2
        }, true, function () {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.saveSuccess);
            me.fireEvent('refreshGrid');
        });
    }
});