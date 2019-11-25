/**
 * Created by enjoy on 2016/3/18 0018.
 */
Ext.define('OrientTdm.Common.Extend.Form.OrientForm', {
    extend: 'Ext.form.Panel',
    alternateClassName: 'OrientExtend.Form',
    requires: [
        'OrientTdm.Common.Extend.Form.Field.SimpleColumnDesc',
        'OrientTdm.Common.Extend.Form.Field.TextColumnDesc',
        'OrientTdm.Common.Extend.Form.Field.SingleEnumColumnDesc',
        'OrientTdm.Common.Extend.Form.Field.MultiEnumColumnDesc',
        'OrientTdm.Common.Extend.Form.Field.NumberColumnDesc',
        'OrientTdm.Common.Extend.Form.Field.BooleanColumnDesc',
        'OrientTdm.Common.Extend.Form.Field.RelationColumnDesc',
        'OrientTdm.Common.Extend.Form.Field.FileColumnDesc',
        'OrientTdm.Common.Extend.Form.Field.SingleTableEnumColumnDesc',
        'OrientTdm.Common.Extend.Form.Field.MultiTableEnumColumnDesc',
        'OrientTdm.Common.Extend.Form.Field.DateTimeColumnDesc',
        'OrientTdm.Common.Extend.Form.Field.DateColumnDesc',
        'OrientTdm.Common.Extend.Form.Field.DateColumnDescForSearch',
        'OrientTdm.Common.Extend.Form.Field.DateTimeColumnDescForSearch',
        'OrientTdm.Common.Extend.Form.Field.FileColumnDescForSearch',
        'OrientTdm.Common.Extend.Form.Field.NumberColumnDescForSearch',
        'OrientTdm.Common.Extend.Form.Field.CheckColumnDesc',
        'OrientTdm.Common.Extend.Form.Field.DynamicFormGridDesc',
        'OrientTdm.Common.Extend.Form.Field.FormGridForSearch',
        'OrientTdm.Common.Extend.Form.Field.SimpleColumnDescForSelector',
        'OrientTdm.Common.Extend.Form.Common.ManyToManyModelDataDetailPanel'
    ],
    alias: 'widget.orientForm',
    frame: false,
    bodyPadding: 10,
    layout: 'anchor',
    //autoHeight: true,
    autoScroll: true,
    bodyStyle: 'border-width:0 0 0 0; background:transparent',
    //自动生成get set方法
    config: {
        //保存成功后操作
        successCallback: Ext.emptyFn,
        //绑定模型数据库实际名称
        bindModelName: '',
        //保存URL
        actionUrl: '',
        //默认数据Record类型
        originalData: null
    },
    defaults: {
        anchor: '100%',
        msgTarget: 'side'
    },
    defaultType: 'textfield',
    initComponent: function () {
        this.callParent(arguments);
        this.addEvents('saveOrientForm');
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.getForm().getFields().each(function (item) {
            // 如果有自定义事件则绑定
            if(item.columnDesc != undefined && item.columnDesc.listeners != undefined){
                for(var key in item.columnDesc.listeners){
                    item.mon(item, key, item.columnDesc.listeners[key], me);
                }
                item.mon(item, 'specialkey', me.specialkeyPressed, me);
            }
            item.mon(item, 'specialkey', me.specialkeyPressed, me);
        });
        me.mon(me, 'saveOrientForm', Ext.Function.createInterceptor(me.saveOrientForm, me.customValidate, me), me);
    },
    afterRender: function () {
        this.callParent();
        if (!Ext.isEmpty(this.originalData)) {
            //如果有默认数据
            if (this.originalData instanceof Ext.data.Model) {
                this.getForm().loadRecord(this.originalData);
            }
            else {
                this.getForm().setValues(this.originalData);
            }
        }
    },
    saveOrientForm: function (extraParams, callBackArguments) {
        extraParams = extraParams || {};
        var me = this;
        var form = this.getForm();
        if (form.isValid()) {
            //准备提交数据
            if (!Ext.isEmpty(this.originalData)) {
                if (this.originalData instanceof Ext.data.Model) {
                    me.formValue = Ext.apply(me.originalData.getData(), OrientExtUtil.FormHelper.generateFormData(form));
                }
                else {
                    me.formValue = Ext.apply(me.originalData, OrientExtUtil.FormHelper.generateFormData(form));
                }
            } else
                me.formValue = OrientExtUtil.FormHelper.generateFormData(form);
            //拼接模型参数
            Ext.apply(extraParams, {
                formData: Ext.encode({
                    fields: me.formValue
                })
            });
            if (me.modelDesc && me.modelDesc.modelId) {
                extraParams.modelId = me.modelDesc.modelId;
            }
            form.submit({
                clientValidation: true,
                url: me.actionUrl,
                waitTitle: '提示',
                waitMsg: '保存中，请稍后...',
                params: extraParams,
                success: function (form, action) {
                    //ExtEnvironment.jsp的globalExtAjaxSetting已经做了消息提示的处理，这里只需要回调就可以了
                    if (me.getSuccessCallback()){
                        me.getSuccessCallback().apply(me, [action.result, callBackArguments]);
                    }
                },
                failure: function (form, action) {
                    switch (action.failureType) {
                        case Ext.form.action.Action.CLIENT_INVALID:
                            OrientExtUtil.Common.err('失败', '表单存在错误');
                            break;
                        case Ext.form.action.Action.CONNECT_FAILURE:
                            OrientExtUtil.Common.err('失败', '无法连接服务器');
                            break;
                        case Ext.form.action.Action.SERVER_INVALID:
                            OrientExtUtil.Common.err('失败', action.result.msg);
                    }
                }
            });
        } else
            OrientExtUtil.Common.err('错误', '表单存在错误!');
    },
    specialkeyPressed: function (field, e) {
        if (e.getKey() == Ext.EventObject.ENTER && !Ext.isEmpty(this.getActionUrl())) {
            this.fireEvent('saveOrientForm');
        }
    },
    customValidate: function () {
        //自定义校验
        return true;
    },
    getFormData: function () {
        //获取表单待保存数据
        var me = this;
        var retVal = {};
        var form = this.getForm();
        if (form.isValid() && this.customValidate()) {
            //准备提交数据
            if (!Ext.isEmpty(this.originalData)) {
                if (this.originalData instanceof Ext.data.Model) {
                    me.formValue = Ext.apply(me.originalData.getData(), OrientExtUtil.FormHelper.generateFormData(form));
                }
                else {
                    me.formValue = Ext.apply(me.originalData, OrientExtUtil.FormHelper.generateFormData(form));
                }
            } else
                me.formValue = OrientExtUtil.FormHelper.generateFormData(form);
            //拼接模型参数
            Ext.apply(retVal, {
                fields: Ext.encode(me.formValue)
            });
        }
        return retVal;
    }
});