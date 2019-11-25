/**
 * 数据字典-
 *  试验类型删除按钮
 *  试验项删除按钮
 */
Ext.define("OrientTdm.TestBomBuild.Button.custom.TestProjectDeleteButton", {
    extend: 'OrientTdm.Common.Extend.Button.OrientButton',
    triggerClicked: function (modelGridPanel) {
        var me = this;

        var selections = modelGridPanel.getSelectionModel().getSelection();
        if(selections.length == 0){
            OrientExtUtil.Common.info('提示', '请选择要删除的数据');
            return;
        }

        var deleteDataIds = [];
        for (var i = 0; i < selections.length; i++) {
            deleteDataIds.push(selections[i].raw.ID);
        }

        Ext.MessageBox.confirm(OrientLocal.prompt.confirm, OrientLocal.prompt.deleteConfirm, function (btn) {
            if (btn == 'yes') {
                OrientExtUtil.AjaxHelper.doRequest(serviceName + "/TestProject462Controller/deleteTestProjectTemplateTestProjectByIds.rdm", {
                    deleteDataIdStr: deleteDataIds.join(',')
                }, false, function (response) {
                    if (response.decodedData.success) {
                        // 刷新列表
                        modelGridPanel.fireEvent('refreshGrid');
                    }
                });
            }
        });
    }
});