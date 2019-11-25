/**
 * Created by Administrator on 2016/7/20 0020.
 * 根据过滤ID 获取单层部门信息
 */
Ext.define('OrientTdm.Common.Extend.Form.Selector.UserComponents.DepTree', {
    extend: 'OrientTdm.Common.Extend.Tree.OrientTree',
    alias: 'widget.depTree',
    requires: [],
    config: {
        chooseRoleIds: ''
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
                    } else {
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
                url:   Ext.isEmpty(me.chooseRoleIds) ? serviceName + "/dept/list.rdm" : serviceName + '/dept/getDepByFilter.rdm',
                extraParams: {
                    ids: me.chooseRoleIds//这里的参数命名有问题
                },
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
            },
            listeners: {
                load: function (store, record) {
                }
            }
        });
        return retVal;
    },
    selectItem: function (tree, node) {
        var depId = node.getId();
        var me = this.up('userFilterPanel');
        var centerPanel = me.ownerCt.centerPanel;
        if (centerPanel) {
            centerPanel.filterByDepId(depId);
        }
    }
});
