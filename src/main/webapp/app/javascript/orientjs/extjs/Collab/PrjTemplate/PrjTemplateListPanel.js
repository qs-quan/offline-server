/**
 * 试验项目模板列表
 */
Ext.define('OrientTdm.Collab.PrjTemplate.PrjTemplateListPanel', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientModelGrid',
    requires: [
        "OrientTdm.Collab.common.template.model.TemplateListModel"
    ],

    initComponent: function () {
        var me = this;
        me.usePage = false;
        me.multiSelect = false;

        me.initEvents();
        me.callParent(arguments);
    },

    initEvents: function () {
        var me = this;
        me.customerFilter = me._getCustomerFilter();
        //me.mon(me, 'filterByFilter', me._filterByFilter, me);
        me.addEvents("filterByFilter");
    },

    createToolBarItems: function () {
        return [];
    },

    /**
     * 设置数据源过滤条件
     * @private
     */
    _getCustomerFilter: function () {
        var me = this;

        var customerFilter = [
            new CustomerFilter("T_ALL_LX_RW_" + OrientExtUtil.FunctionHelper.getSchemaId() + "_ID", CustomerFilter.prototype.SqlOperation.Equal, "", me.pId),
            new CustomerFilter("M_TYPE_" + me.modelId, CustomerFilter.prototype.SqlOperation.Equal, "", me.model),
        ];
        if(me.sysjglParam != undefined && me.sysjglParam.filterCreater){
            customerFilter.push(new CustomerFilter("M_CREATE_" + me.modelId, CustomerFilter.prototype.SqlOperation.Equal, "", window.userId));
        }
        return customerFilter;
    },

    createColumns: function () {
        var me = this;
        var columns = [];
        //获取模型操作描述
        var modelDesc = me.modelDesc;
        if (modelDesc && modelDesc.columns) {
            Ext.each(modelDesc.columns, function (column) {
                if (Ext.Array.contains(modelDesc.listColumnDesc, column.id)) {
                    columns[Ext.Array.indexOf(modelDesc.listColumnDesc, column.id)] = OrientModelHelper.createGridColumn(column);
                }
            });
        }

        columns.unshift({
            xtype:'actioncolumn',
            header: '操作',
            width: 60,
            dataIndex: 'id',
            items: [
                // todo 预览不正确，要用得调试
                /*{
                iconCls: 'icon-preview',
                tooltip: '预览',
                hidden: true,
                handler: function(grid, rowIndex, colIndex, item, e, record) {
                    var me = this.up().up();
                    // 下方的模板预览面板
                    var prjTemplatePreview = Ext.getCmp(me.southPanelName);
                    if (!Ext.isEmpty(prjTemplatePreview)) {
                        prjTemplatePreview.removeAll();
                    }

                    var modelId = me.modelId, deviceModelId = me.deviceModelId, modelDesc, modelData;
                    OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelData/getGridModelDescAndData.rdm', {
                        modelId: me.rwModelId,
                        dataId: record.data['M_RID_' + modelId]
                    }, false, function (response) {
                        modelDesc = response.decodedData.results.orientModelDesc;
                        modelData = response.decodedData.results.modelData;
                    });
                    var retVal = Ext.create("OrientTdm.Common.Extend.Form.OrientDetailModelForm", {
                        title: '查看【' + record.data['M_BH_' + modelId] + '】数据',
                        bindModelName: modelDesc.dbName,
                        modelDesc: modelDesc,
                        originalData: modelData
                    });
                    prjTemplatePreview.insert(0,retVal);
                    prjTemplatePreview.setActiveTab(retVal);

                    var customerFilter = [new CustomerFilter("T_RW_INFO_" + OrientExtUtil.FunctionHelper.getSchemaId() + "_ID", CustomerFilter.prototype.SqlOperation.Equal, "", record.data['M_RID_' + modelId])];
                    Ext.each([
                        {tableId: deviceModelId, tableName: '', title: "设备选择", customerFilter: [new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.In, "", record.data['M_DID_' + modelId] || '')]},
                        {tableName: "T_SYTJ", title: "试验条件", customerFilter: customerFilter},
                        {tableName: "T_HGPJ", title: "合格判据", customerFilter: customerFilter},
                        {tableName: "T_GC", title: "试验过程", customerFilter: customerFilter}
                    ], function (item) {
                        if(item.tableName != ''){
                            item.tableId = OrientExtUtil.ModelHelper.getModelId(item.tableName, OrientExtUtil.FunctionHelper.getSchemaId(), false);
                        }

                        prjTemplatePreview.add(Ext.create('OrientTdm.Common.Extend.Grid.OrientModelGrid', {
                            title : '【' + record.data['M_BH_' + modelId] + '】' + item.title,
                            modelId: item.tableId,
                            isView: 0,
                            customerFilter: item.customerFilter,
                            createToolBarItems: function () {}
                        }));
                    });

                    prjTemplatePreview.expand(false);
                }
            }, ' ', */'->', {
                iconCls: 'icon-delete',
                tooltip: '删除',
                disabled: me.deleteBtnDisabled,
                handler: function(grid, rowIndex, colIndex, item, e, record) {
                    var me = this.up().up();
                    var reqParams = {
                        templateId : record.data.id
                    };
                    OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomTemplateController/deleteTepmleate.rdm', reqParams, false, function (response) {
                        var respJson = response.decodedData;
                        if(respJson.success){
                            // 移除模板预览
                            var prjTemplatePreview = Ext.getCmp(me.southPanelName);
                            if (!Ext.isEmpty(prjTemplatePreview)) {
                                prjTemplatePreview.removeAll();
                            }

                            grid.getStore().reload();
                        }
                    });
                },
                isDisabled : function (view, rowIndex, colIndex, item, record) {
                    return record.data['M_CREATE_' + me.modelId] == window.userId ? false : true;
                }
            }, '->']
        });

        return columns;
    }

});