/**
 * Created by qjs on 2016/12/19.
 */
Ext.define('OrientTdm.BackgroundMgr.PVMMulTemplate.MulPVMTmpDashBoard', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.pvmMulTmpDashBoard',
    requires: [
        //'OrientTdm.BackgroundMgr.PVMHtml.PVMHtmlList',
        'OrientTdm.BackgroundMgr.PVMMulTemplate.MulPVMTmpList',
        'OrientTdm.BackgroundMgr.PVMMulTemplate.Query.MulPVMTmpQueryForm'
    ],
    initComponent: function () {
        var me = this;
        var queryPanel = Ext.create('OrientTdm.BackgroundMgr.PVMMulTemplate.Query.MulPVMTmpQueryForm', {
            region: 'north',
            title: '查询',
            height: 110,
            collapsible: true,
            bodyStyle:{background:'#ffffff'}
        });
        //创建中间面板
        var listPanel = Ext.create('OrientTdm.BackgroundMgr.PVMMulTemplate.MulPVMTmpList', {
            region: 'center',
            padding: '0 0 0 5',
            title: '检查表综合模板'
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