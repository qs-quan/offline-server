Ext.define('OrientTdm.BackgroundMgr.ProcessDefinition.PdCard', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.pdCard',
    config: {
        type: 'audit'
    },
    requires: [
        'OrientTdm.BackgroundMgr.ProcessDefinition.Common.PdList'
    ],
    initComponent: function () {
        var me = this;
        //card布局 展现当前以及历史面板信息
        var pdListPanel = Ext.create('OrientTdm.BackgroundMgr.ProcessDefinition.Common.PdList', {
            type: me.type
        });
        var mainPanel = Ext.create('OrientTdm.Common.Extend.Panel.OrientPanel', {
            layout: 'fit',
            items: [
                pdListPanel
            ]
        });
        var respPanel = Ext.create('OrientTdm.Common.Extend.Panel.OrientPanel', {
            layout: 'fit'
        });
        Ext.apply(me, {
            layout: 'card',
            items: [mainPanel, respPanel]
        });
        me.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent(arguments);
    }
});