/**
 * Created by enjoy on 2016/4/11 0011.
 */
Ext.define('OrientTdm.BackgroundMgr.PVMTemplate.Common.PVMTemplateForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.pvmTemplateForm',
    initComponent: function () {
        var me = this;
        var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
        var templateAllowBlank = me.originalData ? true : false;
        var canChangeModel = me.originalData ? false : true;
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
                            fieldLabel: '模板名称',
                            margin: '0 5 0 0',
                            afterLabelTextTpl: required,
                            allowBlank: false
                        }, {
                            xtype: 'SimpleColumnDescForSelector',
                            margin: '0 5 0 0',
                            columnDesc: {
                                isRequired: true,
                                sColumnName: 'checkmodelid',
                                isSysUnique: true,
                                text: '绑定数据库模型',
                                editAble: canChangeModel,
                                selector: "{'selectorType': '2','multiSelect': false,'selectorName': '选择模型'}"
                            }
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
                            name: 'groupname',
                            xtype: 'textfield',
                            fieldLabel: '所属分组',
                            margin: '0 5 0 0',
                            afterLabelTextTpl: required,
                            allowBlank: false,
                            value: '默认分组'
                        }, {
                            xtype: 'filefield',
                            emptyText: '选择一个模板文件',
                            fieldLabel: '文件',
                            name: 'templateFile',
                            allowBlank: templateAllowBlank,
                            buttonText: '',
                            buttonConfig: {
                                iconCls: 'icon-upload'
                            },
                            validator: function (filePath) {
                                //只准xls 获取 xlsx后缀的文件上传
                                if (!Ext.isEmpty(filePath)) {
                                    var fileSuffix = filePath.substring(filePath.lastIndexOf('.') + 1, filePath.length);
                                    if ('xls' == fileSuffix || 'xlsx' == fileSuffix) {
                                        return true;
                                    } else
                                        return '只能上传Excel文件';
                                }
                                return true;
                            }
                        }
                    ]
                },{
                    xtype: 'hiddenfield',
                    name: 'id'
                }, {
                    xtype: 'hiddenfield',
                    name: 'checkmodelid'
                }, {
                    xtype: 'hiddenfield',
                    name: 'templatepath'
                }, {
                    xtype: 'hiddenfield',
                    name: 'createuser'
                }, {
                    xtype: 'hiddenfield',
                    name: 'uploadtime'
                }
            ],
            buttons: [
                {
                    text:'下载示例模板',
                    iconCls:'icon-download',
                    handler:function() {
                        me.download();
                    }
                },
                {
                    text: '保存',
                    iconCls:'icon-save',
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
                }, {
                    text: '清空',
                    iconCls: 'icon-clear',
                    handler: function () {
                        this.up('form').getForm().reset();
                    }
                }
            ]
        });
        me.callParent(arguments);
    },
    download:function() {
        var me = this;
        var modelName = me.down('SimpleColumnDescForSelector').down('textfield[name=checkmodelid_display]').getValue();
        var modelId = me.down('SimpleColumnDescForSelector').down('hiddenfield[name=checkmodelid]').getValue();
        if(!modelId) {
            Ext.MessageBox.show({
                title: '新增错误',
                msg: '未绑定数据表',
                icon: Ext.MessageBox.ERROR,
                buttons: Ext.Msg.OK
            });
            return;
        }
        window.location.href = serviceName + '/CheckModelDataTemplate/downloadExampleExcel.rdm?modelName='+modelName+'&modelId='+modelId;
    }
});