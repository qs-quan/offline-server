/**
 * Created by dailin on 2019/6/25 13:56.
 */

Ext.define("OrientTdm.TestBomBuild.Button.PowerTestDataTableDownloadButton", {
    extend: 'OrientTdm.Common.Extend.Button.OrientButton',
    //按钮点击时触发事件
    triggerClicked: function (modelGridPanel) {
/*        var me = this;
        var dataId = "";
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomQueryController/getNodesRelationTableDataIds.rdm', {
            tableId: modelGridPanel.tableId,
            tableName: modelGridPanel.tableName,
            nodeId: modelGridPanel.treeNode.raw.id,
            isDataId: "1",
            isAll: "0"
        }, false, function (response) {
            if (response.decodedData.success)
                dataId = response.decodedData.results;
        });
        var tableId = OrientExtUtil.ModelHelper.getModelId("T_SYLX", OrientExtUtil.FunctionHelper.getSYZYSchemaId());

        var retVal = Ext.create("OrientTdm.TestBomBuild.Panel.TabPanel.FileTabPanel", {
            modelId: tableId,
            dataId: dataId,
            layout:'fit',
            nodeId: ''

        });
        Ext.create('widget.window',{
            title: '查看【' + modelGridPanel.treeNode.raw.text + '】' + '试验数据表模板',
            layout: 'fit',
            height: 500,
            width: 500,
            modal: true,
            items: [retVal]
        }).show();*/
        if (modelGridPanel.tableName == "T_RW_INFO") {
            /* 另一种实现模板下载（将绑定的多个模板文件压缩为一个文件，再下载压缩包后，删除原压缩包）
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TemplateController/CompressTemplatesByTestTypeId.rdm',{
                testTypeId: modelGridPanel.testTypeId
            }, false, function (response) {
                var resp = response.decodedData;
                if (resp.success) {
                    if (resp.results['count'] == 0) {
                        OrientExtUtil.Common.tip('提示','实验类型未绑定试验模板，请先进行模板绑定。');
                    } else {
                        OrientExtUtil.FileHelper.doDownloadByFilePath(resp.results['fileName'], '模板文件.zip', 'ftp', 'true');
                    }
                } 
            });*/
            /*var testTypeId = "";
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/')*/
            OrientExtUtil.FileHelper.doDownloadByFilePath('XlsTemplate' +'%2F'+ '模板下载.rar', '模板下载.rar', '', 'false');
        }


    }
});
