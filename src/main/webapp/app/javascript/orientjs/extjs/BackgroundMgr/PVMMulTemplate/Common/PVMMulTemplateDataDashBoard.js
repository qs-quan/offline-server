/**
 * Created by qjs on 2016/12/21.
 */
Ext.define('OrientTdm.BackgroundMgr.PVMMulTemplate.Common.PVMMulTemplateDataDashBoard', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.pvmMulTemplateDataDashBord',
    requires: [
        'OrientTdm.BackgroundMgr.PVMMulTemplate.MulPVMDataTree'
    ],
    config: {
        dataId: '',
        actionType:'',
        templateId:'',
        preview:false
    },
    initComponent: function () {
        var me = this;
        var checkModelTree = Ext.create('OrientTdm.BackgroundMgr.PVMMulTemplate.MulPVMDataTree', {
            itemId: 'checkModelTree',
            region: 'west',
            title: '检查模型',
            animCollapse: true,
            width: 260,
            minWidth: 150,
            maxWidth: 400,
            split: true,
            collapsible: true,
            dataId: me.dataId,
            actionType:me.actionType,
            templateId:me.templateId,
            preview:me.preview
        });
        var checkModelData = Ext.create('OrientTdm.Common.Extend.Panel.OrientTabPanel', {
            itemId: 'checkModelData',
            title: '离线数据',
            region: 'center',
            items: [
                {
                    title: '简介',
                    iconCls: 'icon-basicInfo',
                    html: '<h1>数据显示</h1>'
                }
            ]
        });
        Ext.apply(me, {
            layout: 'border',
            items: [checkModelTree, checkModelData]
        });
        me.callParent(arguments);
        me.addEvents('insertTemplateId');
        me.addEvents('deleteEmptyTmpIdData');
    },
    initEvents: function () {
        var me = this;
        me.mon(me, 'insertTemplateId', me.insertTemplateId, me);
        me.mon(me,'deleteEmptyTmpIdData',me.deleteEmptyTmpIdData,me);
        me.callParent(arguments);
    },
    insertTemplateId:function() {
        var me = this;
        //补足数据库中templateId为空的数据
        Ext.Ajax.request({
            url : serviceName + "/PVMMulCheckRelation/insertTemplateId.rdm",
            async: false,
            method : 'POST',
            params : {
                templateId:me.templateId
            },
            success : function(response) {

            }
        });
    },
    deleteEmptyTmpIdData:function() {//删除templateId为空的数据
        var me = this;
        Ext.Ajax.request({
            url : serviceName + "/PVMMulCheckRelation/deleteEmptyTmpIdData.rdm",
            async: false,
            method : 'POST',
            params : {
            },
            success : function(response) {

            }
        });
    }
});