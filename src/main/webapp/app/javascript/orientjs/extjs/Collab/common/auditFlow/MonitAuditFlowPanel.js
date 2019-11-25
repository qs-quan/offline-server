/**
 * Created by Administrator on 2016/9/8 0008.
 * 审批流程进度监控
 */
Ext.define('OrientTdm.Collab.common.auditFlow.MonitAuditFlowPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.monitAuditFlowPanel',
    layout: 'fit',
    requires: [
        'OrientTdm.Collab.common.auditFlow.auditFlowPanel'
    ],
    config: {
        piId: ''
    },
    initComponent: function () {
        var me = this;
        var items = me._initFlowGraph();
        Ext.apply(me, {
            items: items
        });
        this.callParent(arguments);
    },
    _initFlowGraph: function () {
        var me = this;
        var retVal = [];
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/flowDiagramContent/getMainAndSubPIs.rdm', {
            piId: me.piId
        }, false, function (resp) {
            if (resp.decodedData && resp.decodedData.results) {
                if (resp.decodedData.results.length > 1) {
                    var tmpItems = [];
                    Ext.each(resp.decodedData.results, function (flowInfo) {
                        tmpItems.push(Ext.create('OrientTdm.Collab.common.auditFlow.auditFlowPanel', {
                            piId: flowInfo.id,
                            title: flowInfo.id,
                            itemId: flowInfo.dbId
                        }));
                    });
                    var tabPanel = Ext.create('OrientTdm.Common.Extend.Panel.OrientTabPanel', {
                        items: tmpItems
                    });
                    retVal.push(tabPanel)
                } else {
                    retVal.push(Ext.create('OrientTdm.Collab.common.auditFlow.auditFlowPanel', {
                        piId: me.piId
                    }))
                }

            }
        });
        return retVal;
    }
});