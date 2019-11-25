/**
 * Created by dailin on 2019/4/1 15:26.
 */

Ext.define('OrientTdm.RoleBomMgr.Panel.GridPanel.RoleBomGridpanel',{
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.roleBomGridpanel',
    initComponent: function() {
        var me = this;
        me.callParent(arguments);
    },
    createColumns: function () {
        var me = this;
        return [{
            header: '角色名称',
            flex: 2,
            sortable: true,
            dataIndex: 'name',
            filter: {
                type: 'string'
            }
        }, {
            header: '备注',
            flex: 2,
            sortable: true,
            dataIndex: 'memo',
            filter: {
                type: 'string'
            }
        }];
    },

    createStore: function () {
        var me = this;
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.SysMgr.RoleMgr.Model.RoleListExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    'read': serviceName + '/role/listByFilterOperate.rdm',
                    'create': serviceName + '/role/create.rdm',
                    'update': serviceName + '/role/update.rdm',
                    'delete': serviceName + '/role/delete.rdm'
                },
                extraParams: {
                    operate: me.operate,
                    ids: me.ids,
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
                listeners: {
                    exception: function (proxy, response, operation) {
                        Ext.MessageBox.show({
                            title: '读写数据异常',
                            msg: operation.getError(),
                            icon: Ext.MessageBox.ERROR,
                            buttons: Ext.Msg.OK
                        });
                    }/*,
                    beforeLoad: function (store, operation) {
                        operate: me.operate,
                        store.getProxy().setExtraParam("operate", me.operate);
                        store.getProxy().setExtraParam("ids", me.ids)
                    }*/
                }
            },
            listeners: {
                write: function (proxy, operation) {

                }
            }
        });
        this.store = retVal;
        return retVal;
    }
});