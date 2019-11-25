/**
 * Created by FZH  on 2016/10/24.
 */
Ext.define('OrientTdm.TestResourceMgr.EquipmentCalcMgr.CalcEquipmentGrid', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientModelGrid',
    alias: 'widget.CalcEquipmentGrid',
    config: {
        TPL_SBJLJL: TDM_SERVER_CONFIG.TPL_SBJLJL,
        queryUrl: serviceName + "/resourceMgr/getCalcModelData.rdm"
    },
    requires: [

    ],
    initComponent: function () {
        var me = this;
        me.queryUrl = serviceName + "/resourceMgr/getCalcModelData.rdm";
        this.callParent(arguments);
    },
    afterInitComponent: function () {
        var me = this;
        var toolbar = me.dockedItems[0];
        toolbar.add({
            text: '计量记录',
            handler: me._doCalcRecordClicked,
            icon: serviceName + '/app/images/icons/default/modeldata/addCommonCheckItem.png',
            scope: me
        });
        me.modelDesc.disAbleModifyColumns = ["C_XCJYRQ"];
        me.modelDesc.disAbleAddColumns = ["C_XCJYRQ"];

        me.viewConfig.getRowClass = function (record, rowIndex, rowParams, store) {
            var modelId = me.modelId;
            var nextDateBefore = record.data['C_XCJYRQ_' + modelId];
            if(!nextDateBefore) {
                return "";
            }
            var nextDateStr = nextDateBefore.split('-');
            var nextDate = new Date(nextDateStr[0], parseInt(nextDateStr[1])-1, nextDateStr[2]);
            var nowDate = new Date();
            var diffDay = (nextDate-nowDate) / (24*3600*1000);
            var flag = "";
            if (diffDay > 0 && diffDay <= 10) {
                flag = 'x-grid-record-yellow';
            }
            else if (diffDay <= 0) {
                flag = 'x-grid-record-red';
            }
            return flag;
        };
        //排序
        me.getStore().sort([{
            "property":"C_XCJYRQ_"+me.modelId,
            "direction":"ASC"
        }]);
    },
    afterRender: function() {
        var me = this;
        this.callParent(arguments);

        var treeNode = me.bindNode;
        var tbomModels = treeNode.raw.tBomModels;
    },
    _doCalcRecordClicked: function (toolbar) {
        var me = this;
        var schemaId = me.modelDesc.dbName.split('_')[2];
        if (!OrientExtUtil.GridHelper.hasSelectedOne(me)) {
            return;
        }

        var selectedRecord = OrientExtUtil.GridHelper.getSelectedRecord(me);//选择的数据
        var deviceId = selectedRecord[0].get('id');//主表ID

        var filterColumnName = "T_JLSB_" + schemaId + "_ID";//主表表名ID
        var customerFilter = new CustomerFilter(filterColumnName, CustomerFilter.prototype.SqlOperation.In, "", deviceId);//过滤条件
        var tableName = "T_SBJLJL";
        var modelId = OrientExtUtil.ModelHelper.getModelId(tableName, schemaId);
        var templateId = OrientExtUtil.ModelHelper.getTemplateId(modelId, me.TPL_SBJLJL);
        var modelGrid = Ext.create("OrientTdm.Common.Extend.Grid.OrientModelGrid", {
            region: 'center',
            modelId: modelId,
            isView: 0,
            templateId: templateId,
            customerFilter: [customerFilter],
            afterInitComponent: function () {
                var that = this;
                that.modelDesc.disAbleModifyColumns = [filterColumnName];
                that.modelDesc.disAbleAddColumns = [filterColumnName];
                var toolbar = that.dockedItems[0];
                var addButton = toolbar.child('[text=新增]');
                if(addButton){
                    Ext.Function.interceptAfter(addButton, 'handler', function (button) {
                        //新增表单出现后 相关定制
                        var customPanel = button.orientBtnInstance.customPanel;
                        if (customPanel) {
                            var formValue = {};
                            var refValue = {
                                name: selectedRecord[0].data['C_JLBH_' + me.modelDesc.modelId],
                                id: deviceId
                            };
                            formValue[filterColumnName + '_display'] = Ext.encode([refValue]);
                            formValue[filterColumnName] = deviceId;
                            customPanel.getForm().setValues(formValue);
                            //注入额外参数
                            //customPanel.originalData = Ext.apply(customPanel.originalData || {}, {});
                        }
                    });
                }
            }
        });

        var mainPanel = Ext.create("OrientTdm.Common.Extend.Panel.OrientPanel", {
            layout: "border",
            padding: '0 0 0 0',
            deferredRender: false,
            items: [modelGrid]
        });

        var tableDisplayName = me.modelDesc.text;//表的名称
        OrientExtUtil.WindowHelper.createWindow(mainPanel, {
            title: '查看【<span style="color: red; ">' + tableDisplayName + '</span>】计量记录',
            layout: "fit",
            width: 0.8 * globalWidth,
            height: 0.8 * globalHeight,
            buttonAlign: 'center',
            buttons: [
                {
                    text: '关闭',
                    iconCls: 'icon-back',
                    handler: function (btn) {
                        btn.up('window').close();
                    }
                }
            ],
            listeners: {
                close: function() {
                    if (me.hasListener('customRefreshGrid')) {
                        //如果存在自定义刷新事件
                        me.fireEvent('customRefreshGrid');
                    } else {
                        //否则调用默认刷新事件
                        me.fireEvent('refreshGridByCustomerFilter');
                    }
                }
            }
        });
    }
});