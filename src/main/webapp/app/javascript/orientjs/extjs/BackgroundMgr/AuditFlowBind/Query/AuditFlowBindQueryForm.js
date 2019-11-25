/**
 * Created by Administrator on 2016/6/28 0028.
 */
Ext.define('OrientTdm.BackgroundMgr.AuditFlowBind.Query.AuditFlowBindQueryForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.auditFlowBindQueryForm',
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
                    name: 'flowName',
                    xtype: 'textfield',
                    fieldLabel: '流程名称',
                    margin: '0 5 0 0'
                }, {
                    name: 'flowVersion',
                    xtype: 'textfield',
                    fieldLabel: '流程版本'
                }
            ],
            buttons: [
                {
                    text: '清空',
                    iconCls: 'icon-clear',
                    handler: function () {
                        this.up('form').getForm().reset();
                        me.doQuery();
                    }
                },
                {
                    text: '查询',
                    iconCls: 'icon-query',
                    handler: function () {
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