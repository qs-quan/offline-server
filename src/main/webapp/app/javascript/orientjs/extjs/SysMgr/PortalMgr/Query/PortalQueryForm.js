/**
 * Created by Administrator on 2016/6/28 0028.
 */
Ext.define('OrientTdm.SysMgr.PortalMgr.Query.PortalQueryForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.portalQueryForm',
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
                    name: 'title',
                    xtype: 'textfield',
                    fieldLabel: '名称',
                    margin: '0 5 0 0'
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
        if (me.ownerCt.centerPanel) {
            me.ownerCt.centerPanel.fireEvent("filterByFilter", formValue);
        }
    }
});