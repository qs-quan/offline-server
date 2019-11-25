/**
 * 数据层选择自定义的schema列表
 * Created by dailin on 2019/4/29 14:09.
 */
Ext.define('OrientTdm.TestBomBuild.Tree.PowerModelTree', {
    extend: 'OrientTdm.Common.Extend.Tree.OrientTree',
    alias: 'widget.powerModelTree',
    requires: [],
    config: {
        schemaId: ''
    },
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            xtype: 'check-tree',
            // 根据声明字段显示
            displayField: 'text',
            // 隐藏headers
            hideHeaders: true,
            columns: [{
                xtype: 'treecolumn',
                dataIndex: 'text',
                flex: 1,
                field: {allowBlankfalse: false}
            }]
        });
        me.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
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
            width: 230,
            enableKeyEvents: true,
            listeners: {
                keyup: function (field, e) {
                    if (Ext.EventObject.ESC == e.getKey()) {
                        field.onTriggerClick();
                    } else {
                        me.filterByText(this.getRawValue(), 'text');
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
                api: {
                    'read': serviceName + '/modelData/getModelNodes.rdm'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                },
                extraParams: {
                    schemaId: me.schemaId
                }
            },
            listeners: {
                // 加载节点时展开所有的子节点
                load: function(store, record, successful, eOpts) {
                    var childNodes = record.childNodes;
                    Ext.each(childNodes, function (node) {
                        node.expand();
                    })
                }
            }
        });
        return retVal;
    }
});