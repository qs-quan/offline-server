/**
 * 导入矩阵数据的按钮
 * Created by GNY on 2018/5/29
 */
Ext.define('OrientTdm.Mongo.Button.ImportMatrixDataButton', {
    extend: 'OrientTdm.Common.Extend.Button.OrientButton',
    triggerClicked: function (modelGridPanel) {
        var me = this;
        //如果有选中记录
        if (OrientExtUtil.GridHelper.hasSelectedOne(modelGridPanel)) {
            var selections = modelGridPanel.getSelectionModel().getSelection();
            var dataId = selections[0].data.ID;
            var modelId = modelGridPanel.modelId;
            me.successCallBack = function () {
                if(modelGridPanel.hasListener('customRefreshGrid')){
                    //如果存在自定义刷新事件
                    modelGridPanel.fireEvent('customRefreshGrid');
                }else{
                    //否则调用默认刷新事件
                    modelGridPanel.fireEvent('refreshGridByCustomerFilter');
                }
                me.doBack();
            };
            //创建上传矩阵文件的面板
            me.customPanel = me.createUploadFileForm(modelGridPanel, me.btnDesc, modelId, dataId);
            me.callParent(arguments);
        }
    },
    createUploadFileForm: function (modelGridPanel,btnDesc,modelId,dataId) {
        var me = this;
        var retVal = Ext.create('OrientTdm.Mongo.Form.UploadMatrixDataFileForm', {
            modelId:modelId,
            dataId:dataId,
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    itemId: 'back',
                    text: '返回',
                    iconCls: 'icon-back',
                    scope: me,
                    handler: Ext.bind(me.doBack, me, [modelGridPanel], true)
                }]
            }],
            buttonAlign: 'center',
            successCallback: me.successCallBack,
            modelDesc: modelGridPanel.modelDesc,
            btnInstance: me
        });
        return retVal;
    }
});