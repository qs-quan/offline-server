/**
 * Created by Administrator on 2017/7/18 0018.
 */

Ext.define('OrientTdm.DataMgr.SchemaData.SchemaDataDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.schemaDataDashBord',
    requires: [
        "OrientTdm.DataMgr.SchemaData.SchemaTree",
        "OrientTdm.DataMgr.Center.DataShowRegion"
    ],
    initComponent: function () {
        var me = this;
        //创建中间面板
        var centerPanel = Ext.create("OrientTdm.DataMgr.Center.DataShowRegion", {
            region: 'center',
            padding: '0 0 0 5'
        });
        //Tbom
        var tbomPanel = Ext.create("OrientTdm.DataMgr.SchemaData.SchemaTree", {
            width: 280,
            minWidth: 280,
            maxWidth: 400,
            region: 'west'
        });
        Ext.apply(me, {
            layout: 'border',
            items: [centerPanel, tbomPanel]
        });
        me.callParent(arguments);
    }
});