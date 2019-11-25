/**
 * 删除导入的矩阵数据，也就是删除对应的mongodb表
 * Created by GNY on 2018/5/30
 */
Ext.define('OrientTdm.Mongo.Button.DeleteMatrixDataButton', {
    extend: 'OrientTdm.Common.Extend.Button.OrientButton',
    triggerClicked: function (modelGridPanel) {

        if (OrientExtUtil.GridHelper.hasSelectedOne(modelGridPanel)) {
            var selectedRecord = modelGridPanel.getSelectionModel().getSelection()[0];
            var dataId = selectedRecord.data.ID;
            var modelId = modelGridPanel.modelId;
            var params = {modelId: modelId, dataId: dataId};
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/mongoService/deleteData.rdm', params, false, function (resp) {
                if(resp.decodedData.success){
                    OrientExtUtil.Common.tip(OrientLocal.prompt.info, '删除成功');
                }else{
                    OrientExtUtil.Common.err(OrientLocal.prompt.info, '删除失败');
                }
            });

        }
    }
});