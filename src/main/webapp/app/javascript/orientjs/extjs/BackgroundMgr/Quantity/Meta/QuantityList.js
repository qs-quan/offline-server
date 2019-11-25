/**
 * Created by enjoy on 2016/4/6 0006.
 */
Ext.define('OrientTdm.BackgroundMgr.Quantity.Meta.QuantityList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.quantityList',
    requires: [
        'OrientTdm.BackgroundMgr.Quantity.Meta.Model.QuantityExtModel',
        'OrientTdm.BackgroundMgr.Quantity.Meta.Common.QuantityForm'
    ],
    config: {
        queryUrl: serviceName + '/Quantity/list.rdm',
        canOperate: true
    },
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
    },
    //视图初始化
    createToolBarItems: function () {
        var me = this;
        if (me.canOperate == false) {
            return null;
        }
        var addConfig = {
            title: '新增测试变量',
            height: 200,
            formConfig: {
                formClassName: 'OrientTdm.BackgroundMgr.Quantity.Meta.Common.QuantityForm',
                appendParam: function () {
                    return {
                        actionUrl: me.store.getProxy().api['create'],
                        bindModelName: 'CF_QUANTITY',
                        successCallback: function (resp, callBackArguments) {
                            me.fireEvent('refreshGrid');
                            if (callBackArguments) {
                                this.up("window").close();
                            }
                        }
                    }
                }
            }
        };

        var updateConfig = {
            title: '修改测试变量',
            height: 200,
            formConfig: {
                formClassName: 'OrientTdm.BackgroundMgr.Quantity.Meta.Common.QuantityForm',
                appendParam: function () {
                    return {
                        bindModelName: 'CF_QUANTITY',
                        actionUrl: me.store.getProxy().api['update'],
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
        });
        return retVal;
    },
    createColumns: function () {
        return [
            {
                header: '测试变量名称',
                flex: 1,
                sortable: true,
                dataIndex: 'name',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '测试变量类型',
                width: 150,
                sortable: true,
                dataIndex: 'datatype',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '单位',
                width: 150,
                sortable: true,
                dataIndex: 'unitName',
                filter: {
                    type: 'string'
                }
            }
        ];
    },
    createStore: function () {
        var me = this;
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.BackgroundMgr.Quantity.Meta.Model.QuantityExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    'read': me.queryUrl,
                    'create': serviceName + '/Quantity/create.rdm',
                    'update': serviceName + '/Quantity/update.rdm',
                    'delete': serviceName + '/Quantity/delete.rdm'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                },
                extraParams: {
                    limit: null
                }
            }
        });
        this.store = retVal;
        return retVal;
    }
});