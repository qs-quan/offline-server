/**
 * Created by enjoy on 2016/4/30 0030.
 */
Ext.define('OrientTdm.SysMgr.UserToolMgr.UserToolGroupTree', {
    extend: 'OrientTdm.Common.Extend.Tree.OrientTree',
    alias: 'widget.userToolGroupTree',
    requires: [
        'OrientTdm.SysMgr.ToolMgr.Model.ToolGroupExtModel'
    ],
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            displayField: 'groupName',
            hideHeaders: true,
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

        }];
        return retVal;
    },
    createStore: function () {
        var retVal = new Ext.data.TreeStore({
            model: 'OrientTdm.SysMgr.ToolMgr.Model.ToolGroupExtModel',
            proxy: {
                type: 'ajax',
                api: {
                    'read': serviceName + '/ToolGroup/list.rdm'
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
    }
});