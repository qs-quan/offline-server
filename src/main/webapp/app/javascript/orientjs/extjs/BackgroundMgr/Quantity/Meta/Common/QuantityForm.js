/**
 * Created by enjoy on 2016/4/11 0011.
 */
Ext.define('OrientTdm.BackgroundMgr.Quantity.Meta.Common.QuantityForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.quantityForm',
    requires: [
        'OrientTdm.BackgroundMgr.Quantity.Unit.DataUnitSelectorWin'
    ],
    initComponent: function () {
        var me = this;
        var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
        var buttons = [{
            text: '保存',
            iconCls: 'icon-save',
            handler: function () {
                me.fireEvent("saveOrientForm");
            }
        }];
        if (!me.originalData) {
            buttons.push({
                text: '保存并关闭',
                iconCls: 'icon-saveAndClose',
                handler: function () {
                    me.fireEvent("saveOrientForm", {}, true);
                }
            });
        }
        var dataTypes = Ext.create('Ext.data.Store', {
            fields: ['displayname', 'name'],
            data: [
                {"displayname": "整型", "name": "DT_LONG"},
                {"displayname": "长整型", "name": "DT_LONGLONG"},
                {"displayname": "单精度浮点型", "name": "DT_FLOAT"},
                {"displayname": "双精度浮点型", "name": "DT_DOUBLE"}
            ]
        });
        Ext.apply(this, {
            items: [
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: '名称',
                    margin: '0 0 5 0',
                    afterLabelTextTpl: required,
                    allowBlank: false,
                    vtype: 'unique'
                }, {
                    name: 'datatype',
                    xtype: 'combobox',
                    fieldLabel: '类型',
                    margin: '0 0 5 0',
                    afterLabelTextTpl: required,
                    allowBlank: false,
                    store: dataTypes,
                    queryMode: 'local',
                    displayField: 'displayname',
                    valueField: 'name'
                }, {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    combineErrors: true,
                    name: 'unitSelector',
                    items: [
                        {
                            fieldLabel: '单位',
                            name: 'unitName',
                            margin: '0 0 5 0',
                            xtype: 'textfield',
                            afterLabelTextTpl: required,
                            allowBlank: false
                        },
                        {
                            xtype: 'button',
                            iconCls: 'icon-select',
                            scope: me,
                            itemId: 'selectBtn',
                            width: '22px',
                            handler: me._openSelectorWin
                        },
                        {
                            xtype: 'button',
                            iconCls: 'icon-clear',
                            scope: me,
                            width: '22px',
                            itemId: 'clearBtn',
                            handler: me._clearValue
                        }
                    ]
                }, {
                    xtype: 'hiddenfield',
                    name: 'id'
                }, {
                    xtype: 'hiddenfield',
                    name: 'unitId'
                }
            ],
            buttons: buttons
        });
        me.callParent(arguments);
    },
    _openSelectorWin: function () {
        var me = this;
        var selectWin = Ext.create('OrientTdm.BackgroundMgr.Quantity.Unit.DataUnitSelectorWin', {
            afterSelected: function (unitInfo) {
                for (var key in unitInfo) {
                    me.down('[name=' + key + ']').setValue(unitInfo[key]);
                }
            }
        });
        selectWin.show();
    },
    _clearValue: function () {
        var me = this;
        me.down('[name=unitId]').setValue('');
        me.down('[name=unitName]').setValue('');
    }
});