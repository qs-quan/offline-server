/**
 * Created by FZH  on 2016/10/24.
 */
Ext.define('OrientTdm.TestResourceMgr.TeamMgr.TeamGrid', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientModelGrid',
    alias: 'widget.TeamGrid',
    config: {
        TPL_TDSYRY: TDM_SERVER_CONFIG.TPL_TDSYRY
    },
    requires: [
        'OrientTdm.TestResourceMgr.StaffMgr.ChooseStaffPanel'
    ],
    beforeInitComponent: function () {
        //初始化面板前执行
        var me = this;
        me.modelId = OrientExtUtil.ModelHelper.getModelId("T_SYRY", TDM_SERVER_CONFIG.DEVICE_SCHEMA_ID);
        me.isView = 0;
        me.templateId = OrientExtUtil.ModelHelper.getTemplateId(me.modelId, me.TPL_TDSYRY);
        this.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        this.callParent(arguments);
    },
    afterInitComponent: function () {
        var me = this;
        var toolbar = me.dockedItems[0];

        toolbar.add({
            text: '选择人员',
            handler: me._doAddStaffClicked,
            iconCls: "icon-create",
            scope: me
        }, {
            text: '移除人员',
            handler: me._doDeleteStaffClicked,
            iconCls: "icon-delete",
            scope: me
        });
    },
    afterRender: function() {
        var me = this;
        this.callParent(arguments);

        var treeNode = me.bindNode;
        var tbomModels = treeNode.raw.tBomModels;
    },
    _doAddStaffClicked: function (toolbar) {
        var me = this;
        var teamId = me.bindNode.raw.idList[0];

        var schemaId = TDM_SERVER_CONFIG.DEVICE_SCHEMA_ID;
        var staffs = OrientExtUtil.ModelHelper.createDataQuery("T_TD_RY", schemaId, [
            new CustomerFilter("T_SYTD_"+schemaId+"_ID", CustomerFilter.prototype.SqlOperation.In, "", teamId)
        ]);
        var selVal = [];
        for(var i=0; i<staffs.length; i++) {
            selVal.push(staffs[i]["T_SYRY_"+schemaId+"_ID"]);
        }

        var mainPanel = Ext.create('OrientTdm.TestResourceMgr.StaffMgr.ChooseStaffPanel', {
            showSelected: false,
            selectedValue: selVal.join(","),
            customFilters: [],
            multiSelect: true,
            saveAction: function(selectedIds, selectedRecords, selectedInfoMap) {
                if(selectedIds.length == 0) {
                    return;
                }
                mainPanel.up('window').close();

                var params = {
                    teamId: teamId,
                    staffIds: selectedIds.join(",")
                };
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/resourceMgr/addStaffToTeam.rdm', params, false, function (response) {
                    var retV = Ext.decode(response.responseText);
                    var newIds = retV.results;
                    OrientExtUtil.Common.tip("提示", "试验人员加入团队成功", function() {
                        me.refreshTBomTree();
                    });
                });
            }
        });

        OrientExtUtil.WindowHelper.createWindow(mainPanel, {
            title: '选择人员',
            layout: "fit",
            width: 0.8 * globalWidth,
            height: 0.8 * globalHeight,
            buttonAlign: 'center'
        });
    },
    _doDeleteStaffClicked: function (toolbar) {
        var me = this;
        var teamId = me.bindNode.raw.idList[0];

        OrientExtUtil.GridHelper.deleteRecords(me, serviceName + '/resourceMgr/deleteStaffFromTeam.rdm?teamId='+teamId, function(grid) {
            OrientExtUtil.Common.tip("提示", "试验人员移除团队成功", function() {
                me.refreshTBomTree();
            });
        });
    },
    refreshTBomTree: function() {
        var treePanel = Ext.ComponentQuery.query("tbomTree");
        if (treePanel && treePanel.length>0) {
            var treePanel = treePanel[0];
            var currentNode = treePanel.getSelectionModel().getSelection()[0];
            var parentNode = currentNode.parentNode;
            treePanel.getStore().load({
                node: parentNode,
                callback: function (nodes) {
                    var catched = false;
                    Ext.each(nodes, function (node) {
                        if (node.data.text == currentNode.data.text) {
                            catched = true;
                            node.expand();
                            treePanel.getSelectionModel().select(node, false, true);//刷新时不触发选中节点事件
                            var modelGrid = treePanel.up().down('dataShowRegion').getActiveTab().down("orientModelGrid");
                            var tbomModels = node.raw.tBomModels;
                            Ext.each(tbomModels, function (tbomModel) {
                                if(tbomModel.modelName=='团队人员' && modelGrid.modelDesc.text=="试验人员") {
                                    var customerFilter = [tbomModel.defaultFilter];
                                    modelGrid.refreshGridByCustomerFilter(customerFilter, true);
                                }
                                else if(modelGrid.modelId == tbomModel.modelId) {
                                    var customerFilter = [tbomModel.defaultFilter];
                                    modelGrid.refreshGridByCustomerFilter(customerFilter, true);
                                }
                            });
                        }
                    });
                    if (!catched) {
                        parentNode.expand();
                        treePanel.getSelectionModel().select(parentNode, false, true);//刷新时不触发选中节点事件
                        treePanel.up().down("orientModelGrid").fireEvent("refreshGridByTreeNode", parentNode);
                    }
                }
            });
        }
    }
});