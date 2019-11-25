/**
 * Created by enjoy on 2016/4/26 0026.
 */
Ext.define('OrientTdm.Common.Extend.Form.Field.DateColumnDescForSearch', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.DateColumnDescForSearch',
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
                    xtype: 'datefield',
                    fieldLabel: me.columnDesc.text,
                    format: 'Y-m-d',
                    name: me.columnDesc.sColumnName + "_START",
                    itemId: me.columnDesc.sColumnName + "_START",
                    endDateField: me.columnDesc.sColumnName + "_END",
                    vtype: 'daterange',
                    listeners: {
                        "focus": function () {
                            this.expand();
                        },
                        "blur": function () {
                            this.collapse();
                        }
                    }
                }, {
                    xtype: 'datefield',
                    fieldLabel: "到",
                    labelWidth: 50,
                    margin: '0 5 0 25',
                    format: 'Y-m-d',
                    labelAlign: 'left',
                    name: me.columnDesc.sColumnName + "_END",
                    itemId: me.columnDesc.sColumnName + "_END",
                    startDateField: me.columnDesc.sColumnName + "_START",
                    vtype: 'daterange',
                    listeners: {
                        "focus": function () {
                            this.expand();
                        },
                        "blur": function () {
                            this.collapse();
                        }
                    }
                }
            ]
        });
        me.callParent(arguments);
    },
    createCustomerFilter: function (filterValue) {
        var valueArr = filterValue.split("<!=!>");
        var customerFilter = null;
        if (valueArr.length == 2) {
            var startDate = valueArr[0];
            var endDate = valueArr[1];
            if (!Ext.isEmpty(startDate) || !Ext.isEmpty(endDate)) {
                customerFilter = new CustomerFilter(this.columnDesc.sColumnName, CustomerFilter.prototype.SqlOperation.BetweenAnd, "", filterValue);
            }
        }
        return customerFilter;
    }
});