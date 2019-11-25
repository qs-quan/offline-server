/**
 * Created by enjoy on 2016/6/2 0002
 */
Ext.define('OrientTdm.HomePage.Msg.MsgWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.msgWin',
    requires: [
        'OrientTdm.HomePage.Msg.MsgGrid'
    ],
    height: 450,
    width: 700,
    plain: true,
    modal: true,
    layout: 'fit',
    title: '用户消息',
    closeAction: 'destroy',
    initComponent: function () {
        var me = this;
        var unreadedMsgGrid = Ext.create('OrientTdm.HomePage.Msg.MsgGrid', {
            url: serviceName + '/msg/getUserMsgs.rdm?readed=false',
            tbar: [{
                xtype: 'button',
                iconCls: 'icon-mark',
                text: '标记已读',
                handler: function () {
                    var sels = unreadedMsgGrid.getSelectedIds();
                    if (sels.length == 0) {
                        Ext.MessageBox.alert('提示', '请选择至少一条记录');
                        return;
                    }
                    me.markReaded(sels, true);
                }
            }, {
                xtype: 'button',
                iconCls: 'icon-delete',
                text: '删除',
                handler: function () {
                    var sels = unreadedMsgGrid.getSelectedIds();
                    if (sels.length == 0) {
                        Ext.MessageBox.alert('提示', '请选择至少一条记录');
                        return;
                    }
                    Ext.Msg.confirm('删除', '您确定要删除所选消息吗？', function (btn) {
                        if (btn == "yes") {
                            me.deleteMsgs(sels);
                            me.refreshMsgGridPortal();
                        }
                    });
                }
            }, '->', {
                xtype: 'tbtext',
                style: 'color:red',
                text: '双击条目可查看消息详细内容',
                iconCls: 'x-status-error'
            }]
        });
        var readedMsgGrid = Ext.create('OrientTdm.HomePage.Msg.MsgGrid', {
            url: serviceName + '/msg/getUserMsgs.rdm?readed=true',
            tbar: [{
                xtype: 'button',
                iconCls: 'icon-mark',
                text: '标记未读',
                handler: function () {
                    var sels = readedMsgGrid.getSelectedIds();
                    if (sels.length == 0) {
                        Ext.MessageBox.alert('提示', '请选择至少一条记录');
                        return;
                    }
                    me.markReaded(sels, false);
                }
            }, {
                xtype: 'button',
                iconCls: 'icon-delete',
                text: '删除',
                handler: function () {
                    var sels = readedMsgGrid.getSelectedIds();
                    if (sels.length == 0) {
                        Ext.MessageBox.alert('提示', '请选择至少一条记录');
                        return;
                    }
                    Ext.Msg.confirm('删除', '您确定要删除所选消息吗？', function (btn) {
                        if (btn == 'yes') {
                            me.deleteMsgs(sels);
                        }
                    });
                }
            }, '->', {
                xtype: 'tbtext',
                style: 'color:red',
                text: '双击条目可查看消息详细内容',
                iconCls: 'x-status-error'
            }]
        });

        Ext.apply(me, {
            unreadedMsgGrid: unreadedMsgGrid,
            readedMsgGrid: readedMsgGrid,
            items: [{
                xtype: 'tabpanel',
                items: [{
                    title: '未读消息',
                    layout: "fit",
                    items: [unreadedMsgGrid]
                }, {
                    title: '已读消息',
                    layout: "fit",
                    items: [readedMsgGrid]
                }],
                listeners: {
                    'tabchange': function (tabPanel, newCard) {
                        //tab页切换的时候需要调用刷新grid的方法
                        unreadedMsgGrid.refreshGrid();
                        readedMsgGrid.refreshGrid();
                    }
                }
            }],
            buttons: [{
                text: '关闭',
                iconCls: 'icon-close',
                handler: function () {
                    me.close();
                }
            }]
        });
        me.callParent();
    },
    markReaded: function (ids, readed) {
        var me = this;
        var wait = Ext.MessageBox.wait('正在标记消息，请稍后...', '标记消息', {text: '请稍后...'});
        Ext.Ajax.request({
            url: serviceName + '/msg/markReaded.rdm',
            method: 'POST',
            params: {
                readed: readed
            },
            jsonData: Ext.encode(ids),
            headers: {
                "Content-Type": 'application/json;charset=UTF-8'
            },
            success: function (response, options) {
                wait.hide();
                var data = response.decodedData;
                me.unreadedMsgGrid.refreshGrid();
                me.readedMsgGrid.refreshGrid();
                OrientExtUtil.HomeHelper.refreshNoticeMsgCount();
                me.refreshMsgGridPortal();
            },
            failure: function (result, request) {
                wait.hide();
                Ext.MessageBox.alert('错误', '消息标记出错');
            }
        });
    },
    deleteMsgs: function (ids) {
        var me = this;
        var wait = Ext.MessageBox.wait('正在删除消息，请稍后...', '删除消息', {text: '请稍后...'});
        Ext.Ajax.request({
            url: serviceName + '/msg/deleteMsgs.rdm',
            method: 'POST',
            jsonData: Ext.encode(ids),
            headers: {
                "Content-Type": 'application/json;charset=UTF-8'
            },
            success: function (response, options) {
                wait.hide();
                var data = response.decodedData;
                me.unreadedMsgGrid.refreshGrid();
                me.readedMsgGrid.refreshGrid();
                OrientExtUtil.HomeHelper.refreshNoticeMsgCount();
                me.refreshMsgGridPortal();
            },
            failure: function (result, request) {
                wait.hide();
                Ext.MessageBox.alert('错误', '消息删除出错');
            }
        });
    },
    refreshMsgGridPortal: function () { //刷新磁贴中的消息grid面板
        var msgGridPortal = Ext.ComponentQuery.query('msgGridPortal')[0];
        if (msgGridPortal) {
            msgGridPortal.fireEvent('refreshGrid');
        }
    }
});