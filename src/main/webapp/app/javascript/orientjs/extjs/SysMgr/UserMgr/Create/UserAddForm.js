/**
 * Created by duanduanpan on 16-3-16.
 */
Ext.define('OrientTdm.SysMgr.UserMgr.Create.UserAddForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    requires : ["OrientTdm.Common.Extend.Form.Field.OrientComboBoxTree"],
    alias: 'widget.userAddForm',
    actionUrl: serviceName + '/user/create.rdm',
    config: {
        deptNode: ''
    },
    initComponent: function () {
        var me = this;
        Ext.apply(this, {
            items: [
                {
                    xtype: 'panel',
                    layout: 'hbox',
                    bodyStyle: 'border-width:0 0 0 0; background:transparent',
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
                            anchor:'95%'
                        },
                        layoutConfig: {
                            pack: "start",
                            align: "stretch"
                        },
                        items: [
                            {
                                name: 'userName',
                                xtype: 'textfield',
                                labelWidth: 50,
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
                                labelWidth: 50,
                                fieldLabel: '姓名',
                                margin: '0 5 5 0',
                                allowBlank: false
                            },
                            {
                                name: 'password',
                                xtype: 'textfield',
                                labelWidth: 50,
                                fieldLabel: '密码',
                                margin: '0 5 5 0',
                                allowBlank: false,
                                inputType: "password"
                            },
                            {
                                name: 'sex',
                                xtype: 'orientComboBox',
                                labelWidth: 50,
                                fieldLabel: '性别',
                                margin: '0 5 5 0',
                                editable: false,
                                remoteUrl: serviceName + '/orientForm/getEnumCombobox.rdm?restrictionId=u1'
                            },
                            {
                                name: 'birthday',
                                xtype: 'datefield',
                                labelWidth: 50,
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
                            anchor:'100%'
                        },
                        layoutConfig: {
                            pack: "start",
                            align: "stretch"
                        },
                        items: [
                            {
                                name: 'phone',
                                xtype: 'textfield',
                                labelWidth: 50,
                                fieldLabel: '电话',
                                margin: '0 5 5 0'
                            },
                            {
                                name: 'mobile',
                                xtype: 'textfield',
                                labelWidth: 50,
                                fieldLabel: '手机',
                                margin: '0 5 5 0'
                            },
                            {
                                name: 'email',
                                xtype: 'textfield',
                                labelWidth: 50,
                                fieldLabel: '邮件',
                                margin: '0 5 5 0'
                            },
                            {
                                name: 'post',
                                xtype: 'orientComboBox',
                                labelWidth: 50,
                                fieldLabel: '职务',
                                margin: '0 5 5 0',
                                editable: false,
                                remoteUrl: serviceName + '/orientForm/getEnumCombobox.rdm?restrictionId=u2'
                            },
                            {
                                name: 'grade',
                                xtype: 'orientComboBox',
                                labelWidth: 50,
                                fieldLabel: '涉密等级',
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
                    allowBlank:false,
                    margin: '0 5 5 0',
                    grow: true,
                    labelWidth: 50,
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
                    labelWidth: 50,
                    height: 100
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
