/**
* Created by qjs on 2016/10/21.
*/
Ext.define('OrientTdm.SysMgr.UserMgr.UserDeptTree', {
    extend: 'OrientTdm.Common.Extend.Tree.OrientTree',
    alias: 'widget.UserDeptTree',
    requires: [

    ],
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    itemClickListener: function (tree, node) {
        var depId = node.getId();
        var me = this.up('UserMain');
        var listPanel = me.ownerCt.centerPanel.down('UserList');
        if (listPanel) {
            listPanel.filterByDepId(depId);
        }
    },
    createToolBarItems: function () {
        var me = this;
        var retVal = [{
            xtype: 'trigger',
            width: 150,
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
    createFooBar: function () {
        return Ext.emptyFn;
    },
    createStore: function () {
        var retVal = new Ext.data.TreeStore({
            proxy: {
                type: 'ajax',
                url: serviceName + '/dept/list.rdm',
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                }
            },
            root: {
                text: 'root',
                id: '-1',
                expanded: true
            }
        });
        return retVal;
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'select', me.itemClickListener, me);
    }
});
