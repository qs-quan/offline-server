/**
 * Created by qjs on 2016/12/26.
 */
Ext.define('OrientTdm.BackgroundMgr.PVMMulTemplate.Common.PVMMulOrientModelGrid', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alternateClassName: 'OrientExtend.PVMMulModelGrid',
    alias: 'widget.orientPVMMulModelGrid',
    requires: [
        "OrientTdm.Common.Extend.Form.OrientAddModelForm",
        "OrientTdm.Common.Extend.Form.OrientModifyModelForm",
        "OrientTdm.Common.Extend.Form.OrientDetailModelForm",
        "OrientTdm.Common.Extend.Form.OrientQueryModelForm",
        "OrientTdm.DataMgr.DataAnalysis.OnlineChartingWindow",
        "OrientTdm.Common.Util.HtmlTriggerHelper"
    ],
    config: {
        modelId: '',
        isView: '',
        templateId: '',
        //初始过滤条件
        customerFilter: [],
        //查询过滤条件
        queryFilter: [],
        modelDesc: {},
        queryUrl: '',
        createUrl: '',
        updateUrl: '',
        deleteUrl: '',
        dataList: null,
        loadDataFirst: true,
        formInitData: null,
        showAnalysisBtns: true,
        preview:false
    },
    //视图初始化
    createToolBarItems: function () {
        var me = this;
        var retVal = [];
        //获取模型操作描述
        var btns = me.modelDesc.btns;
        Ext.each(btns, function (btn) {
            retVal.push({
                iconCls: 'icon-' + btn.code,
                text: btn.name,
                scope: me,
                btnDesc: btn,
                handler: Ext.bind(me.onGridToolBarItemClicked, me)
            });
        });
        return retVal;
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
        return retVal;
    },
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
                        "read": me.queryUrl == "" ? serviceName + "/modelData/getModelData.rdm" : me.queryUrl,
                        "create": me.createUrl == "" ? serviceName + "/modelData/saveModelData.rdm" : me.createUrl,
                        "update": me.updateUrl == "" ? serviceName + "/modelData/updateModelData.rdm" : me.updateUrl,
                        "delete": me.deleteUrl == "" ? serviceName + "/modelData/deleteModelData.rdm" : me.deleteUrl
                    },
                    extraParams: {
                        orientModelId: me.modelId,
                        isView: me.isView,
                        templateId:me.templateId
                        //customerFilter: Ext.isEmpty(me.customerFilter) ? "" : Ext.encode(me.customerFilter)
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
    beforeInitComponent: function () {
        //初始化面板前执行
        var me = this;
        if (!me.modelDesc.hasOwnProperty("modelId")) {
            if (Ext.isEmpty(me.modelId)) {
                OrientExtUtil.Common.err(OrientLocal.prompt.error, OrientLocal.prompt.unBindModel);
            }
            var params = {
                modelId: me.modelId,
                isView: me.isView,
                templateId: ''//me.templateId 这里不需要传入templateId,与orientModelGrid中的参数不同
            };
            //初始化模型描述
            OrientExtUtil.AjaxHelper.doRequest(serviceName + "/modelData/getGridModelDesc.rdm", params, false, function (response) {
                //1.获取模型字段描述 字段名称 显示名 类型...
                //2.获取模型操作描述 新增/修改/删除/查询/导入/导出...
                me.modelDesc = response.decodedData.results.orientModelDesc;
            });
        }
    },
    initComponent: function () {
        this.callParent(arguments);
        this.addEvents({
            //自定义刷新
            refreshGridByCustomerFilter: true,
            //根据查询条件刷新
            refreshGridByQueryFilter: true,
            //保存数据前
            afterCreateData: true,
            afterUpdateData: true,
            afterDeleteData: true,
            afterStartAuditFlow: true
        });
        this.addEvents("refreshGridByCustomerFilter", "refreshGridByQueryFilter", "refreshGridByTreeNode");

        this.initDataAnalysisBtns();
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'refreshGridByCustomerFilter', me.refreshGridByCustomerFilter, me);
        me.mon(me, 'refreshGridByQueryFilter', me.refreshGridByQueryFilter, me);
        me.mon(me, 'refreshGridByTreeNode', me.refreshGridByTreeNode, me);
    },
    refreshGridByCustomerFilter: function (customerFilter) {
        var me = this;
        customerFilter = Ext.isEmpty(customerFilter) ? me.customerFilter : customerFilter;
        me.setQueryFilter([]);
        var gridStore = me.getStore();
        var proxy = gridStore.getProxy();
        proxy.setExtraParam("customerFilter", Ext.isEmpty(customerFilter) ? "" : Ext.encode(customerFilter));
        me.getSelectionModel().clearSelections();
        var lastOptions = gridStore.lastOptions;
        gridStore.reload(lastOptions);
    },
    refreshGridByQueryFilter: function () {
        var me = this;
        var customerFilter = me.getCustomerFilter();
        var queryFilter = me.getQueryFilter();
        var combineFilter = Ext.isEmpty(customerFilter) ? queryFilter : Ext.Array.merge(customerFilter, queryFilter);
        //从表格对象中获取自定义过滤条件
        var gridStore = me.getStore();
        var proxy = gridStore.getProxy();
        proxy.setExtraParam("customerFilter", Ext.isEmpty(combineFilter) ? "" : Ext.encode(combineFilter));
        me.getSelectionModel().clearSelections();
        var lastOptions = gridStore.lastOptions;
        gridStore.reload(lastOptions);
    },
    onGridToolBarItemClicked: function (btn, event, eOpts) {
        var me = this;
        var btnDesc = btn.btnDesc;
        if (btnDesc.jspath) {
            Ext.require(btnDesc.jspath);
            var orientBtnInstance = Ext.create(btnDesc.jspath, {
                btnDesc: btnDesc
            });
            btn.orientBtnInstance = orientBtnInstance;
            orientBtnInstance.triggerClicked(me);
        } else {
            OrientExtUtil.Common.err(OrientLocal.prompt.error, OrientLocal.prompt.unBindJSPath);
        }


    },
    getIds: function () {
        //获取当前表格ID集合 不考虑分页
        var retVal = [];
        var me = this;
        me.getStore().each(function (record) {
            retVal.push(record.getId());
        });
        return retVal;
    },
    refreshGridByTreeNode: function (treeNode) {
        var me = this;
        var tbomModels = treeNode.raw.tBomModels;
        Ext.each(tbomModels, function (tbomMode) {
            var customerFilter = [tbomMode.defaultFilter];
            me.refreshGridByCustomerFilter(customerFilter);
        });
    },
    initDataAnalysisBtns: function() {
        var me = this;
        if(!me.showAnalysisBtns) {
            return;
        }

        //添加绘图功能按钮
        var ptbar = me.down("pagingtoolbar");
        if(!ptbar) {
            return;
        }
        ptbar.add([
            {
                xtype: 'button',
                iconCls: 'icon-chart',
                text: '绘图',
                scope: me,
                handler: function() {
                    var win = Ext.create("OrientTdm.DataMgr.DataAnalysis.OnlineChartingWindow", {
                        modelId: me.modelDesc.modelId,
                        colDesc: me.modelDesc.columns
                    });
                    win.show();
                }
            },
            {
                xtype: 'button',
                iconCls: 'icon-analysis',
                text: 'Plot',
                scope: me,
                handler: function() {
                    me.plotAnalysis(me.modelId, me.isView, me.customerFilter);
                }
            },
            {
                xtype: 'button',
                iconCls: 'icon-analysis',
                text: 'Origin',
                scope: me,
                handler: function() {
                    me.originAnalysis(me.modelId, me.isView, me.customerFilter);
                }
            }
        ]);
    },
    plotAnalysis: function(modelId, isView, customerFilter) {
        var wait = Ext.MessageBox.wait("正在准备数据，请稍后...", "准备数据", {text: "请稍后..."});
        Ext.Ajax.request({
            url : serviceName + "/dataAnalysis/plotAnalysis.rdm",
            method : 'POST',
            params : {
                modelId : modelId,
                customFilter : Ext.encode(customerFilter),
                modelType : isView
            },
            success : function(response, options) {
                wait.hide();
                var data = response.decodedData;
                var params = data.serviceAddr+";"+data.servicePort+";"+data.fileName+";null;null";
                HtmlTriggerHelper.startUpTool("edmplot", "null", params);
            },
            failure : function(result, request) {
                wait.hide();
                Ext.MessageBox.alert("错误", "数据准备错误...");
            }
        });
    },
    originAnalysis: function(modelId, isView, customerFilter) {
        var wait = Ext.MessageBox.wait("正在准备数据，请稍后...", "准备数据", {text: "请稍后..."});
        Ext.Ajax.request({
            url : serviceName + "/dataAnalysis/originAnalysis.rdm",
            method : 'POST',
            params : {
                modelId : modelId,
                customFilter : Ext.encode(customerFilter),
                modelType : isView
            },
            success : function(response, options) {
                wait.hide();
                var data = response.decodedData;
                var toolPath = HtmlTriggerHelper.getToolPath("Origin");
                var params = "-serverIp@@"+data.serviceAddr+"@@-socketPort@@"+data.servicePort+"@@-remoteFile@@"+data.fileName;
                HtmlTriggerHelper.startUpTool("origin", toolPath, params);
            },
            failure : function(result, request) {
                wait.hide();
                Ext.MessageBox.alert("错误", "数据准备错误...");
            }
        });
    }
});

