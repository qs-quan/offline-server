/**
 * Created by dailin on 2019/5/5 18:12.
 */

Ext.define('OrientTdm.Collab.ProjectMng.mainFrame.KnowledgeList', {
    alias: 'widget.knowledgeList',
    extend: 'OrientTdm.Common.Extend.Grid.OrientModelGrid',
    config: {},
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
    },

    createColumns: function() {
        var me = this;
        var originalColumns = me.callParent(arguments);
        var columns = [];
        var modelId = me.modelId;
       /* var filterIndex = ["C_FILELOCATION_" + modelId, "C_FINALNAME_" + modelId, "C_FILEDOWNLOAD_" + modelId,"C_FILECLICKNUM_" + modelId,
            "C_PREVIEWNUM_" + modelId, "T_CATEGORY_" + OrientExtUtil.FunctionHelper.getKnowledgeSchemaId() + "_ID"];*/
        // 过滤字段保持和知识界面字段一致
        var filterIndex = ["C_NAME_" + modelId,"C_FILEKEYWORD_" + modelId, "C_FILESUMMARY_" + modelId, "C_PREVIEW_AREA_" + modelId,
            "C_FILESECURITY_" + modelId, "CWM_SYS_USER_ID", "C_UPLOAD_TIME_" + modelId];
        Ext.each(originalColumns, function (column) {
            if (Ext.Array.contains(filterIndex,column.dataIndex)) {
                columns.push(column);
            }
        });
        return columns;
    },

    // 为什么还要再写一次这个：不知道为什么beforeload时加参数会使他连续load三次，但这样写只是一次
    createStore: function () {
        var me = this;
        //获取fields
        var fields = [{
            name: 'ID'
        }];
        //获取模型操作描述
        var modelDesc = me.modelDesc;
        if (modelDesc && modelDesc.columns) {
            Ext.each(modelDesc.columns, function (column) {
                fields.push({
                    name: column.sColumnName
                });
            });
        }
        var retVal;
        if (me.dataList) {
            //直接加载数据 内存加载数据暂不支持 新增、修改、删除、查询等操作
            retVal = Ext.create('Ext.data.Store', {
                fields: fields,
                autoLoad: me.loadDataFirst,
                remoteSort: false,
                data: me.dataList,
                proxy: {
                    type: 'memory',
                    reader: {
                        type: 'json'
                    }
                }
            });
        } else {
            //从后台加载数据
            var customerFilter = [new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.In, "", "{{zsIds}}")];

            retVal = Ext.create('Ext.data.Store', {
                fields: fields,
                autoLoad: me.loadDataFirst,
                remoteSort: true,
                proxy: {
                    type: 'ajax',
                    actionMethods: {
                        create: 'POST',
                        read: 'POST',
                        update: 'POST',
                        destroy: 'POST'
                    },
                    api: {
                        "read": me.queryUrl == "" ? serviceName + "/modelData/getKnowledgeData.rdm" : me.queryUrl
                    },
                    extraParams: {
                        orientModelId: me.modelId,
                        isView: me.isView,
                        isPositive: me.isPositive,
                        taskId: me.taskId,
                        schemaId: me.schemaId,
                        customerFilter: Ext.encode(customerFilter)
                    },
                    reader: {
                        type: 'json',
                        successProperty: 'success',
                        root: 'results',
                        totalProperty: 'totalProperty',
                        idProperty: 'ID',
                        messageProperty: 'msg'
                    },
                    listeners: {}
                }
            });
        }
        return retVal;
    },
    createToolBarItems: function () {
        var me = this;
        if (me.hasToolBar) {
            return [];
        }

        var retV = [];
        if (me.isPositive == "1") {
            if (!me.isBom) {
                retV.push({
                    xtype: "button",
                    text: "选择",
                    iconCls: 'icon-create',
                    handler: function () {
                        me._chooseFunction();
                    }
                });
                retV.push({
                    xtype: "button",
                    text: "取消",
                    iconCls: 'icon-delete',
                    handler: function () {
                        me._cancelFunction();
                    }
                });
            }

            retV.push({
                xtype: "button",
                text: "下载",
                iconCls: 'icon-import',
                handler: function () {
                    me._downloadFunction();
                }
            })
        }
        return retV;
    },
    // 选择按钮操作
    _chooseFunction: function () {
        var me = this;
        var leftPanel = Ext.create('OrientTdm.Collab.ProjectMng.mainFrame.knowledge.LeftFormPanel',{
            region : 'west',
            split : true,
            width : 0.2 * globalWidth
        });

        var centerPanel = Ext.create('OrientTdm.Collab.ProjectMng.mainFrame.knowledge.CenterModelGridpanel',{
            region : 'center',
            split : true,
            modelId: OrientExtUtil.ModelHelper.getModelId('T_FILE',OrientExtUtil.FunctionHelper.getKnowledgeSchemaId(), false),
            modelName: 'T_FILE',
            width : 0.4 * globalWidth,
            taskId : me.taskId
        });

        var dataPanel = Ext.create('OrientTdm.Common.Extend.Panel.OrientPanel',({
            id : 'knChooseMainPanel',
            layout : 'border',
            renderTo: Ext.getBody(),
            items : [leftPanel, centerPanel]
        }));

        var win = Ext.create('widget.window', {
            // title: '选择',
            width: 0.6 * globalWidth,
            height: 0.4 * globalHeight,
            layout: 'fit',
            buttonAlign: 'center',
            buttons: [{
                xtype: "button",
                text: "确定",
                iconCls: 'icon-saveAndClose',
                handler: function () {
                    var grid = this.up('window').down('gridpanel');
                    if (!OrientExtUtil.GridHelper.hasSelected(grid)) {
                        OrientExtUtil.Common.info('提示','请至少选择一条记录');
                        return;
                    } else {
                        var recordIds = OrientExtUtil.GridHelper.getSelectRecordIds(grid);
                        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/KnowledgeController/insertKnowledgeRelation.rdm',{
                            knowledgeIds: recordIds,
                            taskId: me.taskId
                        }, false, function (response) {
                            OrientExtUtil.Common.tip('提示', response.decodedData.results);
                        });
                        me.fireEvent("refreshGrid");
                        win.close();
                    }
                }
            }],
            layout: 'fit',
            modal: true,
            items: [dataPanel]
        });
        win.show();
    },
    // 取消按钮操作
    _cancelFunction: function () {
        var me = this;
        if (!OrientExtUtil.GridHelper.hasSelected(me)) {
            OrientExtUtil.Common.info('提示', '请至少选择一条记录');
            return;
        } else {
            var recordIds = OrientExtUtil.GridHelper.getSelectRecordIds(me);
            OrientExtUtil.Common.confirm(OrientLocal.prompt.confirm, OrientLocal.prompt.confirmDelete, function (btn) {
                if (btn == 'yes') {
                    OrientExtUtil.AjaxHelper.doRequest(serviceName + '/KnowledgeController/deleteKnowledgeRelation.rdm', {
                        taskId: me.taskId,
                        knowledgeIds: recordIds
                    }, false, function (response) {
                        OrientExtUtil.Common.tip('提示', response.decodedData.results);
                    });
                    me.fireEvent("refreshGrid");
                }
            });
        }
    },

    /**
     * 下载
     */
    _downloadFunction: function () {
        var me = this;
        if (!OrientExtUtil.GridHelper.hasSelected(me)) {
            OrientExtUtil.Common.info('提示', '请至少选择一条记录');
            return;
        } else {
            // 照搬的知识功能点路径
            var recordIds = OrientExtUtil.GridHelper.getSelectRecordIds(me);
                var url = serviceName + '/fileController/downloadFile.rdm'
                    + '?fileId=' + recordIds.join(",")
                    + '&fileModelName=' + "T_FILE";
                window.location.href = url;
        }
    },

    /**
     * 刷新表格
     */
    refreshGrid: function () {
        //清空选择
        this.getSelectionModel().clearSelections();
        var store = this.getStore();
        var lastOptions = store.lastOptions;
        store.reload(lastOptions);
    }

});