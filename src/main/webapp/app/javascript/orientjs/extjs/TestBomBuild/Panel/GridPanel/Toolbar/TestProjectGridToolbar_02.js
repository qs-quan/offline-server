Ext.define("OrientTdm.TestBomBuild.Panel.GridPanel.Toolbar.TestProjectGridToolbar_02", {
    extend: 'Ext.Base',

    constructor: function (config) {
        var local = this;
        var me = config.scope;
        this.scope = config.scope;

        // 校验权限
        // 判断是否是试验经理
        var isTestManger = false;
        var isDepManger = false;

        if (me.treeNode.raw.cj == '2') {
            var node = me.treeNode;
            var rootNode = node.getOwnerTree().getRootNode();
            while (node.parentNode != rootNode) {
                node = node.parentNode;
            }

            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomRoleController/getCollabPower.rdm', {
                thDataId: node.raw.dataId,
                rwNodeId: ''
            }, false, function (response) {
                if (response.decodedData.results == '1') {
                    isTestManger = true;
                } else if (response.decodedData.results == '0') {
                    isDepManger = true;
                }
            });
        }

        var retV = [];
        Ext.each(config.btnArr, function (btn) {
            if (btn.text == "详细" && btn.issystem == 0) {
                btn.itemId = 'PowerDetailButton';
                retV.push(btn);

            } else if (btn.text == "查询" && btn.issystem == 0) {
                btn.itemId = 'PowerQueryButton';
                retV.push(btn);

            } else if (btn.text == "查询全部") {
                btn.itemId = 'system_searchAllButton';
                retV.push(btn);

            } else if (btn.issystem == 0 && isTestManger && (btn.text == "新增" || btn.text == "修改" || btn.text == "删除")) {
                switch (btn.text) {
                    case '新增':
                        btn.itemId = 'PowerAddButton';
                        break;
                    case '修改':
                        btn.itemId = 'PowerModifyButton';
                        break;
                    case '删除':
                        btn = {
                            xtype: "button",
                            text: "删除",
                            iconCls: 'icon-delete',
                            handler: function () {
                                local._deleteRw();
                            }
                        };

                        break;
                }
                retV.push(btn);
            }
        });

        // 数据表层级
        if (isTestManger) {
            retV.push({
                    xtype: "button",
                    itemId: "setMan",
                    text: '<span style="color:red">设置负责人</span>',
                    iconCls: 'icon-createbyimport',
                    handler: function () {
                        me.isSetFzr = true;
                        Ext.create('OrientTdm.TestBomBuild.Button.PowerModifyButton', {
                            title: "设置负责人"
                        }).triggerClicked(me);
                    }
                }, {
                    xtype: "button",
                    text: "设置流程模板",
                    iconCls: 'icon-createbyimport',
                    handler: function () {
                        local._setCollabTemaplte(me);
                    }
                }, {
                    xtype: "button",
                    text: "配置项目测试记录表",
                    iconCls: 'icon-createbyimport',
                    handler: function () {
                        local._setProjectTestRecordTable();
                    }
                }, {
                    xtype: 'button',
                    text: '<span style="color:red">下发任务</span>',
                    iconCls: 'icon-startTestTask',
                    handler: function () {
                        local._startCollab(me);
                    }
                }
            );
        }
        var bt1, bt2, bt3, bt4, bt5, bt6, bt7, bt8, bt9;
        for (i = 0; i < retV.length; i++) {
            if (retV[i].text == '新增') {
                bt1 = retV[i];
            } else if (retV[i].text == '删除') {
                bt2 = retV[i];
            } else if (retV[i].text == '修改') {
                bt3 = retV[i];
            } else if (retV[i].text == '查询') {
                bt4 = retV[i];
            } else if (retV[i].text == '查询全部') {
                bt5 = retV[i];
            } else if (retV[i].text == '设置流程模板') {
                bt6 = retV[i];
            } else if (retV[i].text == '配置项目测试记录表') {
                bt7 = retV[i];
            } else if (retV[i].text == '<span style="color:red">设置负责人</span>') {
                bt8 = retV[i];
            } else if (retV[i].text == '<span style="color:red">下发任务</span>') {
                bt9 = retV[i];
            }
        }
        retV.splice(0, retV.length);
        retV.push(bt1, bt2, bt3, bt4, bt5, bt6, bt7, bt8, bt9);
        this.toolbar = retV;
        Ext.merge(this.scope, {
            listeners: {
                select: function () {
                    var me =this;
                    var disabled = false;
                    var btn = me.down("#setMan");
                    var selectedData = me.getSelectedData();
                    Ext.each(selectedData, function (item) {
                        if (item.raw["M_ZT_" + me.modelId] != "未开始") {
                            disabled = true;
                            btn.setTooltip("已有已下发的任务，不能重复设置，请先移除已下发的任务！");
                        }
                    });
                    if(!disabled){
                        btn.setTooltip("");
                    }
                    btn.setDisabled(disabled);
                },
                deselect:function () {
                    var me =this;
                    var disabled = false;
                    var btn = me.down("#setMan");
                    var selectedData = me.getSelectedData();
                    Ext.each(selectedData, function (item) {
                        if (item.raw["M_ZT_" + me.modelId] != "未开始") {
                            disabled = true;
                            btn.setTooltip("已有已下发的任务，不能重复设置，请先移除已下发的任务！");
                        }
                    });
                    if(!disabled){
                        btn.setTooltip("");
                    }
                    btn.setDisabled(disabled);
                }
            }
        });
    },


    /**
     * 删除任务
     * @private
     */
    _deleteRw: function () {
        var me = this.scope;
        var local = this;
        var selecteds = me.getSelectionModel().getSelection();
        if (selecteds.length == 0) {
            OrientExtUtil.Common.info('未选择数据', '请选择要删除的数据');
            return;
        }

        // 校验所选试验项状态是否可删除
        for (var i = 0; i < selecteds.length; i++) {
            var selected = selecteds[i];
            var zt = selected.raw['M_ZT_' + me.modelId];
            if (zt == '进行中' || zt == '已完成') {
                OrientExtUtil.Common.info('提示', '试验项【<span color="red">' + selected.raw['M_BH_' + me.modelId] + '</span>】任务已下发，无法删除');
                return;
            }
            var zr = selected.data['M_SFCJ_' + me.modelId];
            if (zr == 1) {
                OrientExtUtil.Common.info('提示', '试验项【<span color="red">' + selected.raw['M_BH_' + me.modelId] + '</span>】已绑定委托单，无法删除');
                return;
            }
        }

        // 删除确认
        Ext.MessageBox.confirm(OrientLocal.prompt.confirm, OrientLocal.prompt.deleteConfirm, function (btn) {
            if (btn == 'yes') {
                // 获取父节点所有子节点
                var broNodes = [];
                OrientExtUtil.AjaxHelper.doRequest(serviceName + "/TbomQueryController/getChildBom.rdm", {
                    nodeId: me.treeNode.raw.id
                }, false, function (response) {
                    broNodes = response.decodedData;
                });

                // 遍历需要删除的试验项数据
                for (var i = 0; i < selecteds.length; i++) {
                    var selected = selecteds[i];
                    // 遍历父节点的子节点
                    for (var j = 0; j < broNodes.length; j++) {
                        var brNode = broNodes[j];
                        // 如果当前试验项 id 能在父子节点中匹配上就删除
                        if (selected.raw.ID == brNode.dataId) {
                            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomDeleteController/deleteNodeRelationInfo.rdm', {
                                nodeId: brNode.id
                            }, false);
                            break;
                        }
                    }
                }

                // 删除成功刷新列表
                me.fireEvent('refreshGrid');
                // 刷新树
                me.treeNode.store.reload({node: me.treeNode});
            }
        });
    },

    /**
     * 设置项目测试记录表
     * @private
     */
    _setProjectTestRecordTable: function () {
        var me = this.scope;
        var local = this;

        var selections = OrientExtUtil.GridHelper.getSelectedRecord(me);
        if (selections.length == 0) {
            OrientExtUtil.Common.info('提示', '请至少选择一条数据');
            return;
        }
        var changeWarningCount = 0;
        var changeWarningMsg = '';
        var dataIds = [];
        var dataIdBh = [];
        var canSet = true;
        Ext.each(selections, function (record) {
            // 如果试验项流程已发起或完成则提示，不让修改
            if (record.data['M_ZT_' + me.tableId] != '未开始') {
                canSet = false;
                return false;
            }
            // 如果已经选择过表头了，再次编辑表头时需要提醒
            if (record.data['M_TEST_RECROD_COLUMN_' + me.tableId] != null) {
                changeWarningMsg += '、<font color="red">' + record.data['M_BH_' + me.tableId] + '</font>';
                changeWarningCount++;
            }
            dataIds.push(record.get("id"));
            dataIdBh.push(record.data['M_BH_' + me.tableId]);
        });
        if (canSet == false) {
            OrientExtUtil.Common.info('提示', '不可配置，存在已下发的试验项');
            return;
        }
        if (changeWarningCount > 0) {
            changeWarningMsg = changeWarningMsg.substr(1);

            // 如果已经选择过表头了，再次编辑表头时需要提醒
            Ext.Msg.confirm('提示', '试验项【' + changeWarningMsg + '】已经配置项目测试表，是否重新配置?', function (btn, text) {
                if (btn == 'yes') {
                    local._setProjectTestRecordTableShowColumns(dataIds, me.treeNode.raw.text, dataIdBh);
                }
            });
        } else {
            local._setProjectTestRecordTableShowColumns(dataIds, me.treeNode.raw.text, dataIdBh);
        }
    },

    /**
     * 设置项目测试记录表显示字段
     * @param dataIds
     * @param treeNodeText
     * @param dataIdBh
     * @private
     */
    _setProjectTestRecordTableShowColumns: function (dataIds, treeNodeText, dataIdBh) {
        var me = this.scope;

        var chooseShowColumnsPanel = Ext.create('OrientTdm.TestBomBuild.Panel.GridPanel.ChooseTableShowColumnGridpanel', {
            modelId: OrientExtUtil.ModelHelper.getModelId("T_XMCSJL", OrientExtUtil.FunctionHelper.getTestDataSchemaId())
        });
        var win = Ext.create('widget.window', {
            title: '选择显示字段',
            width: 380,
            height: 500,
            layout: 'fit',
            modal: true,
            buttonAlign: 'center',
            items: [chooseShowColumnsPanel],
            buttons: [{
                xtype: 'button',
                text: '确定',
                handler: function () {
                    // 是否选择了，没有则全部选中
                    var selected = OrientExtUtil.GridHelper.getSelectedRecord(chooseShowColumnsPanel);
                    var records = [];
                    if (selected.length == 0) {
                        var defaultColumns = ['指标名称', '指标要求', '指标单位', '测试数据', '合格判定'];
                        Ext.each(chooseShowColumnsPanel.getStore().data.items, function (item) {
                            if (Ext.Array.contains(defaultColumns, item.data.DISPLAY_NAME)) {
                                records.push(item.raw.COLUMN_ID);
                            }
                        });
                    } else {
                        Ext.each(selected, function (item) {
                            records.push(item.raw.COLUMN_ID);
                        });
                    }

                    var updateDataObj = {};
                    updateDataObj['M_TEST_RECROD_COLUMN_' + me.tableId] = records.join(',');

                    // 根据选择的字段变更试验项数据
                    for (var i = 0; i < dataIds.length; i++) {
                        updateDataObj.ID = dataIds[i];
                        updateDataObj['M_TEST_RECROD_NAME_' + me.tableId] = dataIdBh[i] + '-' + '项目测试记录表';
                        OrientExtUtil.ModelHelper.updateModelData(me.tableId, [updateDataObj]);
                        // 变更未改过名称的项目测试记录表
                        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomUpdateController/updateTestDataNodeName.rdm', {
                            dataId: dataIds[i],
                            bh: dataIdBh[i] + '-' + '项目测试记录表'
                        });
                    }
                    win.close();
                }
            }, {
                xtype: 'button',
                text: '取消',
                handler: function () {
                    win.close();
                }
            }]
        }).show();
    },

    /**
     * 试验项下发任务按钮点击事件
     * @param modelGridPanel
     * @private
     */
    _startCollab: function (modelGridPanel) {
        var me = this.scope;
        var local = this;

        var checkeResult = local._checkBindWtdh(modelGridPanel);
        if (checkeResult.status) {
            return;
        }
        var selections = checkeResult.selections;

        // 过滤已发起过的，不执行
        var modelId = modelGridPanel.modelDesc.modelId;
        var dataIdArr = [];
        var dataArr = [];
        var msg = '';
        for (var i = 0; i < selections.length; i++) {
            var item = selections[i];

            var msg_ = '';
            if (item.data['prjId'] == undefined) {
                dataIdArr.push(item.data['ID']);
            }
            if (item.data['M_ZRR_' + modelId] == null || item.data['M_ZRR_' + modelId] == "") {
                // 记录未设置仪器负责人的试验项
                msg_ += '，未设置被试品负责人';
            }
            if (item.data['template_id'] == undefined) {
                // 判断是否绑定了流程模板
                msg_ += '，未设置流程模模板';
            }
            if (item.data['template_id'] != undefined && item.data['prjId'] == undefined) {
                // 校验所选流程模板是否存在
                var isExist = local._checkCollabFlowExist(item.data['template_id']);
                if (isExist) {
                    dataArr.push({
                        'dataId': item.data['ID'],
                        'templateId': item.data['template_id'],
                        'text': item.data['M_BH_' + modelId]
                    });
                } else {
                    msg_ = "所选流程模板不存在，请重新设置后下发任务";
                }
            }

            if (msg_.length > 0) {
                msg += '<br>试验项【<font color="red">' + item.data['M_BH_' + modelId] + '</font>】' + msg_;
            }
        }

        if (dataIdArr.length == 0) {
            Ext.Msg.alert('提示', '所选记录均已下发过任务！');
            return;
        }
        if (msg.length > 0) {
            Ext.Msg.alert('提示', msg.substr(4));
            return;
        }

        // 批量启动
        Ext.getBody().mask("请稍后...", "x-mask-loading");
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TaskController/startTestPrjWithTemplate.rdm', {
            paramJsonStr: Ext.encode(dataArr)
        }, false, function (response) {
            var responseText = Ext.decode(response.responseText);

            // 走掉第一个任务且设置任务执行人
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TaskController/changePrincipal.rdm', {
                param: Ext.encode(responseText.results),
                isStrartPlan: true,
                isStartFirstTask: true
            }, false, function (response) {
                Ext.getBody().unmask();
                // 刷新列表
                modelGridPanel.fireEvent('refreshGrid');
            });


            var syxId = new Array();
            var syxFzr = new Array();
            for (var i = 0; i < selections.length; i++) {
                syxId.push(selections[i].data.id);
                syxFzr.push(selections[i].data['M_ZRR_' + modelId]);
            }
            // 设置所属项目测试记录数据字段状态及测试人员值
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/ProjectTestRecordController/batchUpdate4Syx.rdm', {
                syxFzr: syxFzr,
                syxId: syxId
            }, true);
        });
    },

    /**
     * 试验项设置试验流程模板
     * @param modelGridPanel
     * @private
     */
    _setCollabTemaplte: function (modelGridPanel) {
        var me = this.scope;
        var local = this;

        var checkeResult = local._checkBindWtdh(modelGridPanel);
        if (checkeResult.status) {
            return;
        }

        // 过滤已发起过的，不执行
        var modelId = modelGridPanel.modelDesc.modelId;
        var dataIdArr = [];
        // 流程实例id
        Ext.each(checkeResult.selections, function (item) {
            // 判断是否已启动流程，没有保存dataid
            if (item.data['prjId'] == undefined) {
                dataIdArr.push(item.data['ID']);
            }
        });
        // 如果dataid 数量为0 全部启动流程了
        if (dataIdArr.length == 0) {
            Ext.Msg.alert('提示', '所选记录均已下发过任务！');
            return;
        }

        var startCollabFlowPanel = Ext.create('OrientTdm.TestBomBuild.Panel.WindowPanel.StartCollabFlowPanel', {
            param: {
                modelId: modelId,
                // 传一个id
                dataId: dataIdArr.join(','),
                dataPrincipal: checkeResult.selections[0].data['M_ZRR_' + modelId],
                dataIdArr: dataIdArr,
                isSetTemplate: true,
                testName: me.getSelectedData()[0].raw["M_BH_" + me.modelId]
            },
            successCallback: function () {
                modelGridPanel.fireEvent('refreshGrid');
            }
        });

        // 选择协同流程模板窗口
        OrientExtUtil.WindowHelper.createWindow(startCollabFlowPanel, {
            title: '设置流程模板'
        }, '', 1000);
    },

    /**
     * 校验试验条件是否绑定了委托单号
     * @returns {{selections: *, status: boolean}}
     * @private
     */
    _checkBindWtdh: function (modelGridPanel) {
        var me = this.scope;
        var local = this;

        var selections = modelGridPanel.getSelectionModel().getSelection();
        // 设置流程模板
        if (selections.length < 1) {
            OrientExtUtil.Common.info('提示', '请选择至少一条记录!');

            return {
                selections: selections,
                status: true
            };
        }

        // 判断试验项是否绑定过委托单号
        var sylxDataId = modelGridPanel.treeNode.raw.dataId;
        var sylxModelId = modelGridPanel.treeNode.raw.tableId;
        var sylxValue = OrientExtUtil.ModelHelper.getModelData("T_SYLX", OrientExtUtil.FunctionHelper.getSchemaId(), sylxDataId);
        var wtdh = sylxValue["M_WTDH_" + sylxModelId];
        if (wtdh == null || wtdh == "") {
            OrientExtUtil.Common.info('提示', '试验类型未绑定委托单号，请先绑定委托单号');
        }

        return {
            selections: selections,
            status: wtdh == null || wtdh == ""
        };
    },

    /**
     * 下发任务时校验试验流程是否存在
     * @param templateId
     * @returns {boolean}
     * @private
     */
    _checkCollabFlowExist: function (templateId) {
        var isExist = false;

        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TaskController/checkCollabFlowExist.rdm', {
            collabTaskId: templateId
        }, false, function (response) {
            isExist = response.decodedData;
        });

        return isExist;
    }

});