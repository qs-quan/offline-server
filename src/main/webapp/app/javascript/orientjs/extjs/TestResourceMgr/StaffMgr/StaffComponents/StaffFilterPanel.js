/**
 * Created by Administrator on 2016/7/20 0020.
 * 人员类型树
 */
Ext.define('OrientTdm.TestResourceMgr.StaffMgr.StaffComponents.StaffFilterPanel', {
    extend: 'OrientTdm.Common.Extend.Tree.OrientTree',
    alias: 'widget.StaffFilterPanel',
    requires: [],
    config: {
        rootVisible: true
    },
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    initComponent: function () {
        var me = this;
        Ext.apply(me, {});
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
            enableKeyEvents: true,
            listeners: {
                keyup: function (field, e) {
                    if (Ext.EventObject.ESC == e.getKey()) {
                        field.onTriggerClick();
                    }
                    else {
                        me.filterByText(this.getRawValue(), "text");
                    }
                }
            }
        }];
        return retVal;
    },
    createStore: function () {
        var me = this;
        var retVal = new Ext.data.TreeStore({
            proxy: {
                type: 'ajax',
                url: serviceName + '/resourceMgr/getStaffTypeByPid.rdm',
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                }
            },
            root: {
                text: '人员分类',
                id: '-1',
                expanded: true
            },
            listeners: {
                load: function (store, record) {

                }
            }
        });
        return retVal;
    },
    selectItem: function (tree, node) {
        var me = this;
        var staffTypeId = node.getId();
        var centerPanel = me.ownerCt.centerPanel;
        if (centerPanel) {
            centerPanel.filterByStaffTypeId(staffTypeId);
        }
    },
    listeners: {
        show: function(tree) {
            var me = this;
            var root = tree.getRootNode();

        }
    }

});
