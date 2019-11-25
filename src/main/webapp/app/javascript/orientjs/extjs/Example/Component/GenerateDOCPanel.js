/**
 * Created by Administrator on 2017/7/20 0020.
 */
Ext.define('OrientTdm.Example.Component.GenerateDOCPanel', {
    extend: 'OrientTdm.Collab.common.Component.BaseComponent',
    alias: 'widget.generateDOCPanel',
    loadMask: true,
    mixins: {
        MainFormComponent: 'OrientTdm.Common.Extend.Component.MainFormComponent',
        GridRefToMainFormComponent: 'OrientTdm.Common.Extend.Component.GridRefToMainFormComponent'
    },
    requires: [],
    config: {
        templateName: '试验任务'
    },
    initComponent: function () {
        var me = this;
        var items = me.mixins.MainFormComponent.initMainForm.call(me, {
            buttons: [
                {
                    text: '生成报告',
                    iconCls: 'icon-generateDoc',
                    handler: function () {
                        var mainModelId = me.mainModelId;
                        var mainDataId = me.mainDataId;
                        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/DocReports/list.rdm', {
                            modelId: mainModelId
                        }, true, function (resp) {
                            if (resp.decodedData.results && resp.decodedData.results.length > 0) {
                                var reportId = resp.decodedData.results[0].id;
                                OrientExtUtil.FileHelper.previewDoc(reportId, mainDataId);
                            } else {
                                OrientExtUtil.Common.err(OrientLocal.prompt.error, '未找到相关报告模板');
                            }
                        });
                    }
                }
            ],
            buttonAlign: 'center'
        });
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
        var mainModelDesc = mainData.orientModelDesc;
        var mainOriginalData = mainData.modelData;
        var mainModelId = mainModelDesc.modelId;
        var mainDataId = mainOriginalData.ID;
        me.mainModelId = mainModelId;
        me.mainDataId = mainDataId;
    }
});