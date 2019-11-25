Ext.define('OrientTdm.BackgroundMgr.ProcessDefinition.PdDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientTabPanel',
    alias: 'widget.pdDashBord',
    requires: [
        'OrientTdm.BackgroundMgr.ProcessDefinition.PdCard'
    ],
    initComponent: function () {
        var me = this;
        var auditPdList = Ext.create('OrientTdm.BackgroundMgr.ProcessDefinition.PdCard', {
            title: '审批流程'
        });
        //创建中间面板
        var collabPdList = Ext.create('OrientTdm.BackgroundMgr.ProcessDefinition.PdCard', {
            title: '协同流程',
            type: 'collab'
        });
        Ext.apply(me, {
            title: '流程定义',
            items: [
                auditPdList, collabPdList
            ]
        });
        me.callParent(arguments);
    }
});