/**
 * Created by Administrator on 2016/12/17
 */
Ext.define('OrientTdm.HomePage.Msg.MsgGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.msgGrid',
    requires: [
        'OrientTdm.HomePage.Msg.CwmMsg',
        'OrientTdm.HomePage.homePageShow.MsgFormPortal'
    ],
    config: {
        url: null,
        usePage: true
    },
    viewConfig: {
        stripeRows: true,
        autoFill: true,
        forceFit: true
    },
    initComponent: function () {
        var me = this;
        //当鼠标停留在标题列和内容列时，显示qtip
        me.columns = [{
            header: "标题", dataIndex: "title", width: 160, renderer: function (value, meta, record) {
                meta.tdAttr = 'data-qtip="' + value + '"';
                return value;
            }
        }, {
            header: "内容", dataIndex: "content", flex: 1, renderer: function (value, meta, record) {
                meta.tdAttr = 'data-qtip="' + value + '"';
                return value;
            }
        }, {
            header: "时间", dataIndex: "timestamp", width: 180, renderer: function (value) {
                return Ext.Date.format(new Date(value), "Y-m-d H:i:s");
            }
        }];

        me.store = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.HomePage.Msg.CwmMsg',
            proxy: {
                type: 'ajax',
                url: me.url,
                reader: {
                    type: 'json',
                    root: 'results',
                    idProperty: 'id',
                    totalProperty: 'total'
                }
            },
            autoLoad: true
        });

        me.selModel = Ext.create("Ext.selection.CheckboxModel", {
            mode: 'MULTI'
        });
        if (me.usePage) {
            me.bbar = Ext.create('Ext.PagingToolbar', {
                store: me.store,
                displayInfo: true,
                displayMsg: '{0} - {1} of {2}',
                emptyMsg: "没有数据"
            });
        }
        me.callParent();
        this.addEvents('refreshGrid');
    },
    initEvents: function () {
        var me = this;
        me.mon(me, 'celldblclick', me.celldblclick, me);
        me.mon(me, 'refreshGrid', me.refreshGrid, me);
    },
    getSelectedIds: function () {
        var me = this;
        var sels = this.getSelectionModel().getSelection();
        var ids = [];
        for (var i = 0; i < sels.length; i++) {
            var data = sels[i].raw;
            ids.push(data.id);
        }
        return ids;
    },
    refreshGrid: function () {
        this.getSelectionModel().clearSelections();
        var store = this.getStore();
        var lastOptions = store.lastOptions;
        store.reload(lastOptions);
    },
    celldblclick: function (view, td, cellIndex, record, tr, rowIndex) {
        var me = this;
        var detailForm = Ext.create('OrientTdm.HomePage.Msg.MsgDetail', {
            msg: record.data
        });
        OrientExtUtil.WindowHelper.createWindow(detailForm, {
            title: '消息详细',
            buttons: [
                {
                    text: '关闭',
                    iconCls: 'icon-close',
                    handler: function () {
                        this.up('window').close();
                        OrientExtUtil.HomeHelper.refreshNoticeMsgCount();
                        me.refreshMsgGridPortal();
                    }
                }
            ],
            listeners: {
                close: function () {
                    Ext.Ajax.request({
                        url: serviceName + "/msg/markReaded.rdm",
                        method: 'POST',
                        params: {
                            readed: true
                        },
                        jsonData: Ext.encode([record.getId()]),
                        headers: {
                            "Content-Type": "application/json;charset=UTF-8"
                        },
                        success: function (response, options) {
                            me.refreshGrid();
                            OrientExtUtil.HomeHelper.refreshNoticeMsgCount();
                            me.refreshMsgGridPortal();
                        },
                        failure: function (result, request) {
                            Ext.MessageBox.alert("错误", "消息标记出错");
                        }
                    });
                }
            }
        }, 400, 600);
    },
    refreshMsgGridPortal: function () { //刷新磁贴中的消息grid面板
        var msgGridPortal = Ext.ComponentQuery.query('msgGridPortal')[0];
        if (msgGridPortal) {
            msgGridPortal.fireEvent('refreshGrid');
        }
    }
});