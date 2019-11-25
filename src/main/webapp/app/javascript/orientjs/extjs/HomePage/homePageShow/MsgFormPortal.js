/**
 * 消息列表磁贴
 */
Ext.define('OrientTdm.HomePage.homePageShow.MsgFormPortal', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    requires: [
        'OrientTdm.HomePage.Msg.CwmMsg'
    ],
    config: {
        msgGridId: "",
        msgDataId:""
    },
    initComponent: function () {
        var me = this;
        Ext.apply(this, {
            items: [
                {
                    xtype: 'textfield',
                    name: 'title',
                    fieldLabel: '标题',
                    labelStyle: 'text-align:right;',
                    margin: '0 5 5 0',
                    columnName: 'TITLE',
                    grow: true,
                    labelWidth: 60,
                    readOnly: true
                }, {
                    xtype: 'textarea',
                    name: 'content',
                    fieldLabel: '内容',
                    labelStyle: 'text-align:right;',
                    margin: '0 5 5 0',
                    grow: true,
                    columnName: 'CONTENT',
                    labelWidth: 60,
                    height: 100,
                    readOnly: true
                },{
                    xtype: 'textfield',
                    name: 'timestamp',
                    fieldLabel: '时间',
                    labelStyle: 'text-align:right;',
                    margin: '0 5 5 0',
                    columnName: 'TIMESTAMP',
                    grow: true,
                    labelWidth: 60,
                    readOnly: true
                },{
                    xtype: 'textfield',
                    name: 'src',
                    fieldLabel: '来源',
                    labelStyle: 'text-align:right;',
                    margin: '0 5 5 0',
                    columnName: 'SRC',
                    grow: true,
                    labelWidth: 60,
                    readOnly: true
                }
            ],
            buttons: [
                {
                    text: '关闭',
                    iconCls: 'icon-close',
                    scope: me,
                    handler: function () {
                        me.fireEvent('saveOrientForm', {}, true);
                        OrientExtUtil.HomeHelper.refreshNoticeMsgCount();
                    }
                }
            ],
            listeners: {
                afterrender: function(panel) {
                    var dataIds = new Array();
                    dataIds.push(panel.msgDataId);

                    //标记当前信息为已读
                    Ext.Ajax.request({
                        url : serviceName + "/msg/markReaded.rdm",
                        method : 'POST',
                        params : {
                            readed: true
                        },
                        jsonData: Ext.encode(dataIds),
                        headers: {
                            "Content-Type": "application/json;charset=UTF-8"
                        },
                        success : function(response, options) {
                            Ext.getCmp(panel.msgGridId).fireEvent('refreshGrid');
                        },
                        failure : function(result, request) {
                            Ext.MessageBox.alert("错误", "消息标记出错");
                        }
                    });
                }
            }

        });
        this.callParent(arguments);
    },
    saveOrientForm: function (extraParams, callBackArguments) {
        extraParams = extraParams || {};
        var me = this;
        if (me.getSuccessCallback()) me.getSuccessCallback().apply(me, [{}, callBackArguments]);
    }
});