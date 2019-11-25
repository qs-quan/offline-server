/**
 * Created by enjoy on 2016/5/16 0016.
 */
Ext.define('OrientTdm.DataMgr.DataMgrDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.dataMgrDashBord',
    requires: [
        "OrientTdm.DataMgr.TBom.TBomTree",
        "OrientTdm.DataMgr.Center.DataShowRegion"
    ],
    initComponent: function () {
        var me = this;
        var functionId = me.itemId;
        if (functionId) {
            //截取ID
            functionId = functionId.substr(functionId.indexOf("-") + 1, functionId.length);
        }
        //创建中间面板
        var centerPanel = Ext.create("OrientTdm.DataMgr.Center.DataShowRegion", {
            region: 'center',
            padding: '0 0 0 5'
        });
        //Tbom
        var tbomPanel = Ext.create("OrientTdm.DataMgr.TBom.TBomTree", {
            width: 280,
            minWidth: 280,
            maxWidth: 400,
            belongFunctionId: functionId,
            region: 'west'
        });
        Ext.apply(me, {
            layout: 'border',
            items: [centerPanel, tbomPanel],
            westPanel: tbomPanel,
            centerPanel: centerPanel
        });
        me.callParent(arguments);
    }
});