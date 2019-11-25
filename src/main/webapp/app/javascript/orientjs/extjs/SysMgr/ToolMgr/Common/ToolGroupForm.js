/**
 * Created by enjoy on 2016/5/3 0003.
 */
Ext.define('OrientTdm.SysMgr.ToolMgr.Common.ToolGroupForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.toolGroupForm',
    config: {
        actionUrl: ""
    },
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
                                name: 'groupName',
                                xtype: 'textfield',
                                fieldLabel: '分组名称',
                                margin: '0 5 0 0',
                                afterLabelTextTpl: required,
                                allowBlank: false
                            },
                            {
                                name: 'groupType',
                                xtype: 'textfield',
                                fieldLabel: '分组类型',
                                afterLabelTextTpl: required,
                                allowBlank: false
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
                                name: 'groupName',
                                xtype: 'textfield',
                                fieldLabel: '分组名称',
                                margin: '0 5 0 0',
                                afterLabelTextTpl: required,
                                allowBlank: false
                            },
                            {
                                name: 'groupType',
                                xtype: 'textfield',
                                fieldLabel: '分组类型',
                                afterLabelTextTpl: required,
                                allowBlank: false
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