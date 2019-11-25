/**
 * Created by Administrator on 2017/7/20 0020.
 * -------------------------------------------
 * MainForm
 * xxx:____________________________________
 * xxx:____________________________________
 * xxx:____________________________________
 * xxx:____________________________________
 * xxx:____________________________________
 * xxx:____________________________________
 *
 * -------------------------------------------
 * RefGrid
 * -------------------------------------------
 * 新增 修改 删除 查询
 * -------------------------------------------
 * xxx | xxx | xxx | xxx| xxx | xxx | xxx |
 * -------------------------------------------
 * 1   | 1  | 1   | 1  |  1   |  1  |  1  |
 *
 * -------------------------------------------
 *
 */
Ext.define('OrientTdm.Common.Extend.Component.GridRefToMainFormComponent', {
    extend: 'Ext.Base',
    alias: 'widget.gridRefToMainFormComponent',
    initRefGrid: function (mainForm, mainData, itemsConfig) {
        var me = this;
        var defaultConfig = {
            mainModelDesc: mainData.orientModelDesc,
            mainData: mainData.modelData
        };
        var panelItems = [];
        for (var key in itemsConfig) {
            var config = {
                region: 'center',
                xtype: key,
                canEdit: !me.isHistory()
            };
            Ext.apply(config, defaultConfig);
            panelItems.push({
                layout: 'fit',
                height: 300,
                title: itemsConfig[key],
                items: [
                    config
                ]
            });
        }
        var tabPanel = Ext.create('OrientTdm.Common.Extend.Panel.OrientTabPanel', {
            items: panelItems,
            activeItem: 0
        });
        var groupField = Ext.create('Ext.form.FieldSet', {
            title: '关联信息',
            collapsible: true,
            collapsed: me.refPanelcollapsed,
            defaults: {
                flex: 1
            },
            items: [tabPanel]

        });
        mainForm.add(groupField);
    }
});