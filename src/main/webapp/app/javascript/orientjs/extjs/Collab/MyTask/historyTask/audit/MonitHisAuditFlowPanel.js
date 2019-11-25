/**
 * Created by Administrator on 2016/9/8 0008.
 * 查看历史审批进度
 */
Ext.define('OrientTdm.Collab.MyTask.historyTask.audit.MonitHisAuditFlowPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.monitHisAuditFlowPanel',
    layout: 'fit',
    requires: [
        'OrientTdm.Collab.common.auditFlow.auditFlowPanel'
    ],
    config: {
        flowMonitData: {}
    },
    initComponent: function () {
        var me = this;
        var items = me._initFlowGraph();
        Ext.apply(me, {
            items: items,
            title: '流程图'
        });
        this.callParent(arguments);
    },
    _initFlowGraph: function () {
        var me = this;
        var retVal = [];
        if (me.flowMonitData) {
            if (me.flowMonitData.sonControlFlowData && me.flowMonitData.sonControlFlowData.length > 0) {
                //存在子流程
                var tmpItems = [];
                tmpItems.push(Ext.create('OrientTdm.Collab.common.auditFlow.auditFlowPanel', {
                    jpdlDesc: me.flowMonitData.jpdlDesc,
                    flowTaskNodeModelList: me.flowMonitData.flowTaskNodeModelList,
                    title: me.flowMonitData.piId
                }));
                Ext.each(me.flowMonitData.sonControlFlowData, function (sonFlowDesc) {
                    tmpItems.push(Ext.create('OrientTdm.Collab.common.auditFlow.auditFlowPanel', {
                        jpdlDesc: sonFlowDesc.jpdlDesc,
                        flowTaskNodeModelList: sonFlowDesc.flowTaskNodeModelList,
                        title: sonFlowDesc.piId
                    }));
                });
                var tabPanel = Ext.create('OrientTdm.Common.Extend.Panel.OrientTabPanel', {
                    items: tmpItems
                });
                retVal.push(tabPanel)
            } else {
                retVal.push(Ext.create('OrientTdm.Collab.common.auditFlow.auditFlowPanel', {
                    jpdlDesc: me.flowMonitData.jpdlDesc,
                    flowTaskNodeModelList: me.flowMonitData.flowTaskNodeModelList
                }))
            }
        }
        return retVal;
    }
});