/**
 * Created by Seraph on 16/9/26.
 */
Ext.define('OrientTdm.TestInfo.ExperimentTypeMgr.Template.TemplateCenterPanel', {
    extend : 'Ext.tab.Panel',
    config : {
        schemaId : null,
        modelName : null
    },
    initComponent: function () {
        var me = this;

        var northPanel = Ext.create("OrientTdm.TestInfo.ExperimentTypeMgr.Template.TemplateQueryPanel", {
            title: '查询',
            collapsible: true,
            region : 'north',
            layout : 'fit',
            height : 100
        });

        var modelId = OrientExtUtil.ModelHelper.getModelId('T_SJZD_TEMPLATE', OrientExtUtil.FunctionHelper.getExperimentSchemaId());
        me.modelId = modelId;
        var finalCustomFilter = [new CustomerFilter("M_TYPE_" + modelId, CustomerFilter.prototype.SqlOperation.Equal, "", me.type)];
        var centerPanel = Ext.create("OrientTdm.Common.Extend.Grid.OrientModelGrid", {
            title: '模板列表',
            region: 'center',
            modelId: modelId,
            isView: 0,
            multiSelect: false,
            customerFilter: finalCustomFilter,
            createToolBarItems: function () {
                return [];
            },
            createColumns: function () {
                var me = this;
                var retVal = [];
                //获取模型操作描述
                var modelDesc = me.modelDesc;
                if (modelDesc && modelDesc.columns) {
                    Ext.each(modelDesc.columns, function (column) {
                        if (Ext.Array.contains(modelDesc.listColumnDesc, column.id)) {
                            retVal[Ext.Array.indexOf(modelDesc.listColumnDesc, column.id)] = OrientModelHelper.createGridColumn(column);
                        }
                    });
                }
                // 添加操作列
                retVal.unshift({
                    xtype:'actioncolumn',
                    header: '操作',
                    width: 75,
                    dataIndex: 'id',
                    items: [{
                        iconCls: 'icon-preview',
                        tooltip: '预览',
                        border: '0 5 0 0',
                        handler: function(grid, rowIndex, colIndex, item, e, record) {
                            // 手动选数据
                            var sm = me.getSelectionModel();
                            sm.deselectAll()
                            sm.select(rowIndex);

                            // 移除旧的模板预览面板
                            me.up().up().remove('sylxmbxq');

                            // 创建新的模板预览面板并显示
                            var showPanel = Ext.create('OrientTdm.TestInfo.ExperimentTypeMgr.ExperimentTypeMgrDashboard', {
                                upId: 'sylxmbxq',
                                title: '模板【' + record.data["M_BH_" + modelId] + '】详细内容',
                                queryUrl: serviceName + "/ExperimentController/chooseLayerNodes.rdm",
                                param: {
                                    modelName: record.data["M_TYPE_" + modelId] == 'LX' ? 'T_SYLX' : 'T_RW_INFO',
                                    dataId: record.data["M_DATA_ID_" + modelId],
                                    type: '1'
                                }
                            })
                            me.up().up().add(showPanel);
                            me.up().up().setActiveTab(showPanel);
                        }
                    }, ' ', {
                        xtype: "button",
                        tooltip: "删除",
                        iconCls: 'icon-delete',
                        border: '0 5 0 0',
                        handler: function(grid, rowIndex, colIndex, item, e, record) {
                            // 手动删除模板数据
                            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/ExTemplateController/deleteTepmleate.rdm', {
                                templateId: record.data["ID"],
                                type: record.data["M_TYPE_" + modelId],
                                dataId: record.data["M_DATA_ID_" + modelId]
                            }, false, function (response) {
                                if (response.decodedData.success) {
                                    // 刷新模板列表
                                    me.getStore().reload();
                                }
                            })

                        }
                    }]
                });
                return retVal;
            },
            /**
             * 查询
             * @param filter
             */
            filterByFilter: function (filter) {
                var localCustomFilter = [finalCustomFilter[0]];
                for (var proName in filter) {
                    var value = filter[proName];
                    if(value != ''){
                        localCustomFilter.push(new CustomerFilter(proName + "_" + modelId, CustomerFilter.prototype.SqlOperation.Equal, "", value));
                    }
                }
                centerPanel.getStore().getProxy().extraParams.customerFilter = Ext.encode(localCustomFilter);
                centerPanel.getStore().loadPage(1);
            }
        });

        var panel = Ext.create('Ext.panel.Panel', {
            title: me.typeName,
            layout: 'border',
            items: [northPanel, centerPanel],
            northPanel: northPanel,
            centerPanel: centerPanel,
            listeners: {
                afterrender: function (ct) {
                    centerPanel.mainTab = ct.ownerCt.ownerCt.ownerCt;
                }
            }
        });

        Ext.apply(this, {
            layout: 'fit',
            items: [panel],
            bbar:["->", {
                text: '导入',
                iconCls: 'icon-createbyimport',
                itemId: 'import',
                handler: function () {
                    me._chooseTemplate();
                }
            }, "->"]
        });

        this.callParent(arguments);
    },

    /**
     * 选择模板
     * @private
     */
    _chooseTemplate: function(){
        var me = this;
        // 选择模板，关闭模板弹出框
        var selecteds = me.items.items[0].centerPanel.getSelectionModel().getSelection();
        if(selecteds.length != 1){
            OrientExtUtil.Common.info('提示', '请选择一条试验项目模板！');
            return;
        }

        // 导入模板
        var selectedData = selecteds[0].data;

        // 对话输入框
        var oldName = '';
        var oldResult = false;
        me._setName(selectedData["M_TYPE_" + me.modelId], selectedData["M_DATA_ID_" + me.modelId], '');

        return
    },

    _setName: function (type, dataId, text, msgFlag) {
        var me = this;

        var tipInfo = '';
        if(msgFlag == 0){
            tipInfo = '名称不可为空, 请输入' + me.typeName + '名称';
        }else if(msgFlag == 1){
            tipInfo = '名称不可用，父节点存在同名子节点';
        }else{
            tipInfo = '请输入' + me.typeName + '名称';
        }
        Ext.Msg.prompt('确认', tipInfo, function(btn, text){
            if(btn == 'ok'){
                if(text.length == 0){
                    me._setName(type, dataId, '', 0);
                    return;
                }

                // 校验同级是否存在同名节点
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/ExperimentController/checkNodeNameValidate.rdm',{
                        text: text,
                        pid: me.treeDataId
                    }, false, function(response) {
                        if (response.decodedData.success) {
                            if(response.decodedData.results){
                                return
                                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/ExperimentController/checkNodeNameValidate.rdm',{
                                    text: text,
                                    pid: me.treeDataId
                                }, false, function(response) {

                                })

                                // 关闭选择模板窗口
                                me.up().up().up().close();
                            }else{
                                me._setName(type, dataId, text, 1);
                                return;
                            };
                        }
                    }
                );
            }
        }, this, false, text);
    }
});