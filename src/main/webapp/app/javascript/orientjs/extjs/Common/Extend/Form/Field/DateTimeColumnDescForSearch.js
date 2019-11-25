/**
 * Created by enjoy on 2016/4/26 0026.
 */
Ext.define('OrientTdm.Common.Extend.Form.Field.DateTimeColumnDescForSearch', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.DateTimeColumnDescForSearch',
    config: {
        columnDesc: null
    },
    initComponent: function () {
        var me = this;
        if (Ext.isEmpty(me.columnDesc)) {
            throw("未绑定字段描述");
        }
        Ext.apply(me, {
            layout: 'hbox',
            combineErrors: true,
            name: me.columnDesc.sColumnName,
            defaults: {
                flex: 1,
                labelAlign: 'right'
            },
            items: [
                {
                    xtype: 'datetimefield',
                    fieldLabel: me.columnDesc.text,
                    name: me.columnDesc.sColumnName + "_START",
                    itemId: me.columnDesc.sColumnName + "_START",
                    endDateField: me.columnDesc.sColumnName + "_END",
                    vtype: 'daterange'
                }, {
                    xtype: 'datetimefield',
                    fieldLabel: "到",
                    labelWidth: 50,
                    labelAlign: 'left',
                    margin: '0 5 0 25',
                    name: me.columnDesc.sColumnName + "_END",
                    itemId: me.columnDesc.sColumnName + "_END",
                    startDateField: me.columnDesc.sColumnName + "_START",
                    vtype: 'daterange'
                }
            ]
        });
        me.callParent(arguments);
    },
    createCustomerFilter: function (filterValue) {
        var valueArr = filterValue.split("<!=!>");
        var customerFilter = null;
        if (valueArr.length == 2) {
            var startDateTime = valueArr[0];
            var endDateTime = valueArr[1];
            if (!Ext.isEmpty(startDateTime) || !Ext.isEmpty(endDateTime)) {
                customerFilter = new CustomerFilter(this.columnDesc.sColumnName, CustomerFilter.prototype.SqlOperation.BetweenAnd, "", filterValue);
            }
        }
        return customerFilter;
    }
});