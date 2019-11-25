/**
 * Created by enjoy on 2016/4/30 0030.
 */
Ext.define('OrientTdm.BackgroundMgr.Quantity.Meta.QuantityDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.quantityDashBord',
    requires: [
        'OrientTdm.BackgroundMgr.Quantity.Meta.QuantityList',
        'OrientTdm.BackgroundMgr.Quantity.Meta.Query.QuantityQueryForm'
    ],
    config: {
        queryUrl: serviceName + '/Quantity/list.rdm',
        canOperate: true
    },
    initComponent: function () {
        var me = this;
        var queryPanel = Ext.create('OrientTdm.BackgroundMgr.Quantity.Meta.Query.QuantityQueryForm', {
            region: 'north',
            title: '查询',
            height: 110,
            collapsible: true,
            bodyStyle: {background: '#ffffff'}
        });
        //创建中间面板
        var listPanel = Ext.create('OrientTdm.BackgroundMgr.Quantity.Meta.QuantityList', {
            region: 'center',
            padding: '0 0 0 5',
            title: '测试变量',
            queryUrl: me.queryUrl,
            canOperate: me.canOperate
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