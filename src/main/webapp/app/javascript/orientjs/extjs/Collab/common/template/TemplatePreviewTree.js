/**
 * Created by Seraph on 16/9/26.
 */
Ext.define('OrientTdm.Collab.common.template.TemplatePreviewTree', {
    alias: 'widget.projectTree',
    extend: 'OrientTdm.Common.Extend.Tree.OrientTree',
    requires: [
        'OrientTdm.Collab.common.template.model.TemplatePreviewTreeNode',
        'OrientTdm.Collab.common.util.SelectComponentField'
    ],
    initComponent: function () {
        var me = this;
        me.rootNode = {
            text: 'root',
            dataId: '-1',
            id: '-1',
            expanded: true
        };
        me.callParent(arguments);
    },
    config: {
        templateId : null
    },
    createStore: function () {
        var me = this;
        var retVal = Ext.create('Ext.data.TreeStore', {
            model: 'OrientTdm.Collab.common.template.model.TemplatePreviewTreeNode',
            listeners: {
                beforeLoad: function (store, operation) {
                    var node = operation.node;
                    if (node.isRoot()) {
                        store.getProxy().setExtraParam('parDataId', '-1');
                    } else {
                        if (node.raw.parentNode) {
                            node.raw.parentNode = null;
                        }
                        store.getProxy().setExtraParam('parDataId', node.data.id);
                    }

                    store.getProxy().setExtraParam('templateId', me.templateId);
                }
            },
            root: me.rootNode
        });
        return retVal;
    },
    createToolBarItems: function () {
        var me = this;

        var retVal = [{
            xtype: 'trigger',
            width: 120,
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
        }, {
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
    },
    itemClickListener: function (tree, record, item) {
        var me = this;

        var centerPanel = me.ownerCt.centerPanel;
        centerPanel.removeAll(true);

        var itemsToAdd = [];

        var params = {
            nodeId: record.data.id,
            dataPrincipal: me.dataPrincipal
        };


        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/templatePreview/bmTemplateNodeToBmData.rdm', params, false, function (response) {
            var params = {
                modelId : response.decodedData.modelId,
                dataId : "-1"
            };

            var functions = [];
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/collabTeam/model/' + response.decodedData.modelName + '/functions.rdm', params, false, function (response) {
                functions = response.decodedData.results;
            });

            var modelData = response.decodedData;
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelData/getGridModelDescAndData.rdm', params, false, function (response) {
                var modelDesc = response.decodedData.results.orientModelDesc;

                var centerPanel = me.ownerCt.centerPanel;
                centerPanel.removeAll(true);
                itemsToAdd.push(Ext.create('OrientTdm.Common.Extend.Form.OrientDetailModelForm', {
                    iconCls: 'icon-baseinfo',
                    title: '基本信息',
                    bindModelName: modelDesc.dbName,
                    modelDesc: modelDesc,
                    originalData: modelData,
                    collabComp : record.data.extraInfo.collabComp,
                    afterInitForm: me._specialHandler
                }));

                for (var i = 0; i < record.data.compInfos.length; i++) {
                    record.data.compInfos[i].added = false;
                }

                for(var j = 0; j < functions.length; j++){
                    for (var i = 0; i < record.data.compInfos.length; i++) {
                        var comp = record.data.compInfos[i];
                        var tabInfo = me._getTabInfoByType(comp.type);

                        if(functions[j].name === tabInfo.title){
                            me._addPanel(tabInfo, comp, itemsToAdd, centerPanel);
                        }
                    }
                }

                // 只显示配置了的标签页
                // for (var i = 0; i < record.data.compInfos.length; i++) {
                //     var comp = record.data.compInfos[i];
                //     if(!comp.added){
                //         var tabInfo = me._getTabInfoByType(comp.type);
                //         me._addPanel(tabInfo, comp, itemsToAdd, centerPanel);
                //     }
                // }

                /*if(modelData.modelName == "CB_PLAN"){
                    var modelId = OrientExtUtil.ModelHelper.getModelId("T_FILE", OrientExtUtil.FunctionHelper.getKnowledgeSchemaId());
                    var dataPanel = Ext.create('OrientTdm.Collab.ProjectMng.mainFrame.KnowledgeList', {
                        title: '知识库数据',
                        iconCls: 'icon-basicDataType',
                        modelId: modelId,
                        isPositive: "1",
                        // 项目的dataId
                        taskId: modelData['CB_PROJECT_' + modelData.schemaId + '_ID'],
                        isView: 0,
                        region: 'center',
                        padding: '0 0 0 5',
                        layout: 'fit',
                        hasToolBar: true
                    });
                    itemsToAdd.push(dataPanel);
                }*/


                var content = Ext.create("OrientTdm.Collab.common.template.TemplatePreviewTab", {
                    region: 'center',
                    layout: 'border',
                    padding: '0 0 0 0',
                    items: itemsToAdd,
                    dataPrincipal: me.dataPrincipal,
                    schemaId : record.data.schemaId,
                    modelName : record.data.modelName
                });

                centerPanel.add(content);
            });
        });
    },
    _addPanel : function (tabInfo, comp, itemsToAdd, centerPanel){
        var me = this;
        var panel = Ext.create('OrientTdm.Common.Extend.Panel.OrientPanel', {
            iconCls: tabInfo.iconCls,
            title: tabInfo.title,
            layout: 'border',
            compInfo: comp,
            templateId: me.templateId,
            region: 'center',
            height: centerPanel.getHeight() - 28,
            width: centerPanel.getWidth()
        });
        comp.added = true;
        itemsToAdd.push(panel);
    },
    doRefresh: function () {
        var selectedNode = this.getSelectionModel().getSelection()[0];
        this.getStore().load({
            node: selectedNode
        });
    },
    refreshNode: function (nodeId, refreshParent) {
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
        this.store.load({node: toRefreshNode});
    },
    _getTabInfoByType : function (type) {
        if(type.lastIndexOf("GanttGraph") > 0){
            return {
                title : "甘特图",
                iconCls : "icon-gantt"
            };
        }else if(type.lastIndexOf("CollabTeam") > 0){
            return {
                title : "工作组",
                iconCls : "icon-workGroup"
            };
        }else if(type.lastIndexOf("CollabFlow") > 0){
            return {
                title : "控制流",
                iconCls : "icon-flow"
            };
        }else if(type.lastIndexOf("CollabDataFlowDefinition") > 0){
            return {
                title : "数据流",
                iconCls : "icon-dataflow"
            };
        }else if(type.lastIndexOf("CollabDevData") > 0){
            return {
                title : "设计数据",
                iconCls : "icon-designdata"
            };
        }else if(type.lastIndexOf("CollabCheckData") > 0){
            return {
                title : "离线数据",
                iconCls : "icon-offlinedata"
            };
        }else if(type.lastIndexOf("CollabComp") > 0){
            return {
                title : "任务处理",
                iconCls : "icon-taskprocess"
            };
        }else{
            return {
                title : type,
                iconCls : "icon-" + type
            };
        }
    },
    _specialHandler: function () {
        var me = this;
        var modelDesc = me.modelDesc;
        if (modelDesc.dbName.indexOf('CB_TASK') != -1) {
            //获取组件信息
            var originalData = me.originalData;
            if (!Ext.isEmpty(originalData.ID)) {
                //请求绑定信息
                var params = me.collabComp;

                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/Component/listByIds.rdm', params, false, function (resp) {
                    var results = resp.decodedData.results;
                    if (results && results.length > 0) {
                        originalData['component'] = results[0].id;
                        originalData['component_display'] = results[0].componentname;
                    }
                },true);
            }

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
                            editAble: false
                        }
                    }
                ]
            });
        }
    }
});