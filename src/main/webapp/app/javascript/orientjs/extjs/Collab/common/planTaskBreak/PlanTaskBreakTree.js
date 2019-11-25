/**
 * Created by Seraph on 16/7/26.
 */
/**
 * Created by Seraph on 16/7/6.
 */
Ext.define('OrientTdm.Collab.common.planTaskBreak.PlanTaskBreakTree', {
    extend: 'OrientTdm.Collab.ProjectMng.mainFrame.ProjectTree',
    requires: [
        "OrientTdm.Collab.ProjectMng.mainFrame.model.ProjectTreeNodeModel"
    ],
    config: {
        rootModelName: null,
        rootDataId: null,
        treeNodeData: null,
        rootNode: null
    },
    initComponent: function () {
        var me = this;

        if (me.rootModelName === 'CB_TASK') {
            Ext.apply(
                this, {
                    rootVisible: true
                }
            );
        }

        me.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'select', me.itemClickListener, me);
    },
    createStore: function () {
        var me = this;

        var params = {
            modelName: me.rootModelName,
            dataId: me.rootDataId
        };

        OrientExtUtil.AjaxHelper.doRequest("projectTree/nodeInfo.rdm", params, false, function (response) {
            me.rootNode = Ext.decode(response.responseText);
        });

        var retVal = Ext.create("Ext.data.TreeStore", {
            model: 'OrientTdm.Collab.ProjectMng.mainFrame.model.ProjectTreeNodeModel',
            listeners: {
                beforeLoad: function (store, operation) {
                    var node = operation.node;
                    store.getProxy().setExtraParam("functionModule", "planMng");

                    if (Ext.isEmpty(node)) {
                        operation.node = store.getRootNode();
                        node = operation.node;
                    }
                    store.getProxy().setExtraParam("modelName", Ext.encode(node.data.modelName));
                    store.getProxy().setExtraParam("dataId", node.data.dataId);

                    if (!node.isRoot()) {
                        if (node.raw.parentNode) {
                            node.raw.parentNode = null;
                        }
                    }
                }
            },
            root: Ext.apply(me.rootNode, {
                expanded: true
            })

        });
        return retVal;
    },
    createLeftBar: function () {
        var me = this;
        var retV = [{
            iconCls: 'icon-delete',
            handler: Ext.bind(me.onDeleteNode, me),
            name: 'delete',
            tooltip: '删除',
            disabled: true
        }, '-', {
            tooltip: '手工创建子任务',
            name: 'createbyhand',
            iconCls: 'icon-createbyhand',
            handler: Ext.bind(me.onCreateNode, me, [{toCreateModelName: 'CB_TASK'}])
        }, {
            tooltip: '从模板导入子任务',
            iconCls: 'icon-createbyimport',
            name: 'createbyimport',
            handler: Ext.bind(me.onCreateNodeByImport, me, [{toCreateModelName: 'CB_TASK'}])
        }, '-', {
            iconCls: 'icon-exporttemplate',
            tooltip: '导出模板',
            name: 'exporttemplate',
            handler: Ext.bind(me.onExportTemplate, me)
        }];

        return retV;
    },
    setButtonStatus: function (record) {
        var me = this;
        var lbar = this.down('toolbar[dock=left]');

        lbar.down('button[name=exporttemplate]').setDisabled(false);

        if ('NOT_STARTED' === record.data.status) {
            lbar.down('button[name=delete]').setDisabled(false);
        } else {
            lbar.down('button[name=delete]').setDisabled(true);
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

        if ('NOT_STARTED' === record.data.status) {
            items.push({
                iconCls: 'icon-delete',
                handler: Ext.bind(me.onDeleteNode, me),
                text: '删除'
            });
        }

        items.push({
            text: '手工创建子任务',
            name: 'createbyhand',
            iconCls: 'icon-createbyhand',
            handler: Ext.bind(me.onCreateNode, me, [{toCreateModelName: 'CB_TASK'}])
        });

        items.push({
            text: '从模板导入子任务',
            iconCls: 'icon-createbyimport',
            name: 'createbyimport',
            handler: Ext.bind(me.onCreateNodeByImport, me, [{toCreateModelName: 'CB_TASK'}])
        });

        items.push({
            iconCls: 'icon-exporttemplate',
            text: '导出模板',
            handler: Ext.bind(me.onExportTemplate, me)
        });

        return Ext.create('Ext.menu.Menu',{
            items: items
        });
    },
    createToolBarItems: function () {
        var me = this;

        var retVal = [{
            xtype: 'tbspacer'
        }, {
            xtype: 'trigger',
            width: 160,
            style:{
                margin:'0 0 0 22'
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
                        me.filterByText(this.getRawValue(), "text");
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
    onShowNodeDetail: function (nodeId, refreshParent) {
        var selection = this.getSelectionModel().getSelection();
        var curNodeData = selection[0].data;

        var me = this;
        var params = {dataId: curNodeData.dataId};
        OrientExtUtil.AjaxHelper.doRequest("projectTree/nodeModelInfo.rdm", {modelName: curNodeData.modelName}, false, function (response) {
            params.modelId = response.decodedData.results.modelId;
        });

        OrientExtUtil.AjaxHelper.doRequest("modelData/getGridModelDescAndData.rdm", params, false, function (response) {
            var modelDesc = response.decodedData.results.orientModelDesc;
            var modelData = response.decodedData.results.modelData;

            var form = Ext.create("OrientTdm.Common.Extend.Form.OrientDetailModelForm", {
                buttonAlign: 'center',
                bindModelName: modelDesc.dbName,
                actionUrl: "modelData/updateModelData.rdm",
                modelDesc: modelDesc,
                originalData: modelData
            });

            var win = new Ext.Window({
                title: modelDesc.text + '基本信息',
                width: 0.8 * globalWidth,
                height: 0.8 * globalHeight,
                layout: 'fit',
                items: [
                    form
                ]
            });
            win.show();
        });
    }
});