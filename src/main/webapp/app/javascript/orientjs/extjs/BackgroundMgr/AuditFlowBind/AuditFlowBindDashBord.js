/**
 * Created by enjoy on 2016/4/30 0030.
 */
Ext.define('OrientTdm.BackgroundMgr.AuditFlowBind.AuditFlowBindDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.auditFlowBindDashBord',
    requires: [
        'OrientTdm.BackgroundMgr.AuditFlowBind.AuditFLowBindList',
        'OrientTdm.Common.Extend.Tree.ModelTreePanel',
        'OrientTdm.BackgroundMgr.AuditFlowBind.Query.AuditFlowBindQueryForm'
    ],
    initComponent: function () {
        var me = this;
        var queryPanel = Ext.create('OrientTdm.BackgroundMgr.AuditFlowBind.Query.AuditFlowBindQueryForm', {
            region: 'north',
            title: '查询',
            height: 100,
            collapsible: true
        });

        var bindPanel = Ext.create('OrientTdm.BackgroundMgr.AuditFlowBind.AuditFLowBindList', {
            title: '已绑定信息',
            region: 'center'
        });
        var chooseModelPanel = Ext.create('OrientTdm.Common.Extend.Tree.ModelTreePanel', {
            multiSelect: false,
            title: '模型信息',
            containsView: false,
            region: 'west',
            width: 245,
            itemClickListener: function (tree, record, item) {
                if (record.isLeaf() == true) {
                    var modelId = record.getId();
                    var store = me.centerPanelComponent.getStore();
                    store.getProxy().setExtraParam('modelId', modelId);
                    store.load();
                }
            }
        });
        Ext.apply(me, {
            layout: 'border',
            items: [bindPanel, chooseModelPanel]
        });
        me.callParent(arguments);
    }
});