/**
 * Created by dailin on 2019/7/8 15:29.
 */

Ext.define('OrientTdm.Collab.ProjectMng.mainFrame.knowledge.CenterModelGridpanel',{
    extend: 'OrientTdm.Common.Extend.Grid.OrientModelGrid',

    initComponent: function () {
        var me = this;
        me.nodeId = -1;
        me.setCustomerFilter();
        me.callParent();
    },

    initEvents: function() {
        var me = this;
        me.callParent(arguments);
        me.mon(me, 'refreshByTreeNodeChange', me.refreshByTreeNodeChange, me);
    },

    createToolBarItems: function () {
        var me = this;
        var retV = [];
    },

    /**
     * 知识文档名称，文档可见范围，密级，类型，知识文档大小，上传时间，上传人，摘要，关键字，最后编辑人
        存储位置，最终显示名称，下载次数，点击次数，预览次数，所属类别Id
     * @returns {Array}
     */
    createColumns: function() {
        var me = this;
        var originalColumns = me.callParent(arguments);
        var columns = [];
        var modelId = me.modelId;
        var filterIndex = [
            "C_FILELOCATION_" + modelId,
            "C_FINALNAME_" + modelId,
            "C_FILEDOWNLOAD_" + modelId,
            "C_FILECLICKNUM_" + modelId,
            "C_PREVIEWNUM_" + modelId,
            "T_CATEGORY_" + OrientExtUtil.FunctionHelper.getKnowledgeSchemaId() + "_ID"];
        Ext.each(originalColumns, function (column) {
            if (!Ext.Array.contains(filterIndex,column.dataIndex)) {
                columns.push(column);
            }
        });
        return columns;
    },

    setCustomerFilter: function () {
        var me = this;
        var customerFilter = [];

        // 获取已绑定知识ids
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/KnowledgeController/getKnowledgeIdsByTemplste.rdm',{
            prjId: me.taskId
        }, false, function (response) {
            if(response.decodedData.success){
                // 不显示已绑定知识
                if (response.decodedData.results != "") {
                    customerFilter.push(new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.NotIn, "", response.decodedData.results));
                }
            }
        });

        customerFilter.push(new CustomerFilter("T_CATEGORY_" + OrientExtUtil.FunctionHelper.getKnowledgeSchemaId() + "_ID",
            CustomerFilter.prototype.SqlOperation.In, "", me.nodeId));
        me.customerFilter = customerFilter;
    },

    refreshByTreeNodeChange: function (nodeId) {
        var me = this;
        me.nodeId = nodeId;
        me.setCustomerFilter();
        me.store.getProxy().setExtraParam("customerFilter",Ext.encode(me.customerFilter));
        me.refreshGridByQueryFilter();
    }
});