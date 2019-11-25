/**
 * Created by Administrator on 2016/8/19 0019.
 */
Ext.define('OrientTdm.Example.BtnExtend.TestApprovalBtn', {
    extend: 'OrientTdm.Common.Extend.Button.OrientButton',
    alias: 'widget.testApprovalBtn',
    triggerClicked: function (modelGridPanel) {
        var me = this;
        var selections = modelGridPanel.getSelectionModel().getSelection();
        if (selections.length === 0) {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.atleastSelectOne);
        } else {
            //发起流程
            if (me.btnDesc) {
                var selectedIds = OrientExtUtil.GridHelper.getSelectRecordIds(modelGridPanel);
                var params = {
                    modelId: modelGridPanel.modelDesc.modelId,
                    dataIds: selectedIds
                };
                //重写审批发起面板
                Ext.require('OrientTdm.Collab.common.auditFlow.StartAuditFlowPanel', function () {
                    var item = Ext.create('OrientTdm.Collab.common.auditFlow.StartAuditFlowPanel', params);
                    OrientExtUtil.WindowHelper.createWindow(item, {
                        title: '启动流程'
                    });
                });
            }
        }
    }
});

