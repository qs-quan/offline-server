/**
 * Created by enjoy on 2016/4/19 0019.
 */
Ext.define('OrientTdm.Common.Extend.Form.Field.NumberColumnDescForSearch', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.NumberColumnDescForSearch',
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
        //增加标准单位信息
        //初始化单位
        var unit = me.columnDesc.unit;
        var unitComponent = null;
        if (!Ext.isEmpty(unit)) {
            var unitDesc = Ext.decode(unit);
            var baseUnitId = unitDesc.baseUnitId;
            var index = Ext.Array.indexOf(unitDesc.selectorIds, baseUnitId);
            unitComponent = Ext.create("Ext.form.field.Display", {
                padding: '0 0 0 5',
                flex: 0.1,
                value: unitDesc.selectorNames[index]
            });
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
                    xtype: 'numberfield',
                    fieldLabel: me.columnDesc.text,
                    hideTrigger: true,
                    name: me.columnDesc.sColumnName + "_START"
                }, {
                    xtype: 'numberfield',
                    fieldLabel: "到",
                    labelWidth: 50,
                    margin: '0 5 0 25',
                    labelAlign: 'left',
                    hideTrigger: true,
                    name: me.columnDesc.sColumnName + "_END"
                }, unitComponent
            ]
        });
        me.callParent(arguments);
    },
    createCustomerFilter: function (filterValue) {
        var valueArr = filterValue.split("<!=!>");
        var customerFilter = null;
        if (valueArr.length == 2) {
            var startNumber = valueArr[0];
            var endNumber = valueArr[1];
            if (!Ext.isEmpty(startNumber) || !Ext.isEmpty(endNumber)) {
                customerFilter = new CustomerFilter(this.columnDesc.sColumnName, CustomerFilter.prototype.SqlOperation.BetweenAnd, "", filterValue);
            }
        }
        return customerFilter;
    }
});