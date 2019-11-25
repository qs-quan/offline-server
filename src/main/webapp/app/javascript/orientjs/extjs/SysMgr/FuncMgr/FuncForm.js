Ext.define('OrientTdm.SysMgr.FuncMgr.FuncForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.FuncForm',
    actionUrl: serviceName + '/func/update.rdm',
    requires: [
        'OrientTdm.SysMgr.FuncMgr.Create.FuncAddForm',
        'OrientTdm.SysMgr.FuncMgr.Common.IconWindow'
    ],
    initComponent: function () {
        var me = this;
        Ext.apply(this, {
            hidden: true,
            items: [
                {
                    xtype: 'hiddenfield',
                    name: 'id'
                }, {
                    xtype: 'hiddenfield',
                    name: 'pid'
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
                        //var url = me.down('textfield[name=url]').getValue();
                        //var js = me.down('textfield[name=js]').getValue();
                        //if (url == '' && js == '') {
                        //    return '链接和JS类至少填一项'
                        //}
                        //this.clearInvalid();
                        return true;
                    }
                }, {
                    xtype: 'textfield',
                    name: 'js',
                    fieldLabel: 'JS类',
                    validator: function () {
                        //var url = me.down('textfield[name=url]').getValue();
                        //var js = me.down('textfield[name=js]').getValue();
                        //if (url == '' && js == '') {
                        //    return '链接和JS类至少填一项'
                        //}
                        //// if (js != '') {
                        ////     try {
                        ////         Ext.create(js);
                        ////     } catch (e) {
                        ////         return 'JS类不存在'
                        ////     }
                        //// }
                        //this.clearInvalid();
                        return true;
                    }
                }, {
                    xtype: 'radiogroup',
                    id: 'tbomFlg',
                    fieldLabel: '包含Bom',
                    items: [
                        {boxLabel: '是', name: 'tbomFlg', inputValue: '1'},
                        {boxLabel: '否', name: 'tbomFlg', inputValue: '0'}
                    ]
                }, {
                    xtype: 'hiddenfield',
                    name: 'icon',
                    id: 'iconUrl'
                }, {
                    xtype: 'panel',
                    layout: 'hbox',
                    bodyStyle: 'border-width:0 0 0 0; background:transparent',
                    items: [{
                        xtype: 'displayfield',
                        id: 'iconImg',
                        fieldLabel: '图标',
                        labelWidth: 100,
                        margin: '0 0 5 0'
                    }, {
                        xtype: 'button',
                        text: '选择',
                        id: 'iconSel',
                        margin: '5 0 5 50',
                        handler: function () {
                            var iconSelWin = Ext.create('OrientTdm.SysMgr.FuncMgr.Common.IconWindow', {
                                iconImgField: 'iconImg',
                                iconUrlField: 'iconUrl'
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
                /*{
                    id: 'funcCreate',
                    iconCls: 'icon-create',
                    text: '新增',
                    itemId: 'create',
                    scope: me,
                    handler: function () {
                        var oriData = {};
                        oriData.parentid = me.originalData.id;
                        var createWin = Ext.create('Ext.Window', {
                            title: '新增功能点',
                            plain: true,
                            height: 0.8 * globalHeight,
                            width: 0.5 * globalWidth,
                            layout: 'fit',
                            maximizable: true,
                            modal: true,
                            items: [Ext.create('OrientTdm.SysMgr.FuncMgr.Create.FuncAddForm', {
                                bindModelName: 'CWM_SYS_FUNCTION',
                                successCallback: function () {
                                    me.ownerCt.westPanel.fireEvent('refreshTree', false);
                                    createWin.close();
                                },
                                originalData: oriData
                            })]
                        });
                        createWin.show();
                    }
                },*/
                {
                    id: 'funcUpdate',
                    iconCls: 'icon-update',
                    text: '修改',
                    itemId: 'update',
                    scope: me,
                    handler: function () {
                        if( Ext.getCmp("funcUpdate").text=='修改'){
                            Ext.getCmp("funcUpdate").setText("保存");
                            me.items.each(function (item) {
                                if (item.xtype != 'panel') {
                                    item.setReadOnly(false);
                                }
                            });
                            Ext.getCmp('iconSel').setDisabled(false);
                        }else if( Ext.getCmp("funcUpdate").text=='保存'){
                            this.actionUrl = serviceName + '/func/update.rdm';
                            var oriData = {};
                            oriData.id = this.originalData.id;
                            oriData.pid = this.originalData.pid;
                            oriData.icon = Ext.getCmp('iconUrl').getValue();
                            this.getForm().setValues(oriData);
                            var westPanel = me.ownerCt.westPanel;
                            me.setSuccessCallback(function () {
                                westPanel.fireEvent('refreshTree', false);
                            });
                            var extraPrams = {'functionid': oriData.id, 'parentid': oriData.pid, 'icon': oriData.icon};
                            me.fireEvent('saveOrientForm', extraPrams);
                            Ext.getCmp("funcUpdate").setText("修改");
                            me.items.each(function (item) {
                                if (item.xtype != 'panel') {
                                    item.setReadOnly(true);
                                }
                            });
                            Ext.getCmp('iconSel').setDisabled(true);

                        }

                       /* this.actionUrl = serviceName + '/func/update.rdm';
                        var oriData = {};
                        oriData.id = this.originalData.id;
                        oriData.pid = this.originalData.pid;
                        oriData.icon = Ext.getCmp('iconUrl').getValue();
                        this.getForm().setValues(oriData);
                        var westPanel = me.ownerCt.westPanel;
                        me.setSuccessCallback(function () {
                            westPanel.fireEvent('refreshTree', false);
                        });
                        var extraPrams = {'functionid': oriData.id, 'parentid': oriData.pid, 'icon': oriData.icon};
                        me.fireEvent('saveOrientForm', extraPrams);*/
                    }
                }/*,
                {
                    id: 'funcDelete',
                    iconCls: 'icon-delete',
                    text: '删除',
                    disabled: false,
                    itemId: 'delete',
                    scope: me,
                    handler: function () {
                        var me = this;
                        var westPanel = me.ownerCt.westPanel;
                        OrientExtUtil.TreeHelper.deleteNodes(westPanel, serviceName + '/func/delete.rdm', function () {
                            westPanel.fireEvent('refreshTree', false);
                        });
                    }
                }*/
            ]
        });
        this.callParent(arguments);
    }
});
