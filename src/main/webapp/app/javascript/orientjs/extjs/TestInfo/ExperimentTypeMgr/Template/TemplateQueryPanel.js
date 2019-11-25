/**
 *
 */
Ext.define('OrientTdm.TestInfo.ExperimentTypeMgr.Template.TemplateQueryPanel', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    buttonAlign: 'center',
    initComponent: function () {
        var me = this;
        Ext.apply(this, {
            items: [{
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    combineErrors: true,
                    defaults: {
                        flex: 1
                    },
                    items: [{
                            name: 'M_BH',
                            xtype: 'textfield',
                            fieldLabel: '模板名称',
                            margin: '0 5 0 0',
                            flex: 0.5
                        }/*, {
                            name: 'creator',
                            xtype: 'textfield',
                            fieldLabel: '创建人',
                            margin: '0 5 0 0',
                            flex: 0.5
                    }*/]
                }
            ],
            buttons: [{
                    text: '查询',
                    iconCls: 'icon-query',
                    handler: function () {
                        me._doQuery();
                    }
                },{
                    text: '清空',
                    iconCls: 'icon-clear',
                    handler: function () {
                        this.up('form').getForm().reset();
                        me._doQuery();
                    }
            }]
        });
        me.callParent(arguments);
    },

    _doQuery: function () {
        var me = this;
        var formValue = OrientExtUtil.FormHelper.generateFormData(me.getForm());
        if (me.ownerCt.centerPanel) {
            me.ownerCt.centerPanel.filterByFilter(formValue);
        }
    }
});