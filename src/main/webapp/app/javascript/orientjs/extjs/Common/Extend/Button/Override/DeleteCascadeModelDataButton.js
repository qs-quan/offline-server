/**
 * Created by enjoy on 2016/4/18 0018.
 * 删除模型数据
 */
Ext.define("OrientTdm.Common.Extend.Button.Override.DeleteCascadeModelDataButton", {
    extend: 'OrientTdm.Common.Extend.Button.OrientButton',
    //按钮点击时触发事件
    triggerClicked: function (modelGridPanel) {
        //获取选中数据
        var selections = modelGridPanel.getSelectionModel().getSelection();
        if (selections.length === 0) {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.atleastSelectOne);
        } else {
            //执行删除询问
            Ext.MessageBox.confirm(OrientLocal.prompt.confirm, OrientLocal.prompt.deleteConfirm, function (btn) {
                if (btn == 'yes') {
                    //获取待删除数据ID
                    var toDelIds = OrientExtUtil.GridHelper.getSelectRecordIds(modelGridPanel);
                    Ext.getBody().mask("请稍后...", "x-mask-loading");
                    Ext.Ajax.request({
                        url: modelGridPanel.getStore().getProxy().api["delete"],
                        params: {
                            toDelIds: toDelIds,
                            modelId: modelGridPanel.modelId,
                            isCascade: 'true'
                        },
                        success: function (response) {
                            Ext.getBody().unmask();
                            //删除成功后刷新表格
                            if(modelGridPanel.hasListener('customRefreshGrid')){
                                //如果存在自定义刷新事件
                                modelGridPanel.fireEvent('customRefreshGrid');
                            }else{
                                //否则调用默认刷新事件
                                modelGridPanel.fireEvent('refreshGridByCustomerFilter');
                            }
                            modelGridPanel.fireEvent('afterDeleteData', toDelIds, arguments);
                        }
                    });
                }
            });
        }
    }
});