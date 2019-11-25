/**
 * 消息详细面板
 * Created by GNY on 2018/5/14
 */
Ext.define('OrientTdm.HomePage.Msg.MsgDetail', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.msgDetail',
    requires: [],
    config: {
        msg: null
    },
    initComponent: function () {
        var me = this;

        Ext.apply(this, {
            items: [
                {
                    name: 'title',
                    xtype: 'textfield',
                    fieldLabel: '标题',
                    margin: '0 5 5 0',
                    value: me.msg['title'],
                    readOnly: true,
                    fieldBodyCls: "x-item-disabled"
                },
                {
                    name: 'content',
                    xtype: 'textareafield',
                    fieldLabel: '内容',
                    margin: '0 5 5 0',
                    value: me.msg['content'],
                    readOnly: true,
                    fieldBodyCls: "x-item-disabled"
                },
                {
                    name: 'timestamp',
                    xtype: 'textfield',
                    fieldLabel: '时间',
                    margin: '0 5 5 0',
                    value: Ext.Date.format(new Date(me.msg['timestamp']), "Y-m-d H:i:s"),
                    readOnly: true,
                    fieldBodyCls: "x-item-disabled"
                },
                {
                    name: 'src',
                    xtype: 'textfield',
                    fieldLabel: '来源',
                    margin: '0 5 5 0',
                    value: me.msg['src'],
                    readOnly: true,
                    fieldBodyCls: "x-item-disabled"
                }
            ]
        });
        me.callParent();
    }
});