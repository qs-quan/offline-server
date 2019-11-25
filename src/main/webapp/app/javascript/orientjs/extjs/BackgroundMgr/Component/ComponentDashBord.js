/**
 * Created by enjoy on 2016/4/30 0030.
 */
Ext.define('OrientTdm.BackgroundMgr.Component.ComponentDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.componentDashBord',
    requires: [
        'OrientTdm.BackgroundMgr.Component.ComponentList',
        'OrientTdm.BackgroundMgr.Component.Query.ComponentQueryForm'
    ],
    initComponent: function () {
        var me = this;
        var queryPanel = Ext.create('OrientTdm.BackgroundMgr.Component.Query.ComponentQueryForm', {
            region: 'north',
            title: '查询',
            height: 110,
            collapsible: true,
            bodyStyle:{background:'#ffffff'}
        });
        //创建中间面板
        var listPanel = Ext.create('OrientTdm.BackgroundMgr.Component.ComponentList', {
            region: 'center',
            padding: '0 0 0 5',
            title: '组件列表'
        });
        Ext.apply(me, {
            layout: 'border',
            items: [
                queryPanel, listPanel
            ]
        });
        me.callParent(arguments);
    }
});