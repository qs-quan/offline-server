/**
 * Created by duanduanpan on 16-3-16.
 */
Ext.define('OrientTdm.BackgroundMgr.CustomForm.Create.ModelViewAddForm', {
    extend: "OrientTdm.Common.Extend.Form.OrientForm",
    alias: 'widget.modelViewAddForm',
    actionUrl: serviceName + '/modelFormView/create.rdm',
    initComponent: function () {
        var me = this;
        Ext.apply(this, {
            items: [
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    combineErrors: true,
                    defaults: {
                        flex: 1,
                        labelAlign: 'right'
                    },
                    items: [
                        {
                            name: 'name',
                            xtype: 'textfield',
                            fieldLabel: '表单标题',
                            margin: '10 5 0 0',
                            afterLabelTextTpl: '<span style="color:red;font-weight:bold" data-qtip="必填项">*</span>',
                            allowBlank: false
                        }, {
                            xtype: 'SimpleColumnDescForSelector',
                            margin: '10 5 0 0',
                            columnDesc: {
                                isRequired: true,
                                sColumnName: 'modelid',
                                text: '绑定数据库模型',
                                editAble: true,
                                selector: "{'selectorType': '2','multiSelect': false,'selectorName': '选择模型'}"
                            }
                        }
                    ]
                }, {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    combineErrors: true,
                    defaults: {
                        flex: 1,
                        labelAlign: 'right'
                    },
                    items: [
                        {
                            name: 'templateid',
                            xtype: 'orientComboBox',
                            fieldLabel: '绑定表单模板',
                            afterLabelTextTpl: '<span style="color:red;font-weight:bold" data-qtip="必填项">*</span>',
                            remoteUrl: serviceName + '/freeMarkFormTemplate/getFreemarkerTemplateCombobox.rdm',
                            allowBlank: false
                        }
                    ]
                }, {
                    name: 'desc',
                    xtype: 'textareafield',
                    labelAlign: 'right',
                    grow: true,
                    labelWidth: 100,
                    height: 50,
                    fieldLabel: '表单描述'
                }, {
                    xtype: 'hiddenfield',
                    name: 'id'
                }, {
                    xtype: 'hiddenfield',
                    name: 'title'
                }, {
                    xtype: 'hiddenfield',
                    name: 'html'
                }, {
                    xtype: 'hiddenfield',
                    name: 'template'
                }, {
                    xtype: 'hiddenfield',
                    name: 'versionno'
                }, {
                    xtype: 'hiddenfield',
                    name: 'isdefault'
                }, {
                    xtype: 'hiddenfield',
                    name: 'ispublished'
                }, {
                    xtype: 'hiddenfield',
                    name: 'publishedby'
                }, {
                    xtype: 'hiddenfield',
                    name: 'publishtime'
                }, {
                    xtype: 'hiddenfield',
                    name: 'createby'
                }, {
                    xtype: 'hiddenfield',
                    name: 'createtime'
                }, {
                    xtype: 'hiddenfield',
                    name: 'designtype'
                }
            ],
            buttons: []
        });
        this.callParent(arguments);
    }

});
