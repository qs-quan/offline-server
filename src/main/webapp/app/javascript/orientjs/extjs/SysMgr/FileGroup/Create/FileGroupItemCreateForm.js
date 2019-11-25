/**
 * Created by enjoy on 2016/5/3 0003.
 */
Ext.define('OrientTdm.SysMgr.FileGroup.Create.FileGroupItemCreateForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.fileGroupItemCreateForm',
    actionUrl: serviceName + '/fileGroupItem/create.rdm',
    config: {
        belongFileGroupId: ""
    },
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
                            fieldLabel: '文件类型名称',
                            margin: '0 5 0 0',
                            afterLabelTextTpl: required,
                            allowBlank: false
                        }, {
                            name: 'suffix',
                            xtype: 'textfield',
                            fieldLabel: '后缀',
                            labelWidth: 60,
                            afterLabelTextTpl: required,
                            allowBlank: false
                        }
                    ]
                }, {
                    xtype: 'hiddenfield',
                    name: 'id'
                }, {
                    xtype: 'hiddenfield',
                    name: 'belongFileGroupId',
                    value: me.belongFileGroupId
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