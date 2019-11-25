Ext.define('OrientTdm.SysMgr.DeptMgr.DeptTree', {
    extend: 'OrientTdm.Common.Extend.Tree.OrientTree',
    alias: 'widget.DeptTree',
    requires: [
        "OrientTdm.SysMgr.DeptMgr.Create.DeptAddForm"
    ],
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    itemClickListener: function (tree, record, item) {
        var dept = record.raw;
        var centerPanel = this.ownerCt.centerPanel;
        centerPanel.originalData = dept;
        centerPanel.getForm().setValues(dept);
    },
    createToolBarItems: function () {
        var me = this;
        var retVal = [{
            xtype: 'trigger',
            width: 230,
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
                url: serviceName + '/dept/getByPid.rdm',
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
    onDeleteClick: function () {
        var me = this;
        OrientExtUtil.TreeHelper.deleteNodes(me, "dept/delete.rdm", function () {
            me.fireEvent("refreshTreeAndSelOne");
        });
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'select', me.itemClickListener, me);
    }
});
