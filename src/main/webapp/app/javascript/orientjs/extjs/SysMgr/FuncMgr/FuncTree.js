Ext.define('OrientTdm.SysMgr.FuncMgr.FuncTree', {
    extend: 'OrientTdm.Common.Extend.Tree.OrientTree',
    alias: 'widget.FuncTree',
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    itemClickListener: function (tree, record, item) {
        var func = record.raw;
        var centerPanel = this.ownerCt.centerPanel;
        centerPanel.originalData = func;
        centerPanel.getForm().setValues(func);
        if (centerPanel.isHidden()) {
            centerPanel.setVisible(true);
        }
        Ext.getCmp('tbomFlg').setValue({'tbomFlg': func.tbomFlg});
        if (func.icon != null) {
            Ext.getCmp('iconImg').setValue('<img src="' + func.icon + '" />');
        } else {
            Ext.getCmp('iconImg').setValue('');
        }
        centerPanel.items.each(function (item) {
            if (item.xtype != 'panel') {
                // item.setReadOnly(func.editFlg == '0');
                item.setReadOnly(true);
            }
        });
        // Ext.getCmp('iconSel').setDisabled(func.editFlg == '0');
        Ext.getCmp('iconSel').setDisabled(true);
        Ext.getCmp("funcUpdate").setText("修改");
        Ext.getCmp("funcUpdate").setDisabled(func.editFlg == '0');
    },
    createFooBar: function () {
        return Ext.emptyFn;
    },
    createStore: function () {
        var retVal = new Ext.data.TreeStore({
            proxy: {
                type: 'ajax',
                url: serviceName + '/func/getByPid.rdm',
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    root: 'results',
                    messageProperty: 'msg'
                }
            },
            root: {
                text: '功能点维护',
                id: '1',
                expanded: true
            },
            sorters: [{
                sorterFn: function (node1, node2) {
                    if (node2.raw.position > node1.raw.position) {
                        return -1;
                    } else if (node2.raw.position < node1.raw.position) {
                        return 1;
                    } else
                        return 0;
                }
            }]
        });
        return retVal;
    },
    createToolBarItems: function () {
        var me = this;
        var retVal = [{
            //id: 'funcCreate',
            iconCls: 'icon-create',
            text: '新增',
            itemId: 'create',
            scope: me,
            handler: function () {
                var oriData = {};
                oriData.parentid = me.selModel.selected.items[0].data.id;
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
                            // var funcTree = me.ownerCt.westPanel;
                            var selectNode = me.getSelectionModel().getSelection()[0];
                            var id = selectNode.getPath('id');
                            me.getStore().load({
                                node: me.getRootNode(),
                                callback: function () {
                                    me.expandPath(id, 'id');
                                    me.getSelectionModel().select(selectNode);
                                }
                            });
                            if (arguments[1]) {  //如果是点击保存并关闭按钮，则关闭窗口；如果是点击保存按钮则不关闭窗口
                                createWin.close();
                            }
                        },
                        originalData: oriData
                    })]
                });
                createWin.show();
            }
        }, {
            //id: 'funcDelete',
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
        }, {
            xtype: 'trigger',
            width: 180,
            triggerCls: 'x-form-clear-trigger',
            onTriggerClick: function () {
                this.setValue('');
                me.clearFilter();
            },
            emptyText: '快速搜索',
            enableKeyEvents: true,
            listeners: {
                keyup: function (field, e) {
                    if (Ext.EventObject.ESC == e.getKey()) {
                        field.onTriggerClick();
                    } else {
                        me.filterByText(this.getRawValue(), "text");
                    }
                }
            }

        }];
        return retVal;
    },
    initComponent: function () {
        var me = this;
        Ext.apply(me, {});
        me.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'select', me.itemClickListener, me);
    }
});