/**
 * Created by enjoy on 2016/4/18 0018.
 * 删除模型数据
 */
Ext.define("OrientTdm.Common.Extend.Button.Override.DetailAuditFlowButton", {
    extend: 'OrientTdm.Common.Extend.Button.OrientButton',
    requires: [
        'OrientTdm.Collab.common.auditFlow.MonitAuditFlowPanel'
    ],
    //按钮点击时触发事件
    triggerClicked: function (modelGridPanel) {
        //获取选中数据
        if (OrientExtUtil.GridHelper.hasSelectedOne(modelGridPanel)) {
            var selectedRecord = OrientExtUtil.GridHelper.getSelectedRecord(modelGridPanel)[0];
            var params = {
                modelId: modelGridPanel.modelDesc.modelId,
                dataId: selectedRecord.get('ID')
            };
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/auditFlow/info/getPiIdByBindModel.rdm', params, true, function (resp) {
                var piId = resp.decodedData.results;
                if (!Ext.isEmpty(piId)) {
                    var flowDiagPanel = Ext.create("OrientTdm.Collab.common.auditFlow.MonitAuditFlowPanel", {
                        piId: piId
                    });
                    OrientExtUtil.WindowHelper.createWindow(flowDiagPanel, {
                        title: '审批进度',
                        button: [
                            {
                                text: '关闭',
                                iconCls: 'icon-close',
                                handler: function () {
                                    this.up('window').close();
                                }
                            }
                        ]
                    });
                }
            });
        }
    }
});