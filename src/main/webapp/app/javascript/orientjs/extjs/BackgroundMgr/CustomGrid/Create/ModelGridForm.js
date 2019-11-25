/**
 * Created by enjoy on 2016/4/6 0006.
 */
Ext.define('OrientTdm.BackgroundMgr.CustomGrid.Create.ModelGridForm', {
    extend: "OrientExtend.Form",
    alias: 'widget.modelGridForm',
    initComponent: function () {
        var me = this;
        var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
        Ext.apply(me, {
            title: '基本信息',
            items: [
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: '模板标题',
                    labelAlign: 'right',
                    afterLabelTextTpl: required,
                    labelWidth: 100,
                    allowBlank: false
                },
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    combineErrors: true,
                    defaults: {
                        flex: 1,
                        labelAlign: 'right'
                    },
                    items: [
                        {
                            xtype: 'SimpleColumnDescForSelector',
                            margin: '0 5 0 0',
                            columnDesc: {
                                sColumnName: 'modelid',
                                text: '绑定数据库模型',
                                isRequired: true,
                                editAble: Ext.isEmpty(me.originalData),
                                selector: "{'selectorType': '2','multiSelect': false,'selectorName': '选择模型'}"
                            }
                        }, {
                            name: 'extendclass',
                            xtype: 'textfield',
                            fieldLabel: '自定义扩展类'
                        }
                    ]
                },
                {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    combineErrors: true,
                    defaults: {
                        flex: 1,
                        labelAlign: 'right'
                    },
                    items: [
                        {
                            xtype: 'radiogroup',
                            fieldLabel: '是否包含分页',
                            items: [
                                {boxLabel: '分页', name: 'needpage', checked: true, inputValue: "1"},
                                {boxLabel: '不分页', name: 'needpage', inputValue: "0"}
                            ]
                        }, {
                            name: 'pagesize',
                            xtype: 'numberfield',
                            fieldLabel: '分页大小',
                            allowBlank: false,
                            afterLabelTextTpl: required,
                            value: 25
                        }
                    ]
                },
                {
                    xtype: 'hiddenfield',
                    name: 'id'
                },
                {
                    xtype: 'hiddenfield',
                    name: 'displayfield'
                },
                {
                    xtype: 'hiddenfield',
                    name: 'addfield'
                },
                {
                    xtype: 'hiddenfield',
                    name: 'editfield'
                },
                {
                    xtype: 'hiddenfield',
                    name: 'detailfield'
                },
                {
                    xtype: 'hiddenfield',
                    name: 'queryfield'
                },
                {
                    xtype: 'hiddenfield',
                    name: 'btns'
                }
            ]
        });
        me.callParent(arguments);
    }
});