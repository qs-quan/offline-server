/**
 * Created by enjoy on 2016/4/6 0006.
 */
Ext.define('OrientTdm.BackgroundMgr.DocHandler.DocHandlerScopeList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.docHandlerScopeList',
    requires: [
        'OrientTdm.BackgroundMgr.DocHandler.Model.DocHandlerScopeExtModel',
        'OrientTdm.BackgroundMgr.DocHandler.Common.DocHandlerScopeForm'
    ],
    config: {
        belongHandler: ''
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
        var addConfig = {
            title: '新增类型绑定',
            height: 200,
            formConfig: {
                formClassName: 'OrientTdm.BackgroundMgr.DocHandler.Common.DocHandlerScopeForm',
                appendParam: function () {
                    return {
                        actionUrl: me.store.getProxy().api['create'],
                        bindModelName: 'CWM_DOC_COLUMN_SCOPE',
                        belongHandler: me.belongHandler,
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
        me.actionItems.push(retVal[1]);
        return retVal;
    },
    createColumns: function () {
        return [
            {
                header: '绑定字段类型',
                flex: 1,
                sortable: true,
                dataIndex: 'columnType',
                filter: {
                    type: 'string'
                }
            }
        ];
    },
    createStore: function () {
        var me = this;
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.BackgroundMgr.DocHandler.Model.DocHandlerScopeExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    'read': serviceName + '/DocHandlerScope/list.rdm',
                    'create': serviceName + '/DocHandlerScope/create.rdm',
                    'update': serviceName + '/DocHandlerScope/update.rdm',
                    'delete': serviceName + '/DocHandlerScope/delete.rdm'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                },
                extraParams: {
                    limit: null,
                    belongHandler: me.belongHandler
                }
            }
        });
        this.store = retVal;
        return retVal;
    }
});