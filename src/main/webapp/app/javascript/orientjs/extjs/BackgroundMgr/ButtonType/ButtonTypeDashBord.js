/**
 * Created by enjoy on 2016/4/30 0030.
 */
Ext.define('OrientTdm.BackgroundMgr.ButtonType.ButtonTypeDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.buttonTypeDashBord',
    requires: [
        'OrientTdm.BackgroundMgr.ButtonType.ButtonTypeList',
        'OrientTdm.BackgroundMgr.ButtonType.Query.ButtonTypeQueryForm'
    ],
    initComponent: function () {
        var me = this;
        var queryPanel = Ext.create('OrientTdm.BackgroundMgr.ButtonType.Query.ButtonTypeQueryForm', {
            region: 'north',
            title: '查询',
            height: 110,
            collapsible: true,
            bodyStyle:{background:'#ffffff'}
        });
        //创建中间面板
        var listPanel = Ext.create('OrientTdm.BackgroundMgr.ButtonType.ButtonTypeList', {
            region: 'center',
            padding: '0 0 0 5',
            title: '按钮类型'
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