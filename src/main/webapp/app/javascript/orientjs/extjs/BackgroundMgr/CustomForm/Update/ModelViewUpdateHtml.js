/**
 * Created by enjoy on 2016/3/23 0023.
 * 修改模型表单
 */
Ext.define('OrientTdm.BackgroundMgr.CustomForm.Update.ModelViewUpdateHtml', {
    extend: "OrientTdm.Common.Extend.Panel.OrientPanel",
    alias: 'widget.modelViewUpdateHtml',
    requires: [
        'OrientTdm.BackgroundMgr.CustomForm.Common.RefModelTree'
    ],
    config: {
        originalHtml: "",
        bindModelID: -1,
        bindTemplateId: -1,
        originalData: null
    },
    initComponent: function () {
        var me = this;
        //初始化数据
        me.setOriginalHtml(me.getOriginalData().get('html'));
        me.setBindModelID(me.getOriginalData().get('modelid'));
        me.setBindTemplateId(me.getOriginalData().get('templateid'));
        //绑定全局
        window.originalHtml = me.originalHtml;
        var centerPanel = Ext.create("OrientTdm.Common.Extend.Panel.OrientPanel", {
            region: 'center',
            padding: '0 0 0 5',
            layout: 'fit',
            listeners: {
                render: function () {
                    this.add({
                        title: '表单设计',
                        html: '<iframe width="100%" height="100%" marginwidth="0" framespacing="0" marginheight="0" frameborder="0" src = "' +
                        'app/javascript/orientjs/extjs/BackgroundMgr/CustomForm/Common/editor.jsp?' + 'bindModelID=' + me.bindModelID + '&bindTemplateId=' + me.bindTemplateId + '"></iframe>'
                    });
                }
            }
        });
        //模型字段展现
        var columnSelectPanel = Ext.create("OrientTdm.BackgroundMgr.CustomForm.Common.ModelColumnTree", {
            orientModelId: me.bindModelID,
            bindTemplateId: me.bindTemplateId,
            collapsible: false,
            region: 'center',
            width: 250,
            minWidth: 250,
            maxWidth: 250,
            title: '表字段'
        });

        var refModelSelectPanel = Ext.create("OrientTdm.BackgroundMgr.CustomForm.Common.RefModelTree", {
            orientModelId: me.bindModelID,
            region: 'south',
            height: 200,
            width: 250,
            minWidth: 250,
            maxWidth: 250,
            collapsible: false,
            title: '关联模型'
        });

        var sonFunctionPanel = Ext.create("OrientTdm.Common.Extend.Panel.OrientPanel", {
            region: 'west',
            width: 250,
            layout: 'border',
            minWidth: 250,
            maxWidth: 250,
            items: [
                columnSelectPanel, refModelSelectPanel
            ]
        });

        Ext.apply(this, {
            layout: 'border',
            buttons: [{
                text: '预览',
                iconCls: 'icon-previewForm',
                handler: function () {
                    me.preview();
                }
            }, {
                text: '保存',
                iconCls: 'icon-saveSingle',
                handler: function () {
                    me.saveModelView();
                }
            }],
            items: [sonFunctionPanel, centerPanel]
        });

        this.callParent(arguments);
    },
    saveModelView: function () {
        var me = this;
        //获取数据
        var params = me.prepareData();
        //提交
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelFormView/update.rdm', params, true, function (response) {
            if (me.successCallback) {
                me.successCallback.call(me);
            }
        });
    },
    preview: function () {
        var me = this;
        //获取数据
        var params = me.prepareData();
        var itemId = me.getItemId();
        //预览
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelFormView/preview.rdm', params, true, function (response) {
            var respData = response.decodedData;
            window['previewHtml' + itemId] = respData.results;
            //准备表单数据方法
            var saveModelDataFunName = "prepareFormData";
            var previewWin = Ext.create("Ext.Window", {
                items: [
                    {
                        xtype: 'panel',
                        html: '<iframe width="100%" height="100%" marginwidth="0" framespacing="0" marginheight="0" frameborder="0" src = "' + serviceName +
                        '/app/javascript/orientjs/extjs/BackgroundMgr/CustomForm/Common/preview.jsp?funName=' + saveModelDataFunName + '&modelId=' + me.modelId + '&belongItemId=' + itemId + '"></iframe>'
                    }
                ],
                layout: 'fit',
                modal: true,
                buttonAlign: 'center',
                width: 0.7 * globalWidth,
                height: 0.7 * globalHeight,
                buttons: [
                    {
                        text: '关闭',
                        handler: function () {
                            this.up('window').close();
                        }
                    }
                ]
            });
            previewWin.show();

        });
    },
    prepareData: function () {
        var me = this;
        //是否重新生成模板
        var reGenTemplate = 0;
        //获取设计器中表单设计
        var html = editor.getContent();
        if (html != me.originalHtml) {
            me.originalData.set("html", html);
            reGenTemplate = 1;
        }
        //遍历对象
        var params = {
            "reGenTemplate": reGenTemplate,
            dataId: 241
        };
        Ext.iterate(me.originalData.getData(), function (key, value) {
            params[key] = value;
        });
        return params;
    },
    saveModelData: function (formData, callBack) {
        var me = this;
        var params = {
            modelId: me.bindModelID,
            formData: Ext.encode(formData)
        };
        //先校验
        var validateReuslt = me.doValidate(params);
        if (validateReuslt == true) {
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelData/updateModelData.rdm', params, true, function (response) {
                if (callBack) {
                    callBack.call(me);
                }
            });
        }
    },
    doValidate: function (param) {
        var me = this;
        var retVal = true;
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelData/validateAll.rdm', param, false, function (resp) {
            var respData = resp.decodedData;
            if (respData.results != null && respData.results.length > 0) {
                retVal = false;
                var errorMsg = Ext.Array.pluck(respData.results, "errorMsg").join('</br>');
                OrientExtUtil.Common.err(OrientLocal.prompt.error, errorMsg, function () {
                    //Jquery 错误展现
                });
            }
        });
        return retVal;
    }
});
