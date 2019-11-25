/**
 * Created by Seraph on 16/9/26.
 */
Ext.define('OrientTdm.Collab.Template.TemplateMngTreePanel', {
    alias: 'widget.projectTree',
    extend: 'OrientTdm.Common.Extend.Tree.OrientTree',
    requires: [
        'OrientTdm.Collab.Template.model.TemplateTreeNode'
    ],
    initComponent: function () {
        var me = this;
        me.rootNode = {
            text: 'root',
            dataId: '-1',
            id: '-1',
            expanded: true
        };
        me.callParent(arguments);
    },
    config: {},
    createStore: function () {
        var me = this;
        var retVal = Ext.create('Ext.data.TreeStore', {
            model: 'OrientTdm.Collab.Template.model.TemplateTreeNode',
            listeners: {
                beforeLoad: function (store, operation) {
                    var node = operation.node;
                    if (node.isRoot()) {
                        store.getProxy().setExtraParam('parDataId', '-1');
                    } else {
                        if (node.raw.parentNode) {
                            node.raw.parentNode = null;
                        }
                        store.getProxy().setExtraParam('parDataId', node.data.id);
                    }
                }
            },
            root: me.rootNode
        });
        return retVal;
    },
    createToolBarItems: function () {
        var me = this;

        var retVal = [{
            xtype: 'trigger',
            width: 180,
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
                        me.filterByText(this.getRawValue(), 'text');
                    }
                }
            }
        }, {
            iconCls: 'icon-refresh',
            text: '刷新',
            itemId: 'refresh',
            scope: this,
            handler: this.doRefresh
        }];

        return retVal;
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'select', me.itemClickListener, me);
    },
    itemClickListener: function (tree, record, item) {
        var me = this;

        var centerPanel = me.ownerCt.centerPanel;
        centerPanel.removeAll(true);

        var content = Ext.create("OrientTdm.Collab.Template.TemplateMngCenterPanel", {
            region: 'center',
            layout: 'border',
            padding: '0 0 0 0',
            schemaId : record.data.schemaId,
            modelName : record.data.modelName
        });

        centerPanel.add(content);
    },
    doRefresh: function () {
        var selectedNode = this.getSelectionModel().getSelection()[0];
        this.getStore().load({
            node: selectedNode
        });
    },
    refreshNode: function (nodeId, refreshParent) {
        var rootNode = this.getRootNode();

        var currentNode;
        if (nodeId === '-1') {
            currentNode = rootNode;
        } else {
            currentNode = rootNode.findChild('id', nodeId, true) || rootNode;
        }

        var toRefreshNode = currentNode;
        if (refreshParent && currentNode.isRoot() == false) {
            toRefreshNode = currentNode.parentNode;
        }
        this.store.load({node: toRefreshNode});
    }
});