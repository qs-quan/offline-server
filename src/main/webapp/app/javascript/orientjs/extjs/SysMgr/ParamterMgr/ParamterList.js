/**
 * Created by enjoy on 2016/4/30 0030.
 */
Ext.define('OrientTdm.SysMgr.ParamterMgr.ParamterList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.paramterList',
    requires: [
        "OrientTdm.SysMgr.ParamterMgr.Model.ParamterExtModel",
        "OrientTdm.SysMgr.ParamterMgr.Common.ParamterForm"
    ],
    config: {},
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        this.addEvents("filterByFilter");
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'filterByFilter', me.filterByFilter, me);
    },
    //视图初始化
    createToolBarItems: function () {
        var me = this;
        var addConfig = {
            title: '新增参数',
            height: 400,
            formConfig: {
                formClassName: "OrientTdm.SysMgr.ParamterMgr.Common.ParamterForm",
                appendParam: function () {
                    return {
                        bindModelName: "CWM_SYS_PARAMTER",
                        actionUrl: me.store.getProxy().api.create,
                        successCallback: function (resp, callBackArguments) {
                            me.fireEvent("refreshGrid");
                            if(callBackArguments) {
                                this.up("window").close();
                            }
                        }
                    }
                }
            }
        };

        var updateConfig = {
            title: '修改参数',
            height: 400,
            formConfig: {
                formClassName: "OrientTdm.SysMgr.ParamterMgr.Common.ParamterForm",
                appendParam: function () {
                    return {
                        bindModelName: "CWM_SYS_PARAMTER",
                        actionUrl: me.store.getProxy().api.update,
                        originalData: this.getSelectedData()[0],
                        successCallback: function () {
                            me.fireEvent("refreshGrid");
                            this.up("window").close();
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
            handler: Ext.bind(me.onUpdateClick, me, [updateConfig], false)
        }, {
            iconCls: 'icon-delete',
            text: '删除',
            disabled: false,
            itemId: 'delete',
            scope: this,
            handler: this.onDeleteClick
        }];
        me.actionItems.push(retVal[1],retVal[2]);
        return retVal;
    },
    createColumns: function () {
        return [
            {
                header: '参数名称',
                width: 200,
                sortable: true,
                dataIndex: 'name',
                filter: {
                    type: 'string'
                }
            }, {
                header: '参数值',
                flex: 1,
                sortable: true,
                dataIndex: 'value',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '参数类型',
                width: 150,
                sortable: true,
                dataIndex: 'datatype',
                filter: {
                    type: 'string'
                }
            }
        ];
    },
    createStore: function () {
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.SysMgr.ParamterMgr.Model.ParamterExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    "read": serviceName + '/Paramter/list.rdm',
                    "create": serviceName + '/Paramter/create.rdm',
                    "update": serviceName + '/Paramter/update.rdm',
                    "delete": serviceName + '/Paramter/delete.rdm'
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
    filterByFilter: function (filter) {
        for (var proName in filter) {
            this.getStore().getProxy().setExtraParam(proName, filter[proName]);
        }
        this.getStore().loadPage(1);
    }
});