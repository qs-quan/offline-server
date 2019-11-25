/**
 * 研发数据实例面板
 * Created by Administrator on 2016/7/21 0021.
 */
Ext.define('OrientTdm.Collab.Data.DevData.DevDataDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.devDataDashBord',
    requires: [
        'OrientTdm.Collab.Data.DevData.DevDataCard'
    ],
    config: {
        initPrivateData: false,
        localMode : false,
        localData : null,
        privateDataPanel : null,
        shareDataPanel : null
    },
    initComponent: function () {
        var me = this;
        var privateDataPanel = me.initPrivateData == true ? Ext.create('OrientTdm.Collab.Data.DevData.DevDataCard', {
            title: '个人数据',
            itemId: 'privateData',
            region: 'south',
            height: 0.5 * globalHeight,
            modelId: me.modelId,
            dataId:  me.dataId,
            type: 0,
            initPrivateData: me.initPrivateData,
            localMode : me.localMode,
            localData : me.localData
        }) : null;
        me.privateDataPanel = privateDataPanel;

        var shareDataPanel = Ext.create('OrientTdm.Collab.Data.DevData.DevDataCard', {
            title: '共享数据',
            itemId: 'shareData',
            height: 0.5 * globalHeight,
            region: 'center',
            modelId: me.modelId,
            dataId:  me.dataId,
            type: 1,
            initPrivateData: me.initPrivateData,
            localMode : me.localMode,
            localData : me.localData
        });

        me.shareDataPanel = shareDataPanel;
        Ext.apply(me, {
            layout: 'border',
            items: [shareDataPanel, privateDataPanel]
        });
        me.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent(arguments);
    }
});