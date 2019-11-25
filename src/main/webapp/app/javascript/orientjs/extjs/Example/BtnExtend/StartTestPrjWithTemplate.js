/**
 * 启动试验项目
 */
Ext.define('OrientTdm.Example.BtnExtend.StartTestPrjWithTemplate', {
    extend: 'OrientTdm.Common.Extend.Button.OrientButton',
    alias: 'widget.startTestPrjWithTemplate',
    triggerClicked: function (modelGridPanel) {
        var me = this;
        var selections = modelGridPanel.getSelectionModel().getSelection();
        if (selections.length === 0) {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.atleastSelectOne);
        } else if (selections.length === 1) {
            //发起流程
            if (me.btnDesc) {
                var selectedIds = OrientExtUtil.GridHelper.getSelectRecordIds(modelGridPanel);
                var params = {
                    modelId: modelGridPanel.modelDesc.modelId,
                    dataId: selectedIds[0]
                };
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/customExampleController/startTestPrjWithTemplate.rdm', params, true, function (resp) {
                    modelGridPanel.fireEvent('refreshGrid');
                });
            }
        } else {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, '每次只能启动一个试验项目');
        }
    }
});

