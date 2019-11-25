/**
 * Created by enjoy on 2016/6/2 0002.
 */
Ext.define('OrientTdm.SysMgr.PortalMgr.PortalList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.portalList',
    requires: [
        'OrientTdm.SysMgr.PortalMgr.Model.PortalExtModel',
        'OrientTdm.SysMgr.PortalMgr.Common.PortalForm'
    ],
    afterInitComponent: Ext.emptyFn,
    beforeInitComponent: Ext.emptyFn,
    //视图初始化
    createToolBarItems: function () {
        var me = this;
        var addConfig = {
            title: '新增磁贴',
            width:550,
            height: 200,
            formConfig: {
                formClassName: 'OrientTdm.SysMgr.PortalMgr.Create.PortalAddForm',
                appendParam: function () {
                    return {
                        actionUrl: me.store.getProxy().api.create,
                        bindModelName: 'CWM_PORTAL',
                        successCallback: function (resp, callBackArguments) {
                            me.fireEvent('refreshGrid');
                            if (callBackArguments) {
                                 this.up('window').close();
                            }
                        }
                    }
                }
            }
        };

        var updateConfig = {
            title: '修改磁贴',
            width:550,
            height: 200,
            formConfig: {
                formClassName: 'OrientTdm.SysMgr.PortalMgr.Update.PortalUpdateForm',
                appendParam: function () {
                    return {
                        actionUrl: me.store.getProxy().api.update,
                        bindModelName: 'CWM_PORTAL',
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
            iconCls: 'icon-update',
            text: '修改',
            itemId: 'update',
            scope: this,
            handler: Ext.Function.createInterceptor(Ext.bind(me.onUpdateClick, me, [updateConfig], false), this.checkCanOperate, me)
        }, {
            iconCls: 'icon-delete',
            text: '删除',
            disabled: false,
            itemId: 'delete',
            scope: this,
            handler: Ext.Function.createInterceptor(this.onDeleteClick, this.checkCanOperate, me)
        }];
        me.actionItems.push(retVal[1],retVal[2]);
        return retVal;
    },
    createColumns: function () {
        return [
            {
                header: '名称',
                sortable: true,
                dataIndex: 'title',
                filter: {
                    type: 'string'
                }
            },
            {
                header: 'url',
                flex: 1,
                sortable: true,
                dataIndex: 'url'
            },
            {
                header: 'js路径',
                flex: 1,
                sortable: true,
                dataIndex: 'jspath'
            }
        ];
    },
    createStore: function () {
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.SysMgr.PortalMgr.Model.PortalExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    'read': serviceName + '/protal/list.rdm',
                    'create': serviceName + '/protal/create.rdm',
                    'delete': serviceName + '/protal/delete.rdm',
                    'update': serviceName + '/protal/update.rdm'
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
    checkCanOperate: function () {
        return true;
    },
    filterByFilter: function (filter) {
        for (var proName in filter) {
            this.getStore().getProxy().setExtraParam(proName, filter[proName]);
        }
        this.getStore().loadPage(1);
    },
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        this.addEvents('filterByFilter');
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'filterByFilter', me.filterByFilter, me);
    },
    onCreateClick: function (cfg) {
        if (cfg.formConfig.appendParam) {
            var extraParam = cfg.formConfig.appendParam.call(this);
            Ext.apply(cfg.formConfig, extraParam);
        }
        //弹出新增面板窗口
        var win = Ext.create('Ext.Window', Ext.apply({
            plain: true,
            height: 0.7 * globalHeight,
            width: 0.7 * globalWidth,
            layout: 'fit',
            maximizable: true,
            modal: true,
            items: [
                Ext.create(cfg.formConfig.formClassName, cfg.formConfig)
            ]
        }, cfg));
        win.show();
    }
});