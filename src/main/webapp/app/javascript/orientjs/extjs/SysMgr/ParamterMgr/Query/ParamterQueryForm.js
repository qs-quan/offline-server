/**
 * Created by Administrator on 2016/6/28 0028.
 */
Ext.define('OrientTdm.SysMgr.ParamterMgr.Query.ParamterQueryForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.paramterQueryForm',
    buttonAlign: 'center',
    layout: 'hbox',
    bodyStyle: 'border-width:0 0 0 0; background:transparent',
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
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: '参数名称',
                    margin: '0 5 0 0'
                }, {
                    name: 'value',
                    xtype: 'textfield',
                    fieldLabel: '参数值'
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
            me.ownerCt.centerPanel.fireEvent("filterByFilter", formValue);
        }
    }
});