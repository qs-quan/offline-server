/**
 * Created by enjoy on 2016/4/11 0011.
 */
Ext.define('OrientTdm.BackgroundMgr.ButtonInstance.Create.ButtonInstanceCreateForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.buttonInstanceCreateForm',
    actionUrl: serviceName + '/modelBtnInstance/create.rdm',
    initComponent: function () {
        var me = this;
        var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
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
                            name: 'name',
                            xtype: 'textfield',
                            fieldLabel: '按钮名称',
                            margin: '0 5 0 0',
                            afterLabelTextTpl: required,
                            allowBlank: false
                        }, {
                            name: 'code',
                            xtype: 'textfield',
                            fieldLabel: '按钮code',
                            afterLabelTextTpl: required,
                            allowBlank: false
                        }
                    ]
                }, {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    combineErrors: true,
                    defaults: {
                        flex: 1
                    },
                    items: [
                        {
                            name: 'formViewId',
                            xtype: 'orientComboBox',
                            fieldLabel: '绑定自定义表单',
                            remoteUrl: serviceName + '/modelFormView/getModelFormViewCombobox.rdm',
                            margin: '0 5 0 0'
                        },
                        {
                            name: 'btnTypeId',
                            xtype: 'orientComboBox',
                            fieldLabel: '按钮类型',
                            remoteUrl: serviceName + '/modelBtnType/getBtnTypeCombobox.rdm',
                            afterLabelTextTpl: required,
                            allowBlank: false
                        }
                    ]
                },
                {
                    name: 'jspath',
                    xtype: 'textfield',
                    labelWidth: 100,
                    fieldLabel: '自定义Ext类'
                }, {
                    xtype: 'hiddenfield',
                    name: 'id'
                }, {
                    xtype: 'hiddenfield',
                    name: 'issystem',
                    value: 0
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
        me.callParent(arguments);
    }
});