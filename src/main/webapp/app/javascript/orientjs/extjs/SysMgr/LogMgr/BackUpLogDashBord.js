/**
 * Created by qjs on 2017/1/20.
 */
Ext.define('OrientTdm.SysMgr.LogMgr.BackUpLogDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.backUpLogDashBord',
    requires: [
        'OrientTdm.SysMgr.BackUpJob.Common.BackUpJobForm',
        'OrientTdm.SysMgr.BackUpJob.BackUpJobList'
    ],
    title:'设置',
    initComponent: function () {
        var me = this;
        var queryPanel = Ext.create('OrientTdm.SysMgr.BackUpJob.Common.BackUpJobForm', {
            region: 'north',
            bindModelName: 'CWM_TIME_INFO',
            actionUrl: serviceName + '/SysLog/timeBackUp.rdm',
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
            title: '定时日志备份监控'
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