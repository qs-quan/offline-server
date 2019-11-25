/**
 * Created by enjoy on 2016/5/3 0003.
 */
Ext.define('OrientTdm.BackgroundMgr.Statistic.ChartConfig.Common.ChartInstanceForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.chartInstanceForm',
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
                            name: 'name',
                            xtype: 'textfield',
                            fieldLabel: '图形名称',
                            margin: '0 5 0 0',
                            afterLabelTextTpl: required,
                            allowBlank: false
                        }, {
                            name: 'handler',
                            xtype: 'textfield',
                            fieldLabel: '图形前端处理类',
                            afterLabelTextTpl: required,
                            allowBlank: false
                        }
                    ]
                }, {
                    xtype: 'hiddenfield',
                    name: 'id'
                }, {
                    xtype: 'hiddenfield',
                    name: 'belongChartTypeId'
                }
            ],
            buttons: [
                {
                    text: '保存',
                    iconCls: 'icon-save',
                    handler: function () {
                        me.fireEvent("saveOrientForm");
                    }
                }, {
                    text: '保存并关闭',
                    iconCls: 'icon-saveAndClose',
                    handler: function () {
                        me.fireEvent("saveOrientForm", {}, true);
                    }
                }
            ]
        });
        me.callParent(arguments);
    }
});