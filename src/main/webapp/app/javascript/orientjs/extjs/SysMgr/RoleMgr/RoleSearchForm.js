Ext.define('OrientTdm.SysMgr.RoleMgr.RoleSearchForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.roleSearchForm',
    actionUrl: 'role/search.rdm',
    initComponent: function () {
        var me = this;
        Ext.apply(this, {
            items: [
                {
                    xtype: 'textfield',
                    name: 'name',
                    fieldLabel: '角色名称',
                    margin: '0 5 5 0',
                    grow: true,
                    labelWidth: 100
                }, {
                    xtype: 'textarea',
                    name: 'memo',
                    fieldLabel: '备注',
                    margin: '0 5 5 0',
                    grow: true,
                    labelWidth: 100,
                    height: 80
                }
            ],
            buttons: [
                {
                    text: '查询',
                    iconCls: 'icon-query',
                    handler: function () {
                        var form = this.up('form');
                        var vals = form.getForm().getValues();
                        for (var key in vals) {
                            if (!vals[key]) {
                                delete vals[key];
                            }
                        }
                        OrientExtUtil.AjaxHelper.doRequest('role/search.rdm', vals, true, function (resp) {
                            var data = resp.decodedData;
                            //保存成功后操作
                            if (form.successCallback) {
                                form.successCallback.call(form, data.results);
                            }
                        });
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
