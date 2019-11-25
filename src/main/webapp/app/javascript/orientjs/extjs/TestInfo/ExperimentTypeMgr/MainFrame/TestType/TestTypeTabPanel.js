/**
 * 试验类型的tab
 * Created by dailin on 2019/8/8 9:39.
 */

Ext.define('OrientTdm.TestInfo.ExperimentTypeMgr.MainFrame.TestType.TestTypeTabPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientTabPanel',

    config: {},
    initComponent: function () {
        var me = this;
        var panels = [];
        // 添加对应panel
        panels.push(me._createTestTypeInfoDetailForm());
        /*panels.push(me._createDeviceGrid());
        panels.push(me._createRelationGrid('模板', 'T_SYMB', true));
        panels.push(me._createRelationGrid('试验场地', 'T_SYCD', false));*/
        Ext.apply(this, {
            items: panels
        });
        me.callParent(arguments);
    },

    /**
     * 与相关试验类型的一些普通表的创建
     * @returns {OrientTdm.TestInfo.ExperimentTypeMgr.MainFrame.TestType.GridPanel.TemplateGridpanel}
     * @private
     */
    _createRelationGrid: function (title, modelName, isSpecialSuccessCallBack) {
        var me = this;

        return Ext.create('OrientTdm.TestInfo.ExperimentTypeMgr.MainFrame.TestType.GridPanel.TemplateGridpanel', {
            title : title,
            mainModelId: me.mainModelId,
            dataId: me.dataId,
            modelName: modelName,
            isSpecialSuccessCallBack: isSpecialSuccessCallBack,
            region: 'center',
            usePage : false,
            isTemplate: me.isTemplate
        });
    },

    /**
     * 仪器
     * @returns {OrientTdm.TestInfo.ExperimentTypeMgr.MainFrame.TestType.GridPanel.DeviceGridpanel}
     * @private
     */
    _createDeviceGrid: function () {
        var me = this;
        return Ext.create('OrientTdm.TestInfo.ExperimentTypeMgr.MainFrame.TestType.GridPanel.DeviceGridpanel', {
            mainModelId: me.mainModelId,
            dataId: me.dataId,
            // isShow : true,
            // isView : "0",
            title : '仪器',
            region : 'center',
            usePage : false,
            isTemplate: me.isTemplate
        })
    },

    /**
     * 基本信息
     * @returns {*}
     * @private
     */
    _createTestTypeInfoDetailForm: function () {
        var me = this;
        var detailInfoForm;
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelData/getGridModelDescAndData.rdm', {
            modelId: me.mainModelId,
            dataId: me.dataId
        }, false, function (response) {
            var modelDesc = response.decodedData.results.orientModelDesc;
            var modelData = response.decodedData.results.modelData;
            detailInfoForm = Ext.create('OrientTdm.Common.Extend.Form.OrientDetailModelForm', {
                iconCls: 'icon-baseinfo',
                title: '基本信息',
                bindModelName: modelDesc.dbName,
                modelDesc: modelDesc,
                originalData: modelData
            });
        });
        return detailInfoForm;
    }

});