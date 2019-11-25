/**
 * Created by duanduanpan on 16-3-16.
 */
Ext.define('OrientTdm.SysMgr.UserMgr.Update.UserUpdateForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.userUpdateForm',
    actionUrl: serviceName + '/user/update.rdm',
    initComponent: function () {
        var me = this;
        Ext.apply(this, {
            items: [
                {
                    xtype: 'panel',
                    bodyStyle: 'border-width:0 0 0 0; background:transparent',
                    layout: 'hbox',
                    combineErrors: true,
                    defaults: {
                        flex: 1
                    },
                    layoutConfig: {
                        pack: "start",
                        align: "stretch"
                    },
                    items: [{
                        xtype: 'fieldcontainer',
                        layout: 'anchor',
                        combineErrors: true,
                        defaults: {
                            flex: 1,
                            anchor: '100%'
                        },
                        layoutConfig: {
                            pack: "start",
                            align: "stretch"
                        },
                        items: [
                            {
                                xtype: 'hiddenfield',
                                name: 'id'
                            },
                            {
                                name: 'userName',
                                xtype: 'textfield',
                                fieldLabel: '账号',
                                margin: '0 5 5 0',
                                vtype: 'unique',
                                validateOnChange: false,
                                columnName: "USER_NAME",
                                allowBlank: false
                            },
                            {
                                name: 'allName',
                                xtype: 'textfield',
                                fieldLabel: '姓名',
                                margin: '0 5 5 0',
                                allowBlank: false
                            },
                            {
                                name: 'password',
                                xtype: 'textfield',
                                fieldLabel: '密码',
                                margin: '0 5 5 0',
                                allowBlank: false,
                                inputType: "password"
                            },
                            {
                                name: 'sex',
                                xtype: 'orientComboBox',
                                fieldLabel: '性别',
                                margin: '0 5 5 0',
                                editable: false,
                                remoteUrl: serviceName + '/orientForm/getEnumCombobox.rdm?restrictionId=u1'
                            },
                            {
                                name: 'birthday',
                                xtype: 'datefield',
                                fieldLabel: '生日',
                                margin: '0 5 5 0',
                                editable: false,
                                format: 'Y-m-d',
                                maxValue: new Date()
                            }
                        ]
                    }, {
                        xtype: 'fieldcontainer',
                        layout: 'anchor',
                        combineErrors: true,
                        defaults: {
                            flex: 1,
                            anchor: '100%'
                        },
                        layoutConfig: {
                            pack: "start",
                            align: "stretch"
                        },
                        items: [
                            {
                                name: 'phone',
                                xtype: 'textfield',
                                fieldLabel: '电话',
                                margin: '0 5 5 0'
                            },
                            {
                                name: 'mobile',
                                xtype: 'textfield',
                                fieldLabel: '手机',
                                margin: '0 5 5 0'
                            },
                            {
                                name: 'email',
                                xtype: 'textfield',
                                fieldLabel: '邮件',
                                margin: '0 5 5 0'
                            },
                            {
                                name: 'post',
                                xtype: 'orientComboBox',
                                fieldLabel: '职务',
                                margin: '0 5 5 0',
                                editable: false,
                                remoteUrl: serviceName + '/orientForm/getEnumCombobox.rdm?restrictionId=u2'
                            },
                            {
                                name: 'grade',
                                xtype: 'orientComboBox',
                                fieldLabel: '密级',
                                margin: '0 5 5 0',
                                editable: false,
                                remoteUrl: serviceName + '/orientForm/getEnumCombobox.rdm?restrictionId=u3'
                            }
                        ]
                    }]
                },
                {
                    xtype: 'orientComboboxTree',
                    name: 'department',
                    fieldLabel: '部门',
                    margin: '0 5 5 0',
                    grow: true,
                    labelWidth: 100,
                    root: {
                        text: 'root',
                        id: '-1',
                        expanded: true
                    },
                    url: serviceName + '/dept/getByPid.rdm',
                    displayField: "text",
                    valueField: "id"
                },
                {
                    name: 'notes',
                    xtype: 'textarea',
                    fieldLabel: '备注',
                    margin: '0 5 5 0',
                    grow: true,
                    labelWidth: 100,
                    height: 200
                }
            ],
            buttons: [
                {
                    text: '保存并关闭',
                    iconCls: 'icon-saveAndClose',
                    handler: function () {
                        me.fireEvent("saveOrientForm", {}, true);
                    }
                },
                {
                    text: '保存',
                    iconCls: 'icon-save',
                    handler: function () {
                        me.fireEvent("saveOrientForm");
                    }
                },
                {
                    text: '关闭',
                    iconCls: 'icon-close',
                    handler: function () {
                        this.up('window').close();
                    }
                }
            ]
        });
        this.callParent(arguments);
    }

});
