/**
 * Created by enjoy on 2016/4/30 0030.
 */
Ext.define('OrientTdm.SysMgr.ParamterMgr.ParamDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.paramDashBord',
    requires: [
        "OrientTdm.SysMgr.ParamterMgr.Query.ParamterQueryForm",
        "OrientTdm.SysMgr.ParamterMgr.ParamterList"
    ],
    initComponent: function () {
        var me = this;
        var queryPanel = Ext.create("OrientTdm.SysMgr.ParamterMgr.Query.ParamterQueryForm", {
            region: 'north',
            title: '查询',
            height: 110,
            collapsible: true,
            bodyStyle:{background:'#ffffff'}
        });
        //创建中间面板
        var listPanel = Ext.create("OrientTdm.SysMgr.ParamterMgr.ParamterList", {
            region: 'center',
            padding: '0 0 0 5',
            title: '系统参数'
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