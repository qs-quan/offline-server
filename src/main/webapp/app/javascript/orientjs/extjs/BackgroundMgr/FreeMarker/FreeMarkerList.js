/**
 * Created by enjoy on 2016/3/16 0016.
 */
Ext.define('OrientTdm.BackgroundMgr.FreeMarker.FreeMarkerList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.freeMarkerList',
    requires: [
        'OrientTdm.BackgroundMgr.FreeMarker.Model.FreemarkTemplateExtModel',
        'OrientTdm.BackgroundMgr.FreeMarker.FreeMarkerAddForm',
        'OrientTdm.BackgroundMgr.FreeMarker.FreeMarkerUpdateForm'
    ],
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    //视图初始化
    createToolBarItems: function () {
        var me = this;
        var addConfig = {
            title: '新增FreeMarker模板',
            height:0.5*globalHeight,
            formConfig: {
                formClassName: 'OrientTdm.BackgroundMgr.FreeMarker.FreeMarkerAddForm',
                appendParam: function () {
                    return {
                        bindModelName: 'FREEMARK_TEMPLATE',
                        successCallback: function (resp, callBackArguments) {
                            me.fireEvent('refreshGrid');
                            if(callBackArguments){
                                this.up('window').close();
                            }
                        }
                    }
                }
            }
        };
        var updateConfig = {
            title: '修改FreeMarker模板',
            height:0.5*globalHeight,
            formConfig: {
                formClassName: 'OrientTdm.BackgroundMgr.FreeMarker.FreeMarkerUpdateForm',
                appendParam: function () {
                    return {
                        bindModelName: 'FREEMARK_TEMPLATE',
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
        }, {
            iconCls: 'icon-init',
            text: '初始化',
            scope: this,
            handler: this.onSync
        }];
        me.actionItems.push({
            iconCls: 'icon-update',
            text: '修改',
            itemId: 'update',
            scope: this,
            handler: Ext.bind(me.onUpdateClick, me, [updateConfig], false)
        }, {
            iconCls: 'icon-delete',
            text: '删除',
            disabled: false,
            itemId: 'delete',
            scope: this,
            handler: this.onDeleteClick
        });
        return retVal;
    },
    createFooBar: function () {
        var me = this;
        return {
            xtype: 'pagingtoolbar',
            store: me.store,   // same store GridPanel is using
            dock: 'bottom',
            displayInfo: true
        };
    },
    createColumns: function () {
        return [
            {
                header: '模板名称',
                width: 150,
                sortable: true,
                dataIndex: 'name',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '模板别名',
                width: 100,
                sortable: true,
                dataIndex: 'alias',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '模板类型',
                width: 100,
                sortable: true,
                dataIndex: 'type'
            },
            {
                header: '模板描述',
                flex: 1,
                sortable: false,
                dataIndex: 'desc'
            }
        ];
    },
    createStore: function () {
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.BackgroundMgr.FreeMarker.Model.FreemarkTemplateExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    'read': serviceName + '/freeMarkFormTemplate/list.rdm',
                    'create': serviceName + '/freeMarkFormTemplate/create.rdm',
                    'update': serviceName + '/freeMarkFormTemplate/update.rdm',
                    'delete': serviceName + '/freeMarkFormTemplate/delete.rdm'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    root: 'results',
                    messageProperty: 'msg'
                },
                writer: {
                    type: 'json',
                    writeAllFields: false,
                    root: 'data'
                },
                listeners: {}
            },
            listeners: {}
        });
        this.store = retVal;
        return retVal;
    },
    onSync: function () {
        var me = this;
        Ext.getBody().mask('请稍后...', 'x-mask-loading');
        Ext.Ajax.request({
            url: serviceName + '/freeMarkFormTemplate/init.rdm',
            params: {},
            success: function (response) {
                Ext.getBody().unmask();
                me.fireEvent('refreshGrid');
            }
        });
    }
});
