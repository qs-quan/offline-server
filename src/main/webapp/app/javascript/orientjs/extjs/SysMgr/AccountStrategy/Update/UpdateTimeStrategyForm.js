/**
 * Created by Administrator on 2016/7/4 0004.
 */
Ext.define('OrientTdm.SysMgr.AccountStrategy.Update.UpdateTimeStrategyForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.updateTimeStrategyForm',
    actionUrl: serviceName + '/AccountStrategy/saveTimneStrategyValue.rdm',
    initComponent: function () {
        var me = this;
        var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
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
                            name: 'strategyValue1',
                            xtype: 'textfield',
                            fieldLabel: '开始时间',
                            margin: '0 5 0 0',
                            afterLabelTextTpl: required,
                            emptyText: '9:00:00',
                            allowBlank: false
                        }, {
                            name: 'strategyValue2',
                            xtype: 'textfield',
                            fieldLabel: '结束时间',
                            afterLabelTextTpl: required,
                            emptyText: '15:00:00',
                            allowBlank: false
                        }
                    ]
                }, {
                    xtype: 'hiddenfield',
                    name: 'id'
                }, {
                    xtype: 'hiddenfield',
                    name: 'strategyName'
                }, {
                    xtype: 'hiddenfield',
                    name: 'strategyNote'
                }, {
                    xtype: 'hiddenfield',
                    name: 'isUse'
                }, {
                    xtype: 'hiddenfield',
                    name: 'type'
                }, {
                    xtype: 'hiddenfield',
                    name: 'strategyValue'
                }
            ],
            buttons: [
                {
                    text: '保存并关闭',
                    iconCls: 'icon-saveAndClose',
                    handler: function () {
                        me.fireEvent("saveOrientForm", {}, true);
                    }
                },
                {
                    text: '保存',
                    iconCls: 'icon-save',
                    handler: function () {
                        me.fireEvent("saveOrientForm");
                    }
                },
                {
                    text: '关闭',
                    iconCls: 'icon-close',
                    handler: function () {
                        this.up('window').close();
                    }
                }
            ]
        });
        me.callParent(arguments);
    }
});