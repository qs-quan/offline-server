/**
 * Created by Administrator on 2016/3/29.
 */
Ext.define('OrientTdm.Common.Extend.Tree.OrientTreeGrid', {
    extend: 'Ext.tree.Panel',
    requires: [
        'Ext.tree.*',
        'Ext.data.*'
    ],
    alias: 'widget.orientTreeGrid',
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
        itemClickListener: Ext.emptyFn,
        actionItems:[]
    },
    initComponent: function () {
        var me = this;
        me.actionItems = [];
        var columns = me.createColumns.call(me);
        me.beforeInitComponent.call(me);
        var toolBarItems = me.createToolBarItems.call(me);
        var contextMenu = Ext.create('Ext.menu.Menu', {
            items: toolBarItems
        });
        //增加actionColumn
        var actionColumns = me._initActionColumns();
        Ext.Array.insert(columns, 0, actionColumns);
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
            store: store,
            columns:columns
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
                me.expandPath(currNode.getPath());
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
    },
    _initActionColumns: function () {
        var me = this;
        var retVal = null;
        if (me.actionItems.length > 0) {
            var items = [];
            var index = 0;
            Ext.each(me.actionItems, function (actionItem) {
                items.push({
                    iconCls: actionItem.iconCls,
                    tooltip: actionItem.text,
                    handler: function (grid, rowIndex, colIndex) {
                        var record = grid.store.getAt(rowIndex);
                        me.getSelectionModel().deselectAll();
                        me.getSelectionModel().select(record, false, true);
                        var scope = actionItem.scope || actionItem;
                        actionItem.handler.apply(scope,arguments);
                    }
                });
                if (index < me.actionItems.length - 1) {
                    items.push(' ');
                }
                index++;
            });
            retVal = {
                xtype: 'actioncolumn',
                text: '操作',
                align: 'center',
                width: 30 * items.length <50 ? 50 : 30 * items.length ,
                items: items
            };
        }
        return null == retVal ? [] : [retVal];
    },
    createColumns: function () {
        return [];
    }
});