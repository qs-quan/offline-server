/**
 * Created by enjoy on 2016/4/30 0030.
 */
Ext.define('OrientTdm.BackgroundMgr.ButtonInstance.ButtonInstanceDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.buttonInstanceDashBord',
    requires: [
        'OrientTdm.BackgroundMgr.ButtonInstance.ButtonInstanceList',
        'OrientTdm.BackgroundMgr.ButtonInstance.Query.ButtonInstanceQueryForm'
    ],
    initComponent: function () {
        var me = this;
        var queryPanel = Ext.create('OrientTdm.BackgroundMgr.ButtonInstance.Query.ButtonInstanceQueryForm', {
            region: 'north',
            title: '查询',
            height: 110,
            collapsible: true,
            bodyStyle:{background:'#ffffff'}
        });
        //创建中间面板
        var listPanel = Ext.create('OrientTdm.BackgroundMgr.ButtonInstance.ButtonInstanceList', {
            region: 'center',
            padding: '0 0 0 5',
            title: '按钮实例'
        });
        Ext.apply(me, {
            layout: 'border',
            items: [
                queryPanel, listPanel
            ],
            northPanel: queryPanel,
            centerPanel: listPanel
        });
        me.callParent(arguments);
    }
});