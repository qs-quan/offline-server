/**
 * Created by enjoy on 2016/5/3 0003.
 */
Ext.define('OrientTdm.SysMgr.LogMgr.Query.SysLogQuery', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.sysLogQuery',
    buttonAlign: 'center',
    initComponent: function () {
        var me = this;
        Ext.apply(this, {
            items: [
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    combineErrors: true,
                    defaults: {
                        flex: 1
                    },
                    items: [
                        {
                            name: 'opUserId',
                            xtype: 'textfield',
                            fieldLabel: '操作人',
                            margin: '0 5 0 0'
                        }, {
                            name: 'opDate_s',
                            xtype: 'datetimefield',
                            fieldLabel: '操作时间',
                            margin: '0 5 0 0',
                            flex: 0.5
                        }, {
                            name: 'opDate_e',
                            xtype: 'datetimefield',
                            labelWidth: 30,
                            fieldLabel: '至',
                            flex: 0.5
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    combineErrors: true,
                    defaults: {
                        flex: 1
                    },
                    items: [
                        {
                            name: 'opIpAddress',
                            xtype: 'textfield',
                            fieldLabel: '操作人IP',
                            margin: '0 5 0 0'
                        }, {
                            name: 'opTarget',
                            xtype: 'textfield',
                            fieldLabel: '操作目标'
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    combineErrors: true,
                    defaults: {
                        flex: 1
                    },
                    items: [
                        {
                            name: 'opResult',
                            xtype: 'textfield',
                            fieldLabel: '操作结果',
                            margin: '0 5 0 0'
                        }, {
                            name: 'opRemark',
                            xtype: 'textfield',
                            fieldLabel: '操作说明'
                        }
                    ]
                }
            ],
            buttons: [
                {
                    text: '查询',
                    iconCls: 'icon-query',
                    handler: function () {
                        me._doQuery();
                    }
                },
                {
                    text: '清空',
                    iconCls: 'icon-clear',
                    handler: function () {
                        this.up('form').getForm().reset();
                        me._doQuery();
                    }
                }
            ]
        });
        me.callParent(arguments);
    },
    _doQuery: function () {
        var me = this;
        var formValue = OrientExtUtil.FormHelper.generateFormData(me.getForm());
        if (me.ownerCt.centerPanel) {
            me.ownerCt.centerPanel.fireEvent("filterByFilter", formValue);
        }
    }
});