/**
 * Created by enjoy on 2016/4/30 0030.
 */
Ext.define('OrientTdm.SysMgr.BackUpJob.BackUpJobDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.backUpJobDashBord',
    requires: [
        'OrientTdm.SysMgr.BackUpJob.Common.BackUpJobForm',
        'OrientTdm.SysMgr.BackUpJob.BackUpJobList'
    ],
    initComponent: function () {
        var me = this;
        var queryPanel = Ext.create('OrientTdm.SysMgr.BackUpJob.Common.BackUpJobForm', {
            region: 'north',
            bindModelName: 'CWM_TIME_INFO',
            actionUrl: serviceName + '/BackUpJob/create.rdm',
            successCallback: function () {
                me.northPanel.clearBackStrategy();
                me.centerPanel.fireEvent('refreshGrid');
            }
        });
        //创建中间面板
        var listPanel = Ext.create('OrientTdm.SysMgr.BackUpJob.BackUpJobList', {
            height: 350,
            region: 'center',
            padding: '0 0 0 5',
            title: '定时任务监控'
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