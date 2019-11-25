/**
 * Created by duanduanpan on 16-3-16.
 */
Ext.define('OrientTdm.SysMgr.RoleMgr.Create.RoleAddForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.roleAddForm',
    actionUrl: serviceName + '/role/create.rdm',
    initComponent: function () {
        var me = this;
        Ext.apply(this, {
            items: [
                {
                    xtype: 'textfield',
                    name: 'name',
                    fieldLabel: '角色名称',
                    margin: '0 5 5 0',
                    vtype: 'unique',
                    columnName: "NAME",
                    allowBlank: false,
                    grow: true,
                    labelWidth: 100
                }, {
                    xtype: 'textarea',
                    name: 'memo',
                    fieldLabel: '备注',
                    margin: '0 5 5 0',
                    grow: true,
                    labelWidth: 100,
                    height: 100
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
