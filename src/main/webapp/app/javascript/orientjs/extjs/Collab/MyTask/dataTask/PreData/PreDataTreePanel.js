/**
 * Created by Administrator on 2016/8/31 0031.
 */
Ext.define('OrientTdm.Collab.MyTask.dataTask.PreData.PreDataTreePanel', {
    extend: 'OrientTdm.Common.Extend.Tree.OrientTree',
    alias: 'widget.preDataTreePanel',
    config: {
        modelId: '',
        dataId: ''
    },
    requires: [
        'OrientTdm.Collab.ProjectMng.mainFrame.model.ProjectTreeNodeModel'
    ],
    initComponent: function () {
        var me = this;
        this.callParent(arguments);
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
            width: 110,
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
            model: 'OrientTdm.Collab.ProjectMng.mainFrame.model.ProjectTreeNodeModel',
            proxy: {
                type: 'ajax',
                api: {
                    'read': serviceName + '/myTask/dataTasks/getPreTaskDesc.rdm'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                },
                extraParams: {
                    modelId: me.modelId,
                    dataId: me.dataId
                }
            }
        });
        return retVal;
    },
    selectItem: function (tree, node) {
        var me = this;
        var dashPanel = me.up();
        if (dashPanel) {
            var params = {
                modelId: node.get('modelId'),
                dataId: node.get('dataId'),
                type: 2
            };
            dashPanel.fireEvent('refreshData', params);
        }
    }
});