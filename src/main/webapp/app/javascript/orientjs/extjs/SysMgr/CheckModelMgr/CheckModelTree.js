/**
 * Created by qjs on 2016/11/8.
 */
Ext.define('OrientTdm.SysMgr.CheckModelMgr.CheckModelTree', {
    extend: 'OrientTdm.Common.Extend.Tree.OrientTree',
    alias: 'widget.CheckModelTree',
    loadMask: true,
    //是否多选
    multiSelect: false,
    config: {

    },
    initComponent: function () {
        var me = this;
        me.selectedData = Ext.isEmpty(me.selectedValue) ? [] : me.selectedValue.split(',');
        me.beforeInitComponent.call(me);
        Ext.apply(me, {
        });
        this.callParent(arguments);
        me.afterInitComponent.call(me);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
    },
    itemClickListener: function (tree, record, item) {

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
        var me = this;
        var retVal = new Ext.data.TreeStore({
            proxy: {
                type: 'ajax',
                url: serviceName + '/CheckModelManage/getModelHasCheckTree.rdm',
                extraParams: {

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
                    Ext.each(record.childNodes, function (childNode) {
                        if (Ext.Array.contains(me.selectedData, childNode.get('id'))) {
                            me.getSelectionModel().select(childNode, true, false);
                        }
                    });
                },
                scope: me
            }
        });
        return retVal;
    }
});