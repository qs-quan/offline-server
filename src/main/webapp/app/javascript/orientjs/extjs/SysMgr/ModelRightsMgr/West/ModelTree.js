/**
 * Created by Administrator on 2016/7/4 0004.
 */
Ext.define('OrientTdm.SysMgr.ModelRightsMgr.West.ModelTree', {
    extend: 'OrientTdm.Common.Extend.Tree.OrientTree',
    alias: 'widget.modelTree',
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
            displayField: 'text',
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
        me.mon(me, 'select', me.selectItem, me);
    },
    createToolBarItems: function () {
        var me = this;
        var retVal = [{
            xtype: 'orientComboBox',
            fieldLabel: '选择业务库',
            labelAlign: "left",
            labelWidth: 40,
            width: 150,
            remoteUrl: serviceName + '/role/listSchemas.rdm',
            displayField: 'name',
            valueField: 'id',
            initFirstRecord: false,
            listeners: {
                afterrender: function(combo) {
                    var store = combo.getStore();
                    store.load(function (records) {
                        if (records.length > 0) {
                            combo.setValue(records[0]);
                            combo.fireEvent('select', combo, records[0]);
                        }
                    });
                },
                select: function (combo, record) {
                    var schemaId = record instanceof Array ? record[0].get('id') : record.get('id');
                    me.setSchemaId(schemaId);
                    me.getStore().getProxy().setExtraParam('schemaId', schemaId);
                    var rootNode = me.getRootNode();
                    me.getStore().load({
                        node: rootNode,
                        callback: function (nodes) {
                            Ext.each(nodes, function (node) {
                                node.expand();
                            })
                        }
                    });
                }
            }
        }, {
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
                    schemaId: me.getSchemaId()
                }
            },
            listeners: {
                /*
                load: function(store, record, successful, eOpts) {
                    var childNodes = record.childNodes;
                    for(var i=0; i<childNodes.length; i++) {
                        var childNode = childNodes[i];
                        if(childNode.data.id!="0" && childNode.data.id!="1") {
                            childNode.raw.checked = false;
                            childNode.data.checked = false;
                        }
                    }
                }
                */
            }
        });
        return retVal;
    },
    selectItem: function (tree, node) {
        var me = this;
        var centerPanel = me.ownerCt.centerPanel;
        if (centerPanel) {
            if (centerPanel) {
                centerPanel.fireEvent('initModelRightsContent', node);
            }
        }
    }
});