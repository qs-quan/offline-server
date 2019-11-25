/**
 * Created by Seraph on 16/8/29.
 */
/**
 * Created by enjoy on 2016/5/3 0003.
 */
Ext.define('OrientTdm.Collab.MyTask.historyTask.HistoryTaskQueryPanel', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    config: {
        buttonAlign: 'center',
        taskType: null
    },
    initComponent: function () {
        var me = this;

        var typeStores = Ext.create('Ext.data.Store', {
            fields : ['display', 'value'],
            data : [
                {'display' : '计划', 'value' : 'CB_PLAN'},
                {'display' : '审批任务', 'value' : 'audit'},
                {'display' : '协同任务', 'value' : 'collab'},
                {'display' : '数据任务', 'value' : 'dataTask'}
            ]
        });

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
                            fieldLabel: '时间范围',
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
                },
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    combineErrors: true,
                    defaults: {
                        flex: 1
                    },
                    items: [
                        {
                            name: 'name',
                            xtype: 'textfield',
                            fieldLabel: '名称',
                            margin: '0 5 0 0',
                            flex: 0.5
                        }, {
                            name: 'groupType',
                            xtype: 'combo',
                            labelWidth: 30,
                            fieldLabel: '类型',
                            flex: 0.5,
                            store : typeStores,
                            queryMode : 'local',
                            displayField : 'display',
                            valueField : 'value',
                            value: me.taskType,
                            disabled: me.taskType
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