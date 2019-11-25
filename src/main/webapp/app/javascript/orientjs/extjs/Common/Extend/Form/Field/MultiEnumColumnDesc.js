/**
 * Created by enjoy on 2016/4/19 0019.
 */
Ext.define('OrientTdm.Common.Extend.Form.Field.MultiEnumColumnDesc', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.MultiEnumColumnDesc',
    mixins: {
        CommonField: "OrientTdm.Common.Extend.Form.Field.CommonField"
    },
    config: {
        columnDesc: null
    },
    initComponent: function () {
        var me = this;
        if (Ext.isEmpty(me.columnDesc)) {
            throw("未绑定字段描述");
        }
        //公用属性初始化
        this.mixins.CommonField.initCommonAttr.call(this, me.columnDesc);
        //初始化特殊属性
        var enumData = me.columnDesc.aryOptions;
        if (enumData) {
            var data = [];
            for (var value in enumData) {
                var displayValue = enumData[value];
                data.push({
                    id: value,
                    value: displayValue
                });
            }
            var store = Ext.create("Ext.data.Store", {
                fields: [
                    'id', 'value'
                ],
                data: data
            });
            Ext.apply(me, {
                store: store,
                queryMode: 'local',
                displayField: 'value',
                valueField: 'id',
                multiSelect: true,
                listeners: {
                    "focus": function (e) {
                        if (!me.readOnly) {
                            e.expand();
                            this.doQuery(this.allQuery, true);
                        }
                    },
                    buffer: 200
                }
            });
        }
        me.callParent(arguments);
    },
    getSubmitValue: function () {
        var realValue = "";
        var value = this.getValue();
        if (Ext.isEmpty(value)) {
            value = '';
        } else {
            realValue = value.join(';');
        }
        return realValue;
    },
    setValue: function (value, doSelect) {
        if (value && typeof(value) == 'string') {
            var store = this.getStore();
            var displayArray = value.split(";");
            var converedValue = [];
            Ext.each(displayArray, function (displayValue) {
                var record = store.findRecord("value", displayValue);
                if (record) {
                    converedValue.push(record);
                }
            });
            value = converedValue;
        }
        this.callParent(arguments);
    },
    createCustomerFilter: function (filterValue) {
        if(Ext.isEmpty(filterValue)){
            return null;
        }
        var customerFilter = new CustomerFilter(this.columnDesc.sColumnName, CustomerFilter.prototype.SqlOperation.Contains, "", filterValue);
        return customerFilter;
    }
});