Ext.define('OrientTdm.SysMgr.DeptMgr.DeptForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.DeptForm',
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
                    //vtype: 'unique',
                    columnName: 'NAME',
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
                    iconCls: 'icon-create',
                    text: '新增',
                    itemId: 'create',
                    scope: me,
                    handler: function () {
                        var oriData = {};
                        oriData.pid = me.originalData.id;
                        var createWin = Ext.create('Ext.Window', {
                            title: '新增部门',
                            plain: true,
                            height: 0.6 * globalHeight,
                            width: 0.5 * globalWidth,
                            layout: 'fit',
                            maximizable: true,
                            modal: true,
                            items: [Ext.create(OrientTdm.SysMgr.DeptMgr.Create.DeptAddForm, {
                                bindModelName: 'CWM_SYS_DEPARTMENT',
                                successCallback: function () {
                                    me.ownerCt.westPanel.fireEvent('refreshTreeAndSelOne');
                                    createWin.close();
                                },
                                originalData: oriData
                            })]
                        });
                        createWin.show();
                    }
                },
                {
                    iconCls: 'icon-update',
                    text: '修改',
                    itemId: 'update',
                    scope: me,
                    handler: function () {
                        this.actionUrl = serviceName + '/dept/update.rdm';
                        var oriData = {};
                        oriData.id = this.originalData.id;
                        oriData.pid = this.originalData.pid;
                        this.getForm().setValues(oriData);
                        var westPanel = me.ownerCt.westPanel;
                        me.setSuccessCallback(function () {
                            westPanel.fireEvent('refreshTreeAndSelOne',oriData.id);
                        });
                        me.fireEvent('saveOrientForm');
                    }
                },
                {
                    iconCls: 'icon-delete',
                    text: '删除',
                    disabled: false,
                    itemId: 'delete',
                    scope: me,
                    handler: function () {
                        if (this.originalData.id == -2) {
                            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.rootDelForbidden);
                            return;
                        }
                        var me = this;
                        var westPanel = me.ownerCt.westPanel;
                        OrientExtUtil.TreeHelper.deleteNodes(westPanel, serviceName + '/dept/delete.rdm', function () {
                            westPanel.fireEvent('refreshTreeAndSelOne');
                        });
                    }
                }
            ]
        });
        this.callParent(arguments);
    }

});
