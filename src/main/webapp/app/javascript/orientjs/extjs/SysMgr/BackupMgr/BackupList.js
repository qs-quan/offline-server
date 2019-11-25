/**
 * Created by enjoy on 2016/4/30 0030.
 */
Ext.define('OrientTdm.SysMgr.BackupMgr.BackupList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.backupList',
    requires: [
        "OrientTdm.SysMgr.BackupMgr.Model.BackupMgrExtModel",
        "OrientTdm.SysMgr.BackupMgr.Common.BackupForm"
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
            title: '新增备份',
            height: 200,
            width:650,
            formConfig: {
                formClassName: "OrientTdm.SysMgr.BackupMgr.Common.BackupForm",
                appendParam: function () {
                    return {
                        bindModelName: "CWM_BACK",
                        actionUrl: me.store.getProxy().api.create,
                        successCallback: function () {
                            me.fireEvent("refreshGrid");
                            this.up("window").close();
                        }
                    }
                }
            }
        };

        var updateConfig = {
            title: '修改备份',
            height: 200,
            width:650,
            formConfig: {
                formClassName: "OrientTdm.SysMgr.BackupMgr.Common.BackupForm",
                appendParam: function () {
                    return {
                        bindModelName: "CWM_BACK",
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
            iconCls: 'icon-backup',
            text: '备份',
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
        me.actionItems = [{
            iconCls: 'icon-update',
            text: '修改备份',
            itemId: 'update',
            scope: this,
            handler: Ext.bind(me.onUpdateClick, me, [updateConfig], false)
        }, {
            iconCls: 'icon-recover',
            text: '恢复数据',
            disabled: false,
            itemId: 'recovery',
            scope: this,
            handler: this.onRecoveryClick
        }, retVal[1]];
        return retVal;
    },
    createColumns: function () {
        return [
            {
                header: '备份日期',
                width: 200,
                sortable: true,
                dataIndex: 'backDate',
                filter: {
                    type: 'string'
                }
            }, {
                header: '备份人',
                width: 150,
                sortable: true,
                dataIndex: 'userId',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '备份说明',
                flex: 1,
                dataIndex: 'remark',
                filter: {
                    type: 'string'
                }
            }
        ];
    },
    createStore: function () {
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.SysMgr.BackupMgr.Model.BackupMgrExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    "read": serviceName + '/DataBack/list.rdm',
                    "create": serviceName + '/DataBack/create.rdm',
                    "update": serviceName + '/DataBack/update.rdm',
                    "delete": serviceName + '/DataBack/delete.rdm'
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
    },
    onRecoveryClick: function () {
        var me = this;
        var selections = this.getSelectionModel().getSelection();
        if (selections.length === 0) {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.atleastSelectOne);
        } else if (selections.length > 1) {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.onlyCanSelectOne);
        } else {
            OrientExtUtil.Common.confirm(OrientLocal.prompt.info, "恢复后数据回滚到所选备份版本，现有数据可能会丢失，恢复完成后请重启服务", function (btn) {
                if (btn == 'yes') {
                    var backId = selections[0].get("id");
                    OrientExtUtil.AjaxHelper.doRequest(serviceName + '/DataBack/doRecovery.rdm', {
                        backUpId: backId
                    }, true, function () {
                        OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.recorySuccess);
                    });
                }
            });

        }
    }
});