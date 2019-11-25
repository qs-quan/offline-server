/**
 * Created by enjoy on 2016/4/30 0030.
 */
Ext.define('OrientTdm.SysMgr.FileGroup.FileGroupDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.fileGroupDashBord',
    requires: [
        "OrientTdm.SysMgr.FileGroup.FileTypeGroupTree",
        "OrientTdm.SysMgr.FileGroup.FileTypeGroupItemList",
        "OrientTdm.SysMgr.FileGroup.Query.FileGroupQueryForm"
    ],
    initComponent: function () {
        var me = this;
        var queryPanel = Ext.create("OrientTdm.SysMgr.FileGroup.Query.FileGroupQueryForm", {
            region: 'north',
            title: '查询',
            height: 100,
            collapsible: true
        });
        //创建中间面板
        var listPanel = Ext.create("OrientTdm.SysMgr.FileGroup.FileTypeGroupItemList", {
            region: 'center',
            padding: '0 0 0 5',
            title: '分组详细'
        });
        var centerPanel = Ext.create("OrientTdm.Common.Extend.Panel.OrientPanel", {
            layout: 'border',
            region: 'center',
            items: [
                queryPanel, listPanel
            ],
            northPanel: queryPanel,
            centerPanel: listPanel
        });
        //左侧文件分组tree
        var fileTypeGroupTree = Ext.create("OrientTdm.SysMgr.FileGroup.FileTypeGroupTree", {
            width: 290,
            minWidth: 290,
            maxWidth: 290,
            region: 'west'
        });
        Ext.apply(me, {
            layout: 'border',
            items: [centerPanel, fileTypeGroupTree],
            westPanel: fileTypeGroupTree,
            centerPanel: listPanel
        });
        me.callParent(arguments);
    }
});