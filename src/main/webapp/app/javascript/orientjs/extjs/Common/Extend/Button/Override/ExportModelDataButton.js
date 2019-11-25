/**
 * Created by enjoy on 2016/4/18 0018.
 * 删除模型数据
 */
Ext.define("OrientTdm.Common.Extend.Button.Override.ExportModelDataButton", {
    extend: 'OrientTdm.Common.Extend.Button.OrientButton',
    //按钮点击时触发事件
    triggerClicked: function (modelGridPanel) {
        var me = this;
        //获取选中数据
        var selections = modelGridPanel.getSelectionModel().getSelection();
        var combineFilter = [];
        var modelId = modelGridPanel.modelId;
        var isView = modelGridPanel.isView;
        if (selections.length === 0) {
            //执行删除询问
            Ext.MessageBox.confirm(OrientLocal.prompt.confirm, OrientLocal.prompt.exportAll, function (btn) {
                if (btn == 'yes') {
                    //获取待删除数据ID
                    var customerFilter = modelGridPanel.getCustomerFilter();
                    var queryFilter = modelGridPanel.getQueryFilter();
                    var combineFilter = Ext.isEmpty(customerFilter) ? queryFilter : Ext.Array.merge(customerFilter, queryFilter);
                    me._doExport(modelId, isView, combineFilter);
                }
            });
        } else {
            toExportDataIds = OrientExtUtil.GridHelper.getSelectRecordIds(modelGridPanel);
            combineFilter[0] = new CustomerFilter("ID", "In", "", toExportDataIds.join(","));
            me._doExport(modelId, isView, combineFilter);
        }
    },
    _doExport: function (modelId, isView, customFilter) {
        OrientExtUtil.AjaxHelper.doRequest(serviceName + "/dataImportExport/preapareExportData.rdm", {
            'modelId': modelId,
            'isView': isView,
            'customerFilter': Ext.isEmpty(customFilter) ? "" : Ext.encode(customFilter)
        }, true, function (resp) {
            window.location.href = serviceName + "/orientForm/downloadByName.rdm?fileName=" + resp.decodedData.results;
        });
    }
});