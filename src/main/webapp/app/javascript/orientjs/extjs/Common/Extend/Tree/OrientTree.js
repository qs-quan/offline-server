/**
 * Created by Administrator on 2016/3/29.
 */
Ext.define('OrientTdm.Common.Extend.Tree.OrientTree', {
    extend: 'Ext.tree.Panel',
    requires: [
        'Ext.tree.*',
        'Ext.data.*'
    ],
    alias: 'widget.orientTree',
    loadMask: true,
    useArrows: true,
    rootVisible: false,
    frame: false,
    config: {
        beforeInitComponent: Ext.emptyFn,
        afterInitComponent: Ext.emptyFn,
        createToolBarItems: Ext.emptyFn,
        createFooBar: Ext.emptyFn,
        createStore: Ext.emptyFn,
        itemClickListener: Ext.emptyFn
    },
    initComponent: function () {
        var me = this;
        me.beforeInitComponent.call(me);
        var toolBarItems = me.createToolBarItems.call(me);
        var contextMenu = Ext.create('Ext.menu.Menu', {
            items: toolBarItems
        });
        var toolBar = toolBarItems && toolBarItems.length > 0 ? Ext.create('Ext.toolbar.Toolbar', {
            items: toolBarItems
        }) : null;
        var footBar = me.createFooBar.call(me);
        var store = me.createStore.call(me);
        Ext.applyIf(me, {
            viewConfig: {
                stripeRows: true,
                listeners: {
                    itemcontextmenu: function (view, rec, node, index, e) {
                        e.stopEvent();
                        contextMenu.showAt(e.getXY());
                        return false;
                    },
                    refresh: function () {
                        this.select(0);
                    }
                }
            },
            dockedItems: [toolBar, footBar],
            store: store
        });
        me.afterInitComponent.call(me);
        me.callParent(arguments);
        me.addEvents("refreshTree");
        me.addEvents("refreshTreeAndSelOne");
        me.on("itemclick", me.itemClickListener, me);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'refreshTree', me.refreshTree, me);
        me.mon(me, 'refreshTreeAndSelOne', me.refreshTreeAndSelOne, me);
    },
    refreshTree: function (recurrently) {
        var me = this;
        var root = me.getRootNode();
        var store = me.getStore();
        if (recurrently == false) {
            store.load({
                node: root
            });
        } else {
            me.reloadRecurrently(root);
        }
    },
    refreshTreeAndSelOne: function (nodeId, fromRoot, recurrently) {
        var me = this;
        var root = me.getRootNode();
        var node = root.findChild(nodeId);
        //从根开始刷新
        me.reloadRecurrently(fromRoot == true ? root : node, true, nodeId);
    },
    filterByText: function (text, propName) {
        this.clearFilter();
        var view = this.getView();
        var me = this;
        var nodesAndParents = [];
        this.getRootNode().cascadeBy(function (tree, view) {
            var currNode = this;
            if (currNode && currNode.data[propName] && currNode.data[propName].toString().toLowerCase().indexOf(text.toLowerCase()) > -1) {
                me.expandPath(currNode.getPath('text'));
                while (currNode.parentNode) {
                    nodesAndParents.push(currNode.id);
                    currNode = currNode.parentNode;
                }
            }
        }, null, [me, view]);
        this.getRootNode().cascadeBy(function (tree, view) {
            var uiNode = view.getNodeByRecord(this);
            if (uiNode && !Ext.Array.contains(nodesAndParents, this.id)) {
                Ext.get(uiNode).setDisplayed('none');
            }
        }, null, [me, view]);
    },
    clearFilter: function () {
        var view = this.getView();
        this.getRootNode().cascadeBy(function (tree, view) {
            var uiNode = view.getNodeByRecord(this);
            if (uiNode) {
                Ext.get(uiNode).setDisplayed('table-row');
            }
        }, null, [this, view])
    },
    reloadRecurrently: function (node, selectNode, nodeId) {
        var me = this;
        var store = me.getStore();
        store.reload({
            node: node,
            callback: function () {
                node.expand(true);
                var children = node.childNodes;
                for (var i = 0; i < children.length; i++) {
                    if (node.get('leaf') == false) {
                        me.reloadRecurrently(children[i], selectNode, nodeId);
                    }
                    if (selectNode == true && nodeId) {
                        if (nodeId == children[i].get('id')) {
                            me.fireEvent("itemclick", me, children[i]);
                            me.getSelectionModel().select(children[i]);
                        }
                    }

                }

            }
        });
    }
});