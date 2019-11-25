/**
 * 试验项目列表(可在其他许多地方通用)
 * Created by dailin on 2019/4/4 15:53.
 */

Ext.define('OrientTdm.TestBomBuild.Panel.GridPanel.TestProjectGridpanel',{
    extend: 'OrientTdm.Common.Extend.Grid.OrientModelGrid',
    alias: 'widget.TestProjectGridpanel',
    alternateClassName: 'OrientExtend.TestProjectGridpanel',
    // 静态方法
    statics: {
        /**
         * 当前任务信息关联的流程图
         * @param dataId
         */
        showCollabFlowPanel: function(dataId, bh) {
            // 移除旧的
            var testOp = Ext.getCmp('test_OP');
            testOp.remove('cfpPanel');

            // 构建新的
            var afpPanel = Ext.create("OrientTdm.Collab.common.collabFlow.collabFlowPanel", {
                closable: true,
                id: 'cfpPanel',
                iconCls: "icon-flow",
                title: '查看【' + bh + '】流程图',
                readOnly: true,
                modelName: 'CB_PLAN',
                dataId: dataId
            });
            testOp.add(afpPanel);
            afpPanel.show();
        }
    },

    initComponent: function () {
        var me = this;
        me.customerFilter = me.getCustomerFilter();
        if (me.treeNode.raw.cj != "6") {
            me.showAnalysisBtns = false;
        }
        me.callParent(arguments);
    },

    createColumns: function () {
        var me = this;
        var modelId = me.tableId;

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
        if(me.tableName == 'T_RW_INFO'){
            retVal.push({
                header: '所属流程',
                sortable: true,
                dataIndex: 'ID',
                renderer: function (value, p, record) {
                    // 根据试验项id获取以绑定的流程模板id
                    OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TemplateRealController/querySlaveIds.rdm',{
                        realDataId: value,
                        realTableId: modelId,
                        templateTableId: 'COLLAB_TEMPLATE',
                        templateDataId: ''
                    }, true, function (response) {
                        var selected = Ext.decode(response.responseText);
                        if(selected.length > 0){
                            record.data['template_id'] = selected;
                        }
                    });

                    // 根据 modelId、dataId 获取流程信息
                    var showInfo = '';
                    var tipInfo =  "未开始";
                    OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TaskController/getProjectInfoByRwId.rdm',{
                        modelId: modelId,
                        dataId: value
                    }, false, function (resp) {
                        if(resp.decodedData.success != undefined){
                            var result = resp.decodedData.results;

                            record.data['prjId'] = result["prjId"];
                            tipInfo = result["activeName"];
                            showInfo =  tipInfo == "未开始" ? '' :
                                '<span href="javascript:;" onclick="OrientExtend.TestProjectGridpanel.showCollabFlowPanel(' + result["prjId"] + ', \'' + record.data['M_BH_' + modelId] + '\'' + ')"> <font color="blue">' + tipInfo + '</font></span>';
                        }
                    });

                    // 鼠标悬浮提示内容
                    p.tdAttr = 'data-qtip="' + tipInfo + '"';
                    return showInfo;
                }
            });
        }

        return retVal;
    },

    getCustomerFilter: function () {
        var me = this;
        var treeNode = me.treeNode;
        var customerFilter = [];
        var modelId = me.modelId;
        var childrenIds = "";

        if(me.testDatePanel != undefined){
            customerFilter.push(new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.In, "", me.testDatePanel.childrenIds));

        } else if (treeNode.raw.cj == "2" && me.tableName == 'T_RW_INFO') {
            customerFilter.push(new CustomerFilter("T_SYLX_" + OrientExtUtil.FunctionHelper.getSchemaId() + "_ID", CustomerFilter.prototype.SqlOperation.Equal, "",treeNode.raw.dataId));

        } else if ((treeNode.raw.cj == "3" && me.tableName != '') || (treeNode.raw.cj == "4" && me.tableName == 'T_SYTJ')) {
            customerFilter.push(new CustomerFilter("T_RW_INFO_" + OrientExtUtil.FunctionHelper.getSchemaId() + "_ID", CustomerFilter.prototype.SqlOperation.In, "", me.dataId));

        } else if (treeNode.raw.cj == "4" && (treeNode.raw.text == "仪器" /*|| treeNode.raw.text == "实施人员"*/ || treeNode.raw.text == "参试品")) {
            // 根据节点Id 获取所有子节点对应的影子节点Id
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomQueryController/getNodesRelationTableDataIds.rdm', {
                tableId: modelId,
                tableName: treeNode.raw.tableName,
                nodeId: treeNode.raw.id,
                isDataId: "1",
                isAll: "1"
            }, false, function (response) {
                if (response.decodedData.success)
                    childrenIds = response.decodedData.results;
            });
            if (childrenIds == "") {
                customerFilter.push(new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.Equal, "", "null"));
            } else {
                customerFilter.push(new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.In, "", childrenIds));
            }

            // 查询影子节点信息找到对应的主节点dataId
        }else if(treeNode.raw.cj == "6" && treeNode.parentNode.parentNode.raw.text == "数据（汇总）"){
            // 数据（汇总） - 展示非结构化数据节点
            if(treeNode.raw.tableName == 'T_TEST_IMPORT'){
                customerFilter.push(
                    // 过滤条件：导入结果不是结构化数据
                    new CustomerFilter('M_RESULT_' + treeNode.raw.tableId, CustomerFilter.prototype.SqlOperation.Equal, '', '结构化数据'),
                    // 过滤条件：所属的实物标识节点id
                    new CustomerFilter('M_NODE_ID_' + treeNode.raw.tableId, CustomerFilter.prototype.SqlOperation.Equal, '', me.treeNode.parentNode.raw.id)
                );

            // 数据（汇总） - 展示非结构化的项目测试记录
            }else if(treeNode.raw.tableName == 'T_XMCSWJ'){
                // 查询所有子节点，根据子节点id 从关系表中获得知识id
                OrientExtUtil.AjaxHelper.doRequest(serviceName + "/TbomQueryController/getNodeRelationTableDataIds.rdm", {
                    tableId: treeNode.raw.tableId,
                    tableName: treeNode.raw.tableName,
                    isAll: '1',
                    nodeId: treeNode.raw.id
                }, false, function (response) {
                    if (response.decodedData.success) {
                        if(childrenIds != ""){
                            childrenIds = "," + childrenIds;
                        }
                        childrenIds = response.decodedData.results + childrenIds;
                    }
                });
                if (childrenIds == "") {
                    customerFilter.push(new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.Equal, "","null"));
                } else {
                    customerFilter.push(new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.In, "",childrenIds));
                }

            }else{
                // 先获取影子节点数据
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomQueryController/getNodesRelationTableDataIds.rdm', {
                    tableId: modelId,
                    tableName: treeNode.raw.tableName,
                    nodeId: treeNode.raw.id,
                    isDataId: "1",
                    isAll: "0"
                }, false, function (response) {
                    if (response.decodedData.success)
                        childrenIds = response.decodedData.results;
                });

                // 再获取自己的节点数据
                OrientExtUtil.AjaxHelper.doRequest(serviceName + "/TbomQueryController/getNodeRelationTableDataIds.rdm", {
                    tableId: treeNode.raw.tableId,
                    tableName: treeNode.raw.tableName,
                    isAll: "0",
                    nodeId: treeNode.raw.id
                }, false, function (response) {
                    if (response.decodedData.success) {
                        if(childrenIds != ""){
                            childrenIds = "," + childrenIds;
                        }
                        childrenIds = response.decodedData.results + childrenIds;
                    }
                });
                if (childrenIds == "") {
                    customerFilter.push(new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.Equal, "","null"));
                } else {
                    customerFilter.push(new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.In, "",childrenIds));
                }
            }

        } else {
            OrientExtUtil.AjaxHelper.doRequest(serviceName + "/TbomQueryController/getNodeRelationTableDataIds.rdm", {
                tableId: treeNode.raw.tableId,
                isAll: "1",
                nodeId: treeNode.raw.id
            }, false, function (response) {
                if (response.decodedData.success) {
                    childrenIds = response.decodedData.results;
                }
            });
            if (childrenIds == "") {
                customerFilter.push(new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.Equal, "","null"));
            } else {
                customerFilter.push(new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.In, "",childrenIds));
            }
        }
        return customerFilter;
    },

    createToolBarItems: function () {
        var me = this;

        var btnArr = [];
        Ext.each(me.callParent(), function (btn, index) {
            btnArr.push(btn);
        });

        if(me.treeNode.raw.cj == "2"){
            return Ext.create('OrientTdm.TestBomBuild.Panel.GridPanel.Toolbar.TestProjectGridToolbar_02', {
                scope: me,
                btnArr: btnArr
            }).toolbar;
        }else if(me.treeNode.raw.cj == "4"){
            return Ext.create('OrientTdm.TestBomBuild.Panel.GridPanel.Toolbar.TestProjectGridToolbar_04', {
                scope: me,
                btnArr: btnArr
            }).toolbar;
        }else if(me.treeNode.raw.cj == "6"){
            return Ext.create('OrientTdm.TestBomBuild.Panel.GridPanel.Toolbar.TestProjectGridToolbar_06', {
                scope: me,
                btnArr: btnArr
            }).toolbar;
        }

        /*if (me.isFromData) {
            retV.push({
                xtype: "button",
                text: "文档生成",
                iconCls: 'icon-generateDoc',
                handler: function () {
                    me._documentGeneration();
                }
            })
        }*/

        return retV;
    }

    /**
     * 选择试验条件，合格判据，试验标准
     * @private
     */
    /*_chooseInfoFunction: function(){
        var me = this;
        var win = OrientExtUtil.WindowHelper.createWindow(Ext.create('OrientTdm.Common.Extend.Grid.OrientModelGrid', {
            modelId: OrientExtUtil.ModelHelper.getModelId(me.tableName, OrientExtUtil.FunctionHelper.getSYZYSchemaId(), false),
            customerFilter: [new CustomerFilter("T_SYLX_"+ OrientExtUtil.FunctionHelper.getSYZYSchemaId() + "_ID",
                CustomerFilter.prototype.SqlOperation.Equal, "", me.testTypeDataId)],
            modelName: me.tableName,
            createToolBarItems: function() {
                return [];
            }
        }),{
            title: '选择' + me.tableDisplayName,
            layout: "fit",
            buttonAlign: 'center',
            buttons: [{
                xtype: "button",
                text: "确定",
                iconCls: 'icon-saveAndClose',
                handler: function () {
                    var panel = win.down("panel");
                    var selectDatas = panel.selModel.selected.items;
                    var dataArrays = Ext.Array.pluck(selectDatas,"data");
                    OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomInsertController/insertTestInfoByDictionary.rdm', {
                        modelName: panel.modelName,
                        testTaskId: me.dataId,
                        dataArrayString: JSON.stringify(dataArrays)
                    }, false, function (response) {
                        if (response.decodedData.success) {
                            var insertDataIds = response.decodedData.results.split(",");
                            if (me.tableName == "T_SYTJ") {
                                var testConditionId = OrientExtUtil.TreeHelper.getChildNode(2, me.treeNode.raw.id, ["工况"]);
                                Ext.each(insertDataIds, function (insertDataId) {
                                    OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomInsertController/insertNodeByData.rdm',{
                                        pid: testConditionId,
                                        tableName: "T_SYTJ",
                                        tableId: me.modelId,
                                        dataId : insertDataIds,
                                        cj: 4
                                    }, false, function (resp) {});
                                });
                                if (me.treeNode) {
                                    // 重新加载这个节点有时候会没有用，就删除所有子节点重新再加载一次节点
                                    var childNodes = me.treeNode.childNodes;
                                    for (var i = childNodes.length -1; i >= 0; i--) {
                                        me.treeNode.removeChild(childNodes[i]);
                                    }
                                    me.treeNode.store.reload({node: me.treeNode});
                                }

                            }
                            OrientExtUtil.Common.info('提示','新增成功');
                            win.close();
                            me.customerFilter = me.getCustomerFilter();
                            me.store.getProxy().setExtraParam("customerFilter",Ext.encode(me.customerFilter));
                            me.fireEvent("refreshGrid");
                        }
                    });
                }
            }]
        });
        win.show();
        // todo 出现列表可以进行选择

    },*/


    /**
     * 文档生成
     */
    /*_documentGeneration: function () {
        var me = this;
        if (!OrientExtUtil.GridHelper.hasSelected(me)) {
            OrientExtUtil.Common.info('提示','请至少选择一条数据');
            return;
        }
        var dataIds = OrientExtUtil.GridHelper.getSelectRecordIds(me);
        var listPanel = Ext.create('OrientTdm.TestBomBuild.Panel.GridPanel.DocReportGridpanel', {
            modelId: me.tableId,
            operate: "like",
            region: 'center',
            padding: '0 0 0 5',
            title: '报告模板'
        });

        var win = Ext.create('widget.window',{
            title: '选择报告模板',
            width: 0.5 * globalWidth,
            height: 0.5 * globalHeight,
            buttonAlign: 'center',
            buttons: [{
                xtype: "button",
                text: "确定",
                handler: function () {
                    // 判断里面进行了不是选中一条后的tip提示的处理，所以直接返回
                    if (!OrientExtUtil.GridHelper.hasSelectedOne(listPanel)) {
                        return;
                    }
                    var reportId = OrientExtUtil.GridHelper.getSelectRecordIds(listPanel).join(",");
                    OrientExtUtil.AjaxHelper.doRequest(serviceName + '/DocReports/generateReportSpecial.rdm',{
                        reportId: reportId,
                        nodeId: me.treeNode.raw.id,
                        dataIds: dataIds
                    },false, function (response) {
                        var path = 'DocTemplate' +'%2F' + response.decodedData;
                        OrientExtUtil.FileHelper.doDownloadByFilePath(path, me.treeNode.raw.text + "报告.doc");
                        win.close();
                    })

                }
            }],
            layout: 'fit',
            modal: true,
            items: [listPanel]
        });

        win.show();
    }*/

});