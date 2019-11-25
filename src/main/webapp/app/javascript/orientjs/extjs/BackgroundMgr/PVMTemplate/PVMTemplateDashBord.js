/**
 * Created by enjoy on 2016/4/30 0030.
 */
Ext.define('OrientTdm.BackgroundMgr.PVMTemplate.PVMTemplateDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.pvmTemplateDashBord',
    requires: [
        'OrientTdm.BackgroundMgr.PVMTemplate.PVMTemplateList',
        'OrientTdm.BackgroundMgr.CustomForm.Query.CustomFormQueryForm'
    ],
    initComponent: function () {
        var me = this;
        var queryPanel = Ext.create('OrientTdm.BackgroundMgr.PVMTemplate.Query.PVMTemplateQueryForm', {
            region: 'north',
            title: '查询',
            height: 110,
            collapsible: true,
            bodyStyle:{background:'#ffffff'}
        });
        //创建中间面板
        var listPanel = Ext.create('OrientTdm.BackgroundMgr.PVMTemplate.PVMTemplateList', {
            region: 'center',
            padding: '0 0 0 5',
            title: '检查表模板'
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