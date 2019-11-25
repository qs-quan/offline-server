/**
 * Created by Administrator on 2016/8/3 0003.
 */
Ext.define('OrientTdm.BackgroundMgr.FlowCommission.FlowListGrid', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    requires: [
        'OrientTdm.BackgroundMgr.FlowCommission.Model.FlowExtModel'
    ],
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    config: {
        type: 'audit',
        name: ''
    },
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            listeners: {
                select: function(rowModel, record, index) {
                    var pdid = record.get("name");
                    var userList = me.up("FlowCommissionDashBord").userList;
                    userList.pdid = pdid;
                    var store = userList.getStore();
                    store.getProxy().setExtraParam('pdid', pdid);
                    store.reload();
                }
            }
        });
        me.callParent(arguments);
    },
    createToolBarItems: function () {
        var me = this;

        return [];
    },
    createColumns: function () {
        var me = this;
        return [
            {
                header: '流程名称',
                flex: 3,
                sortable: true,
                dataIndex: 'name'
            },
            {
                header: '流程版本',
                flex: 1,
                sortable: true,
                dataIndex: 'version'
            }
        ];
    },
    createStore: function () {
        var me = this;
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.BackgroundMgr.FlowCommission.Model.FlowExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: serviceName + '/PDMgr/list.rdm',
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                },
                extraParams: {
                    limit: null,
                    type: me.type,
                    name: me.name
                }
            },
            listeners: {
                load: function(store, records, success) {
                    if(records.length > 0) {
                        var firstRec = records[0];
                        var sm = me.getSelectionModel();
                        sm.select(firstRec);
                    }
                }
            }
        });
        return retVal;
    }
});