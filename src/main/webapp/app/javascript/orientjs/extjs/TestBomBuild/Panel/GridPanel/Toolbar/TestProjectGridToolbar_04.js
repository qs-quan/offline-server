Ext.define("OrientTdm.TestBomBuild.Panel.GridPanel.Toolbar.TestProjectGridToolbar_04", {
    extend: 'Ext.Base',

    constructor: function (config) {
        var local = this;
        var me = config.scope;
        this.scope = config.scope;

        // 校验权限
        // 判断是否是试验经理
        var isTestManger = false;
        var isDepManger = false;

        // 试验类型
            // 试验项、试验项子节点、试验项-数据（汇总）-实物标识-子节点
        var node = me.treeNode.parentNode;
        var getCollabPowerParam = {};
        // 测试数据导入记录详情数据页面
        var getCollabPowerParam =
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomRoleController/getCollabPower.rdm',
            me.testDatePanel != undefined ? {
                thDataId : me.testDatePanel.rid,
                rwNodeId: me.testDatePanel.nodeId
            }:{
                thDataId : node.parentNode.parentNode.parentNode.raw.dataId,
                rwNodeId: node.raw.id
            }, false, function (response) {
                if (response.decodedData.results == '1') {
                    isTestManger = true;
                } else if (response.decodedData.results == '0') {
                    isDepManger = true;
                }
            }
        );

        var retV = [];
        Ext.each(config.btnArr, function (btn) {
            if (btn.text == "详细" && btn.issystem == 0) {
                btn.itemId = 'PowerDetailButton';
                retV.push(btn);
                return;

            } else if (btn.text == "查询" && btn.issystem == 0) {
                btn.itemId = 'PowerQueryButton';
                retV.push(btn);
                return;

            } else if (btn.text == "查询全部") {
                btn.itemId = 'system_searchAllButton';
                retV.push(btn);
                return;

            } else if(btn.issystem == 0 && me.tableName == "T_SYJ" && btn.text == "新增"){
                btn.itemId = 'PowerAddButton';
                retV.push(btn);
                return;
            }
        });

        // 设备节点-借用
        /*if(me.treeNode.raw.tableName == 'T_DEVICE'){
            retV.push({
                xtype: "button",
                text: "借用",
                iconCls: 'icon-saveAndClose',
                handler: function () {
                    me._borrowFunction();
                }
            });

        }
        else*/ if(me.treeNode.raw.text == "参试品"){
        // 被参试品节点- 新增、选择、删除
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomRoleController/getDeviceBtnPower.rdm',{
                rwNodeId: me.treeNode.parentNode.raw.id
            }, false, function (response) {
                if(response.decodedData.results){
                    retV.push({
                        xtype: "button",
                        text: "选择",
                        iconCls: 'icon-create',
                        itemId: 'chooseButton',
                        handler: function () {
                            local._chooseFunction();
                        }
                    },{
                        xtype: "button",
                        text: "删除",
                        iconCls: 'icon-delete',
                        handler: function () {
                            local._deleteFunction();
                        }
                    });
                }
            });
        }

        this.toolbar = retV;
    },

    /**
     * 借用按钮
     * @private
     */
