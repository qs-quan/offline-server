/**
 * 试验项目模板管理-左侧树
 */
Ext.define('OrientTdm.TestInfo.ApplyTestRecord.SyxColumnPanel.UnSelectSylxTreePanel', {
    extend: 'OrientTdm.Common.Extend.Tree.OrientTree',
    alias: 'widget.UnSelectSylxTreePanel',

    initComponent: function () {
        this.title = '试验类型';
        this.autoScroll = true;


        this.callParent(arguments);
    },

    createStore: function () {
        var me = this;

        return Ext.create('Ext.data.TreeStore', {
            // 定义树节点数据模型
            model: Ext.define('TreeModel', {
                extend: 'Ext.data.Model',
                fields: [
                    'id',
                    'text',
                    'leaf',
                    'iconCls',
                    'pid',
                    'model'
                ]
            }),
            proxy: {
                type: 'ajax',
                api: {
                    'read': serviceName + '/SylxController/queryTreeList.rdm'
                },
                reader: {
                    type: 'json',
                    root: 'results'
                }
            },
            root: {
                text: 'root',
                id: '-1'
            }
        });
    },

    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'select', me.itemClickListener, me);
    },

    itemClickListener: function (tree, record, item) {
        var me = this;

        // 未选数据面板
        var unSelect4SYLXPanel = me.up().down('#UnSelect4SYLX');
        // 重置查询过滤条件数组
        unSelect4SYLXPanel.getStore().getProxy().setExtraParam('customerFilter', Ext.encode([
            // 所属试验类型ID
            new CustomerFilter('T_SYLX_' + TDM_SERVER_CONFIG.DEVICE_SCHEMA_ID + '_ID', CustomerFilter.prototype.SqlOperation.Equal, '', record.internalId),
            // 已选数据 dataId
            new CustomerFilter('ID', 'NotIn', '', unSelect4SYLXPanel.upScope.selectedValue.join(','))
        ]));
        unSelect4SYLXPanel.getStore().loadPage(1);
    },

    doRefresh: function () {
        var selectedNode = this.getSelectionModel().getSelection()[0];
        this.getStore().load();
    }

});