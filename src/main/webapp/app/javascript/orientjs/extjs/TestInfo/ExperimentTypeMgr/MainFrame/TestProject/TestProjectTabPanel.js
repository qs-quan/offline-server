/**
 * 试验项的tab
 * Created by dailin on 2019/8/8 9:39.
 */

Ext.define('OrientTdm.TestInfo.ExperimentTypeMgr.MainFrame.TestProject.TestProjectTabPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientTabPanel',

    config: {},
    initComponent: function () {
        var me = this;
        var panels = [];
        // 添加对应panel
        panels.push(me._createTestProjectInfoDetailForm());
        panels.push(me._createTJGrid());
        panels.push(me._createHGPJGrid());
        panels.push(me._createGCGrid());
        Ext.apply(this, {
            items: panels
        });
        me.callParent(arguments);
    },

    /**
     * 试验场地
     * @returns {OrientTdm.TestInfo.ExperimentTypeMgr.MainFrame.TestType.GridPanel.PlaceGrid}
     * @private
     */
    _createTJGrid: function () {
        var me = this;

        return Ext.create('OrientTdm.TestInfo.ExperimentTypeMgr.MainFrame.TestProject.GridPanel.DocGridpanel', {
            title : '试验条件',
            mainModelId: me.mainModelId,
            mainModelName: 'T_RW_INFO',
            dataId: me.dataId,
            region: 'center',
            modelName: 'T_TJ',
            isTemplate: me.isTemplate
        });
    },

    /**
     * 合格判据
     * @returns {OrientTdm.TestInfo.ExperimentTypeMgr.MainFrame.TestType.GridPanel.PlaceGrid}
     * @private
     */
    _createHGPJGrid: function () {
        var me = this;

        return Ext.create('OrientTdm.TestInfo.ExperimentTypeMgr.MainFrame.TestProject.GridPanel.DocGridpanel', {
            title : '合格判据',
            mainModelId: me.mainModelId,
            mainModelName: 'T_RW_INFO',
            dataId: me.dataId,
            region: 'center',
            modelName: 'T_HGPJ',
            isTemplate: me.isTemplate
        });
    },


    /**
     * 试验过程
     * @returns {OrientTdm.TestInfo.ExperimentTypeMgr.MainFrame.TestType.GridPanel.PlaceGrid}
     * @private
     */
    _createGCGrid: function () {
        var me = this;

        return Ext.create('OrientTdm.TestInfo.ExperimentTypeMgr.MainFrame.TestProject.GridPanel.DocGridpanel', {
            title : '试验过程',
            mainModelId: me.mainModelId,
            mainModelName: 'T_RW_INFO',
            dataId: me.dataId,
            region: 'center',
            modelName: 'T_GC',
            isTemplate: me.isTemplate
        });
    },

    /**
     * 基本信息
     * @returns {*}
     * @private
     */
    _createTestProjectInfoDetailForm: function () {
        var me = this;
        var detailInfoForm;
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelData/getGridModelDescAndData.rdm', {
            modelId: me.mainModelId,
            dataId: me.dataId
        }, false, function (response) {
            var modelDesc = response.decodedData.results.orientModelDesc;
            var modelData = response.decodedData.results.modelData;
            detailInfoForm = Ext.create('OrientTdm.Common.Extend.Form.OrientDetailModelForm', {
                bindModelName: modelDesc.dbName,
                modelDesc: modelDesc,
                originalData: modelData
            });
        });

        var ids;
        OrientExtUtil.AjaxHelper.doRequest(serviceName + "/RealtionController/querySlaveIds.rdm", {
            masterTableId: me.mainModelId,
            masterDataId: me.dataId,
            slaveTableId: 'COLLAB_TEMPLATE',
            slaveDataId: ''
        }, false, function (response) {
            if (response.decodedData.success) {
                ids = response.decodedData.results;
            }
        });

        var form = Ext.create('OrientTdm.Common.Extend.Form.OrientForm',{
            title: '基本信息',
            iconCls: 'icon-baseinfo',
            items: [detailInfoForm,{
                xtype: 'fieldset',
                border: '1 1 1 1',
                collapsible: true,
                title: '选择试验流程',
                items: [
                    Ext.create('OrientTdm.Common.Extend.Form.Field.OrientComboBox', {
                        initFirstRecord: false,
                        remoteUrl: serviceName + '/TaskController/getCollabTemplateList.rdm',
                        anchor: '100%',
                        name: 'pdId',
                        fieldLabel: '流程模板',
                        disabled: me.isTemplate,
                        listeners: {
                            change: me._showCollabTemp,
                            scope: me
                        },
                        value: ids
                    })
                ]
            }]
        });

        return form;
    },

    /**
     * 变更协同流程后修改
     * @param scope
     * @param newRecord
     * @param oldRecord
     * @private
     */
    _showCollabTemp: function (scope, newRecord, oldRecord) {
        var me = this;

        // 新增或更新关系
        CustomExtUtil.RelationModelHelper.createUpDateDelete('2', me.mainModelId, me.dataId, "COLLAB_TEMPLATE", newRecord);
        OrientExtUtil.Common.tip('提示','选择流程模板成功');
    }

});