/**
 * Created by Administrator on 2017/7/20 0020.
 */
Ext.define('OrientTdm.Example.Component.DAQDashBord', {
    extend: 'OrientTdm.Collab.common.Component.BaseComponent',
    alias: 'widget.DAQDashBord',
    loadMask: true,
    mixins: {
        MainFormComponent: 'OrientTdm.Common.Extend.Component.MainFormComponent',
        GridRefToMainFormComponent: 'OrientTdm.Common.Extend.Component.GridRefToMainFormComponent'
    },
    requires: [
        'OrientTdm.Example.Component.ResistanceRawDataGrid',
        'OrientTdm.Example.Component.SelfPropelledRawDataGrid',
        'OrientTdm.BackgroundMgr.Quantity.Instance.QuantityInstanceList'
    ],
    config: {
        templateName: '试验任务',
        refPanelcollapsed: true
    },
    initComponent: function () {
        var me = this;
        var items = me.mixins.MainFormComponent.initMainForm.call(me);
        Ext.apply(me, {
            items: items
        });
        me.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
    },
    getComponentOutData: function () {
        var me = this;
        //保存当前试验任务信息
        var testTaskForm = me.down('orientDetailModelForm');
        var formData = testTaskForm.getFormData();
        //增加模型ID
        formData.modelId = testTaskForm.modelDesc.modelId;
        return formData;
    },
    _prepareRefTable: function (mainForm, mainData) {
        var me = this;
        //附件分组
        var mainModelDesc = mainData.orientModelDesc;
        var mainOriginalData = mainData.modelData;
        var mainModelId = mainModelDesc.modelId;
        var mainDataId = mainOriginalData.ID;
        me._prepareDAQ(mainForm, mainModelId, mainDataId);
        me._prepareFile(mainForm, mainModelId, mainDataId);
        var testType = mainOriginalData['C_TESTTYPE_' + mainModelId];
        var itemsMapping = {
            '自航试验': {
                selfPropelledRawDataGrid: '3.数据分析'

            },
            '阻力试验': {
                resistanceRawDataGrid: '3.数据分析'
            }
        };
        //关联信息
        var items = itemsMapping[testType];
        me.mixins.GridRefToMainFormComponent.initRefGrid.call(me, mainForm, mainData, items);
    },
    _prepareFile: function (mainForm, modelId, dataId) {
        OrientExtUtil.AjaxHelper.doRequest(serviceName + "/fileGroup/listByPiId.rdm", {
                node: "root",
                isCustomer: 1
            }, false, function (resp) {
                var groupDesc = resp.decodedData.results;
                var fileDashBord = Ext.create("OrientTdm.DataMgr.FileMgr.ModelFileDashBord", {
                    title: '采集附件',
                    modelId: modelId,
                    dataId: dataId,
                    groupDesc: groupDesc
                });
                var groupField = Ext.create('Ext.form.FieldSet', {
                    title: '2.上传采集数据',
                    collapsible: true,
                    collapsed: true,
                    defaults: {
                        flex: 1
                    },
                    items: [fileDashBord]

                });
                mainForm.add(groupField);
            }
        );
    },
    _prepareDAQ:function(mainForm, modelId, dataId){
        var me = this;
        var instanceGrid = Ext.create('OrientTdm.BackgroundMgr.Quantity.Instance.QuantityInstanceList', {
            modelId: modelId,
            dataId: dataId
        });
        var groupField = Ext.create('Ext.form.FieldSet', {
            title: '1.开始采集',
            collapsible: true,
            defaults: {
                flex: 1
            },
            items: [instanceGrid]

        });
        mainForm.add(groupField);
    }
});