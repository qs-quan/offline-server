/**
 * Created by enjoy on 2016/4/6 0006.
 */
Ext.define('OrientTdm.BackgroundMgr.DocHandler.DocHandlerList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.docHandlerList',
    requires: [
        'OrientTdm.BackgroundMgr.DocHandler.Model.DocHandlerExtModel',
        'OrientTdm.BackgroundMgr.DocHandler.Common.DocHandlerForm',
        'OrientTdm.BackgroundMgr.DocHandler.DocHandlerScopeList'
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
            title: '新增报告处理器',
            height: 200,
            formConfig: {
                formClassName: 'OrientTdm.BackgroundMgr.DocHandler.Common.DocHandlerForm',
                appendParam: function () {
                    return {
                        actionUrl: me.store.getProxy().api['create'],
                        bindModelName: 'CWM_DOC_HANDLER',
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
            title: '修改报告处理器',
            height: 200,
            formConfig: {
                formClassName: 'OrientTdm.BackgroundMgr.DocHandler.Common.DocHandlerForm',
                appendParam: function () {
                    return {
                        bindModelName: 'CWM_DOC_HANDLER',
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
        }, retVal[1],{
            iconCls: 'icon-bind',
            text: '绑定字段',
            itemId: 'bind',
            scope: this,
            handler: me.onBindClick
        });
        return retVal;
    },
    createColumns: function () {
        return [
            {
                header: '名称',
                width: 150,
                sortable: true,
                dataIndex: 'showName',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '处理类',
                flex: 1,
                sortable: true,
                dataIndex: 'beanName',
                filter: {
                    type: 'string'
                }
            }
        ];
    },
    createStore: function () {
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.BackgroundMgr.DocHandler.Model.DocHandlerExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    'read': serviceName + '/DocHandler/list.rdm',
                    'create': serviceName + '/DocHandler/create.rdm',
                    'update': serviceName + '/DocHandler/update.rdm',
                    'delete': serviceName + '/DocHandler/delete.rdm'
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
    onBindClick:function(){
        //bind the columns
        var me = this;
        var selectedId = OrientExtUtil.GridHelper.getSelectRecordIds(me)[0];
        //init column bind grid
        var scopeGrid = Ext.create('OrientTdm.BackgroundMgr.DocHandler.DocHandlerScopeList',{
            belongHandler:selectedId
        });
        OrientExtUtil.WindowHelper.createWindow(scopeGrid,{
            title:'绑定类型'
        })
    }
});