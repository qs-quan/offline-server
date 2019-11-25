/**
 * Created by enjoy on 2016/4/6 0006.
 */
Ext.define('OrientTdm.BackgroundMgr.PVMHtml.PVMHtmlList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.pvmHtmlList',
    requires: [
        'OrientTdm.BackgroundMgr.PVMHtml.Model.PVMHtmlExtModel',
        'OrientTdm.BackgroundMgr.PVMHtml.Common.PVMHtmlForm'
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
            title: '新增自定义检查表',
            height: 550,
            formConfig: {
                formClassName: 'OrientTdm.BackgroundMgr.PVMHtml.Common.PVMHtmlForm',
                appendParam: function () {
                    return {
                        actionUrl: me.store.getProxy().api['create'],
                        bindModelName: 'CWM_TASKCHECK_HTML',
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
            title: '修改自定义检查表',
            height: 550,
            formConfig: {
                formClassName: 'OrientTdm.BackgroundMgr.PVMHtml.Common.PVMHtmlForm',
                appendParam: function () {
                    return {
                        bindModelName: 'CWM_TASKCHECK_HTML',
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
        }, retVal[1]);
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
                header: '备注',
                flex: 1,
                sortable: true,
                dataIndex: 'notes',
                filter: {
                    type: 'string'
                }
            }
        ];
    },
    createStore: function () {
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.BackgroundMgr.PVMHtml.Model.PVMHtmlExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    'read': serviceName + '/CheckTaskHtmlTemplate/list.rdm',
                    'create': serviceName + '/CheckTaskHtmlTemplate/create.rdm',
                    'update': serviceName + '/CheckTaskHtmlTemplate/update.rdm',
                    'delete': serviceName + '/CheckTaskHtmlTemplate/delete.rdm'
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