/**
 * Created by mengbin on 16/7/21.
 */
Ext.define("OrientTdm.Common.Extend.Button.Override.ExportODSButton", {
    extend: 'OrientTdm.Common.Extend.Button.OrientButton',
    //按钮点击时触发事件
    triggerClicked: function (modelGridPanel) {
        var me = this;
        //获取选中数据
        var selections = modelGridPanel.getSelectionModel().getSelection();
        var combineFilter = [];
        var modelId = modelGridPanel.modelId;
        var isView = modelGridPanel.isView;
        var bindNode = modelGridPanel.bindNode;

        var treeNode = {
            dataId: bindNode.raw.idList[0],
            displayName: bindNode.raw.text,
            modelId: bindNode.raw.modelId
        };


        var treenodes = new Array();
        treenodes.push(treeNode);

        while (true) {
            if (bindNode.parentNode.internalId == 'root' || bindNode.parentNode.raw.modelId == null) {
                break;
            }
            bindNode = bindNode.parentNode;
            if (!Ext.isEmpty(bindNode.raw.modelId) && bindNode.raw.idList.length > 0) {
                var treeNode = {
                    dataId: bindNode.raw.idList[0],
                    displayName: bindNode.raw.text,
                    modelId: bindNode.raw.modelId
                };
                treenodes.push(treeNode);
            }
        }
        if (selections.length === 0) {
            Ext.MessageBox.confirm(OrientLocal.prompt.confirm, OrientLocal.prompt.exportAll, function (btn) {
                if (btn == 'yes') {
                    //获取待删除数据ID
                    var customerFilter = modelGridPanel.getCustomerFilter();
                    var queryFilter = modelGridPanel.getQueryFilter();
                    var combineFilter = Ext.isEmpty(customerFilter) ? queryFilter : Ext.Array.merge(customerFilter, queryFilter);
                    me._doExport(modelId, isView, combineFilter, treenodes);
                }
            });
        } else {
            toExportDataIds = OrientExtUtil.GridHelper.getSelectRecordIds(modelGridPanel);
            combineFilter[0] = new CustomerFilter("ID", "In", "", toExportDataIds.join(","));
            me._doExport(modelId, isView, combineFilter, treenodes);
        }
    },
    _doExport: function (modelId, isView, customFilter, treenodes) {
        OrientExtUtil.AjaxHelper.doRequest("AtfxExport/exportODS.rdm", {
            'modelId': modelId,
            'isView': isView,
            'pathBeans': Ext.encode(treenodes),
            'customerFilter': Ext.isEmpty(customFilter) ? "" : Ext.encode(customFilter)
        }, true, function (resp) {
            window.location.href = "orientForm/downloadByName.rdm?fileName=" + resp.decodedData.results;
        });
    }


});
