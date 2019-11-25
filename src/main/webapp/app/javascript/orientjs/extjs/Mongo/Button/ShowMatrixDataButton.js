/**
 * 查看矩阵数据按钮
 * Created by GNY on 2018/5/30
 */
Ext.define('OrientTdm.Mongo.Button.ShowMatrixDataButton', {
    extend: 'OrientTdm.Common.Extend.Button.OrientButton',
    triggerClicked: function (modelGridPanel) {
        //如果有选中记录
        if (OrientExtUtil.GridHelper.hasSelectedOne(modelGridPanel)) {
            var modelId = modelGridPanel.modelId;
            var selection = modelGridPanel.getSelectionModel().getSelection()[0];
            var dataId = selection.data.ID;
            var params = {modelId: modelId, dataId: dataId};

            //获取所有tab页的名字
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/mongoService/getTabs.rdm', params, false, function (resp) {
                var results = resp.decodedData.results;
                if (results.length === 0) {
                    OrientExtUtil.Common.info(OrientLocal.prompt.info, "请导入实验数据后再点击查看按钮！");
                } else {
                    //以tab页的形式显示

                    var tabPanel = Ext.create('Ext.tab.Panel', {
                        closable: true,
                        iconCls: 'icon-preview',
                        title: '矩阵数据查看'
                    });
                    Ext.each(results, function (result) {

                        var matrixDataGrid = Ext.create('OrientTdm.Mongo.Grid.ShowMatrixDataGrid', {
                            itemId: modelId + '_' + dataId + '_' + result,
                            modelId: modelId,
                            dataId: dataId,
                            tabName: result
                        });

                        tabPanel.add({
                            iconCls: 'icon-preview',
                            title: result,
                            closable: true,
                            active: true,
                            layout: 'fit',
                            items: [matrixDataGrid]
                        });

                    });

                    tabPanel.setActiveTab(0);

                    var orientCenterTabPanel = Ext.getCmp('orient-center');
                    orientCenterTabPanel.add(
                        tabPanel
                    );
                    orientCenterTabPanel.setActiveTab(orientCenterTabPanel.items.length - 1);
                }

            });
            /* var queryUrl = null;
             var isEditing = false;
             var showVersionId = '';
             //先判断当前登录人是否是上一次修改人
             OrientExtUtil.AjaxHelper.doRequest(serviceName + '/mongoService/judgeIsEditing.rdm', params, false, function (resp) {
                 switch (resp.decodedData.success) {
                     case true:  //如果是登录人就是上一次修改人，则显示temp表中的数据
                         queryUrl = '/mongoService/getTempVersionGridData.rdm';
                         isEditing = true;
                         break;
                     default :   //默认显示show版本的数据
                         queryUrl = '/mongoService/getCurrentVersionGridData.rdm';
                         isEditing = false;
                         showVersionId = resp.decodedData.results;
                         break;
                 }
             });

             var orientCenterTabPanel = Ext.getCmp('orient-center');

             orientCenterTabPanel.add(
                 Ext.create('OrientTdm.Mongo.Grid.ShowMatrixDataGrid', {
                     closable: true,
                     iconCls: 'icon-preview',
                     title: '矩阵数据查看',
                     modelId: modelId,
                     dataId: dataId,
                     showVersionId: showVersionId,
                     isEditing: isEditing,
                     queryUrl: queryUrl
                 })
             );

             orientCenterTabPanel.setActiveTab(orientCenterTabPanel.items.length - 1);*/

        }
    }
});