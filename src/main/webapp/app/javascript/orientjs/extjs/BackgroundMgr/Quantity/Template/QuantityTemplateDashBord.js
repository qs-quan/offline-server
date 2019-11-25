/**
 * Created by enjoy on 2016/4/30 0030.
 */
Ext.define('OrientTdm.BackgroundMgr.Quantity.Template.QuantityTemplateDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.quantityTemplateDashBord',
    requires: [
        'OrientTdm.BackgroundMgr.Quantity.Template.QuantityTemplateList',
        'OrientTdm.BackgroundMgr.Quantity.Template.Query.QuantityTemplateQueryForm'
    ],
    initComponent: function () {
        var me = this;
        var queryPanel = Ext.create('OrientTdm.BackgroundMgr.Quantity.Template.Query.QuantityTemplateQueryForm', {
            region: 'north',
            title: '查询',
            height: 110,
            collapsible: true,
            bodyStyle:{background:'#ffffff'}
        });
        //创建中间面板
        var listPanel = Ext.create('OrientTdm.BackgroundMgr.Quantity.Template.QuantityTemplateList', {
            region: 'center',
            padding: '0 0 0 5',
            title: '测试变量模板'
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