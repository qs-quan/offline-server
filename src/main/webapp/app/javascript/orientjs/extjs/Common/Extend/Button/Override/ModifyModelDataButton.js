/**
 * Created by enjoy on 2016/4/18 0018.
 */
Ext.define("OrientTdm.Common.Extend.Button.Override.ModifyModelDataButton", {
    extend: 'OrientTdm.Common.Extend.Button.OrientButton',
    //按钮点击时触发事件
    triggerClicked: function (modelGridPanel) {
        var me = this;
        //构建操作成功函数
        me.successCallBack = function () {
            if (modelGridPanel.hasListener('customRefreshGrid')) {
                //如果存在自定义刷新事件
                modelGridPanel.fireEvent('customRefreshGrid', true);
            } else {
                //否则调用默认刷新事件
                modelGridPanel.fireEvent("refreshGridByQueryFilter");
            }
            modelGridPanel.fireEvent('afterUpdateData', arguments);
            me.doBack();
        };
        //如果有选中记录
        if (OrientExtUtil.GridHelper.hasSelectedOne(modelGridPanel)) {
            //创建新增表单面板
            me.customPanel = me.createModelForm(modelGridPanel, me.btnDesc);
            me.callParent(arguments);
        }
    },
    createModelForm: function (modelGridPanel, btnDesc) {
        var me = this;
        //针对附件 关系属性 枚举属性特殊化处理
        var toModifyRecord = OrientExtUtil.GridHelper.getSelectedRecord(modelGridPanel)[0];
        var retVal;
        var saveUrl = modelGridPanel.getStore().getProxy().api.update;
        if (btnDesc && !Ext.isEmpty(btnDesc.formViewId)) {
            retVal = Ext.create('OrientTdm.BackgroundMgr.CustomForm.Common.FreemarkerForm', {
                formViewId: btnDesc.formViewId,
                modelId: modelGridPanel.modelDesc.modelId,
                buttonAlign: 'center',
                successCallback: me.successCallBack,
                saveUrl: saveUrl,
                dataId: toModifyRecord.raw.ID,
                buttons: [
                    {
                        text: '保存',
                        itemId: 'save',
                        iconCls: 'icon-save',
                        handler: function () {
                            retVal.fireEvent('saveFreemarkerForm');
                        }
                    },
                    {
                        itemId: 'back',
                        text: '返回',
                        iconCls: 'icon-back',
                        scope: me,
                        handler: Ext.bind(me.doBack, me, [modelGridPanel], true)
                    }
                ]
            });
        } else {
            var btnArr = [];

            // 保存按钮绑定自定义事件
            var saveBtn = {
                itemId: 'save',
                text: '保存',
                scope: me,
                iconCls: 'icon-saveSingle',
                handler: Ext.bind(me.doSave, me, [modelGridPanel], true)
            };
            if(modelGridPanel.saveButtonListeners != undefined){
                saveBtn.listeners = modelGridPanel.saveButtonListeners;
            }
            btnArr.push(saveBtn);
            btnArr.push(
                {
                    itemId: 'back',
                    text: '关闭',
                    iconCls: 'icon-back',
                    scope: me,
                    handler: Ext.bind(me.doBack, me, [modelGridPanel], true)
                }
            );

            //创建表单时传入副本值
            var rawData = toModifyRecord.raw;
            var copyData = Ext.decode(Ext.encode(rawData));
            retVal = Ext.create("OrientTdm.Common.Extend.Form.OrientModifyModelForm", {
                title: '修改【<span style="color: red; ">' + modelGridPanel.modelDesc.text + '</span>】数据',
                /*dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [{
                        itemId: 'back',
                        text: '返回',
                        iconCls: 'icon-back',
                        scope: me,
                        handler: Ext.bind(me.doBack, me, [modelGridPanel], true)
                    }]
                }],*/
                buttonAlign: 'center',
                buttons: btnArr,
                successCallback: me.successCallBack,
                bindModelName: modelGridPanel.modelDesc.dbName,
                actionUrl: saveUrl,
                modelDesc: modelGridPanel.modelDesc,
                originalData: copyData,
                listeners:{
                    beforedestroy:function(){
                        //防止点击关闭按钮 引起customPanel引用Bug
                        delete me.customPanel;
                    }
                }
            });
        }
        return retVal;
    }
    ,
    doSave: function (btn, event, modelGridPanel) {
        var me = this;
        btn.up("form").fireEvent("saveOrientForm", {
            modelId: modelGridPanel.modelDesc.modelId
        });
    },
    saveModelData: function (formData, modelId, saveUrl) {
        var me = this;
        var params = {
            modelId: modelId,
            formData: Ext.encode(formData)
        };
        OrientExtUtil.AjaxHelper.doRequest(saveUrl, params, true, function (response) {
            if (me.successCallBack) {
                me.successCallBack.call(me);
            }
        });
    },
    customValidate: function () {
        var formData = OrientExtUtil.FormHelper.getModelData(this);
        var modelId = this.modelDesc.modelId;
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelData/validateAll.rdm', {
            formData: formData,
            modelId: modelId
        }, false, function (resp) {

        });
        return false;
    }
})
;