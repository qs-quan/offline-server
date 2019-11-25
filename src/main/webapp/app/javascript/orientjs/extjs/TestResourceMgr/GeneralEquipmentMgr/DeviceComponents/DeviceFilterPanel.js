/**
 * Created by Administrator on 2016/7/20 0020.
 * 设备类型树
 */
Ext.define('OrientTdm.TestResourceMgr.GeneralEquipmentMgr.DeviceComponents.DeviceFilterPanel', {
    extend: 'OrientTdm.Common.Extend.Tree.OrientTree',
    alias: 'widget.DeviceFilterPanel',
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
                url: serviceName + '/resourceMgr/getDeviceTypeByPid.rdm',
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                }
            },
            root: {
                text: '设备分类',
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
        var devTypeId = node.getId();
        var centerPanel = me.ownerCt.centerPanel;
        if (centerPanel) {
            centerPanel.filterByDevTypeId(devTypeId);
        }
    },
    listeners: {
        show: function(tree) {
            var me = this;
            var root = tree.getRootNode();

        }
    }

});
