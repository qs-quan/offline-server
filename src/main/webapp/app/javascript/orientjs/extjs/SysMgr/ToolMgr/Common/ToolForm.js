/**
 * Created by enjoy on 2016/5/3 0003.
 */
Ext.define('OrientTdm.SysMgr.ToolMgr.Common.ToolForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.toolForm',
    config: {
        belongGroupId: "",
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
                                name: 'toolName',
                                xtype: 'textfield',
                                fieldLabel: '工具名称',
                                labelWidth: 60,
                                margin: '0 5 0 0',
                                afterLabelTextTpl: required,
                                allowBlank: false
                            },
                            {
                                name: 'toolVersion',
                                xtype: 'textfield',
                                fieldLabel: '工具版本',
                                labelWidth: 60,
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
                                xtype: 'FileColumnDesc',
                                labelWidth: 60,
                                columnDesc: {
                                    text: '工具图标',
                                    sColumnName: 'toolIcon',
                                    isRequired: true
                                },
                                margin: '10px 60px 10px -5px'
                            },
                            {
                                xtype: 'FileColumnDesc',
                                labelWidth: 80,
                                columnDesc: {
                                    text: '工具安装文件',
                                    sColumnName: 'toolCode',
                                    isRequired: true
                                },
                                margin: '10px 20px 10px -60px'
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
                                name: 'toolType',
                                xtype: 'textfield',
                                fieldLabel: '工具类型',
                                labelWidth: 60,
                                margin: '0 5 0 0'
                            },
                            {
                                name: 'toolDescription',
                                xtype: 'textarea',
                                fieldLabel: '工具描述',
                                labelWidth: 60
                            }
                        ]
                    }, {
                        xtype: 'hiddenfield',
                        name: 'id'
                    }, {
                        xtype: 'hiddenfield',
                        name: 'groupId',
                        value: me.belongGroupId
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
                                name: 'toolName',
                                xtype: 'textfield',
                                fieldLabel: '工具名称',
                                labelWidth: 60,
                                margin: '0 5 0 0',
                                afterLabelTextTpl: required,
                                allowBlank: false
                            },
                            {
                                name: 'toolVersion',
                                xtype: 'textfield',
                                fieldLabel: '工具版本',
                                labelWidth: 60,
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
                                xtype: 'FileColumnDesc',
                                labelWidth: 60,
                                columnDesc: {
                                    text: '工具图标',
                                    sColumnName: 'toolIcon',
                                    isRequired: true
                                },
                                margin: '10px 60px 10px -5px'
                            },
                            {
                                xtype: 'FileColumnDesc',
                                labelWidth: 80,
                                columnDesc: {
                                    text: '工具安装文件',
                                    sColumnName: 'toolCode',
                                    isRequired: true
                                },
                                margin: '10px 20px 10px -60px'
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
                                name: 'toolDescription',
                                xtype: 'textarea',
                                fieldLabel: '工具描述',
                                labelWidth: 60
                            }
                        ]
                    }, {
                        xtype: 'hiddenfield',
                        name: 'id'
                    }, {
                        xtype: 'hiddenfield',
                        name: 'groupId',
                        value: me.belongGroupId
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