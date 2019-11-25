/**
 * Created by enjoy on 2016/5/3 0003.
 */
Ext.define("OrientTdm.Common.Extend.Button.Override.ShowFileButton", {
    extend: 'OrientTdm.Common.Extend.Button.OrientButton',
    //按钮点击时触发事件
    triggerClicked: function (modelGridPanel) {
        var me = this;
        //创建附件面板
        if (OrientExtUtil.GridHelper.hasSelectedOne(modelGridPanel)) {
            me.customPanel = me.createFilePanel(modelGridPanel, me.btnDesc);
            me.callParent(arguments);
        }
    },
    createFilePanel: function (modelGridPanel, btnDesc) {
        var me = this;
        var retVal;
        var modelDesc = modelGridPanel.modelDesc;
        var modelId = modelDesc.modelId;
        var dataId = OrientExtUtil.GridHelper.getSelectedRecord(modelGridPanel)[0].get("ID");
        OrientExtUtil.AjaxHelper.doRequest(serviceName + "/fileGroup/listByPiId.rdm", {
                node: "root",
                isCustomer: 1
            }, false, function (resp) {
                var groupDesc = resp.decodedData.results;
                retVal = Ext.create("OrientTdm.DataMgr.FileMgr.ModelFileDashBord", {
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
                    title: '附件',
                    modelId: modelId,
                    dataId: dataId,
                    groupDesc: groupDesc,
                    buttonAlign: 'center',
                    buttons: [
                        {
                            itemId: 'back',
                            text: '关闭',
                            iconCls: 'icon-back',
                            scope: me,
                            handler: Ext.bind(me.doBack, me, [modelGridPanel], true)
                        }
                    ]
                });
            }
        );
        return retVal;
    }
})
;