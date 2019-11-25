/**
 * Created by Administrator on 2016/9/2 0002.
 */
Ext.define('OrientTdm.Collab.common.auditFlow.DetailAuditFlowPanel', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.detailAuditFlowPanel',
    requires: [],
    config: {
        modelId: '',
        dataIds: ''
    },
    initComponent: function () {
        var me = this;

        this.callParent(arguments);
    }
});