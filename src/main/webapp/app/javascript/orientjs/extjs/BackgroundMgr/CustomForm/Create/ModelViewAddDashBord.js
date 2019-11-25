/**
 * Created by enjoy on 2016/3/18 0018.
 */
Ext.define('OrientTdm.BackgroundMgr.CustomForm.Create.ModelViewAddDashBord', {
    extend: "OrientTdm.Common.Extend.Panel.OrientPanel",
    alias: 'widget.modelViewAddDashBord',
    requires: [
        "OrientTdm.BackgroundMgr.CustomForm.Create.ModelViewAddForm",
        "OrientTdm.BackgroundMgr.CustomForm.Create.ModelViewAddHtml"
    ],
    bindModelName: "",
    successCallback: Ext.emptyFn,
    layout: 'card',
    activeItem: 0,
    initComponent: function () {
        var me = this;
        Ext.apply(this, {
            bbar: ['->', {
                id: 'card-prev',
                iconCls: 'icon-prev',
                text: '上一步',
                handler: Ext.bind(me.doPrevious, me),
                disabled: true
            }, {
                id: 'card-next',
                text: '下一步',
                iconCls: 'icon-next',
                handler: Ext.bind(me.doNext, me)
            }, {
                id: 'card-preview',
                text: '预览',
                iconCls: 'icon-previewForm',
                disabled: true,
                handler: Ext.bind(me.doPreview, me)
            }, {
                id: 'card-save',
                iconCls: 'icon-saveSingle',
                text: '保存',
                disabled: true,
                handler: Ext.bind(me.doSave, me)
            },{
                id:'card-saveAndClose',
                text: '保存并关闭',
                disabled: true,
                iconCls: 'icon-saveAndClose',
                handler: Ext.bind(me.doSaveAndClose, me)
            }],
            items: [
                Ext.create(OrientTdm.BackgroundMgr.CustomForm.Create.ModelViewAddForm, {
                    bindModelName: me.bindModelName,
                    successCallback: function (resp,callBackArguments) {
                        if (me.successCallback) {
                            me.successCallback.call(me,resp,callBackArguments);
                        }
                    }
                })
            ]
        });
        this.callParent(arguments);
    },
    doPrevious: function () {
        var layout = this.getLayout();
        layout.setActiveItem(0);
        this.down('[id=card-next]').setDisabled(false);
        this.down('[id=card-prev]').setDisabled(true);
        this.down('[id=card-save]').setDisabled(true);
        this.down('[id=card-preview]').setDisabled(true);
        this.down('[id=card-saveAndClose]').setDisabled(true);
    },
    doNext: function () {
        var layout = this.getLayout();
        var activeItem = layout.getActiveItem();
        var form = activeItem.getForm();
        if (form.isValid()) {
            //如果包裹的容器为Window 则最大化窗口
            var content = this.findParentByType('window');
            if (content) {
                content.maximize()
            }
            var bindModelID = form.findField("modelid").getValue();
            var bindTemplateId = form.findField("templateid").getValue();
            var nextPanel = layout.getNext();
            if (nextPanel) {
                if (bindModelID != nextPanel.getBindModelID() || bindTemplateId != nextPanel.getBindTemplateId()) {
                    this.remove(nextPanel);
                    this.createFormDesignPanel(bindModelID,bindTemplateId);
                }
            } else {
                this.createFormDesignPanel(bindModelID,bindTemplateId);
            }
            layout.setActiveItem(1);
            this.down('[id=card-next]').setDisabled(true);
            this.down('[id=card-prev]').setDisabled(false);
            this.down('[id=card-preview]').setDisabled(false);
            this.down('[id=card-save]').setDisabled(false);
            this.down('[id=card-saveAndClose]').setDisabled(false);
        }
        else {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.formError);
        }
    },
    createFormDesignPanel: function (bindModelID,bindTemplateId) {
        this.add(Ext.create(OrientTdm.BackgroundMgr.CustomForm.Create.ModelViewAddHtml, {
            bindModelID: bindModelID,
            bindTemplateId: bindTemplateId
        }));
    }
    ,
    doSave: function () {
        var me = this;
        var modelViewForm = me.previewData();
        modelViewForm.fireEvent("saveOrientForm", modelViewForm);
    }
    ,
    doSaveAndClose: function() {
        var me = this;
        var modelViewForm = me.previewData();
        modelViewForm.fireEvent("saveOrientForm", modelViewForm,true);
    }
    ,
    doPreview: function () {
        var me = this;
        var modelViewForm = me.previewData();
        me.down('modelViewAddHtml').doPreview(modelViewForm.getForm());
    }
    ,
    previewData: function () {
        var layout = this.getLayout();
        var modelViewForm = layout.getPrev();
        var form = modelViewForm.getForm();
        var htmlField = form.findField("html");
        var html = editor.getContent();
        htmlField.setValue(html);
        return modelViewForm;
    }
});