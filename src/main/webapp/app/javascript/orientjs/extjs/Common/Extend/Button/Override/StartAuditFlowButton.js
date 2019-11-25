/**
 * Created by enjoy on 2016/4/18 0018.
 * 删除模型数据
 */
Ext.define("OrientTdm.Common.Extend.Button.Override.StartAuditFlowButton", {
    extend: 'OrientTdm.Common.Extend.Button.OrientButton',
    //按钮点击时触发事件
    triggerClicked: function (modelGridPanel) {
        //获取选中数据
        var selections = modelGridPanel.getSelectionModel().getSelection();
        if (selections.length === 0) {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.atleastSelectOne);
        } else {
            var selectedIds = OrientExtUtil.GridHelper.getSelectRecordIds(modelGridPanel);
            var params = {
                modelId: modelGridPanel.modelDesc.modelId,
                dataIds: selectedIds,
                successCallback: function () {
                    if (modelGridPanel.hasListener('customRefreshGrid')) {
                        //如果存在自定义刷新事件
                        modelGridPanel.fireEvent('customRefreshGrid');
                    } else {
                        //否则调用默认刷新事件
                        modelGridPanel.fireEvent('refreshGridByCustomerFilter');
                    }
                    modelGridPanel.fireEvent('afterStartAuditFlow', arguments);
                }
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
});