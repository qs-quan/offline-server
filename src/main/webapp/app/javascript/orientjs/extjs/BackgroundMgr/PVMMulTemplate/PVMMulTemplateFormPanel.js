/**
 * Created by qjs on 2016/12/20.
 * 综合模板管理中的表单页面
 */
Ext.define('OrientTdm.BackgroundMgr.PVMMulTemplate.PVMMulTemplateFormPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.pvmMulTemplateFormPanel',
    requires: [
        'OrientTdm.BackgroundMgr.PVMMulTemplate.Common.PVMMulTemplateForm',
        'OrientTdm.BackgroundMgr.CustomForm.Query.CustomFormQueryForm'
    ],
    config:{
        actionType:'',
        templateId:'',
        preview:false
    },
    initComponent: function () {
        var me = this;
        if(me.originalData) me.templateId = me.originalData.data.id;
        var formPanel = Ext.create('OrientTdm.BackgroundMgr.PVMMulTemplate.Common.PVMMulTemplateForm', {
            region: 'north',
            actionUrl:me.actionUrl,
            successCallback:me.successCallback,
            originalData:me.originalData,
            height: 120
        });
        //创建中间面板
        var treePanel = Ext.create('OrientTdm.BackgroundMgr.PVMMulTemplate.Common.PVMMulTemplateDataDashBoard', {
            region: 'center',
            actionType:me.actionType,
            templateId:me.templateId,
            padding: '0 0 0 5',
            title: '综合模板',
            preview:me.preview
        });
        var buttons = [];
        if(!me.preview) {
            buttons.push({
                text: '保存',
                iconCls: 'icon-save',
                handler: function () {
                    formPanel.fireEvent("saveMulTemplate");
                }
            });
        }

        if ("create"==me.actionType) {
            buttons.push({
                text: '保存并关闭',
                iconCls: 'icon-saveAndClose',
                handler: function () {
                    formPanel.fireEvent("saveMulTemplateAndClose");
                }
            });
        }

        buttons.push({
            text: '关闭',
            iconCls: 'icon-close',
            handler: function () {
                treePanel.fireEvent("deleteEmptyTmpIdData");
                this.up('window').close();
            }
        });

        Ext.apply(me, {
            layout: 'border',
            items: [
                formPanel, treePanel
            ],
            buttons: buttons,
            northPanel: formPanel,
            centerPanel: treePanel
        });
        me.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent(arguments);
    }
});