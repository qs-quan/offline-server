/**
 * Created by enjoy on 2016/4/30 0030.
 */
Ext.define('OrientTdm.BackgroundMgr.CustomGrid.CustomGridDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.customGridDashBord',
    requires: [
        'OrientTdm.BackgroundMgr.CustomGrid.ModelGridList',
        'OrientTdm.BackgroundMgr.CustomGrid.Query.CustomGridQueryForm'
    ],
    initComponent: function () {
        var me = this;
        var queryPanel = Ext.create('OrientTdm.BackgroundMgr.CustomGrid.Query.CustomGridQueryForm', {
            region: 'north',
            title: '查询',
            height: 110,
            collapsible: true,
            bodyStyle:{background:'#ffffff'}
        });
        //创建中间面板
        var listPanel = Ext.create('OrientTdm.BackgroundMgr.CustomGrid.ModelGridList', {
            region: 'center',
            padding: '0 0 0 5',
            title: '表格模板'
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