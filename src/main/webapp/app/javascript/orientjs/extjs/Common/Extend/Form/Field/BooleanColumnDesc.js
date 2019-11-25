/**
 * Created by enjoy on 2016/4/19 0019.
 */
Ext.define('OrientTdm.Common.Extend.Form.Field.BooleanColumnDesc', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.BooleanColumnDesc',
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
        var store = Ext.create("Ext.data.Store", {
            fields: [
                'id', 'value'
            ],
            data: [
                {id: '1', value: '是'},
                {id: '0', value: '否'}
            ]
        });
        Ext.apply(me, {
            typeAhead: true,
            typeAheadDelay: 200,
            store: store,
            queryMode: 'local',
            displayField: 'value',
            valueField: 'id',
            editable: false,
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
        //特殊属性
        me.callParent(arguments);
    },
    setValue: function (value, doSelect) {
        var store = this.getStore();
        var realValue = store.findRecord("value", value) ? store.findRecord("value", value).get("id") : value;
        value = realValue;
        this.callParent(arguments);
    },
    createCustomerFilter: function (filterValue) {
        if (Ext.isEmpty(filterValue)) {
            return null;
        }
        var customerFilter = new CustomerFilter(this.columnDesc.sColumnName, CustomerFilter.prototype.SqlOperation.Equal, "", filterValue);
        return customerFilter;
    }
});