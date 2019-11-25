/**
 * Created by enjoy on 2016/3/15 0015.
 */
Ext.define('OrientTdm.HomePage.Function.FunctionTreePanel', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.functionTree',
    rootVisible: false,
    animate: true,
    collapsible: true,
    loadMask: true,
    useArrows: true,
    config: {
        orientRootId: -1
    },
    initComponent: function () {
        var me = this;
        me.store = Ext.create('Ext.data.TreeStore', {
            fields: ['id', 'text', 'name', 'js', 'url', 'type'],
            proxy: {
                type: 'ajax',
                reader: 'json',
                url: serviceName + '/func/getSubFunctions.rdm',
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                }
            },
            root: {
                text: '根节点',
                id: me.orientRootId,
                expanded: true
            },
            sorters: [{
                sorterFn: function (node1, node2) {
                    if (node2.raw.position > node1.raw.position) {
                        return -1;
                    } else if (node2.raw.position < node1.raw.position) {
                        return 1;
                    } else
                        return 0;
                }
            }],
            listeners: {
                load: function (store, record) {
                    var childNodes = record.childNodes;
                    Ext.each(childNodes, function (childNode) {
                        if (!Ext.isEmpty(childNode.get('icon'))) {
                            var icon = childNode.get('icon');
                            var smalIcon = icon.replace('.', '_small.');
                            childNode.set('icon', smalIcon);
                        }
                    });
                }
            }

        });
        this.callParent(arguments);
    }
});