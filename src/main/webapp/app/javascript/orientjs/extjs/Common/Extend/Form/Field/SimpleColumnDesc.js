/**
 * Created by enjoy on 2016/4/19 0019.
 */
Ext.define('OrientTdm.Common.Extend.Form.Field.SimpleColumnDesc', {
    extend: 'Ext.form.field.Text',
    alias: 'widget.SimpleColumnDesc',
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
        me.callParent(arguments);
    },
    createCustomerFilter: function (filterValue) {
        if(Ext.isEmpty(filterValue)){
            return null;
        }
        var customerFilter = new CustomerFilter(this.columnDesc.sColumnName, CustomerFilter.prototype.SqlOperation.Like, "", filterValue);
        return customerFilter;
    }
});