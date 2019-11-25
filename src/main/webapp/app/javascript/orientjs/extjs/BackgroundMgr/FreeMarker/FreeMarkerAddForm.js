/**
 * Created by duanduanpan on 16-3-16.
 */
Ext.define('OrientTdm.BackgroundMgr.FreeMarker.FreeMarkerAddForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.freeMarkerAddForm',
    actionUrl: serviceName + '/freeMarkFormTemplate/create.rdm',
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
                            name: 'name',
                            xtype: 'textfield',
                            fieldLabel: '名称',
                            margin: '0 5 0 0',
                            allowBlank: false
                        }, {
                            name: 'alias',
                            xtype: 'textfield',
                            fieldLabel: '别名',
                            validateOnChange: false,
                            vtype: 'unique',
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
                            name: 'desc',
                            xtype: 'textareafield',
                            margin: '0 5 0 0',
                            fieldLabel: '说明'
                        }, {
                            xtype: 'radiogroup',
                            fieldLabel: '模板类型',
                            items: [
                                {boxLabel: '主表模板', name: 'type', checked: true, inputValue: "主表模板"},
                                {boxLabel: '宏模板', name: 'type', inputValue: "宏模板"}
                            ]
                        }
                    ]
                }, {
                    name: 'html',
                    xtype: 'textareafield',
                    grow: true,
                    labelWidth: 100,
                    height: 300,
                    fieldLabel: '模板HTML',
                    allowBlank: false
                }, {
                    xtype: 'hiddenfield',
                    name: 'id'
                }, {
                    xtype: 'hiddenfield',
                    name: 'macroAlias'
                }, {
                    xtype: 'hiddenfield',
                    name: 'canedit'
                }
            ],
            buttons: [
                {
                    text: '保存',
                    iconCls: 'icon-save',
                    handler: function () {
                        me.fireEvent("saveOrientForm");
                    }
                }, {
                    text: '保存并关闭',
                    iconCls: 'icon-saveAndClose',
                    handler: function () {
                        me.fireEvent("saveOrientForm", {}, true);
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
        this.callParent(arguments);
    }

});
