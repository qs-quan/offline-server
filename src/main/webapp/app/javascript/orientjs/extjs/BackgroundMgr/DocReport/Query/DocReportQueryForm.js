/**
 * Created by Administrator on 2016/6/28 0028.
 */
Ext.define('OrientTdm.BackgroundMgr.DocReport.Query.DocReportQueryForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.docReportQueryForm',
    buttonAlign: 'center',
    layout: 'hbox',
    defaults: {
        flex: 1
    },
    layoutConfig: {
        pack: "center",
        align: "stretch"
    },
    initComponent: function () {
        var me = this;
        Ext.apply(this, {
            items: [
                {
                    name: 'reportName',
                    xtype: 'textfield',
                    fieldLabel: '模板名称',
                    margin: '0 5 0 0'
                }, {
                    xtype: 'SimpleColumnDescForSelector',
                    margin: '0 5 0 0',
                    columnDesc: {
                        sColumnName: 'modelId',
                        text: '绑定数据库模型',
                        selector: "{'selectorType': '2','multiSelect': false,'selectorName': '选择模型'}"
                    }
                }
            ],
            buttons: [
                {
                    text: '查询',
                    iconCls: 'icon-query',
                    handler: function () {
                        me.doQuery();
                    }
                },
                {
                    text: '清空',
                    iconCls: 'icon-clear',
                    handler: function () {
                        this.up('form').getForm().reset();
                        me.doQuery();
                    }
                }
            ]
        });
        me.callParent(arguments);
    },
    doQuery: function () {
        var me = this;
        var formValue = OrientExtUtil.FormHelper.generateFormData(me.getForm());
        if (me.ownerCt.centerPanelComponent) {
            me.ownerCt.centerPanelComponent.fireEvent("filterByForm", formValue);
        }
    }
});