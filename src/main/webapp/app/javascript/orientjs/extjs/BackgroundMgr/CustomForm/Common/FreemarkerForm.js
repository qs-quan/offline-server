/**
 * Created by Administrator on 2016/8/13 0013.
 */
Ext.define('OrientTdm.BackgroundMgr.CustomForm.Common.FreemarkerForm', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.freemarkerForm',
    minHeight: 350,
    config: {
        formViewId: '',
        modelId: '',
        dataId: '',
        saveUrl: serviceName + '/modelData/create.rdm',
        successCallback: Ext.emptyFn,
        canOperate: true
    },
    initComponent: function () {
        var me = this;
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelFormView/previewByFormViewId.rdm', {
            formViewId: me.formViewId,
            dataId: me.dataId
        }, false, function (response) {
            var respData = response.decodedData;
            if (Ext.isEmpty(respData.results)) {
                OrientExtUtil.Common.tip(OrientLocal.prompt.info, respData.msg);
            } else {
                var itemId = me.getItemId();
                window['previewHtml' + itemId] = respData.results;
                //准备表单数据方法
                var saveModelDataFunName = "prepareFormData";
                me.saveModelDataFunName = saveModelDataFunName;
                var buttons = !me.buttons && me.canOperate == true ? [{
                    text: '关闭',
                    handler: function () {
                        me.up().close();
                    }
                }] : me.buttons;
                Ext.apply(me, {
                    html: '<iframe width="100%" height="100%" marginwidth="0" framespacing="0" marginheight="0" frameborder="0" src = "' + serviceName +
                    '/app/javascript/orientjs/extjs/BackgroundMgr/CustomForm/Common/preview.jsp?funName=' + saveModelDataFunName + '&modelId=' + me.modelId + '&belongItemId=' + itemId + '"></iframe>',
                    layout: 'fit',
                    modal: true,
                    buttonAlign: 'center',
                    buttons: buttons
                });
            }
        });
        this.addEvents({
            saveFreemarkerForm: true
        });
        this.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.mon(me, 'saveFreemarkerForm', me._saveFreemarkerForm, me);
        me.callParent();
    },
    saveModelData: function (formData, modelId, saveUrl) {
        var me = this;
        if (formData != false) {
            var params = {
                modelId: modelId,
                formData: Ext.encode(formData)
            };
            OrientExtUtil.AjaxHelper.doRequest(saveUrl, params, true, function (response) {
                if (me.successCallback) {
                    me.successCallback.call(me);
                }
            });
        }
    },
    _saveFreemarkerForm: function () {
        var me = this;
        var saveModelDataFunName = me.saveModelDataFunName;
        if (window[saveModelDataFunName]) {
            var formData = window[saveModelDataFunName].call(me);
            //加入ID信息
            if (formData != false) {
                if (!Ext.isEmpty(me.dataId)) {
                    formData.fields.ID = me.dataId;
                }
                //保存数据
                me.saveModelData(formData, me.modelId, me.saveUrl);
            } else {
                OrientExtUtil.Common.err(OrientLocal.prompt.error, OrientLocal.prompt.formError);
            }
        }
    }
});