/**
 * Created by Seraph on 16/7/11.
 */
Ext.define("OrientTdm.Collab.common.team.roleUserMng.RoleUserMngPanel", {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    config: {
        initRoleName : null
    },
    requires: [
    ],
    initComponent: function () {
        var me = this;
        if(this.initRoleName) {
            Ext.apply(me, {
                bindModelName : 'COLLAB_ROLE',
                items: [
                    {
                        xtype: 'fieldset',
                        title: '详情',
                        collapsible: true,
                        defaults: {
                            labelWidth: 89,
                            anchor: '100%',
                            layout: {
                                type: 'vbox',
                                defaultMargins: {top: 15, right: 15, bottom: 0, left: 15}
                            }
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                name: 'name',
                                fieldLabel: '角色名称',
                                margin: '0 5 5 0',
                                // vtype: 'unique',
                                allowBlank: false,
                                grow: true,
                                labelWidth: 100,
                                width:300,
                                value : me.initRoleName
                            }]
                    }
                ],
                buttons: [{
                    text: '保存',
                    iconCls: 'icon-saveSingle',
                    handler: function () {
                        var form = this.up('form').getForm();
                        if (form.isValid()) {
                            form.submit({
                                success: function(form, action) {
                                    me.successCallback();
                                },
                                failure: function(form, action) {
                                    OrientExtUtil.Common.err('保存失败', action.result.msg);
                                }
                            });
                        }
                    }
                }, {
                    text: '清空',
                    iconCls: 'icon-clear',
                    handler: function () {
                        this.up('form').getForm().reset();
                    }
                }
                ]
            });
        } else {
            Ext.apply(me, {
                bindModelName : 'COLLAB_ROLE',
                items: [
                    {
                        xtype: 'fieldset',
                        title: '详情',
                        collapsible: true,
                        defaults: {
                            labelWidth: 89,
                            anchor: '100%',
                            layout: {
                                type: 'vbox',
                                defaultMargins: {top: 15, right: 15, bottom: 0, left: 15}
                            }
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                name: 'name',
                                fieldLabel: '角色名称',
                                margin: '0 5 5 0',
                                // vtype: 'unique',
                                allowBlank: false,
                                grow: true,
                                labelWidth: 100,
                                width:300,
                                value : me.initRoleName
                            }]
                    }
                ],
                buttons: [{
                    text: '保存',
                    iconCls: 'icon-saveSingle',
                    handler: function () {
                        var form = this.up('form').getForm();
                        if (form.isValid()) {
                            form.submit({
                                success: function(form, action) {
                                    me.successCallback();
                                },
                                failure: function(form, action) {
                                    OrientExtUtil.Common.err('保存失败', action.result.msg);
                                }
                            });
                        }
                    }
                }, {
                    text: '保存并关闭',
                    iconCls: 'icon-saveAndClose',
                    handler: function () {
                        me.fireEvent("saveOrientForm", {}, true);
                    }
                },{
                    text: '清空',
                    iconCls: 'icon-clear',
                    handler: function () {
                        this.up('form').getForm().reset();
                    }
                }
                ]
            });
        }

        this.callParent(arguments);
    }
});