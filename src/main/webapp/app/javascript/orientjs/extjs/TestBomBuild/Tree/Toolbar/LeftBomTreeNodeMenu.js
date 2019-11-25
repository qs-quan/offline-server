/**
 * 试验数据管理 bom 树节点菜单
 */
Ext.define('OrientTdm.TestBomBuild.Tree.Toolbar.LeftBomTreeNodeMenu', {
    extend: "Ext.menu.Menu",

    initComponent: function () {
        this.items = this._createMenuBtn(this.rec, this.scope);
        this.callParent(arguments);
    },

    /**
     * 组装按钮栏对象，根据按钮栏不同返回不同对象
     * @param isShowText true：右键菜单 / false：做按钮栏
     * @returns {*}
     * @private
     */
    _createMenuBtn: function (rec, scope) {
        var local = this;
        var me = scope;

        var toolbar = [];
        if (me.selModel.selected.items && me.selModel.selected.items.length > 0) {
            var selectNode = me.selModel.selected.items[0];
        }
        if (!me.isShowCruBtn) {
            return toolbar;
        } else {
            me._setButtonStatus(rec);
            var lbar = me.down('toolbar[dock=left]');
            var btns = lbar.items.items;

            // 等级：军检 -> 所检 -> 试验验证
            if (selectNode && selectNode.raw.cj == '1' && Ext.Array.indexOf(['军检', '所检'], selectNode.raw.text) > -1) {
                // 高等级从低等级复制
                toolbar.push({
                    iconCls: 'icon-copy',
                    itemId: 'copy',
                    text: '复制',
                    disabled: lbar.down('button[itemId=add]').disabled,
                    handler: function () {
                        local._copyAll(selectNode, selectNode.parentNode.childNodes);
                    }
                }, '-');

            } else if (selectNode && selectNode.raw.cj == '2') {
                // 节点名称有待绑定的就触发绑定委托单按钮
                local._buildWtdBtn(selectNode, toolbar, local);
            }
            // 手工新增按钮
            if(selectNode && selectNode.raw.cj != '3'){
                toolbar.push(
                    {
                        // 新增或选择试验类型
                        iconCls: "icon-create",
                        text: selectNode.raw.cj == '1' ? '新增试验类型' : '新增',
                        itemId: 'add',
                        disabled: lbar.down('button[itemId=add]').disabled,
                        handler: function () {
                            me._addTreeNode();
                        }
                    }
                );
            }
            if(selectNode && selectNode.raw.cj == '2') {
                toolbar.push(
                    {
                        // 删除按钮
                        iconCls: 'icon-delete',
                        itemId: 'delete',
                        text: '删除',
                        handler: function () {
                            me._deleteTreeNode();
                        }
                    }
                );
            }
            if (selectNode.raw.cj > 0 && selectNode.raw.cj < 4) {
                local._buildNodeCjIn123(toolbar, lbar, me);
            }

            return toolbar;
        }
    },

    /**
     * 构造节点层级 123 的按钮
     * @param toolbar
     * @param lbar
     * @param me
     * @private
     */
    _buildNodeCjIn123: function (toolbar, lbar, me) {
        toolbar.push('-', {
            // 从模板导入项目
            iconCls: 'icon-createbyimport',
            itemId: 'import',
            text: '从模板导入项目',
            disabled: lbar.down('button[itemId=import]').disabled,
            handler: function () {
                me._CreateNodeByImport();
            }
        }, {
            // 从模板导出项目
            iconCls: 'icon-exporttemplate',
            itemId: 'export',
            text: '导出模板',
            disabled: lbar.down('button[itemId=export]').disabled,
            handler: function () {
                me._exportTemplate();
            }
        });
    },

    /**
     * 高等级从低等级复制
     * 等级：军检 -> 所检 -> 试验验证
     */
    _copyAll: function (selectNode, brotherNodes) {
        var me = this.scope;

        Ext.create('widget.window', {
            itemId: "bindApplayWindow",
            title: '复制',
            width: 300,
            autoHeight: true,
            layout: 'fit',
            modal: true,
            buttonAlign: 'center',
            items: [Ext.create('Ext.panel.Panel', {
                tbar: [{
                    xtype: 'combobox',
                    itemId: 'dataSource',
                    editable: false,
                    fieldLabel: '数据源',
                    labelWidth: 60,
                    forceSelection: true,
                    emptyText: '--选择数据源--',
                    // 军检可以复制两个，所检可以复制一个
                    store: selectNode.raw.text == '军检' ? ['所检', '试验验证'] : ['试验验证']
                }, '-', {
                    iconCls: 'icon-copy',
                    xtype: 'button',
                    text: '提交',
                    handler: function () {
                        Ext.MessageBox.confirm(OrientLocal.prompt.confirm, '建议完成数据采集后再复制，确认现在复制？', function (btn) {
                            if (btn == 'yes') {
                                var me = this;
                                var selectedNodeName = this.up().down('#dataSource').getValue();
                                // 未选择数据源
                                if (selectedNodeName == null) {
                                    OrientExtUtil.Common.info("提示", "数据源不能为空！");
                                    return;
                                }

                                // 根据选择的数据源匹配数据源节点Id
                                var sourceNodeId = '';
                                for (var i in brotherNodes) {
                                    var item = brotherNodes[i];
                                    if (item.raw.text == selectedNodeName) {
                                        sourceNodeId = item.raw.id;
                                    }
                                }

                                // 阻塞，等待
                                var wait = Ext.MessageBox.wait("正在复制数据", '提示', {text: '请稍后...'});
                                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomTemplateController/copyDataFromLowTest.rdm', {
                                    rid: selectNode.raw.rid,
                                    nodeId: selectNode.raw.id,
                                    sourceNodeId: sourceNodeId
                                }, false, function (response) {
                                    // 刷新自己
                                    selectNode.removeAll();
                                    selectNode.store.load({node: selectNode});

                                    // 关闭弹出框
                                    me.up().up().up().close();
                                });

                                // 关闭等待
                                wait.hide();
                            }
                        });
                    }
                }]
            })]
        }).show();
    },

    /**
     * 节点名称有待绑定的就触发绑定委托单按钮
     * @param selectNode
     * @param toolbar
     * @param local
     * @private
     */
    _buildWtdBtn: function (selectNode, toolbar, local) {
        if (selectNode.raw.displayText.indexOf('待绑定') > -1) {
            toolbar.push({
                iconCls: 'icon-create',
                itemId: 'bindApplyNumber',
                text: '绑定委托单号',
                handler: function () {
                    local._getApplyInfoPanel();
                }
            }, '-');
            // 没有绑定的就出发查看委托单详情按钮
        } else {
            toolbar.push({
                iconCls: 'icon-detail',
                itemId: 'queryApplyNumber',
                text: '委托单号详情',
                hidden: selectNode.raw.displayText.indexOf('待绑定') > -1 ? true : false,
                handler: function () {
                    local._getApplyTestDetailForm();
                }
            }, '-');
        }
    },

    /**
     * 绑定申请单界面
     */
    _getApplyInfoPanel: function () {
        var local = this;
        var me = this.scope;

        var node = OrientExtUtil.TreeHelper.getSelectNodes(me)[0];
        var modelId = OrientExtUtil.ModelHelper.getModelId("T_APPLY_TEST_RECORD", OrientExtUtil.FunctionHelper.getSYZYSchemaId(), false);
        var customerFilters = [];
        var thModelId = OrientExtUtil.ModelHelper.getModelId("T_TH", OrientExtUtil.FunctionHelper.getSchemaId(), false);
        // 使用根图号节点的图号
        var pthNode = Ext.Array.filter(me.getRootNode().childNodes, function (item) {
            return item.data.id == node.raw.rid ? true : false;
        }, this)[0];
        //var thData = OrientExtUtil.ModelHelper.getModelData("T_TH",OrientExtUtil.FunctionHelper.getSchemaId(), pthNode.data.dataId);
        customerFilters.push(new CustomerFilter("M_STATE_" + modelId, CustomerFilter.prototype.SqlOperation.Equal, "", "已完成"));
        //customerFilters.push(new CustomerFilter("M_SOURCE_" + modelId, CustomerFilter.prototype.SqlOperation.Equal, "", "TDM"));
        customerFilters.push(new CustomerFilter("M_CREATE_" + modelId, CustomerFilter.prototype.SqlOperation.Equal, "", userId));
        // customerFilters.push(new CustomerFilter("M_TH_" + modelId, CustomerFilter.prototype.SqlOperation.Equal, "", thData["M_BH_" + thModelId]));
        customerFilters.push(new CustomerFilter("M_TH_" + modelId, CustomerFilter.prototype.SqlOperation.Equal, "", pthNode.data.qtip.split('<br/>')[1].split('</b>')[1]));

        // 匹配军所联检
        var applyType = [node.parentNode.raw.text];
        if (Ext.Array.indexOf(['军检', '所检'], node.parentNode.raw.text) > -1) {
            applyType.push('军所联检');
        }
        customerFilters.push(new CustomerFilter("M_APPLY_TYPE_" + modelId, CustomerFilter.prototype.SqlOperation.In,
            '', applyType.join(',')));
        var grid = Ext.create('OrientTdm.Common.Extend.Grid.OrientModelGrid', {
            customerFilter: customerFilters,
            createToolBarItems: function () {
                return []
            },
            modelId: modelId,
            isView: 0
        });
        var win = Ext.create('widget.window', {
            id: "TDMApplyNumberGridPanel",
            title: '可选委托单号',
            width: 1200,
            autoHeight: true,
            maxHeight: 800,
            layout: 'fit',
            modal: true,
            buttonAlign: 'center',
            items: [grid],
            buttons: [
                {
                    text: '确定',
                    iconCls: 'icon-add',
                    handler: function () {
                        if (OrientExtUtil.GridHelper.hasSelectedOne(grid)) {
                            var raw = OrientExtUtil.GridHelper.getSelectedRecord(grid)[0].raw;
                            /* bindApplayWindow.down("textfield").setValue(raw["M_CODE_" + modelId]);
                             bindApplayWindow.down("textfield").applyTestRecrodCodeId = raw.id;*/

                            // 更新试验类型的委托单号字段
                            var dataList = {
                                ID: node.raw.dataId
                            };
                            dataList['M_WTDH_' + node.raw.tableId] = raw["M_CODE_" + modelId];
                            OrientExtUtil.ModelHelper.updateModelData(node.raw.tableId, [dataList]);
                            // 根据选择的委托单号绑定的试验项删除当前试验类型的试验项，以及节点名称
                            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/ApplyTestRecordController/cutSyxFromApplyTestReCord.rdm', {
                                applyTestRecrodCodeId: raw.ID,
                                applyTestRecrodCode: raw["M_CODE_" + modelId],
                                sylxDataId: node.raw.dataId
                            }, false, function (response) {
                                // 刷新试验类型节点
                                node = node.parentNode;
                                node.removeAll();
                                node.store.load({node: node});
                                // 刷新右侧试验项列表
                                me.ownerCt.down("#test_OP").down("gridpanel").fireEvent("refreshGrid");
                                win.close();
                            });
                        }
                    }
                }, {
                    text: '关闭',
                    iconCls: 'icon-close',
                    handler: function () {
                        win.close();
                    }
                }
            ]
        }).show();
    },

    /**
     * 试验类型查看试验申请表单
     * @private
     */
    _getApplyTestDetailForm: function() {
        var local = this;
        var me = this.scope;

        var applyTestDataId;
        // 根据试验类型id 获取选择的委托单号
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/CustomDataController/getDataIdsByColumnValue.rdm', {
            columnName: 'ID',
            modelName: 'T_SYLX',
            schemaId: OrientExtUtil.FunctionHelper.getSchemaId(),
            isRelationProperty: '1',
            value: OrientExtUtil.TreeHelper.getSelectNodes(me)[0].raw.dataId,
            resultColumn: 'M_WTDH',
            resultIsReltion: '0'
        }, false, function (response) {
            var wtdh = response.decodedData;
            if(wtdh.length > 0){
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/CustomDataController/getDataIdsByColumnValue.rdm', {
                    columnName: 'M_CODE',
                    modelName: 'T_APPLY_TEST_RECORD',
                    schemaId: OrientExtUtil.FunctionHelper.getSYZYSchemaId(),
                    isRelationProperty: '0',
                    value: wtdh[0],
                    resultColumn: 'ID',
                    resultIsReltion: '1'
                }, false, function (response) {
                    var applyTestDataId_ = response.decodedData;
                    if(applyTestDataId_.length > 0){
                        applyTestDataId = applyTestDataId_[0];
                        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelData/getGridModelDescAndData.rdm', {
                            modelId: OrientExtUtil.ModelHelper.getModelId('T_APPLY_TEST_RECORD', OrientExtUtil.FunctionHelper.getSYZYSchemaId()),
                            dataId: applyTestDataId
                        }, false, function (response) {
                            var modelDesc = response.decodedData.results.orientModelDesc;
                            var modelData = response.decodedData.results.modelData;
                            detailForm = Ext.create('OrientTdm.Common.Extend.Form.OrientDetailModelForm', {
                                bindModelName: modelDesc.dbName,
                                modelDesc: modelDesc,
                                originalData: modelData
                            });
                        });

                        OrientExtUtil.WindowHelper.createWindow(detailForm, {
                            title: '查看委托单基本信息',
                            layout: "fit"
                        }, globalHeight * 0.27, globalWidth * 0.4).show();
                    }
                });
            }
        });

        if(applyTestDataId == null){
            OrientExtUtil.Common.info('提示', '委托单信息不存在');
        }
    }

});