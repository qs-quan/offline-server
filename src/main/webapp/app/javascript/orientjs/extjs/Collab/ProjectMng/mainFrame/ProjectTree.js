/**
 * Created by Seraph on 16/7/6.
 */
Ext.define('OrientTdm.Collab.ProjectMng.mainFrame.ProjectTree', {
    alias: 'widget.projectTree',
    extend: 'OrientTdm.Common.Extend.Tree.OrientTree',
    requires: [
        'OrientTdm.Collab.ProjectMng.mainFrame.model.ProjectTreeNodeModel',
        'OrientTdm.Collab.common.util.SelectComponentField',
        'OrientTdm.Collab.ProjectMng.mainFrame.ProjectStatisticPanel'
    ],
    config: {},

    initComponent: function () {
        var me = this;
        me.rootNode = {
            text: '根文件夹',
            dataId: '-1',
            id: '-1',
            expanded: true,
            modelName: 'CB_DIR',
            modelId: '343'
        };

        Ext.apply(me, {
            viewConfig: {
                listeners: {
                    itemcontextmenu: function (view, rec, node, index, e) {
                        e.stopEvent();
                        var menu = me.createMenu(rec);
                        menu.showAt(e.getXY());
                        return false;
                    }
                }
            },
            lbar: me.createLeftBar()
        });
        me.hasConfigInfoParam = false;
        if (typeof me.configInfo === "object" && !(me.configInfo instanceof Array)){
            for (var prop in this.configInfo){
                me.hasConfigInfoParam = true;
                break;
            }
        }
        me.callParent(arguments);

    },
    createStore: function () {
        var me = this;
        var retVal = Ext.create('Ext.data.TreeStore', {
            model: 'OrientTdm.Collab.ProjectMng.mainFrame.model.ProjectTreeNodeModel',
            listeners: {
                beforeLoad: function (store, operation) {
                    var node = operation.node;
                    store.getProxy().setExtraParam("functionModule", "projectMng");
                    if (node.isRoot()) {
                        var dir = 'CB_DIR';
                        store.getProxy().setExtraParam('modelName', dir);
                        store.getProxy().setExtraParam('dataId', '-1');
                    } else {
                        if (node.raw.parentNode) {
                            node.raw.parentNode = null;
                        }
                        store.getProxy().setExtraParam('modelName', Ext.encode(node.data.modelName));
                        store.getProxy().setExtraParam('dataId', node.data.dataId);
                    }
                }
            },
            root: me.rootNode
        });
        return retVal;
    },
    createLeftBar: function () {
        var me = this;

        var retVal = [{
            xtype: 'tbspacer'
        }, ' ', ' ', ' ', {
            iconCls: 'icon-update',
            handler: Ext.bind(me.onEditNode, me),
            name: 'update',
            tooltip: '修改',
            disabled: true
        }, {
            iconCls: 'icon-delete',
            handler: Ext.bind(me.onDeleteNode, me),
            name: 'delete',
            tooltip: '删除',
            disabled: true
        }, '-', {
            iconCls: 'icon-createfolder',
            handler: Ext.bind(me.onCreateNode, me, [{toCreateModelName: 'CB_DIR'}]),
            name: 'createfolder',
            disabled: false,
            tooltip: {
                text: '在选中的文件夹下添加子文件夹，若点击空白区域，则添加根文件夹',
                title: '新增文件夹'
            }
        },
            {
                tooltip: '手工创建项目',
                name: 'createbyhand',
                iconCls: 'icon-createbyhand',
                disabled: true,
                handler: Ext.bind(me.onCreateNode, me, [{toCreateModelName: 'CB_PROJECT'}])
            }, {
                tooltip: '从模板导入项目',
                iconCls: 'icon-createbyimport',
                name: 'createbyimport',
                disabled: true,
                handler: Ext.bind(me.onCreateNodeByImport, me, [{toCreateModelName: 'CB_PROJECT'}])
            }, '-',
            {
                iconCls: 'icon-taskwbs',
                tooltip: '工作包分解',
                name: 'taskwbs',
                hidden: !TDM_SERVER_CONFIG['COLLAB_ENABLE_PLAN_BREAK'],
                disabled: true,
                handler: Ext.bind(me.onPlanTaskBreak, me)
            },
            {
                iconCls: 'icon-exporttemplate',
                tooltip: '导出模板',
                name: 'exporttemplate',
                disabled: true,
                handler: Ext.bind(me.onExportTemplate, me)
            }];

        return retVal;
    },
    setButtonStatus: function (record) {
        var me = this;
        var lbar = this.down('toolbar[dock=left]');
        var btns = lbar.items.items;
        for (var i = 0; i < btns.length; i++) {
            btns[i].setDisabled(true);
        }

        if (record.data.modelName === 'CB_DIR') {
            lbar.down('button[name=update]').setDisabled(true);
            lbar.down('button[name=createfolder]').setDisabled(false);
            lbar.down('button[name=createbyhand]').setDisabled(false);
            lbar.down('button[name=createbyimport]').setDisabled(false);
            lbar.down('button[name=delete]').setDisabled(true);
        } else {
            lbar.down('button[name=exporttemplate]').setDisabled(false);
            if ('NOT_STARTED' === record.data.status) {
                lbar.down('button[name=delete]').setDisabled(false);
            }
        }
        if (record.data.modelName !== 'CB_DIR' && record.data.modelName !== 'CB_PROJECT') {
            lbar.down('button[name=taskwbs]').setDisabled(false);
        }
        if (TDM_SERVER_CONFIG.COLLAB_DEBUG_MODEL && record.raw.text != '项目分类') {
            lbar.down('button[name=update]').setDisabled(false);
            lbar.down('button[name=delete]').setDisabled(false);
        }
    },
    createMenu: function (record) {
        var me = this;

        var items = [{
            iconCls: 'icon-refresh',
            text: '刷新',
            scope: me,
            handler: me.doRefresh
        }];

        if (record.data.modelName === 'CB_DIR') {

            items.push({
                iconCls: 'icon-update',
                handler: Ext.bind(me.onEditNode, me),
                text: '编辑'
            });

            items.push({
                text: '新增文件夹',
                iconCls: 'icon-createfolder',
                handler: Ext.bind(me.onCreateNode, me, [{toCreateModelName: 'CB_DIR'}]),
                tooltip: {
                    text: '在选中的文件夹下添加子文件夹，若点击空白区域，则添加根文件夹',
                    title: '新增提示'
                }
            });

            items.push({
                text: '新增项目',
                iconCls: 'icon-createproject',
                menu: {
                    showSeparator: false,
                    items: [{
                        text: '手工创建',
                        iconCls: 'icon-createbyhand',
                        handler: Ext.bind(me.onCreateNode, me, [{toCreateModelName: 'CB_PROJECT'}])
                    }, '-', {
                        text: '从模板导入',
                        iconCls: 'icon-createbyimport',
                        handler: Ext.bind(me.onCreateNodeByImport, me, [{toCreateModelName: 'CB_PROJECT'}])
                    }
                    ]
                }
            });

            items.push({
                iconCls: 'icon-delete',
                handler: Ext.bind(me.onDeleteNode, me),
                text: '删除'
            });
        } else {
            items.push({
                iconCls: 'icon-exporttemplate',
                text: '导出模板',
                handler: Ext.bind(me.onExportTemplate, me)
            });

            if ('NOT_STARTED' === record.data.status) {

                items.push({
                    iconCls: 'icon-delete',
                    handler: Ext.bind(me.onDeleteNode, me),
                    text: '删除'
                });
            }
        }

        if (record.data.modelName !== 'CB_DIR' && record.data.modelName !== 'CB_PROJECT') {
            items.push({
                iconCls: 'icon-taskwbs',
                text: '工作包分解',
                handler: Ext.bind(me.onPlanTaskBreak, me)
            });
        }

        var menu = Ext.create('Ext.menu.Menu',
            {
                items: items
            });

        return menu;
    },
    createToolBarItems: function () {
        var me = this;

        var retVal = [{
            xtype: 'tbspacer'
        }, {
            xtype: 'trigger',
            width: 160,
            style: {
                margin: '0 0 0 22'
            },
            triggerCls: 'x-form-clear-trigger',
            onTriggerClick: function () {
                this.setValue('');
                me.clearFilter();
            },
            emptyText: '快速搜索',
            enableKeyEvents: true,
            listeners: {
                keyup: function (field, e) {
                    if (Ext.EventObject.ESC == e.getKey()) {
                        field.onTriggerClick();
                    } else {
                        me.filterByText(this.getRawValue(), 'text');
                    }
                }
            }
        }, ' ', {
            iconCls: 'icon-refresh',
            text: '刷新',
            itemId: 'refresh',
            scope: this,
            handler: this.doRefresh
        }];

        return retVal;
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'select', me.itemClickListener, me);
        me.mon(me, 'containerclick', me.containerclick, me);
    },
    itemClickListener: function (tree, record, item) {
        var params = {
            modelId: record.data.modelId,
            dataId: record.data.dataId
        };

        var me = this;
        me.setButtonStatus(record);

        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelData/getGridModelDescAndData.rdm', params, false, function (response) {
            var modelDesc = response.decodedData.results.orientModelDesc;
            var modelData = response.decodedData.results.modelData;

            me._filterDisplayData(modelData, record.data.modelId);
            var centerPanel = me.ownerCt.centerPanel;
            centerPanel.removeAll(true);
            //如果节点是文件夹则去掉基本信息tab页，换成简介页
            var inforForm = null;
            if (modelDesc.dbName.indexOf('CB_DIR') >= 0) {
                inforForm = Ext.create('OrientTdm.Collab.ProjectMng.mainFrame.ProjectStatisticPanel', {
                    title: '项目统计信息',
                    dirId: record.data.dataId
                });
            } else {
                var status = modelData['STATUS_' + modelDesc.modelId];
                var canEdit = '未开始' != status;
                inforForm = Ext.create('OrientTdm.Common.Extend.Form.OrientDetailModelForm', {
                    iconCls: 'icon-baseinfo',
                    title: '基本信息',
                    bindModelName: modelDesc.dbName,
                    modelDesc: modelDesc,
                    originalData: modelData,
                    hasConfigInfoParam: me.hasConfigInfoParam,
                    configInfo: me.configInfo,
                    afterInitForm: me._specialHandler,
                    listeners: {
                        activate: function (ct) {
                            centerPanel.activeTabName = ct.title;
                        }
                    },
                    dockedItems: [{
                        xtype: 'toolbar',
                        dock: 'top',
                        items: [{
                            itemId: 'modify',
                            text: '修改',
                            disabled: canEdit,
                            iconCls: 'icon-update',
                            handler: me.onEditNodeInner,
                            scope: me
                        }]
                    }]
                });
            }
            var toActivePanel = inforForm;
            var itemsToAdd = [];
            itemsToAdd.push(inforForm);

            var params = {
                modelName: record.data.modelName,
                dataId: record.data.dataId
            };

            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/collabTeam/user/current/functions.rdm', params, false, function (response) {
                var respJson = response.decodedData.results;

                for (var i = 0; i < respJson.length; i++) {
                    var extraInfo = {};
                    if (respJson[i].name === '甘特图') {
                        extraInfo.projectPlannedStartDate = modelData["PLANNED_START_DATE_" + record.data.modelId];
                        extraInfo.projectPlannedEndDate = modelData["PLANNED_END_DATE_" + record.data.modelId];
                    }
                    if (respJson[i].name === '工作组') {
                        // 获取项目id
                        var projectId = modelDesc.dbName.indexOf("CB_PLAN") > -1 ?
                            record.parentNode.raw.dataId :
                            record.raw.dataId;
                        // 根据项目id获取试验任务的nodeId
                        /*OrientExtUtil.AjaxHelper.doRequest(serviceName + "/TaskController/getRwNodeAndChildsByProjectId.rdm",{
                            projectId: projectId
                        },false,function (response) {
                            if (response.decodedData.success) {
                                var retV = response.decodedData.results;
                                // 根据试验任务nodeId先获取绑定的实施人员的nodeId再获取到人员的ids
                                if (retV.nodeId) {
                                    var ryNodeId = OrientExtUtil.TreeHelper.getChildNode(2, retV.nodeId, ["实施人员"]);
                                    if(me.ryNodeId != "") {
                                        OrientExtUtil.AjaxHelper.doRequest(serviceName + "/TbomQueryController/getNodesRelationTableDataIds.rdm", {
                                            isAll: "1",
                                            isDataId: "1",
                                            nodeId: ryNodeId
                                        }, false, function (response) {
                                            if (response.decodedData.success) {
                                                extraInfo.ids = response.decodedData.results;
                                            }
                                        });
                                    }
                                }
                            }
                        });*/
                    }

                    if (respJson[i].name === '控制流' && me.hasConfigInfoParam) {
                        extraInfo = {
                            filterValue: OrientExtUtil.SysMgrHelper.getCustomRoleIds(),
                            filterType: me.configInfo.filterType,
                            rwNodeId: me.configInfo.rwNodeId,
                            filterTH: me.configInfo.filterTH
                        };
                    }

                    var panel = Ext.create('OrientTdm.Common.Extend.Panel.OrientPanel', {
                        title: respJson[i].name,
                        iconCls: respJson[i].iconCls,
                        layout: 'border',
                        treeNodeData: record.data,
                        modelName: record.data.modelName,
                        dataId: record.data.dataId,
                        modelId: record.data.modelId,
                        extraInfo: extraInfo,
                        region: 'center',
                        height: centerPanel.getHeight() - 28,
                        width: centerPanel.getWidth(),
                        listeners: {
                            afterrender: function (ct) {},
                            activate: function (ct) {
                                centerPanel.activeTabName = ct.title;
                            }
                        }
                    });

                    if (!Ext.isEmpty(centerPanel.activeTabName) && centerPanel.activeTabName == respJson[i].name) {
                        toActivePanel = panel;
                    }
                    itemsToAdd.push(panel);
                }

                /*if (modelDesc.dbName.indexOf("CB_PLAN") > -1 && itemsToAdd.length > 1) {
                    // 原先流程任务的设备tab
                    OrientExtUtil.AjaxHelper.doRequest(serviceName + "/TaskController/getRwNodeAndChildsByProjectId.rdm",{
                        projectId: record.parentNode.raw.dataId
                    },false,function (response) {
                        if (response.decodedData.success) {
                            var retV = response.decodedData.results;
                            // 是计划时增加数据页（关于知识库的）、以及原先流程任务的设备tab
                            if (retV.nodeId) {
                                var modelId = OrientExtUtil.ModelHelper.getModelId("T_FILE", OrientExtUtil.FunctionHelper.getKnowledgeSchemaId());
                                var dataPanel = Ext.create('OrientTdm.Collab.ProjectMng.mainFrame.KnowledgeList', {
                                    title: '知识库数据',
                                    iconCls: 'icon-basicDataType',
                                    modelId: modelId,
                                    isPositive: "1",
                                    // 项目的dataId                            计划的Id
                                    taskId: record.parentNode.raw.dataId, // record.raw.dataId,
                                    isView: 0,
                                    region: 'center',
                                    padding: '0 0 0 5',
                                    layout: 'fit'
                                });
                                itemsToAdd.push(dataPanel);

                                // 设备的tab页面
                                var device = Ext.create('OrientTdm.TestBomBuild.Panel.GridPanel.TaskDeviceGridpanel', {
                                    nodeId : retV.nodeId,
                                    isShow:true,
                                    isView : "0",
                                    layout:'border',
                                    title: '仪器',
                                    iconCls: 'icon-resources-equiment',
                                    usePage : true
                                });
                                itemsToAdd.push(device);
                            }
                        }
                    });
                }*/
                var pan1, pan2, pan3;
                if(itemsToAdd[0].title === '基本信息' && itemsToAdd[1].title === '工作组' && itemsToAdd[2].title === '控制流'){
                   pan1 = itemsToAdd[0];
                   pan2 = itemsToAdd[1];
                   pan3 = itemsToAdd[2];
                   itemsToAdd.splice(0,itemsToAdd.length);
                   itemsToAdd.push(pan3, pan1, pan2);
                   toActivePanel = pan3;
                }

                var tabPanel = Ext.create("OrientTdm.Collab.ProjectMng.mainFrame.MainPanel", {
                    region: 'center',
                    layout: 'border',
                    padding: '0 0 0 0',
                    activeItem: 0,
                    deferredRender: true,
                    items: itemsToAdd
                });

                centerPanel.add(tabPanel);
                tabPanel.setActiveTab(pan2);
                tabPanel.setActiveTab(pan3);
            });

        });
    },
    onCreateNode: function (param, fromRoot) {
        var selection = this.getSelectionModel().getSelection();
        var parentNode = fromRoot == true ? this.getRootNode() : selection[0];
        var curNodeData;
        if (selection.length == 0) {
            curNodeData = this.rootNode;
        } else {
            curNodeData = selection[0].data;
        }

        if (curNodeData.modelName === 'CB_PROJECT' || (curNodeData.id == 'root' && param.toCreateModelName == 'CB_PROJECT')) {
            Ext.Msg.alert("提示", '项目节点只能建立在文件夹下');
            return;
        }

        var me = this;
        var params = {};
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/projectTree/nodeModelInfo.rdm', {modelName: param.toCreateModelName}, false, function (response) {
            params.modelId = response.decodedData.results.modelId;
            params.schemaId = response.decodedData.results.schemaId;
        });


        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelData/getGridModelDesc.rdm', params, false, function (response) {
            var modelDesc = response.decodedData.results.orientModelDesc;
            //默认值
            var originalData = me.createDefaultData(parentNode, params.schemaId);
            var createForm = Ext.create('OrientTdm.Common.Extend.Form.OrientAddModelForm', {
                buttonAlign: 'center',
                originalData: originalData,
                buttons: [
                    {
                        itemId: 'save',
                        text: '保存',
                        scope: me,
                        iconCls: 'icon-save',
                        handler: function (btn) {
                            var me = this;
                            btn.up('form').fireEvent('saveOrientForm', {
                                modelId: params.modelId
                            });
                        }
                    },
                    {
                        itemId: 'back',
                        text: '取消',
                        scope: me,
                        iconCls: 'icon-close',
                        handler: function () {
                            win.close();
                        }
                    }
                ],
                successCallback: function () {
                    me._specialAfterSave(this, arguments);
                    win.close();
                    me.refreshNode(curNodeData.id, false);
                },
                bindModelName: modelDesc.dbName,
                actionUrl: serviceName + '/projectTree/saveModelData.rdm',
                modelDesc: modelDesc,
                hasConfigInfoParam: me.hasConfigInfoParam,
                configInfo: me.configInfo,
                afterInitForm: me._specialHandler
            });

            var win = new Ext.Window({
                title: '新增' + modelDesc.text,
                width: 0.4 * globalWidth,
                height: 0.8 * globalHeight,
                layout: 'fit',
                modal: true,
                model: true,
                items: [
                    createForm
                ],
                listeners: {
                    'beforeshow': function () {
                        var items = createForm.items.items[0].items.length;
                        if (items < 3) {
                            win.setHeight(items * 210);
                        }
                        else if (items >= 3 && items <= 7) {
                            win.setHeight(items * 90);
                        }
                        else {
                            win.setHeight(items * 90);
                        }
                    }
                }
            });
            win.show();
        });
    },
    onCreateNodeByImport: function (param) {
        var me = this;
        var selection = me.getSelectionModel().getSelection();
        var currentNode = selection.length > 0 ? selection[0] : this.getRootNode();
        var curNodeData;
        if (selection.length == 0) {
            curNodeData = this.rootNode;
        } else {
            curNodeData = selection[0].data;
        }

        if (curNodeData.modelName === 'CB_PROJECT' || (curNodeData.id == 'root' && param.toCreateModelName == 'CB_PROJECT')) {
            Ext.Msg.alert("提示", '项目节点只能建立在文件夹下');
            return;
        }


        var importParams = {modelName: param.toCreateModelName};
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/projectTree/nodeModelInfo.rdm', importParams, false, function (response) {
            importParams.schemaId = response.decodedData.results.schemaId;
        });

        importParams.parentModelName = curNodeData.modelName;
        importParams.parentDataId = curNodeData.dataId;
        importParams.successCallback = function () {
            win.close();
            me.refreshNode(curNodeData.id, false);
        };

        importParams.mainTab = me.ownerCt.ownerCt;

        var templateImportPanel = Ext.create("OrientTdm.Collab.common.template.TemplateImportPanel", importParams);
        var win = new Ext.Window({
            title: '导入模板',
            height: 0.8 * globalHeight,
            width: 0.8 * globalWidth,
            layout: 'fit',
            items: [
                templateImportPanel
            ]
        });
        win.show();
    },
    onExportTemplate: function (param) {
        var selection = this.getSelectionModel().getSelection();
        var curNodeData = selection[0].data;
        if (curNodeData.modelName === 'CB_DIR') {
            Ext.Msg.alert("提示", '无法导出文件夹');
            return;
        }
        var exportParams = {
            modelName: curNodeData.modelName,
            dataId: curNodeData.dataId
        };
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/projectTree/nodeModelInfo.rdm', {modelName: curNodeData.modelName}, false, function (response) {
            exportParams.schemaId = response.decodedData.results.schemaId;
        });
        exportParams.mainTab = this.ownerCt.ownerCt;
        var win = new Ext.Window({
            title: '导出模板',
            width: 0.6 * globalWidth,
            height: 0.4 * globalHeight,
            modal: true,
            plain: true,
            layout: 'fit',
            items: [
                Ext.create("OrientTdm.Collab.common.template.TemplateExportPanel", {
                    baseParams: exportParams,
                    successCallback: function (templateId) {
                        if(templateId){
                            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/KnowledgeController/templateBindKnowledge.rdm', {
                                prjId: curNodeData.dataId,
                                templateId: templateId
                            }, true);
                        }

                        win.close();
                    }
                })
            ]
        });
        win.show();
    },
    onEditNodeInner: function (button) {
        var me = this;
        //当前节点信息
        var selection = me.getSelectionModel().getSelection();
        var curNodeData = selection[0].data;
        //旧的表单相关信息
        var form = button.up('form');
        var modelDesc = form.modelDesc;
        var originalData = form.originalData;
        //响应面板
        var centerPanel;
        var tabPanel;
        if (modelDesc.dbName.indexOf('CB_TASK') != -1) {
            //任务面板重新获取
            centerPanel = me.up('planTaskBreakMainPanel').down('#taskRespRegion');
        } else {
            centerPanel = me.up('projectMngDashboard').down('#prjRespRegion');
        }
        tabPanel = centerPanel.down('projectMngCenterPanel');
        //旧的位置
        var layout = tabPanel.getLayout();
        var originalIndex = Ext.Array.indexOf(layout.getLayoutItems(), form);
        tabPanel.remove(form);
        //创建修改面板
        var modifyForm = Ext.create('OrientTdm.Common.Extend.Form.OrientModifyModelForm', {
            title: modelDesc.text + '基本信息',
            bindModelName: modelDesc.dbName,
            modal: true,
            modelDesc: modelDesc,
            originalData: originalData,
            hasConfigInfoParam: me.hasConfigInfoParam,
            configInfo: me.configInfo,
            afterInitForm: me._specialHandler,
            actionUrl: serviceName + '/projectTree/updateModelData.rdm',
            listeners: {
                activate: function (ct) {
                    centerPanel.activeTabName = ct.title;
                }
            },
            successCallback: function () {
                me.refreshNode(curNodeData.id, true);
            },
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    itemId: 'save',
                    text: '保存',
                    iconCls: 'icon-save',
                    handler: function (btn) {
                        btn.up("form").fireEvent("saveOrientForm", {
                            modelId: modelDesc.modelId
                        });
                    },
                    scope: me
                }]
            }]
        });
        tabPanel.insert(originalIndex, modifyForm);
        tabPanel.setActiveTab(modifyForm);

    },
    onEditNode: function () {
        var selection = this.getSelectionModel().getSelection();
        var curNodeData = selection[0].data;

        var me = this;
        var params = {dataId: curNodeData.dataId};
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/projectTree/nodeModelInfo.rdm', {modelName: curNodeData.modelName}, false, function (response) {
            params.modelId = response.decodedData.results.modelId;
        });

        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelData/getGridModelDescAndData.rdm', params, false, function (response) {
            var modelDesc = response.decodedData.results.orientModelDesc;
            var modelData = response.decodedData.results.modelData;

            var form = Ext.create('OrientTdm.Common.Extend.Form.OrientModifyModelForm', {
                buttonAlign: 'center',
                buttons: [
                    {
                        itemId: 'save',
                        text: '保存',
                        iconCls: 'icon-save',
                        scope: me,
                        handler: function (btn) {
                            var me = this;
                            btn.up('form').fireEvent('saveOrientForm', {
                                modelId: params.modelId
                            });
                        }
                    },
                    {
                        itemId: 'back',
                        text: '取消',
                        iconCls: 'icon-close',
                        scope: me,
                        handler: function () {
                            win.close();
                        }
                    }
                ],
                successCallback: function () {
                    me._specialAfterSave(this, arguments);
                    win.close();
                    me.refreshNode(curNodeData.id, true);
                },
                bindModelName: modelDesc.dbName,
                actionUrl: serviceName + '/projectTree/updateModelData.rdm',
                modelDesc: modelDesc,
                originalData: modelData,
                hasConfigInfoParam: me.hasConfigInfoParam,
                configInfo: me.configInfo,
                afterInitForm: me._specialHandler
            });

            var win = new Ext.Window({
                title: '编辑' + modelDesc.text,
                width: 0.4 * globalWidth,
                height: 0.8 * globalHeight,
                modal: true,
                layout: 'fit',
                items: [
                    form
                ]
                , listeners: {
                    'beforeshow': function () {
                        var items = form.items.items[0].items.length;
                        if (items < 3) {
                            win.setHeight(items * 160);
                        }
                        else if (items >= 3 && items <= 7) {
                            win.setHeight(items * 90);
                        }
                        else {
                            win.setHeight(items * 90);
                        }
                    }
                }
            });
            win.show();
        });
    },
    onDeleteNode: function () {
        var selection = this.getSelectionModel().getSelection();
        var curNodeData = selection[0].data;
        var me = this;
        Ext.Msg.confirm('提示', '是否删除【' + curNodeData.text + '】?',
            function (btn, text) {
                if (btn == 'yes') {
                    var params = {
                        modelName: curNodeData.modelName,
                        dataId: curNodeData.dataId
                    };
                    OrientExtUtil.AjaxHelper.doRequest(serviceName + '/projectTree/deleteNode.rdm', params, false, function (response) {
                        var retV = response.decodedData;
                        var success = retV.success;
                        if (success) {
                            me.refreshNode(curNodeData.id, true);
                        }
                    });
                }
            }
        );
    },
    doRefresh: function () {
        var selectedNode = this.getSelectionModel().getSelection()[0];
        this.getStore().load({
            node: selectedNode
        });
    },
    refreshNode: function (nodeId, refreshParent) {
        var me = this;
        var rootNode = this.getRootNode();

        var currentNode;
        if (nodeId === '-1') {
            currentNode = rootNode;
        } else {
            currentNode = rootNode.findChild('id', nodeId, true) || rootNode;
        }

        var toRefreshNode = currentNode;
        if (refreshParent && currentNode.isRoot() == false) {
            toRefreshNode = currentNode.parentNode;
        }
        this.store.load({
            node: toRefreshNode,
            callback: function () {
                me.getSelectionModel().select(currentNode);
            }
        });
    },
    onPlanTaskBreak: function () {
        var me = this;
        var selection = this.getSelectionModel().getSelection();
        var curNodeData = selection[0].data;
        if (curNodeData.modelName == 'CB_DIR' || curNodeData.modelName == 'CB_PROJECT') {
            Ext.Msg.alert("提示", '当前节点不支持工作包分解');
            return;
        }

        var oldPanel = this.ownerCt.ownerCt.queryById("planTaskBreak");
        if (!Ext.isEmpty(oldPanel)) {
            this.ownerCt.ownerCt.remove(oldPanel);
        }

        var thePanel = Ext.create('OrientTdm.Collab.common.planTaskBreak.PlanTaskBreakMainPanel', {
            title: '工作包分解"' + curNodeData.text + '"',
            closable: true,
            rootModelName: curNodeData.modelName,
            rootDataId: curNodeData.dataId
        });
        this.ownerCt.ownerCt.add(thePanel);
        this.ownerCt.ownerCt.setActiveTab(thePanel);
    },
    createDefaultData: function (fatherNode, schemaId) {
        fatherNode = fatherNode || this.getRootNode();
        var fatherModelKey = fatherNode.raw.modelName + '_' + schemaId + '_ID';
        var orderKey = "DISPLAY_ORDER_" + fatherNode.raw.modelId;
        var maxOrder = 0;
        fatherNode.expand(false, function () {
            fatherNode.eachChild(function (child) {
                var tmpOrder = child.raw.order || 0;
                maxOrder = Math.max(maxOrder, parseInt(tmpOrder));
            });
        });
        var retVal = {};
        retVal[fatherModelKey] = fatherNode.raw.dataId;
        retVal[orderKey] = maxOrder + 1;
        return retVal;
    },
    containerclick: function () {
        //点击空白区域 选中 根节点
        this.getSelectionModel().select(this.getRootNode(), false, true);
    },
    _specialHandler: function () {
        var me = this;
        if (me.hasConfigInfoParam) {
            var roleIds = OrientExtUtil.SysMgrHelper.getCustomRoleIds();
                var responsibleField = me.down('SimpleColumnDescForSelector[name=PRINCIPAL_' + me.modelDesc.modelId +']');
                // 设置角色ids
                var selectorDesc = Ext.decode(responsibleField.columnDesc.selector);
                selectorDesc.filterValue = roleIds;
                selectorDesc.filterTH = me.configInfo.filterTH;
                selectorDesc.filterType = me.configInfo.filterType;
                responsibleField.columnDesc.selector = Ext.encode(selectorDesc);
        }
        return;
        // 客户觉得不想要
        var me = this;
        var modelDesc = me.modelDesc;
        if (modelDesc.dbName.indexOf('CB_TASK') != -1) {
            //获取组件信息
            var originalData = me.originalData;
            if (!Ext.isEmpty(originalData.ID)) {
                //请求绑定信息
                var params = {
                    modelId: modelDesc.modelId,
                    dataId: originalData.ID
                };
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/ComponentBind/list.rdm', params, false, function (resp) {
                    var results = resp.decodedData.results;
                    if (results && results.length > 0) {
                        originalData['component'] = results[0].belongComponent.id;
                        originalData['component_display'] = results[0].belongComponent.componentname;
                    }
                });
            }
            var editAble = me.xtype != 'orientDetailModelForm';
            //针对任务节点 增加组件选择信息
            me.add({
                xtype: 'fieldset',
                border: '1 1 1 1',
                collapsible: true,
                title: '组件信息',
                items: [
                    {
                        xtype: 'selectComponentField',
                        columnDesc: {
                            sColumnName: 'component',
                            text: '绑定组件',
                            editAble: editAble
                        }
                    }
                ]
            });
        }
    },
    _specialAfterSave: function (form, respArray) {
        var resp = respArray[0];
        var respData = resp.results;
        var dataId = respData.ID;
        if (dataId && form.down('hiddenfield[name=component]')) {
            var modelDesc = form.modelDesc;
            //绑定组件关系
            var params = {
                    modelId: modelDesc.modelId,
                    dataId: dataId,
                    componentId: form.down('hiddenfield[name=component]').getValue()
                }
                ;
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/ComponentBind/create.rdm', params, false);
        }
    },
    _filterDisplayData: function (formData, modelId) {
        if ("未开始" === formData["STATUS_" + modelId]) {
            formData["ACTUAL_START_DATE_" + modelId] = "";
            formData["ACTUAL_END_DATE_" + modelId] = "";
        }
    }
});