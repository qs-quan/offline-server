/**
 * Created by enjoy on 2016/4/19 0019.
 */
Ext.define('OrientTdm.Common.Extend.Form.Field.DateColumnDesc', {
    extend: 'Ext.form.field.Date',
    alias: 'widget.DateColumnDesc',
    editable: false,
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
        Ext.apply(me, {
            format: 'Y-m-d',
            listeners: {
                // "focus": function () {
                //     if (!me.readOnly) {
                //         me.expand();
                //     }
                // },
                // "blur": function () {
                //     me.collapse();
                // }
            }
        });
        me.callParent(arguments);
    }
});
