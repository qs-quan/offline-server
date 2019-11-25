/**
 * Created by Seraph on 16/8/29.
 */
/**
 * Created by enjoy on 2016/5/3 0003.
 */
Ext.define('OrientTdm.Collab.MyTask.dataTask.DataTaskQueryPanel', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    buttonAlign: 'center',
    initComponent: function () {
        var me = this;
        Ext.apply(this, {
            items: [
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    combineErrors: true,
                    defaults: {
                        flex: 1
                    },
                    items: [
                        {
                            name: 'startDate',
                            xtype: 'datefield',
                            fieldLabel: '开始时间',
                            margin: '0 5 0 0',
                            flex: 0.5
                        }, {
                            name: 'endDate',
                            xtype: 'datefield',
                            labelWidth: 30,
                            fieldLabel: '至',
                            flex: 0.5
                        }
                    ]
                }
            ],
            buttons: [
                {
                    text: '查询',
                    iconCls: 'icon-query',
                    handler: function () {
                        me._doQuery();
                    }
                },
                {
                    text: '清空',
                    iconCls: 'icon-clear',
                    handler: function () {
                        this.up('form').getForm().reset();
                        me._doQuery();
                    }
                }
            ]
        });
        me.callParent(arguments);
    },
    _doQuery: function () {
        var me = this;
        var formValue = OrientExtUtil.FormHelper.generateFormData(me.getForm());
        if (me.ownerCt.centerPanel) {
            me.ownerCt.centerPanel.fireEvent("filterByFilter", formValue);
        }
    }
});