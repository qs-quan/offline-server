/**
 * 试验项设备
 */
Ext.define('OrientTdm.TestInfo.ExperimentTypeMgr.MainFrame.TestType.GridPanel.DeviceGridpanel', {
    extend:  'OrientTdm.Common.Extend.Grid.OrientModelGrid',
    alias: 'widget.deviceGridpanel',
    afterInitComponent: Ext.emptyFn,
    config: {
        TPL_SBSYJL: TDM_SERVER_CONFIG.TPL_SBSYJL,
        TPL_SBGZJL: TDM_SERVER_CONFIG.TPL_SBGZJL,
        TPL_SBWXJL: TDM_SERVER_CONFIG.TPL_SBWXJL,
        deviceModelId: '',
        deviceTemplateId : ''
    },
    requires: [
        "OrientTdm.TestResourceMgr.Util.TestResourceUtil",
        'OrientTdm.TestInfo.ExperimentTypeMgr.Support.CustomExtUtil'

    ],

    initComponent: function () {
        var me = this;
        deviceModelId = OrientExtUtil.ModelHelper.getModelId("T_DEVICE",OrientExtUtil.FunctionHelper.getSYZYSchemaId());
        deviceTemplateId = OrientExtUtil.ModelHelper.getTemplateId(deviceModelId,"试验资源管理-公用-设备");

        // 获取已关联的设备Ids
        var ids = CustomExtUtil.RelationModelHelper.getChooseIdsFromMaster(me.mainModelId, me.dataId, deviceModelId, "");
        me.tableName = "T_DEVICE";
        me.modelId = deviceModelId;
        me.hasToolBar = me.hasToolBar != undefined ? me.hasToolBar : true;
        me.ids = ids;
        me.customerFilter = [new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.In, "", ids)];
        me.templateId = deviceTemplateId;
        me.callParent(arguments);
    },

    createToolBarItems: function () {
        var me = this;
        var retVal = me.hasToolBar ? [{
            xtype: "button",
            text: "查询仪器",
            iconCls: 'icon-search',
            handler: function () {
                me._queryDevicesByNameAndType();
            }
        }] : [];

        if(me.hasToolBar && !me.isTemplate){
            retVal.unshift({
                xtype: "button",
                text: "选择",
                iconCls: 'icon-create',
                handler: function () {
                    me._chooseFunction();
                }
            },{
                xtype: "button",
                text: "取消",
                iconCls: 'icon-delete',
                handler: function () {
                    me._deleteFunction();
                }
            });
        }

        return retVal;
    },

    /**
     * 查询仪器设备系统
     * @private
     */
    _queryDevicesByNameAndType: function(){
        OrientExtUtil.WindowHelper.createWindow(Ext.create('OrientTdm.Common.Extend.Panel.OrientPanel',{
            id: "queryDevicesPanel",
            items:[{
                id: "deviceNameLabel",
                margin: '10 0 5 15',
                xtype:'textfield',
                name: "inputLabel",
                width: 300,
                allowBlank: false,
                fieldLabel:'仪器名称',
                emptyText:'输入不可为空'
            },{
                id: "deviceTypeLabel",
                margin: '10 0 5 15',
                xtype:'textfield',
                name: "inputLabel",
                width: 300,
                allowBlank: false,
                fieldLabel:'仪器类型名称',
                emptyText:'输入不可为空'
            }],
            bbar: [{
                xtype: 'tbfill'
            },{
                id: "searchOrConfirmButton",
                xtype: 'button',
                text: '查询',
                iconCls: 'icon-saveAndClose',
                handler: function() {
                    var deviceNameLabel = this.up("#queryDevicesPanel").down("#deviceNameLabel");
                    var deviceTypeLabel = this.up("#queryDevicesPanel").down("#deviceTypeLabel");
                    // 校验是否为空
                    if(!deviceNameLabel.validate() && !deviceTypeLabel.validate()){
                        Ext.Msg.alert("提示", '至少填写一项查询条件！');
                        return;
                    }

                    // 根据查询参数后台

                }
            },{
                xtype: 'tbfill'
            }]
        }), {
            id: "queryDevicesInfoWindow",
            itemId: "queryDevicesInfoWindow",
            title: '查询仪器信息'
        }, 135, 350);
    },

    /**
     * 选择设备或者人员
     * @private
     */
    _chooseFunction: function () {
        var me = this;

        // 仪器设备选择面板
        var customFilters = [];
        if(me.ids != ""){
            customFilters.push(new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.NotIn, "", me.ids))
        }
        var mainPanel = Ext.create('OrientTdm.TestResourceMgr.GeneralEquipmentMgr.ChooseDevicePanel', {
            showSelected: false,
            selectedValue: '',
            customFilters: customFilters,
            multiSelect: true,
            saveAction: function(selectedIds, selectedRecords, selectedInfoMap) {
                /*var dataIds = selectedIds.join(",");*/
                Ext.each(selectedIds, function (dataId) {
                    CustomExtUtil.RelationModelHelper.createUpDateDelete(0,me.mainModelId, me.dataId, me.modelId, dataId);
                });

                // OrientExtUtil.Common.tip('提示','选择设备成功');
                var ids = CustomExtUtil.RelationModelHelper.getChooseIdsFromMaster(me.mainModelId, me.dataId, deviceModelId, "");
                me.customerFilter = [new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.In, "", ids)];
                me.ids =  ids;
                me.store.getProxy().setExtraParam("customerFilter",Ext.encode(me.customerFilter));
                me.fireEvent("refreshGrid");
                chooseWindow.close();
            }
        });

        var chooseWindow = OrientExtUtil.WindowHelper.createWindow(mainPanel, {
            title: '选择设备',
            layout: "fit",
            width: 0.8 * globalWidth,
            height: 0.8 * globalHeight,
            buttonAlign: 'center'
        });
    },

    /**
     * 删除某个记录
     * @private
     */
    _deleteFunction: function () {
        var me = this;
        if (OrientExtUtil.GridHelper.hasSelected(me)) {
            // 删除前进行确认
            Ext.Msg.confirm('提示', '是否删除?',
                function (btn, text) {
                    if (btn == 'yes') {

                        Ext.each(OrientExtUtil.GridHelper.getSelectRecordIds(me), function (dataId) {
                            CustomExtUtil.RelationModelHelper.createUpDateDelete(1,me.mainModelId, me.dataId, me.modelId, dataId);
                        });
                        var ids = CustomExtUtil.RelationModelHelper.getChooseIdsFromMaster(me.mainModelId, me.dataId, deviceModelId, "");
                        me.customerFilter = [new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.In, "", ids)];
                        me.ids =  ids;
                        me.store.getProxy().setExtraParam("customerFilter",Ext.encode(me.customerFilter));
                        me.fireEvent("refreshGrid");
                    }
                }
            );
        }
    }

});