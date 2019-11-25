/**
 * Created by enjoy on 2016/4/30 0030.
 */
Ext.define('OrientTdm.SysMgr.ToolMgr.ToolGroupTree', {
    extend: 'OrientTdm.Common.Extend.Tree.OrientTree',
    alias: 'widget.toolGroupTree',
    requires: [
        'OrientTdm.SysMgr.ToolMgr.Model.ToolGroupExtModel',
        'OrientTdm.SysMgr.ToolMgr.Common.ToolGroupForm'
    ],
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            displayField: 'groupName',
            hideHeaders: true,
            plugins: [{
                ptype: 'cellediting',
                pluginId: 'cellEditPlugin',
                listeners: {
                    edit: function (editor, e) {
                        if (e.record.dirty) {
                            me._updateRecord(e.record);
                        }
                    }
                }
            }],
            columns: [{
                xtype: 'treecolumn',
                dataIndex: 'groupName',
                flex: 1,
                field: {allowBlankfalse: false},
                renderer: function (value, column, record) {
                    return value + '_' + record.get('groupType');
                }
            }]
        });
        me.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'select', me.selectItem, me);
    },
    createToolBarItems: function () {
        var me = this;
        var retVal = [{
            xtype: 'trigger',
            triggerCls: 'x-form-clear-trigger',
            onTriggerClick: function () {
                this.setValue('');
                me.clearFilter();
            },
            emptyText: '快速搜索',
            width: 110,
            enableKeyEvents: true,
            listeners: {
                keyup: function (field, e) {
                    if (Ext.EventObject.ESC == e.getKey()) {
                        field.onTriggerClick();
                    } else {
                        me.filterByText(this.getRawValue(), 'groupName');
                    }
                }
            }

        }, {
            iconCls: 'icon-create',
            text: '新增',
            itemId: 'create',
            scope: this,
            handler: this.onCreateClick
        }, {
            iconCls: 'icon-update',
            text: '修改',
            itemId: 'update',
            scope: this,
            handler: this.onUpdateClick
        }, {
            iconCls: 'icon-delete',
            text: '删除',
            disabled: false,
            itemId: 'delete',
            scope: this,
            handler: this.onDeleteClick
        }];
        return retVal;
    },
    createStore: function () {
        var retVal = new Ext.data.TreeStore({
            model: 'OrientTdm.SysMgr.ToolMgr.Model.ToolGroupExtModel',
            proxy: {
                type: 'ajax',
                api: {
                    'read': serviceName + '/ToolGroup/list.rdm',
                    'create': serviceName + '/ToolGroup/create.rdm',
                    'destroy': serviceName + '/ToolGroup/delete.rdm',
                    'update': serviceName + '/ToolGroup/update.rdm'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                },
                writer: {
                    type: 'json',
                    encode: true,
                    root: 'formData',
                    allowSingle: false
                }
            },
            listeners: {
                load: function (store, records) {
                    
                }
            }
        });
        return retVal;
    },
    selectItem: function (tree, node) {
        var nodeId = node.getId();
        if (this.ownerCt.centerPanel) {
            this.ownerCt.centerPanel.fireEvent('filterByBelongGroupId', nodeId);
        }
    },
    onCreateClick: function () {
        var me = this;
        //弹出新增面板窗口
        var win = Ext.create('Ext.Window', Ext.apply({
            plain: true,
            title: '新增工具分组',
            height: 200,
            width: '70%',
            layout: 'fit',
            maximizable: true,
            modal: true,
            items: [
                Ext.create('OrientTdm.SysMgr.ToolMgr.Common.ToolGroupForm', {
                    bindModelName: 'CWM_SYS_TOOLS_GROUP',
                    actionUrl: me.getStore().getProxy().api['create'],
                    successCallback: function (resp,callBackArguments) {
                        me.fireEvent('refreshTree');
                        if(callBackArguments) {
                            this.up('window').close();
                        }
                    }
                })
            ]
        }));
        win.show();
    },
    onUpdateClick: function () {
        var me = this;
        //弹出新增面板窗口
        var win = Ext.create('Ext.Window', Ext.apply({
            plain: true,
            title: '修改工具分组',
            height: 200,
            width: '70%',
            layout: 'fit',
            maximizable: true,
            modal: true,
            items: [
                Ext.create('OrientTdm.SysMgr.ToolMgr.Common.ToolGroupForm', {
                    bindModelName: 'CWM_SYS_TOOLS_GROUP',
                    actionUrl: me.getStore().getProxy().api['update'],
                    originalData: me.getSelectionModel().getSelection()[0],
                    successCallback: function () {
                        me.fireEvent('refreshTree');
                        this.up('window').close();
                    }
                })
            ]
        }));
        win.show();
    },
    onDeleteClick: function () {
        var me = this;
        var records = me.getSelectionModel().getSelection();
        if (records.length > 0) {
            var record = records[0];
            Ext.Msg.confirm(OrientLocal.prompt.info, OrientLocal.prompt.deleteConfirm, function (btn) {
                if (btn == 'yes') {
                    OrientExtUtil.AjaxHelper.doRequest(me.getStore().getProxy().api['destroy'], {
                        toDelIds: [record.get('id')]
                    }, true, function () {
                        OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.saveSuccess, function () {
                            me.fireEvent('refreshTree');
                        });
                    });
                }
            }, me);
        }
    },
    _updateRecord: function (record) {
        var me = this;
        OrientExtUtil.AjaxHelper.doRequest(me.getStore().getProxy().api['update'], record.data, true, function () {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.saveSuccess);
            record.commit();
        });
    }
});