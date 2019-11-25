/**
 * Created by duanduanpan on 16-3-16.
 */
Ext.define('OrientTdm.BackgroundMgr.CustomForm.Create.ModelViewAddHtml', {
    extend: "OrientTdm.Common.Extend.Panel.OrientPanel",
    alias: 'widget.modelViewAddHtml',
    config: {
        bindModelID: -1,
        bindTemplateId: -1
    },
    requires: [
        'OrientTdm.BackgroundMgr.CustomForm.Common.ModelColumnTree',
        'OrientTdm.BackgroundMgr.CustomForm.Common.RefModelTree'
    ],
    initComponent: function () {
        var me = this;
        var centerPanel = Ext.create("OrientTdm.Common.Extend.Panel.OrientPanel", {
            region: 'center',
            padding: '0 0 0 5',
            layout: 'fit',
            listeners: {
                render: function () {
                    this.add({
                        title: '表单设计',
                        html: '<iframe width="100%" height="100%" marginwidth="0" framespacing="0" marginheight="0" frameborder="0" src = "' +
                        'app/javascript/orientjs/extjs/BackgroundMgr/CustomForm/Common/editor.jsp?bindModelID=' + me.bindModelID + '&bindTemplateId=' + me.bindTemplateId + '"></iframe>'
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
            items: [sonFunctionPanel, centerPanel]
        });
        this.callParent(arguments);
    },
    doPreview: function (form) {
        var me = this;
        var params = {
            "reGenTemplate": 1
        };
        Ext.apply(params, OrientExtUtil.FormHelper.generateFormData(form));
        //预览
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelFormView/preview.rdm', params, true, function (response) {
            var respData = response.decodedData;
            window.previewHtml = respData.results;
            //准备表单数据方法
            var saveModelDataFunName = "prepareFormData";
            var previewWin = Ext.create("Ext.Window", {
                html: '<iframe width="100%" height="100%" marginwidth="0" framespacing="0" marginheight="0" frameborder="0" src = "' +
                'app/javascript/orientjs/extjs/BackgroundMgr/CustomForm/Common/preview.jsp?funName=' + saveModelDataFunName + '"></iframe>',
                plain: true,
                layout: 'fit',
                modal: true,
                width: 0.7 * globalWidth,
                height: 0.7 * globalHeight,
                buttons: [
                    {
                        text: '关闭',
                        handler: function () {
                            previewWin.close();
                        }
                    }
                ]
            });
            previewWin.show();

        });
    }
});
