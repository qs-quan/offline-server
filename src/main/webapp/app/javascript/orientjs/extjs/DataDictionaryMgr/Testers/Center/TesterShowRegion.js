/**
 * 试验人员管理面板
 * Created by dailin on 2019/5/23 15:46.
 */

Ext.define('OrientTdm.DataDictionaryMgr.Testers.Center.TesterShowRegion',{
    extend: 'OrientTdm.Common.Extend.Panel.OrientTabPanel',
    alias: 'widget.dataShowRegion',
    requires: [
        'OrientTdm.DataDictionaryMgr.Testers.Center.TesterGridpanel'
    ],
    config: {
        belongFunctionId: ''
    },
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        me.addEvents('initUserDataByTypeNode');
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'initUserDataByTypeNode', me.initUserDataByTypeNode, me);
    },
    initUserDataByTypeNode: function (node) {
        var me = this;
        if (!me.down("#SYRYPZ_" + node.ID)) {
            var modelGrid = Ext.create('OrientTdm.DataDictionaryMgr.Testers.Center.TesterGridpanel', {
                nodeId: node.ID,
                region: 'center'
            });
            me.add( {
                itemId: 'SYRYPZ_' + node.ID,
                layout: 'border',
                title: "【" + node.text + "】" + "试验人员配置",
                closable: true,
                items: [modelGrid]
            });
        }
        me.setActiveTab(me.down("#SYRYPZ_" + node.ID));
    }

});