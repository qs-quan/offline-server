/**
 * Created by enjoy on 2016/4/7 0007.
 * 模型表格模板修改面板
 */


Ext.define('OrientTdm.BackgroundMgr.CustomGrid.Update.ModelGridUpdateDashBord', {
    extend: "OrientTdm.Common.Extend.Panel.OrientTabPanel",
    alias: 'widget.modelGridUpdateDashBord',
    require: [
        "OrientTdm.BackgroundMgr.CustomGrid.Create.ModelGridForm",
        "OrientTdm.BackgroundMgr.CustomGrid.Common.ModelColumnSelectedPanel"
    ],
    originalModelId: '',
    initComponent: function () {
        var me = this;
        var modelGridForm = Ext.create("OrientTdm.BackgroundMgr.CustomGrid.Create.ModelGridForm", {
            bindModelName: me.bindModelName,
            originalData: me.originalData,
            actionUrl: serviceName + '/modelGridView/update.rdm',
            listeners: {
                beforedeactivate: me.initColumnTab
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
            title: '菜单栏按钮',
            originalData: me.originalData.get("btns")
        });
        Ext.apply(me, {
            items: [modelGridForm, showColumnChoosePanel, addColumnChoosePanel, editColumnChoosePanel, detailColumnChoosePanel, queryColumnChoosePanel, btnChoosePanel],
            activeItem: 0
        });
        me.callParent(arguments);
    },
    doSave: function (callBack) {
        var me = this;
        //获取按钮信息
        var formPanel = me.down("modelGridForm");
        var btnChoosePanel = me.down("modelButtonSelectedPanel");
        var btnFieldName = btnChoosePanel.getItemId();
        me.initColumnTab.call(formPanel);
        //获取字段信息
        var btnDescData = {};
        btnDescData[btnFieldName] = btnChoosePanel.getSubmitValue();
        var columnDescData = me.getColumnDescData();
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
        var me = this.up("modelGridUpdateDashBord");
        if (!this.getForm().isValid()) {
            return false;
        } else {
            var columnChoosePanels = me.query("modelColumnSelectedPanel");
            var bindModelId = this.down("hidden[name=modelid]").getValue();
            if (bindModelId != me.originalModelId) {
                me.originalModelId = bindModelId;
                //组织原始数据
                var columnDescs = {
                    displayfield: this.down("hiddenfield[name=displayfield]").getValue(),
                    addfield: this.down("hiddenfield[name=addfield]").getValue(),
                    editfield: this.down("hiddenfield[name=editfield]").getValue(),
                    detailfield: this.down("hiddenfield[name=detailfield]").getValue(),
                    queryfield: this.down("hiddenfield[name=queryfield]").getValue()
                };
                //获取字段描述
                OrientExtUtil.AjaxHelper.doRequest(serviceName + "/modelFormView/getModelColumn.rdm", {
                    orientModelId: bindModelId
                }, false, function (resp) {
                    Ext.each(columnChoosePanels, function (panel) {
                        panel.needReconfig = true;
                        panel.columnData = resp.decodedData.results;
                        panel.original = columnDescs[panel.getItemId()];
                        panel.validateModelChange();
                    });
                });
            }
        }
    }
});
