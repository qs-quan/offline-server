/**
 * Created by enjoy on 2016/4/6 0006.
 */
Ext.define('OrientTdm.BackgroundMgr.Quantity.Template.QuantityTemplateList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.quantityTemplateList',
    requires: [
        'OrientTdm.BackgroundMgr.Quantity.Template.Model.QuantityTemplateExtModel',
        'OrientTdm.BackgroundMgr.Quantity.Template.Common.QuantityTemplateForm',
        'OrientTdm.BackgroundMgr.Quantity.Meta.QuantityList'
    ],
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
        var addConfig = {
            title: '新增测试变量',
            height: 200,
            formConfig: {
                formClassName: 'OrientTdm.BackgroundMgr.Quantity.Template.Common.QuantityTemplateForm',
                appendParam: function () {
                    return {
                        actionUrl: me.store.getProxy().api['create'],
                        bindModelName: 'CF_QUANTITY_TEMPLATE',
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
                formClassName: 'OrientTdm.BackgroundMgr.Quantity.Template.Common.QuantityTemplateForm',
                appendParam: function () {
                    return {
                        bindModelName: 'CF_QUANTITY_TEMPLATE',
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
        }, {
            iconCls: 'icon-bind',
            text: '绑定测试变量',
            itemId: 'bind',
            scope: this,
            handler: me.onBindClick
        }, {
            iconCls: 'icon-detail',
            text: '详细',
            itemId: 'detail',
            scope: this,
            handler: me.onDetailClick
        });
        return retVal;
    },
    createColumns: function () {
        return [
            {
                header: '测试变量模板名称',
                flex: 1,
                sortable: true,
                dataIndex: 'name',
                filter: {
                    type: 'string'
                }
            }
        ];
    },
    createStore: function () {
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.BackgroundMgr.Quantity.Template.Model.QuantityTemplateExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    'read': serviceName + '/QuantityTemplate/list.rdm',
                    'create': serviceName + '/QuantityTemplate/create.rdm',
                    'update': serviceName + '/QuantityTemplate/update.rdm',
                    'delete': serviceName + '/QuantityTemplate/delete.rdm'
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
    },
    onBindClick: function () {
        var me = this;
        var selectedId = OrientExtUtil.GridHelper.getSelectRecordIds(me)[0];
        var scopeGrid = Ext.create('OrientTdm.BackgroundMgr.Quantity.Meta.QuantityList', {
            queryUrl: serviceName + '/Quantity/listByTemplate.rdm?type=0&templateId=' + selectedId,
            canOperate: false,
            usePage: false
        });
        OrientExtUtil.WindowHelper.createWindow(scopeGrid, {
            title: '绑定采集变量',
            buttons: [
                {
                    text: '绑定',
                    iconCls: 'icon-save',
                    handler: function () {
                        var btn = this;
                        var grid = this.up('window').down('quantityList');
                        if (OrientExtUtil.GridHelper.hasSelected(grid)) {
                            var ids = OrientExtUtil.GridHelper.getSelectRecordIds(grid);
                            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/QuantityTemplateRelation/createRelation.rdm', {
                                templateId: selectedId,
                                quantityIds: ids
                            }, true, function () {
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
    onDetailClick: function () {
        var me = this;
        var selectedId = OrientExtUtil.GridHelper.getSelectRecordIds(me)[0];
        var scopeGrid = Ext.create('OrientTdm.BackgroundMgr.Quantity.Meta.QuantityList', {
            queryUrl: serviceName + '/Quantity/listByTemplate.rdm?type=1&templateId=' + selectedId,
            canOperate: false,
            usePage: false
        });
        OrientExtUtil.WindowHelper.createWindow(scopeGrid, {
            title: '已绑定采集变量',
            buttons: [
                {
                    text: '取消绑定',
                    iconCls: 'icon-delete',
                    handler: function () {
                        var btn = this;
                        var grid = this.up('window').down('quantityList');
                        if (OrientExtUtil.GridHelper.hasSelected(grid)) {
                            var ids = OrientExtUtil.GridHelper.getSelectRecordIds(grid);
                            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/QuantityTemplateRelation/removeRelation.rdm', {
                                templateId: selectedId,
                                quantityIds: ids
                            }, true, function () {
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
    }
});