/*
    _borrowFunction: function () {
        var me = this.scope;

        // 判断是否选择数据
        if (!OrientExtUtil.GridHelper.hasSelected(me)) {
            return;
        } else {
            OrientExtUtil.Common.tip('提示','借用成功');
            return;

            var selectedRecords = OrientExtUtil.GridHelper.getSelectedRecord(me);
            var dataIds = Ext.Array.pluck(Ext.Array.pluck(selectedRecords, 'raw'),'ID');
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/testTaskController/borrowDevice.rdm',{
                dataIds : dataIds
            }, false, function (response) {
                if (response.decodedData.success) {
                    OrientExtUtil.Common.tip('提示','借用成功');
                    me.refreshGridByQueryFilter();
                }
            });
        }

        // 校验所选设备状态是否可借用，并保存所选设备Id
        var dataIds = "";
        Ext.each(OrientExtUtil.GridHelper.getSelectedRecord(me),function (record) {
            // 校验状态
            // TODO 判断语句未完成
            if(record.get("M_ZT") == "已借用"){
                Ext.Msg.alert('提示', record.get("M_BH") + '已被借用！');
                return
            }
            // 保存所选设备Id
            dataIds = dataIds + "," + record.get("id");
        });

        // 发起借用
        dataIds = dataIds.substr(1, dataIds.length);
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/testTaskController/borrowDevice.rdm',{
            dataIds : OrientExtUtil.GridHelper.getSelectRecordIds(me)
        }, false, function (response) {
            if (response.decodedData.success) {
                me.refreshGridByQueryFilter();
            }else{
                OrientExtUtil.Common.tip('提示','设备借用审批发起失败，请联系。。。。！');
            }
        });
    },
*/

    /**
     * 选择参试品按钮
     * @private
     */
    _chooseFunction: function () {
        var me = this.scope;

        var ids = "";
        var node = me.treeNode.raw;
        var syjNodeId = node.id;
        var syjModelId = OrientExtUtil.ModelHelper.getModelId("T_SYJ",OrientExtUtil.FunctionHelper.getSYZYSchemaId());
        OrientExtUtil.AjaxHelper.doRequest(serviceName + "/TbomQueryController/getNodesRelationTableDataIds.rdm", {
            isAll: "1",
            isDataId: "1",
            tableId: syjModelId,
            nodeId: syjNodeId
        }, false, function (response) {
            if (response.decodedData.success) {
                ids = response.decodedData.results;
            }
        });

        // 参试品选择面板
        // 过滤条件：1. 状态可用
        var customFilters = [new CustomerFilter("C_ZT_" + syjModelId, CustomerFilter.prototype.SqlOperation.Equal, "", '0')];
        if(ids != ""){
            // 2. 已选择
            customFilters.push(new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.NotIn, "", ids));
        }

        var chooseWindow = OrientExtUtil.WindowHelper.createWindow(
            Ext.create('OrientTdm.TestResourceMgr.testSyjMgr.ChooseSyjPanel', {
                    showSelected: false,
                    selectedValue: '',
                    customFilters: customFilters,
                    multiSelect: true,
                    saveAction: function(selectedIds, selectedRecords, selectedInfoMap) {
                        var dataIds = selectedIds.join(",");
                        // 更新被选择试验件的状态以及所属试验，存在占用失败的情况：已经被占用了。
                        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/ModelController/updateSyjInfo.rdm',{
                            ztFlag: '1', // 占用
                            syjDataIds : dataIds, // 待变更试验件ids
                            syjNodeId: syjNodeId  // 参试品节点id
                        }, false, function (response) {
                            if (response.decodedData.success) {
                                var newDataIds = response.decodedData.results;
                                if(newDataIds.length < dataIds.length){
                                    OrientExtUtil.Common.tip('提示','部分被选试验件已被占用！');
                                }
                            }
                        });

                        // 根据被选择的试验件增加节点
                        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomInsertController/insertNodeByData.rdm',{
                            pid: syjNodeId,
                            tableName: "T_SYJ",
                            tableId: syjModelId,
                            dataId : dataIds,
                            cj: 5
                        }, false, function (response) {
                            if (response.decodedData.success) {
                                OrientExtUtil.Common.tip('提示','选择参试品成功');
                                me.customerFilter = me.getCustomerFilter();
                                me.store.getProxy().setExtraParam("customerFilter",Ext.encode(me.customerFilter));
                                me.fireEvent("refreshGrid");
                                var childNodes = me.treeNode.childNodes;
                                for (var i = childNodes.length -1; i >= 0; i--) {
                                    me.treeNode.removeChild(childNodes[i]);
                                }
                                me.treeNode.store.reload({node: me.treeNode});
                                chooseWindow.close();

                            }
                        })
                    }
                }
            ), {
                title: '选择参试品',
                layout: "fit",
                width: 0.8 * globalWidth,
                height: 0.8 * globalHeight,
                buttonAlign: 'center'
            }).show();
    },

    /**
     * todo 删除关联关系节点
     * @private
     */
    _deleteFunction: function () {
        var me = this.scope;

        if (OrientExtUtil.GridHelper.hasSelected(me)) {
            // 删除前进行确认
            Ext.Msg.confirm('提示', '是否删除?',
                function (btn, text) {
                    if (btn == 'yes') {
                        var dataIds = OrientExtUtil.GridHelper.getSelectRecordIds(me).join(",");

                        // 取消占用所选参试品，如果能变更试验件属性则变更，不能也不影响继续删除当前参试品关联信息
                        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/ModelController/updateSyjInfo.rdm',{
                            ztFlag: '0', // 取消占用
                            syjDataIds : dataIds, // 待变更试验件ids
                            syjNodeId: me.treeNode.raw.id  // 参试品节点id
                        }, false);

                        // 已删除参试品
                        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomDeleteController/deleteShadowByPnodeAndMasterIds.rdm',{
                            nodeId : me.treeNode.raw.id,
                            type: "T_SYJ",
                            dataIds : dataIds
                        }, false, function (response) {
                            if (response.decodedData.success) {
                                OrientExtUtil.Common.tip('提示','删除成功');
                                var idArray = [];
                                Ext.each(me.customerFilter[0].filterValue.split(","), function (id) {
                                    if (!Ext.Array.contains(dataIds.split(","), id)) {
                                        idArray.push(id);
                                    }
                                });
                                var ids = idArray.join(",");
                                me.customerFilter = [new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.In, "", ids)];
                                me.store.getProxy().setExtraParam("customerFilter",Ext.encode(me.customerFilter));
                                me.treeNode.store.reload({node: me.treeNode});
                                me.refreshGridByQueryFilter();
                            }
                        })
                    }
                }
            );
        }
    }

});