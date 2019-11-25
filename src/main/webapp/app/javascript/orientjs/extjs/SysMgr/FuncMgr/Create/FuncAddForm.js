Ext.define('OrientTdm.SysMgr.FuncMgr.Create.FuncAddForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.FuncAddForm',
    actionUrl: serviceName + '/func/create.rdm',
    initComponent: function () {
        var me = this;
        Ext.apply(this, {
            items: [
                {
                    xtype: 'hiddenfield',
                    name: 'parentid'
                }, {
                    xtype: 'textfield',
                    name: 'code',
                    fieldLabel: '业务功能代号',
                    allowBlank: false
                }, {
                    xtype: 'textfield',
                    name: 'name',
                    fieldLabel: '业务功能名称',
                    allowBlank: false
                }, {
                    xtype: 'numberfield',
                    name: 'position',
                    fieldLabel: '位置',
                    minValue: 0,
                    allowBlank: false
                }, {
                    xtype: 'textfield',
                    name: 'url',
                    fieldLabel: '链接',
                    validator: function () {
                        //var url = me.down("textfield[name=url]").getValue();
                        //var js = me.down("textfield[name=js]").getValue();
                        //if (url == "" && js == "") {
                        //    return "链接和JS类至少填一项"
                        //}
                        //this.clearInvalid();
                        return true;
                    }
                }, {
                    xtype: 'textfield',
                    name: 'js',
                    fieldLabel: 'JS类',
                    validator: function () {
                        //var url = me.down("textfield[name=url]").getValue();
                        //var js = me.down("textfield[name=js]").getValue();
                        //if (url == "" && js == "") {
                        //    return "链接和JS类至少填一项"
                        //}
                        //// if (js != "") {
                        ////     try {
                        ////         Ext.create(js);
                        ////     } catch (e) {
                        ////         return "JS类不存在"
                        ////     }
                        //// }
                        //this.clearInvalid();
                        return true;
                    }
                }, {
                    xtype: 'radiogroup',
                    id: 'tbomFlg_Add',
                    fieldLabel: '包含Bom',
                    columns: 1,
                    items: [
                        {boxLabel: '是', name: 'tbomFlg', inputValue: '1'},
                        {boxLabel: '否', name: 'tbomFlg', inputValue: '0', checked: true}
                    ]
                }, {
                    xtype: 'hiddenfield',
                    name: 'icon',
                    id: 'iconUrl_Add',
                    value: "app/images/function/表单管理.png"
                }, {
                    xtype: 'panel',
                    layout: 'hbox',
                    bodyStyle: 'border-width:0 0 0 0; background:transparent',
                    items: [{
                        xtype: 'displayfield',
                        id: 'iconImg_Add',
                        fieldLabel: '图标',
                        value: '<img src="app/images/function/表单管理.png" />',
                        labelWidth: 100,
                        margin: '0 0 5 0'
                    }, {
                        xtype: 'button',
                        text: '选择',
                        margin: '5 0 5 50',
                        handler: function () {
                            var iconSelWin = Ext.create("OrientTdm.SysMgr.FuncMgr.Common.IconWindow", {
                                iconImgField: 'iconImg_Add',
                                iconUrlField: 'iconUrl_Add'
                            });
                            iconSelWin.show();
                        }
                    }]
                }, {
                    xtype: 'textarea',
                    name: 'notes',
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
                        me.fireEvent("saveOrientForm", {}, false);
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