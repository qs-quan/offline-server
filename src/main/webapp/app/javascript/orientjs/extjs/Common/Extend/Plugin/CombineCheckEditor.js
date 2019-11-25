/**
 * Created by enjoy on 2016/4/19 0019.
 */
Ext.define('OrientTdm.Common.Extend.Plugin.CombineCheckEditor', {
    extend: 'Ext.form.field.Display',
    alias: 'widget.CombineCheckEditor',
    alternateClassName: 'OrientExtend.CombineCheckEditor',
    config: {},
    msgTarget: 'side',
    submitValue: true,
    statics: {
        switchCheckStatus: function (belongItemId) {
            var field = Ext.getCmp(belongItemId);
            var checkField = Ext.query('input[type=checkbox]', field.getEl().dom)[0];
            var checkedValue = $(checkField).attr('checked');
            var originalData = field.data;
            var splitArray = originalData.split('[orient-mid]');
            if (checkedValue) {
                splitArray[0] = true;
            } else {
                splitArray[0] = false;
            }
            field.data = splitArray.join('[orient-mid]');
        },
        changeText: function (belongItemId) {
            var field = Ext.getCmp(belongItemId);
            var textField = Ext.query('input[type=text]', field.getEl().dom)[0];
            var textFieldValue = $(textField).val();
            var originalData = field.data;
            var splitArray = originalData.split('[orient-mid]');
            splitArray[1] = textFieldValue;
            field.data = splitArray.join('[orient-mid]');
        }
    },
    initComponent: function () {
        var me = this;
        //增加特殊属性
        var itemId = me.getItemId();
        me.data = [];
        //采用模板方式加载数据
        var writeTplArray = [
            '<tpl for=".">',
            '<input type="checkbox" {booleanValue} onclick="OrientExtend.CombineCheckEditor.switchCheckStatus(\'' + itemId + '\')"/>',
            '<input type="text" value="{textValue}" onblur="OrientExtend.CombineCheckEditor.changeText(\'' + itemId + '\')"/>',
            '</tpl>'
        ];
        me.tpl = new Ext.XTemplate(
            writeTplArray
        );
        var value = me.tpl.apply(me.data);
        Ext.apply(me, {
            value: value
        });
        me.callParent(arguments);
    },
    //重载设置值 增加传入文件描述json的支持
    setValue: function (value) {
        var me = this;
        //判断是否需要json转化
        var showValue = value;
        if (!Ext.isEmpty(value)) {
            var splitArray = value.split('[orient-mid]');
            var jsonValue = {
                textValue: splitArray[1],
                booleanValue: splitArray[0] === "true" ? 'checked="true"' : ''
            };
            showValue = me.tpl.apply(jsonValue)
        }
        me.data = value;
        me.setRawValue(me.valueToRaw(showValue));
        return me.mixins.field.setValue.call(me, showValue);
    },
    //重载提交数据
    getSubmitValue: function () {
        var me = this;
        return me.data;
    },
    validate: function () {
        return true;
    },
    getValue: function () {
        var me = this;
        return me.data;
    }
});