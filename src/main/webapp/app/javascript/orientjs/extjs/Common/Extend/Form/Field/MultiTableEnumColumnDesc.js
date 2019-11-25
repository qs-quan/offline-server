/**
 * Created by enjoy on 2016/4/19 0019.
 */
Ext.define('OrientTdm.Common.Extend.Form.Field.MultiTableEnumColumnDesc', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.MultiTableEnumColumnDesc',
    alternateClassName: 'OrientExtend.MultiTableEnumColumnDesc',
    mixins: {
        CommonField: "OrientTdm.Common.Extend.Form.Field.CommonField"
    },
    requires: [
        'OrientTdm.Common.Extend.Form.Field.TableEnumColumnDesc'
    ],
    config: {
        columnDesc: null
    },
    initComponent: function () {
        var me = this;
        if (Ext.isEmpty(me.columnDesc)) {
            throw('未绑定字段描述');
        }
        //初始展现框
        var displayFiled = Ext.create('OrientTdm.Common.Extend.Form.Field.TableEnumColumnDesc', {
            columnDesc: me.columnDesc,
            isMulti: true,
            listeners: {
                change: function (field) {
                    var newValue = field.getSubmitValue();
                    me.down('hidden').setValue(newValue);
                }
            }
        });
        //覆盖名称
        displayFiled.name = me.columnDesc.sColumnName + '_display';
        //增加隐藏属性
        var hiddenData = Ext.create('Ext.form.field.Hidden');
        this.mixins.CommonField.initCommonAttr.call(hiddenData, me.columnDesc);
        //生成面板
        Ext.apply(me, {
            layout: 'column',
            combineErrors: true,
            name: me.columnDesc.sColumnName,
            items: [
                displayFiled, hiddenData
            ]
        });
        me.callParent(arguments);
    },
    createCustomerFilter: function (filterValue) {
        return this.down('TableEnumColumnDesc').createCustomerFilter(filterValue);
    }
});