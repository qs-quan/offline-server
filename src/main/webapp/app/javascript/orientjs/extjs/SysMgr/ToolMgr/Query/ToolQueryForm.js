/**
 * Created by Administrator on 2016/6/28 0028.
 */
Ext.define('OrientTdm.SysMgr.ToolMgr.Query.ToolQueryForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.toolQueryForm',
    buttonAlign: 'center',
    layout: 'hbox',
    bodyStyle: 'border-width:0 0 0 0; background:transparent',
    defaults: {
        flex: 1
    },
    config: {
        belongGroupId: ""
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
                    name: 'toolName',
                    xtype: 'textfield',
                    fieldLabel: '工具名称',
                    margin: '0 5 0 0'
                }, {
                    name: 'toolType',
                    xtype: 'textfield',
                    fieldLabel: '工具类型'
                }, {
                    xtype: 'hiddenfield',
                    name: 'groupId',
                    value: me.belongGroupId
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