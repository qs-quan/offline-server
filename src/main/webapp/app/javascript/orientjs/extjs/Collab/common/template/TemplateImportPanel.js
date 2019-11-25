/**
 * Created by Seraph on 16/9/22.
 */
Ext.define('OrientTdm.Collab.common.template.TemplateImportPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    config: {
        modelName: null,
        parentModelName: null,
        parentDataId: null,
        schemaId: null,
        mainTab: null,
        successCallback: Ext.emptyFn()

    },
    initComponent: function () {
        var me = this;

        var centerPanel = Ext.create("OrientTdm.Collab.common.template.TemplateListPanel", {
            region: 'center',
            layout: 'fit',
            personal: true,
            modelName: me.modelName,
            schemaId: me.schemaId,
            mainTab: me.mainTab
        });

        Ext.apply(this, {
            layout: 'border',
            items: [centerPanel],
            tbar: me._getToolbar(),
            centerPanel: centerPanel
        });

        this.callParent(arguments);
    },
    _getToolbar: function (params) {
        var me = this;
        var tools = [];

        tools.push({
            xtype: 'button',
            iconCls: 'icon-import',
            text: '导入',
            handler: Ext.bind(me.importTemplate, me)
        });
        return tools;
    },
    importTemplate: function () {
        var me = this;
        var selection = me.centerPanel.getSelectionModel().getSelection();

        if (selection.length == 0) {
            Ext.Msg.alert("提示", '请选择一条记录');
            return;
        }

        var importParams = {
            modelName: me.modelName,
            parentModelName: me.parentModelName,
            parentDataId: me.parentDataId,
            schemaId: me.schemaId,
            templateId: selection[0].data.id
        };

        var win = new Ext.Window({
            title: '导入模板',
            width: 0.8 * globalWidth,
            height: 0.8 * globalHeight,
            layout: 'fit',
            items: [
                Ext.create("OrientTdm.Collab.common.template.TemplateImportFormPanel", {
                    baseParams: importParams, successCallback: function () {
                        win.close();
                        me.successCallback();
                    }
                })
            ]
        });
        win.show();
    }
});