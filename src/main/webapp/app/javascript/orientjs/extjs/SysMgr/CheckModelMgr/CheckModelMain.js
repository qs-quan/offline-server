/**
 * Created by qjs on 2016/11/8.
 */
Ext.define('OrientTdm.SysMgr.CheckModelMgr.CheckModelMain',{
    extend:'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.CheckModelMain',
    requires: [
        'OrientTdm.SysMgr.CheckModelMgr.CheckModelTree',
        'OrientTdm.SysMgr.CheckModelMgr.CheckModelList'
    ],
    initComponent: function () {
        var me = this;
        var westPanel = Ext.create("OrientTdm.SysMgr.CheckModelMgr.CheckModelTree", {
            multiSelect: false,
            title: '含有检查字段模型信息',
            region: 'west',
            width: 245,
            itemClickListener: function (tree, record, item) {
                if (record.isLeaf() == true) {
                    var modelId = record.getId();
                    var schemaId = record.data.parentId;
                    var store = me.centerPanelComponent.getStore();
                    store.getProxy().setExtraParam('modelId', modelId);
                    store.getProxy().setExtraParam('schemaId', schemaId);
                    store.load();
                }
            }
        });
        var centerPanel = Ext.create("OrientTdm.SysMgr.CheckModelMgr.CheckModelList", {
            region: 'center',
            title:'检查字段信息'
        });
        Ext.apply(me, {
            layout: 'border',
            items: [westPanel, centerPanel],
            westPanel: westPanel,
            centerPanel: centerPanel
        });
        me.callParent(arguments);
    }
});