/**
 * Created by enjoy on 2016/4/19 0019.
 */
Ext.define('OrientTdm.Common.Extend.Form.Field.TextColumnDesc', {
    extend: 'Ext.form.field.TextArea',
    alias: 'widget.TextColumnDesc',
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
        // 特殊需求的高度（todo 这样写有点丑陋，height原本是undefined，可能有更好的处理办法）
        if (me.columnDesc.sColumnName.indexOf("M_TJNR_") > -1 && me.columnDesc.sModelName.indexOf("T_SYTJ_") > -1) {
            me.height = 400;
        }
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