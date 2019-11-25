/**
 * Created by enjoy on 2016/4/30 0030.
 */
Ext.define('OrientTdm.BackgroundMgr.FreeMarker.FreeMarkerDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.freeMarkerDashBord',
    requires: [
        'OrientTdm.BackgroundMgr.FreeMarker.FreeMarkerQueryForm',
        'OrientTdm.BackgroundMgr.FreeMarker.FreeMarkerList'
    ],
    initComponent: function () {
        var me = this;
        var queryPanel = Ext.create('OrientTdm.BackgroundMgr.FreeMarker.FreeMarkerQueryForm', {
            region: 'north',
            title: '查询',
            height: 110,
            collapsible: true,
            bodyStyle:{background:'#ffffff'}
        });
        //创建中间面板
        var listPanel = Ext.create('OrientTdm.BackgroundMgr.FreeMarker.FreeMarkerList', {
            region: 'center',
            padding: '0 0 0 5',
            title: '系统模板'
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