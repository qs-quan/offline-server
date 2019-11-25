/**
 * 试验任务的设备的js
 * Created by dailin on 2019/4/9 10:11.
 */
Ext.define('OrientTdm.TestBomBuild.Panel.GridPanel.TaskDeviceGridpanel', {
    extend:  'OrientTdm.Common.Extend.Grid.OrientModelGrid',
    alias: '    widget.taskDeviceGridpanel',
    afterInitComponent: Ext.emptyFn,
    config: {
        TPL_SBSYJL: TDM_SERVER_CONFIG.TPL_SBSYJL,
        TPL_SBGZJL: TDM_SERVER_CONFIG.TPL_SBGZJL,
        TPL_SBWXJL: TDM_SERVER_CONFIG.TPL_SBWXJL
    },
    requires: [
        "OrientTdm.TestResourceMgr.Util.TestResourceUtil"
    ],

    initComponent: function () {
        var me = this;
        me.showAnalysisBtns = false;
        // 获取试验任务子节点【设备】的nodeId
        var sbNodeId = "";
        if(me.isShow){
            sbNodeId = OrientExtUtil.TreeHelper.getChildNode(4, me.nodeId, ["仪器"]);
        }
        // 获取已关联的设备Ids
        var deviceModelId = OrientExtUtil.ModelHelper.getModelId("T_DEVICE",OrientExtUtil.FunctionHelper.getSYZYSchemaId());
        // var deviceTemplateId = OrientExtUtil.ModelHelper.getTemplateId(deviceModelId,"试验资源管理-公用-设备");
        var ids="";
        if(sbNodeId != ""){
            OrientExtUtil.AjaxHelper.doRequest(serviceName + "/TbomQueryController/getNodesRelationTableDataIds.rdm", {
                isAll: "1",
                isDataId: "1",
                tableId: deviceModelId,
                nodeId: sbNodeId
            }, false, function (response) {
                if (response.decodedData.success) {
                    ids = response.decodedData.results;
                }
            });
        }
        me.tableName = "T_DEVICE";
        me.modelId = deviceModelId;
        me.hasToolBar = me.hasToolBar != undefined ? me.hasToolBar : true;
        me.ids = ids;
        me.customerFilter = [new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.In, "", ids)];
        // me.templateId = deviceTemplateId;
        me.pageSize = 25;
        me.sbNodeId = sbNodeId;
        me.callParent(arguments);
    },

    createToolBarItems: function () {
        var me = this;

        if(me.hisTaskDetail != null){
            return [];
        }

        var retV = [];

        var hasModifyPower = false;
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomRoleController/getDeviceBtnPower.rdm',{
            rwNodeId: me.nodeId
        }, false, function (response) {
            hasModifyPower = response.decodedData.results;
        });
        // 获取权限
        if (me.hasToolBar) {
            if (me.onlyBorrowButton) {
                retV.push({
                    xtype: "button",
                    text: "借用",
                    iconCls: 'icon-saveAndClose',
                    handler: function () {
                        me._queryDevices();
                    }
                });
            }

            retV.push({
                xtype: "button",
                text: "查询仪器",
                iconCls: 'icon-search',
                handler: function () {
                    me._queryDevicesByNameAndType();
                }
            });

            if (hasModifyPower) {
                retV.push({
                    xtype: "button",
                    text: "选择",
                    iconCls: 'icon-create',
                    handler: function () {
                        me._chooseFunction();
                    }
                });
                retV.push({
                    xtype: "button",
                    text: "取消",
                    iconCls: 'icon-delete',
                    handler: function () {
                        me._deleteFunction();
                    }
                });
            }

            Ext.each(me.callParent(), function (btn, index) {
                if (btn.text == "详细" && btn.btnDesc.issystem == 0) {
                    btn.itemId = 'PowerDetailButton';
                    retV.push(btn);
                    return;
                }
            });
        }
        return retV;
    },

    /**
     * 查询仪器设备系统
     * @private
     */
    _queryDevicesByNameAndType: function(){
        OrientExtUtil.WindowHelper.createWindow(Ext.create('OrientTdm.Common.Extend.Panel.OrientPanel',{
            id: "queryDevicesPanel",
            items:[{
                id: 'deviceNumberLabl',
                margin: '10 0 5 15',
                xtype: 'textfield',
                name: "inputLabel",
                width: 300,
                // allowBlank: false,
                fieldLabel:'仪器编号',
                emptyText: '请输入'
            },{
                id: "deviceNameLabel",
                margin: '10 0 5 15',
                xtype:'textfield',
                name: "inputLabel",
                width: 300,
                // allowBlank: false,
                fieldLabel:'仪器名称',
                emptyText: '请输入'
            },{
                id: "deviceTypeLabel",
                margin: '10 0 5 15',
                xtype:'textfield',
                name: "inputLabel",
                width: 300,
                // allowBlank: false,
                fieldLabel:'仪器类型名称',
                emptyText: '请输入'
            }],
            bbar: [{
                xtype: 'tbfill'
            },{
                id: "searchOrConfirmButton",
                xtype: 'button',
                text: '查询',
                iconCls: 'icon-saveAndClose',
                handler: function() {
                    var deviceNumberLabl = this.up("#queryDevicesPanel").down("#deviceNumberLabl");
                    var deviceNameLabel = this.up("#queryDevicesPanel").down("#deviceNameLabel");
                    var deviceTypeLabel = this.up("#queryDevicesPanel").down("#deviceTypeLabel");
                    // 校验是否为空
                    if (deviceNumberLabl.getValue() == "" && deviceNameLabel.getValue() == "" && deviceTypeLabel.getValue() == "") {
                        Ext.Msg.alert("提示", '至少填写一项查询条件！');
                        return;
                    }
                    OrientExtUtil.Common.tip('提示', '开发中');
                    // 根据查询参数后台

                }
            },{
                xtype: 'tbfill'
            }]
        }), {
            id: "queryDevicesInfoWindow",
            itemId: "queryDevicesInfoWindow",
            title: '查询仪器信息'
        }, 180, 350);
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
                var dataIds = selectedIds.join(",");

                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomInsertController/insertNodeByData.rdm',{
                    pid: me.sbNodeId,
                    tableName: "T_DEVICE",
                    tableId: me.modelId,
                    dataId : dataIds,
                    cj: 5
                }, false, function (response) {
                    if (response.decodedData.success) {
                        OrientExtUtil.Common.tip('提示','选择设备成功');
                        me.ids =  me.ids + "," + dataIds;
                        if (me.ids.indexOf(",") == 0) {
                            me.ids = me.ids.substr(1);
                        }
                        me.customerFilter = [new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.In, "", me.ids + "," + dataIds)];
                        
                        
                        me.store.getProxy().setExtraParam("customerFilter",Ext.encode(me.customerFilter));
                        if (me.treeNode) {
                            // 重新加载这个节点有时候会没有用，就删除所有子节点重新再加载一次节点
                            var childNodes = me.treeNode.childNodes;
                            for (var i = childNodes.length -1; i >= 0; i--) {
                                me.treeNode.removeChild(childNodes[i]);
                            }
                            me.treeNode.store.reload({node: me.treeNode});
                        }

                        me.fireEvent("refreshGrid");
                        chooseWindow.close();
                    }
                })
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
     * todo
     * 仪器借用
     * @private
     */
    _queryDevices: function () {
        var me = this;
        if (OrientExtUtil.GridHelper.hasSelected(me)) {
            var dataIds = OrientExtUtil.GridHelper.getSelectRecordIds(me).join(",");
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/DeviceController/queryDevices.rdm', {
                dataIds: dataIds
            }, false, function (response) {})
        }
    },

    /**
     * 删除某个记录
     * @private
     */
    _deleteFunction: function () {
        var me = this;
        if (OrientExtUtil.GridHelper.hasSelected(me)) {
            // 删除前进行确认
            Ext.Msg.confirm('提示', '是否取消?',
                function (btn, text) {
                    if (btn == 'yes') {
                        var dataIds = OrientExtUtil.GridHelper.getSelectRecordIds(me).join(",");
                        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomDeleteController/deleteShadowByPnodeAndMasterIds.rdm',{
                            nodeId : me.sbNodeId,
                            type: "T_DEVICE",
                            dataIds : dataIds
                        }, false, function (response) {
                            if (response.decodedData.success) {
                                OrientExtUtil.Common.tip('提示','取消成功');
                                var idArray = [];
                                Ext.each(me.ids.split(","), function (id) {
                                    if(!Ext.Array.contains(dataIds.split(","), id)){
                                        idArray.push(id);
                                    }
                                });
                                me.ids = idArray.join(",");
                                me.customerFilter = [new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.In, "", me.ids)];
                                me.store.getProxy().setExtraParam("customerFilter",Ext.encode(me.customerFilter));
                                // 重新加载这个节点有时候会没有用，就删除所有子节点重新再加载一次节点
                                if (me.treeNode) {
                                    var childNodes = me.treeNode.childNodes;
                                    for (var i = childNodes.length -1; i >= 0; i--) {
                                        me.treeNode.removeChild(childNodes[i]);
                                    }
                                    me.treeNode.store.reload({node: me.treeNode});
                                }
                                me.refreshGridByQueryFilter();
                            }
                        })
                    }
                }
            );
        }
    }

});