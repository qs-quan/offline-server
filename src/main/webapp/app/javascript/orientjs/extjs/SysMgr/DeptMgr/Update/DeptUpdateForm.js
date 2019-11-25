Ext.define('OrientTdm.SysMgr.DeptMgr.Update.DeptUpdateForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.deptUpdateForm',
    actionUrl: serviceName + '/dept/update.rdm',
    initComponent: function () {
        var me = this;
        Ext.apply(this, {
            items: [
                {
                    xtype: 'hiddenfield',
                    name: 'id'
                },
                {
                    xtype: 'hiddenfield',
                    name: 'pid'
                },
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: '名称',
                    vtype: 'unique',
                    validateOnChange: false,
                    columnName: "NAME",
                    allowBlank: false
                },
                {
                    name: 'function',
                    xtype: 'textfield',
                    fieldLabel: '职能'
                },
                {
                    name: 'order',
                    xtype: 'numberfield',
                    fieldLabel: '排序'
                },
                {
                    name: 'notes',
                    xtype: 'textarea',
                    fieldLabel: '备注',
                    height: 200
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
        this.callParent(arguments);
    }

});
