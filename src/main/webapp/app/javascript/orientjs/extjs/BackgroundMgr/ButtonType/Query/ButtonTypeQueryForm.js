/**
 * Created by Administrator on 2016/6/28 0028.
 */
Ext.define('OrientTdm.BackgroundMgr.ButtonType.Query.ButtonTypeQueryForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.buttonTypeQueryForm',
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
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: '按钮类型名称',
                    margin: '0 5 0 0'
                }, {
                    name: 'issystem',
                    xtype: 'combobox',
                    fieldLabel: '是否系统类型',
                    store: {
                        fields: ['id', 'name'],
                        data: [
                            {'id': 1, 'name': '是'},
                            {'id': 0, 'name': '否'}
                        ]
                    },
                    queryModel: 'local',
                    displayField: 'name',
                    valueField: 'id'
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