/**
 * Created by Administrator on 2016/8/19 0019.
 */
Ext.define('OrientTdm.TestResourceMgr.EquipmentCalcMgr.AddCalcButton', {
	extend: 'OrientTdm.Common.Extend.Button.OrientButton',
    alias: 'widget.addCalcButton',
    config: {
        TPL_JLSB: TDM_SERVER_CONFIG.TPL_JLSB
    },
    //按钮点击时触发事件
    triggerClicked: function (grid) {
        var me = this;
        var modelDesc = grid.modelDesc;
        var dbName = modelDesc.dbName;
        var schemaId = dbName.split('_')[2];
        var tableName = dbName.substring(0, dbName.indexOf("_"+schemaId));
        var modelId = modelDesc.modelId;
        if (!OrientExtUtil.GridHelper.hasSelectedOne(grid)) {
            return;
        }

        var record = OrientExtUtil.GridHelper.getSelectedRecord(grid)[0];//选择的数据
        var dataId = record.get("ID");

        var calcDbName = "T_JLSB";
        var calcSchemaId = TDM_SERVER_CONFIG.DEVICE_SCHEMA_ID;
        var calcModelId = OrientExtUtil.ModelHelper.getModelId(calcDbName, calcSchemaId);
        var calcTemplateId = OrientExtUtil.ModelHelper.getTemplateId(calcModelId, me.TPL_JLSB);
        var calcDevice = OrientExtUtil.ModelHelper.createDataQuery(calcDbName, calcSchemaId, [
            new CustomerFilter("C_TAB_NAME_"+calcModelId, CustomerFilter.prototype.SqlOperation.Equal, "", tableName),
            new CustomerFilter("C_DATA_ID_"+calcModelId, CustomerFilter.prototype.SqlOperation.In, "", dataId)
        ]);
        if(calcDevice && calcDevice.length>0) {
            OrientExtUtil.Common.tip('提示', "该设备已增加计量，请不要重复操作！");
            return;
        }

        var calcModelDesc;
        OrientExtUtil.AjaxHelper.doRequest(serviceName + "/modelData/getGridModelDesc.rdm", {
            modelId: calcModelId,
            templateId: calcTemplateId,
            isView: 0
        }, false, function (response) {
            calcModelDesc = response.decodedData.results.orientModelDesc;
        });
        var addForm = Ext.create("OrientTdm.Common.Extend.Form.OrientAddModelForm", {
            title: '新增【<span style="color: red; ">' + calcModelDesc.text + '</span>】数据',
            buttonAlign: 'center',
            buttons: [
                {
                    itemId: 'saveAndClose',
                    text: '保存并关闭',
                    scope: me,
                    iconCls: 'icon-saveSingle',
                    handler: function () {
                        addForm.fireEvent("saveOrientForm", {modelId: calcModelId}, true);
                        me.doBack.call(me, grid.ownerCt);
                    }
                },
                {
                    itemId: 'close',
                    text: '关闭',
                    iconCls: 'icon-close',
                    scope: me,
                    handler: Ext.bind(me.doBack, me, [grid], true)
                }
            ],
            successCallback: function() {

            },
            bindModelName: calcModelDesc.dbName,
            actionUrl: serviceName + '/modelData/saveModelData.rdm',
            modelDesc: calcModelDesc,
            listeners: {
                beforerender: function () {
                    var formValue = {};
                    formValue["C_TAB_NAME_"+calcModelId] = tableName;
                    formValue["C_SCHEMA_ID_"+calcModelId] = schemaId;
                    formValue["C_DATA_ID_"+calcModelId] = dataId;
                    formValue["C_SJB_"+calcModelId] = modelDesc.text;
                    addForm.originalData = Ext.apply(addForm.originalData || {}, formValue);
                }
            }
        });
        me.customPanel = addForm;
        me.callParent(arguments);
    }
});