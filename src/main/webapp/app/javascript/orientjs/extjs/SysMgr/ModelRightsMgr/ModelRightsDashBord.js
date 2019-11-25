/**
 * Created by enjoy on 2016/4/30 0030.
 */
Ext.define('OrientTdm.SysMgr.ModelRightsMgr.ModelRightsDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.modelRightsDashBord',
    requires: [
        'OrientTdm.SysMgr.ModelRightsMgr.West.ModelTree',
        'OrientTdm.SysMgr.ModelRightsMgr.Center.ModelRightsDetail'
    ],
    initComponent: function () {
        var me = this;
        var modelTree = Ext.create('OrientTdm.SysMgr.ModelRightsMgr.West.ModelTree', {
            width: 280,
            minWidth: 280,
            maxWidth: 400,
            region: 'west',
            collapsible: true
        });
        var centerPanel = Ext.create("OrientTdm.SysMgr.ModelRightsMgr.Center.ModelRightsDetail", {
            padding: '0 0 0 5',
            region: 'center'
        });
        Ext.apply(me, {
            layout: 'border',
            items: [modelTree, centerPanel],
            westPanel: modelTree,
            centerPanel: centerPanel
        });
        me.callParent(arguments);
    }
});