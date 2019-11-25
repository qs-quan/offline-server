/**
 * Created by enjoy on 2016/4/6 0006.
 * 模型表格模板新增面板
 */

Ext.define('OrientTdm.BackgroundMgr.CustomGrid.Create.ModelGridAddDashBord', {
    extend: "OrientTdm.Common.Extend.Panel.OrientTabPanel",
    alias: 'widget.modelGridAddDashBord',
    require: [
        "OrientTdm.BackgroundMgr.CustomGrid.Create.ModelGridForm",
        "OrientTdm.BackgroundMgr.CustomGrid.Common.ModelColumnSelectedPanel",
        "OrientTdm.BackgroundMgr.CustomGrid.Common.ModelButtonSelectedPanel"
    ],
    originalModelId: '',
    bindModelName: '',
    initComponent: function () {
        var me = this;
        var modelGridForm = Ext.create("OrientTdm.BackgroundMgr.CustomGrid.Create.ModelGridForm", {
            bindModelName: me.bindModelName,
            actionUrl: serviceName + '/modelGridView/create.rdm',
            listeners: {
                beforedeactivate: me.initColumnTab,
                scope: me
            }
        });
        var showColumnChoosePanel = Ext.create("OrientTdm.BackgroundMgr.CustomGrid.Common.ModelColumnSelectedPanel", {
            itemId: "displayfield",
            title: '显示字段'
        });
        var addColumnChoosePanel = Ext.create("OrientTdm.BackgroundMgr.CustomGrid.Common.ModelColumnSelectedPanel", {
            itemId: "addfield",
            title: '新增字段'
        });
        var editColumnChoosePanel = Ext.create("OrientTdm.BackgroundMgr.CustomGrid.Common.ModelColumnSelectedPanel", {
            itemId: "editfield",
            title: '修改字段'
        });
        var detailColumnChoosePanel = Ext.create("OrientTdm.BackgroundMgr.CustomGrid.Common.ModelColumnSelectedPanel", {
            itemId: "detailfield",
            title: '详细字段'
        });
        var queryColumnChoosePanel = Ext.create("OrientTdm.BackgroundMgr.CustomGrid.Common.ModelColumnSelectedPanel", {
            itemId: "queryfield",
            title: '查询字段'
        });
        var btnChoosePanel = Ext.create("OrientTdm.BackgroundMgr.CustomGrid.Common.ModelButtonSelectedPanel", {
            itemId: "btns",
            title: '菜单栏按钮'
        });
        Ext.apply(me, {
            items: [modelGridForm, showColumnChoosePanel, addColumnChoosePanel, editColumnChoosePanel, detailColumnChoosePanel, queryColumnChoosePanel, btnChoosePanel],
            activeItem: 0
        });
        me.callParent(arguments);
    },
    doSave: function (callBack) {
        var me = this;
        //初始化
        me.initColumnTab();
        //获取字段信息
        var columnDescData = me.getColumnDescData();
        //获取按钮信息
        var btnChoosePanel = me.down("modelButtonSelectedPanel");
        var btnFieldName = btnChoosePanel.getItemId();
        var btnDescData = {};
        btnDescData[btnFieldName] = btnChoosePanel.getSubmitValue();
        var formPanel = me.down("modelGridForm");
        for (var item in columnDescData) {
            var field = formPanel.down("hiddenfield[name=" + item + "]");
            field.setValue(columnDescData[item].toString());
        }
        for (var item in btnDescData) {
            var field = formPanel.down("hiddenfield[name=" + item + "]");
            field.setValue(btnDescData[item].toString());
        }
        formPanel.successCallback = callBack;
        formPanel.fireEvent("saveOrientForm");

    },
    doPreview: function () {

    },
    getColumnDescData: function () {
        var me = this;
        var columnChoosePanels = me.query("modelColumnSelectedPanel");
        var columnDescs = {};
        Ext.each(columnChoosePanels, function (panel) {
            var selectedGrid = panel.down("#selectedGrid");
            var selectedStore = selectedGrid.getStore();
            var selectedIds = [];
            selectedStore.each(function (record) {
                selectedIds.push(record.get("id"));
            });
            columnDescs[panel.getItemId()] = selectedIds;
        });
        return columnDescs;
    },
    initColumnTab: function () {
        var me = this;
        var formPanel = me.down("modelGridForm");
        if (!formPanel.isValid()) {
            return false;
        } else {
            var columnChoosePanels = me.query("modelColumnSelectedPanel");
            var bindModelId = formPanel.down("hidden[name=modelid]").getValue();
            if (bindModelId != me.originalModelId) {
                me.originalModelId = bindModelId;
                //获取字段描述
                OrientExtUtil.AjaxHelper.doRequest(serviceName + "/modelFormView/getModelColumn.rdm", {
                    orientModelId: bindModelId
                }, false, function (resp) {
                    Ext.each(columnChoosePanels, function (panel) {
                        panel.needReconfig = true;
                        panel.columnData = resp.decodedData.results;
                        panel.validateModelChange();
                    });
                });
            }
        }

    }
});
