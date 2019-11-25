/**
 * Created by Administrator on 2016/6/28 0028.
 */
Ext.define('OrientTdm.BackgroundMgr.FreeMarker.FreeMarkerQueryForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.freeMarkerQueryForm',
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
                    fieldLabel: '模板名称',
                    labelWidth:60,
                    margin: '0 5 0 0'
                }, {
                    name: 'type',
                    xtype: 'combobox',
                    fieldLabel: '模板类型',
                    labelWidth:60,
                    store: {
                        fields: ['id', 'name'],
                        data: [
                            {'id': '宏模板', 'name': '宏模板'},
                            {'id': '主表模板', 'name': '主表模板'}
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
                },{
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