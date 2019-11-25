/**
 * Created by enjoy on 2016/4/18 0018.
 */
Ext.define("OrientTdm.Common.Extend.Button.Override.DetailModelDataButton", {
    extend: 'OrientTdm.Common.Extend.Button.OrientButton',
    config: {
        record: "",
        opreationType:""
    },
    //按钮点击时触发事件
    triggerClicked: function (modelGridPanel) {
        var me = this;
        //如果有选中记录
        if (me.record || OrientExtUtil.GridHelper.hasSelectedOne(modelGridPanel)) {
            //创建新增表单面板
            me.customPanel = me.createModelForm(modelGridPanel, me.btnDesc);
            me.callParent(arguments);
        }
    },
    createModelForm: function (modelGridPanel, btnDesc) {
        var me = this;
        //针对附件 关系属性 枚举属性特殊化处理
        var toModifyRecord = OrientExtUtil.GridHelper.getSelectedRecord(modelGridPanel)[0];
        if (me.record) {
            toModifyRecord = me.record;
        }
        var retVal;
        var btn = {
            itemId: 'back',
            text: '关闭',
            iconCls: 'icon-back',
            scope: me,
            handler: Ext.bind(me.doBack, me, [modelGridPanel], true)
        };
        if (btnDesc && !Ext.isEmpty(btnDesc.formViewId)) {
            retVal = Ext.create('OrientTdm.BackgroundMgr.CustomForm.Common.FreemarkerForm', {
                formViewId: btnDesc.formViewId,
                modelId: modelGridPanel.modelDesc.modelId,
                buttonAlign: 'center',
                dataId: toModifyRecord.raw.ID,
                canOperate: false,
                buttons: [btn]
            });
        } else {
            retVal = Ext.create("OrientTdm.Common.Extend.Form.OrientDetailModelForm", {
                title: '查看【<span style="color: red; ">' + modelGridPanel.modelDesc.text + '</span>】数据',
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [{
                        itemId: 'back',
                        text: '返回',
                        iconCls: 'icon-back',
                        scope: me,
                        handler: Ext.bind(me.doBack, me, [modelGridPanel], true)
                    }]
                }],
                buttonAlign: 'center',
                buttons: [btn],
                successCallback: me.successCallBack,
                bindModelName: modelGridPanel.modelDesc.dbName,
                modelDesc: modelGridPanel.modelDesc,
                originalData: toModifyRecord.raw
            })
            ;
        }
        return retVal;
    }
})
;