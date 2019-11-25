/**
 * Created by enjoy on 2016/5/3 0003.
 */
Ext.define('OrientTdm.SysMgr.ParamterMgr.Common.ParamterForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.paramterForm',
    initComponent: function () {
        var me = this;
        var ori = this.originalData;
        var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
        if(ori) {
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
                                fieldLabel: '参数名称',
                                margin: '0 5 0 0',
                                afterLabelTextTpl: required,
                                allowBlank: false
                            }, {
                                name: 'datatype',
                                xtype: 'textfield',
                                fieldLabel: '参数类型',
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
                                name: 'value',
                                xtype: 'textfield',
                                fieldLabel: '参数值',
                                margin: '0 5 0 0',
                                afterLabelTextTpl: required,
                                allowBlank: false
                            }, {
                                name: 'description',
                                xtype: 'textarea',
                                fieldLabel: '参数描述'
                            }
                        ]
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
                    }]
            });
        }else {
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
                                fieldLabel: '参数名称',
                                margin: '0 5 0 0',
                                afterLabelTextTpl: required,
                                allowBlank: false
                            }, {
                                name: 'datatype',
                                xtype: 'textfield',
                                fieldLabel: '参数类型',
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
                                name: 'value',
                                xtype: 'textfield',
                                fieldLabel: '参数值',
                                margin: '0 5 0 0',
                                afterLabelTextTpl: required,
                                allowBlank: false
                            }, {
                                name: 'description',
                                xtype: 'textarea',
                                fieldLabel: '参数描述'
                            }
                        ]
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