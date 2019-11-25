/**
 * Created by enjoy on 2016/4/30 0030.
 */
Ext.define('OrientTdm.SysMgr.BackupMgr.BackupDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.backupDashBord',
    requires: [
        "OrientTdm.SysMgr.BackupMgr.Query.BackupQueryForm",
        "OrientTdm.SysMgr.BackUpJob.BackUpJobDashBord"
    ],
    initComponent: function () {
        var me = this;
        var queryPanel = Ext.create("OrientTdm.SysMgr.BackupMgr.Query.BackupQueryForm", {
            region: 'north',
            title: '查询',
            height: 110,
            collapsible: true,
            bodyStyle:{background:'#ffffff'}
        });
        //创建中间面板
        var listPanel = Ext.create("OrientTdm.SysMgr.BackupMgr.BackupList", {
            region: 'center',
            padding: '0 0 0 5',
            title: '备份恢复'
        });
        //创建右侧面板
        var eastPanel = Ext.create("OrientTdm.SysMgr.BackUpJob.BackUpJobDashBord", {
            region: 'east',
            title: '定时备份',
            padding: '0 0 0 5',
            width: "50%",
            collapsible: true
        });
        Ext.apply(me, {
            layout: 'border',
            items: [
                queryPanel, listPanel, eastPanel
            ],
            northPanel: queryPanel,
            centerPanel: listPanel,
            eastPanel: eastPanel
        });
        me.callParent(arguments);
    }
});