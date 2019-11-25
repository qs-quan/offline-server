/**
 * Created by Administrator on 2016/6/28 0028.
 */
Ext.define('OrientTdm.BackgroundMgr.PVMTemplate.Query.PVMTemplateQueryForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.pvmTemplateQueryForm',
    buttonAlign: 'center',
    layout: 'hbox',
    defaults: {
        flex: 1,
        labelAlign: 'right'
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
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: '名称',
                    margin: '0 5 0 0',
                    labelWidth: 50
                },
                {
                    xtype: 'SimpleColumnDescForSelector',
                    margin: '0 5 0 0',
                    columnDesc: {
                        sColumnName: 'checkmodelid',
                        text: '数据表',
                        editAble: true,
                        selector: "{'selectorType': '2','multiSelect': false,'selectorName': '选择模型'}"
                    }
                },
                {
                    name: 'groupname',
                    xtype: 'textfield',
                    fieldLabel: '所属分组',
                    margin: '0 5 0 0',
                    labelWidth: 70
                },
                {
                    name: 'createuser',
                    xtype: 'textfield',
                    fieldLabel: '创建人',
                    margin: '0 5 0 0',
                    labelWidth: 70
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
        if (me.ownerCt.centerPanel) {
            me.ownerCt.centerPanel.fireEvent("filterByForm", formValue);
        }
    }
});