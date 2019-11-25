/**
 * Created by enjoy on 2016/4/11 0011.
 */
Ext.define('OrientTdm.BackgroundMgr.Component.Common.ComponentForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.componentForm',
    initComponent: function () {
        var me = this;
        var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
        if(this.originalData) {
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
                                name: 'componentname',
                                xtype: 'textfield',
                                fieldLabel: '组件名称',
                                margin: '0 5 0 0',
                                afterLabelTextTpl: required,
                                allowBlank: false
                            },
                            {
                                name: 'classname',
                                xtype: 'orientComboBox',
                                fieldLabel: '绑定组件类',
                                margin: '0 5 0 0',
                                remoteUrl: serviceName + '/Component/getComponentBeanList.rdm',
                                allowBlank: false
                            }
                        ]
                    },{
                        name: 'remark',
                        xtype: 'textarea',
                        fieldLabel: '组件说明',
                        margin: '0 5 0 0'
                    }, {
                        xtype: 'hiddenfield',
                        name: 'id'
                    }
                ],
                buttons: [
                    {
                        text: '保存',
                        iconCls:'icon-save',
                        handler: function () {
                            me.fireEvent("saveOrientForm");
                        }
                    }
                ]
            });
        }else{
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
                                name: 'componentname',
                                xtype: 'textfield',
                                fieldLabel: '组件名称',
                                margin: '0 5 0 0',
                                afterLabelTextTpl: required,
                                allowBlank: false
                            },
                            {
                                name: 'classname',
                                xtype: 'orientComboBox',
                                fieldLabel: '绑定组件类',
                                margin: '0 5 0 0',
                                remoteUrl: serviceName + '/Component/getComponentBeanList.rdm',
                                allowBlank: false
                            }
                        ]
                    },{
                        name: 'remark',
                        xtype: 'textarea',
                        fieldLabel: '组件说明',
                        margin: '0 5 0 0'
                    }, {
                        xtype: 'hiddenfield',
                        name: 'id'
                    }
                ],
                buttons: [
                    {
                        text: '保存',
                        iconCls: 'icon-save',
                        handler: function () {
                            me.fireEvent("saveOrientForm");
                        }
                    },
                    {
                        text: '保存并关闭',
                        iconCls: 'icon-saveAndClose',
                        handler: function () {
                            me.fireEvent("saveOrientForm", {}, true);
                        }
                    },
                    {
                        text: '清空',
                        iconCls: 'icon-clear',
                        handler: function () {
                            this.up('form').getForm().reset();
                        }
                    }
                ]
            });
        }

        me.callParent(arguments);
    }
});