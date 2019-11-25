/**
 * Created by Administrator on 2016/8/3 0003.
 */
Ext.define('OrientTdm.BackgroundMgr.FlowCommission.UserListGrid', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    requires: [
        'OrientTdm.BackgroundMgr.FlowCommission.Model.UserExtModel'
    ],
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    config: {
        pdid: ''
    },
    usePage: false,
    initComponent: function () {
        var me = this;

        me.callParent(arguments);
    },
    createToolBarItems: function () {
        var me = this;
        var retVal = [{
            iconCls: 'icon-create',
            text: '新增',
            itemId: 'create',
            scope: me,
            handler: me.onCreateClick
        }, {
            iconCls: 'icon-delete',
            text: '删除',
            disabled: false,
            itemId: 'delete',
            scope: me,
            handler: me.onDeleteClick
        }];
        return retVal;
    },
    createColumns: function () {
        var me = this;
        return [
            {
                header: '账号',
                flex: 2,
                sortable: true,
                dataIndex: 'userName',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '姓名',
                flex: 2,
                sortable: true,
                dataIndex: 'allName',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '部门',
                flex: 2,
                sortable: false,
                dataIndex: 'department',
                renderer: function (value) {
                    var retVal = '';
                    if (!Ext.isEmpty(value)) {
                        retVal = Ext.decode(value)["text"];
                    }
                    return retVal;
                },
                filter: {
                    type: 'string'
                }
            }
        ];
    },
    createStore: function () {
        var me = this;
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.BackgroundMgr.FlowCommission.Model.UserExtModel',
            autoLoad: false,
            proxy: {
                type: 'ajax',
                url: serviceName + '/flowCommission/getSlaveUsers.rdm',
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                },
                extraParams: {
                    pdid: ""
                }
            }
        });
        return retVal;
    },
    onCreateClick: function () {
        var me = this;
        var store = me.getStore();

        var filterUserIds = [window.userId];
        if(store.getCount() > 0) {
            var records = store.getRange(0, store.getCount());
            for(var i=0; i<records.length; i++) {
                filterUserIds.push(records[i].get("id"));
            }
        }

        var userSelectorPanel = Ext.create('OrientTdm.Common.Extend.Form.Selector.ChooseUserPanel', {
            selectedValue: '',
            filterType: '0',
            filterValue: '',
            extraFilter: {
                idFilter: {'not in': filterUserIds.join(",")}
            },
            multiSelect: true,
            showCalendar: false,
            saveAction: function (saveData, callBack) {
                if(!saveData || saveData.length==0) {
                    OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.atleastSelectOne);
                    return;
                }

                var userNames = Ext.Array.pluck(saveData, 'userName').join(',');
                Ext.getBody().mask("请稍后...", "x-mask-loading");
                Ext.Ajax.request({
                    url: serviceName + '/flowCommission/addSlaveUsers.rdm',
                    params: {
                        pdid: me.pdid,
                        userNames: userNames
                    },
                    success: function (response) {
                        Ext.getBody().unmask();
                        store.reload();
                    }
                });

                if (callBack) {
                    callBack.call(this);
                }
            }
        });
        var win = Ext.create('Ext.Window', {
            plain: true,
            height: 600,
            width: 800,
            layout: 'fit',
            maximizable: false,
            title: '选择用户',
            modal: true,
            items: [userSelectorPanel]
        });
        win.show();
    },
    onDeleteClick: function () {
        var me = this;
        var selections = me.getSelectionModel().getSelection();
        if (selections.length === 0) {
            OrientExtUtil.Common.err(OrientLocal.prompt.info, OrientLocal.prompt.atleastSelectOne);
        } else {
            OrientExtUtil.Common.confirm(OrientLocal.prompt.confirm, OrientLocal.prompt.deleteConfirm, function (btn) {
                if (btn == 'yes') {
                    var userNames = [];
                    for(var i=0; i<selections.length; i++) {
                        var record = selections[i];
                        var userName = record.get("userName");
                        userNames.push(userName);
                    }
                    Ext.getBody().mask("请稍后...", "x-mask-loading");
                    Ext.Ajax.request({
                        url: serviceName + '/flowCommission/deleteSlaveUsers.rdm',
                        params: {
                            pdid: me.pdid,
                            userNames: userNames
                        },
                        success: function (response) {
                            Ext.getBody().unmask();
                            me.getStore().reload();
                        }
                    });
                }
            });
        }
    }
});