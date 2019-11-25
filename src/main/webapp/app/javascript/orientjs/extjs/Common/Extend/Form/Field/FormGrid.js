/**
 * Created by Administrator on 2016/7/16 0016.
 */
/**
 * 表单中表格基类
 */
Ext.define('OrientTdm.Common.Extend.Form.Field.FormGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.FormGrid',
    isFormField: true,
    alternateClassName: 'OrientExtend.formGrid',
    mixins: {
        CommonField: "OrientTdm.Common.Extend.Form.Field.CommonField"
    },
    config: {
        columnDesc: null
    },
    submitValue: true,
    statics: {},
    padding: '0 0 5 0',
    initComponent: function () {
        var me = this;
        //公用属性初始化
        this.mixins.CommonField.initCommonAttr.call(this, me.columnDesc);
        if (Ext.isEmpty(me.columnDesc)) {
            throw("未绑定字段描述");
        }
        //增加特殊属性
        var plugins = me.createPlugins();
        var store = me.createStore();
        var columns = me.createColumns();
        Ext.apply(me, {
            store: store,
            columns: columns,
            plugins: plugins
        });
        me.callParent(arguments);
    },
    //重载提交数据
    getSubmitData: function () {
        var me = this;
        return me.getGridData();
    },
    getGridData: function () {
        var me = this;
        var data = [];
        me.getStore().each(function (record) {
            var toSaveData = record.data;
            data.push(toSaveData);
        });
        var retVal = {};
        retVal[me.columnDesc.sColumnName] = Ext.encode(data);
        return retVal
    },
    validate: function () {
        return true;
    },
    getName: function () {
        return this.name;
    },
    isValid: function () {
        var me = this;
        return me.disabled || Ext.isEmpty(me.getErrors());
    },
    getErrors: function (value) {
        return [];
    },
    setValue: function (value) {
        var me = this;
        if (!Ext.isEmpty(value)) {
            data = Ext.decode(value);
            me.getStore().loadData(data);
        }
        return me;
    },
    isFileUpload: function () {
        return this.inputType === 'file';
    },
    isDirty: function () {
        var me = this;
        return false;
    },
    clearInvalid: function () {

    }
});