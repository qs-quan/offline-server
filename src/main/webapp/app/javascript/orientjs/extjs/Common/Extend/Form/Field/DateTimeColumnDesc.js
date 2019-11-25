/**
 * Created by enjoy on 2016/4/19 0019.
 */
Ext.define('OrientTdm.Common.Extend.Form.Field.DateTimeColumnDesc', {
    extend: 'OrientTdm.Common.ThirdPart.DateTimeField',
    alias: 'widget.DateTimeColumnDesc',
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
        me.callParent(arguments);
    }
});
