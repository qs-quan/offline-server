/**
 * Created by enjoy on 2016/4/30 0030.
 */
Ext.define('OrientTdm.BackgroundMgr.CustomForm.CustomFormDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.customFormDashBord',
    requires: [
        'OrientTdm.BackgroundMgr.CustomForm.ModelFormList',
        'OrientTdm.BackgroundMgr.CustomForm.Query.CustomFormQueryForm'
    ],
    initComponent: function () {
        var me = this;
        var queryPanel = Ext.create('OrientTdm.BackgroundMgr.CustomForm.Query.CustomFormQueryForm', {
            region: 'north',
            title: '查询',
            height: 110,
            collapsible: true,
            bodyStyle:{background:'#ffffff'}
        });
        //创建中间面板
        var listPanel = Ext.create('OrientTdm.BackgroundMgr.CustomForm.ModelFormList', {
            region: 'center',
            padding: '0 0 0 5',
            title: '表单模板'
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