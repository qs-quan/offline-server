/**
 * 项目测试记录
 */

Ext.define('OrientTdm.TestBomBuild.Panel.GridPanel.TestDataRecord', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientModelGrid',
    alias: 'widget.TestDataRecord',
    config: {
        selectedComboboxDataIndex: 0,
        showIndex: 1
    },

    initComponent: function () {
        var me = this;

        // 初始化相关
        me._initComponent();

        Ext.apply(me, {
            layout: 'border',
            region: 'center',
            modelName: 'T_XMCSJL',
            sortDirection: 'ASC',
            // 只显示自己创建的
            needDefaultValue: true,
            pageSize: 25,
            plugins: [
                // 使用Ext插件，使列里面的数据可编辑
                Ext.create('Ext.grid.plugin.CellEditing', {
                    clicksToEdit: 2
                })
            ],
            customerFilter: [
                new CustomerFilter("M_NODE_ID_" + me.modelId, CustomerFilter.prototype.SqlOperation.Equal, "", me.swbsArrSelected)
            ]
        });

        this.callParent(arguments);
    },

    initEvents: function () {
        var me = this;
        me.callParent();

        // 根据选择的字段过滤需要的字段
        me.mon(me, 'afterlayout', function (scope, cntainer, eopts) {
            var thisModelDesc = this.modelDesc;

            thisModelDesc.createColumnDesc = me.testDataColums;
            thisModelDesc.listColumnDesc = me.testDataColums;
            thisModelDesc.detailColumnDesc = me.testDataColums;
            thisModelDesc.modifyColumnDesc = me.testDataColums;
            thisModelDesc.queryColumnDesc = me.testDataColums;
        }, me);

        // 被移除前处理 新增行 的数据是否被编辑过，没有则删除
        me.mon(me, 'removed', function () {
            me._deleterow(false);
        }, me);
    },

    /**
     * 视图初始化
     * @returns {Array}
     */
    createToolBarItems: function () {
        var me = this;

        if (me.btnPower == undefined || me.btnPower == false) {
            return [];
        }

        // 设置实物标识下拉列表
        var retVal = [];
        if (me.source != 'swbsNode') {
            me._buildDataCollabFlowPanelCombobox(retVal);
        }

        if (!me.isCollab) {
            retVal.push({
                text: "新增行",
                iconCls: 'icon-create',
                handler: function () {
                    me._addNewLine();
                }
            });
        }

        retVal.push({
            text: "保存修改数据",
            iconCls: 'icon-save',
            handler: function () {
                me._saveModifyData();
            }
        });

        var btnArr = me.isCollab == true ? ['导入', '导出', '查询', '查询全部'] : ['删除', '导入', '导出', '查询', '查询全部'];
        for (var i = 0; i < btnArr.length; i++) {
            var btnName = btnArr[i];
            Ext.each(me.modelDesc.btns, function (btn) {
                if (btn.issystem == '1' && btnName == btn.name) {
                    retVal.push({
                        iconCls: 'icon-' + btn.code,
                        text: btn.name,
                        scope: me,
                        btnDesc: btn,
                        handler: Ext.bind(me.onGridToolBarItemClicked, me),
                        listeners: {
                            click: me._btnClickHandler,
                            scope: me
                        }
                    });
                }
            });
        }

        // 流程和数据汇总的下的项目测试记录表界面无需二次修改表
        if (!me.isCollab && me.treeNode && me.treeNode.raw.cj == '3') {
            retVal.push({
                text: "配置项目测试记录表",
                iconCls: 'icon-createbyimport',
                handler: function () {
                    me._setProjectTestRecordTable();
                }
            });
        }

        return retVal;
    },

    /**
     *
     * @returns {Array}
     */
    createColumns: function () {
        var me = this;

        //获取模型操作描述
        var retVal = [];
        var modelDesc = me.modelDesc;
        if (modelDesc && modelDesc.columns) {
            var column = modelDesc.columns;

            var testDataColumns = me.testDataColums;
            // 未设置的项目记录表应当赋予名称
            if (testDataColumns.length == 0) {
                for (var i = 0; i < column.length; i++) {
                    var defaultColumns = ['指标名称', '指标要求', '指标单位', '测试数据', '合格判定'];
                    if (Ext.Array.contains(defaultColumns, column[i].text)) {
                        testDataColumns.push(column[i].id);
                    }
                }
            }
            me.testDataColums = testDataColumns;

            Ext.each(modelDesc.columns, function (column) {
                if (Ext.Array.contains(me.testDataColums, column.id)) {
                    switch (column.text) {
                        case "测试时间": {
                            column.editor = {
                                xtype: 'datetimefield',
                                editable: true
                            };
                            break;
                        }
                        case "合格判定": {
                            column.editor = {
                                xtype: 'combobox',
                                editable: false,
                                listeners: {
                                    'change': function (combobox, newValue, oldValue) {
                                    }
                                },
                                store: [
                                    ["合格", '合格'],
                                    ["不合格", '不合格']
                                ]
                            };
                            break;
                        }
                        case "数据类型": {
                            column.editor = {
                                xtype: 'combobox',
                                editable: false,
                                listeners: {
                                    'change': function (combobox, newValue, oldValue) {
                                    }
                                },
                                store: [
                                    ["调试数据", '调试数据'],
                                    ["检验数据", '检验数据']
                                ]
                            };
                            break;
                        }
                        default: {
                            column.editor = {
                                xtype: 'textfield'
                            };
                            break;
                        }
                    }

                    // 定制 column 值渲染
                    column.renderer = function (value, meta, record) {
                        // 已下发的试验项的项目测试记录已有值的字段不可编辑
                        if ((',' + record.raw['M_LOCK_' + me.modelId] + ',').indexOf(',' + meta.column.dataIndex + ',') > -1) {
                            meta.column.editor = null;
                        }
                        switch (meta.column.text) {
                            case "测试时间": {
                                if (value && !isNaN(new Date(value))) {
                                    value = Ext.Date.format(new Date(value), "Y-m-d H:i:s");
                                }
                                if (value == '1970-01-01 08:00:00') {
                                    value = '';
                                }
                                // if (me.addAddNewRowObj[record.data.ID]) {
                                //     value = Ext.Date.format("", "Y-m-d H:i:s");
                                // }
                                break;
                            }
                        }
                        value = value || '';
                        meta.tdAttr = 'data-qtip="' + value + '"';
                        return value;
                    };

                    // 先根据ds表上面设置的顺序进行显示
                    retVal.push(OrientModelHelper.createGridColumn(column));
                }
            });
        }

        return retVal;
    },

    /**
     * 初始化相关
     * @private
     */
    _initComponent: function () {
        var me = this;

        me.addAddNewRowObj = {};
        // 设置 10 秒钟一次轮询，如果存在 5 分钟未编辑的行则移除
        setInterval(function () {
            // 判断编辑的数据中是否存在新增的行，如果存在则需要移除该行
            me._deleterow(true);
        }, 10000);

        // 设置实物标识下拉列表数据源
        if (me.source == 'swbsNode') {
            me.swbsArrSelected = me.treeNode.parentNode.raw.id;
        } else {
            me.swbsArr = [];
            me.rwNodeId = me.nodeId != undefined ? me.nodeId : me.treeNode.raw.id;
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomQueryController/getThAllSwbs.rdm', {
                rwNodeId: me.rwNodeId
            }, false, function (response) {
                if (response.decodedData.success) {
                    me.swbsArr = response.decodedData.results;
                }
            });
            // 给下拉列表添加一个默认值：全部
            me.swbsArr.unshift({
                id: '全部',
                text: '全部'
            });
            me.swbsArrSelected = me.swbsArr[0].id;
        }

        me.modelId = OrientExtUtil.ModelHelper.getModelId(
            'T_XMCSJL',
            OrientExtUtil.FunctionHelper.getTestDataSchemaId(),
            false
        );
    },

    /**
     * 保存修改数据
     * @private
     */
    _saveModifyData: function () {
        var me = this;
        var selectedDatas = OrientExtUtil.GridHelper.getSelectedRecord(me);
        if (selectedDatas.length == 0) {
            OrientExtUtil.Common.info('提示', '请至少选择一条记录');
            return;
        }
        var dataList = [];
        Ext.each(selectedDatas, function (selectedData) {
            // 判断编辑的数据中是否存在新增的行，如果编辑了则从新增行数组中移除改 id
            delete  me.addAddNewRowObj[selectedData.data.id];

            var dateStr = selectedData.data["M_CREATE_TIME_" + me.modelId];
            if (dateStr && !isNaN(new Date(dateStr))) {
                dateStr = Ext.Date.format(new Date(dateStr), "Y-m-d H:i:s");
            }
            if (dateStr == '1970-01-01 08:00:00') {
                dateStr = '';
            }
            selectedData.data["M_CREATE_TIME_" + me.modelId] = dateStr;
            dataList.push(selectedData.data);

        });
        OrientExtUtil.ModelHelper.updateModelData(me.modelId, dataList);
        me.refreshGrid();
    },

    /**
     * 设置记录表字段，逻辑同试验类型的标签页下设置一致
     * @private
     */
    _setProjectTestRecordTable: function () {
        var me = this;
        var changeWarningCount = 0;
        var changeWarningMsg = '';
        var dataIds = [];
        var dataIdBh = [];
        // 获取当前试验项信息
        var rwData = OrientExtUtil.ModelHelper.getModelData("T_RW_INFO", OrientExtUtil.FunctionHelper.getSchemaId(), me.rwDataId);

        if (rwData['M_ZT_' + me.rwModelId] != '未开始') {
            OrientExtUtil.Common.info('提示', '不可配置，试验项已下发');
            return;
        }

        // 如果已经选择过表头了，再次编辑表头时需要提醒
        if (rwData['M_TEST_RECROD_COLUMN_' + me.rwModelId] != null) {
            changeWarningMsg += '、<font color="red">' + rwData['M_BH_' + me.rwModelId] + '</font>';
            changeWarningCount++;
        }
        // 记录编号和id
        dataIds.push(rwData["ID"]);
        dataIdBh.push(rwData['M_BH_' + me.rwModelId]);

        if (changeWarningCount > 0) {
            changeWarningMsg = changeWarningMsg.substr(1);

            // 如果已经选择过表头了，再次编辑表头时需要提醒
            Ext.Msg.confirm('提示', '试验项【' + changeWarningMsg + '】已经配置项目测试表，是否重新配置?', function (btn, text) {
                if (btn == 'yes') {
                    execute();
                }
            });
        } else {
            execute();
        }

        /**
         * 干活
         */
        function execute() {
            me._setProjectTestRecordTableShowColumns(dataIds, me.treeNode.parentNode.raw.text, dataIdBh);
        }
    },

    /**
     * 设置可选字段
     * @param dataIds
     * @param treeNodeText
     * @param dataIdBh
     * @private
     */
    _setProjectTestRecordTableShowColumns: function (dataIds, treeNodeText, dataIdBh) {
        var me = this;
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
                    updateDataObj['M_TEST_RECROD_COLUMN_' + me.rwModelId] = records.join(',');

                    // 根据选择的字段变更试验项数据
                    for (var i = 0; i < dataIds.length; i++) {
                        updateDataObj.ID = dataIds[i];
                        updateDataObj['M_TEST_RECROD_NAME_' + me.rwModelId] = dataIdBh[i] + '-' + "项目测试记录表";
                        OrientExtUtil.ModelHelper.updateModelData(me.rwModelId, [updateDataObj]);
                        // 变更未改过名称的项目测试记录表
                        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomUpdateController/updateTestDataNodeName.rdm', {
                            dataId: dataIds[i],
                            bh: updateDataObj['M_TEST_RECROD_NAME_' + me.rwModelId]
                        });
                    }

                    //自动导出数据
                    Ext.each(me.swbsArr, function (item) {
                        if (item.id != "全部") {
                            me.excute(item.text);
                        }

                    });

                    win.close();

                    // 选择字段结束后，重新赋值可显示字段，并重新加载界面的column和store
                    me.testDataColums = records;
                    me.reconfigure(me.createStore(), me.createColumns());
                }
            }, {
                xtype: 'button',
                text: '取消',
                handler: function () {
                    win.close();
                }
            }]
        });
        win.show();
    },

    /**
     * 按钮点击事件
     * 根据按钮触发不同分类方法
     * @private
     */
    _btnClickHandler: function (btn, event, opts) {
        var me = this;
        //var selected = OrientExtUtil.GridHelper.getSelectedRecord(me);

        // 新增表单需要给试验项ids 字段赋默认值
        if ('新增' === btn.text) {
            // 新增需要赋值
            me.formInitData = {};
            me.formInitData["M_NODE_ID_" + me.modelId] = me.swbsArrSelected;

            me._setColumnConfig();
        } else if ('修改' === btn.text) {
            me._setColumnConfig();
        }

        return true;
    },

    /**
     * 设置字段的属性
     * @private
     */
    _setColumnConfig: function () {
        var me = this;
        var columns = me.modelDesc.columns;

        for (var i = 0; i < columns.length; i++) {
            var column = columns[i];
            // 测试人员、测试时间，取消默认值、禁止编辑。
            if (column.sColumnName == 'M_CSRY2_' + me.modelId || column.sColumnName == 'M_CREATE_TIME_' + me.modelId) {
                column.defaultValue = '';
                // 不可编辑
                //column.editAbleType = '2';
            }
        }
    },

    /**
     * 删除超时的新增行
     * 判断编辑的数据中是否存在新增的行，如果存在则需要移除该行
     * @param validityPeriod
     * @private
     */
    _deleterow: function (validityPeriod) {
        var me = this;

        var localTimestamp = new Date().getTime();
        var deleteRowCount = 0;
        for (var id in me.addAddNewRowObj) {
            var timestamp = me.addAddNewRowObj[id];
            if (timestamp != undefined && me.addAddNewRowObj != null) {
                // 需要判断超时有效期： 5分钟
                if (validityPeriod && (localTimestamp - timestamp) < 300000) {
                    break;
                }
                // 删除行
                OrientExtUtil.ModelHelper.deleteModelData(me.modelId, id, false);
                delete  me.addAddNewRowObj[id];
                deleteRowCount++;
            }
        }

        // 刷新表格
        if (deleteRowCount > 0) {
            me.refreshGrid();
        }
    },

    /**
     * 新增行按钮点击事件
     * @private
     */
    _addNewLine: function (productNo) {
        var me = this;

        // 先校验是否存在新创建未保存的行
        if (Object.getOwnPropertyNames(me.addAddNewRowObj).length > 0) {
            Ext.MessageBox.confirm(OrientLocal.prompt.confirm, "存在未保存的数据，是否保存？", function (btn) {
                // 选择是则提交一波
                if (btn == 'yes') {
                    var newLineIds = [];
                    // 遍历旧的新增行数据 id 数组
                    for (var key in me.addAddNewRowObj) {
                        newLineIds.push(key);
                    }

                    // 选中所有行
                    me.getSelectionModel().selectAll();
                    var selecteds = OrientExtUtil.GridHelper.getSelectedRecord(me);
                    var dataList = [];
                    for (var index in selecteds) {
                        var selected = selecteds[index];
                        // 根据 id 找到对应的行
                        if (Ext.Array.indexOf(newLineIds, selected.data.ID) > -1) {
                            // 设置测试时间字段值
                            var oldDate = selected.data['M_CREATE_TIME_' + me.modelId];
                            selected.data['M_CREATE_TIME_' + me.modelId] = Ext.Date.format(new Date(oldDate), 'Y-m-d H:i:s');
                            dataList.push(selected.data);

                            // 判断编辑的数据中是否存在新增的行，如果编辑了则从新增行数组中移除改 id
                            delete  me.addAddNewRowObj[key];
                        }
                    }

                    // 批量更新
                    if (dataList.length > 0) {
                        OrientExtUtil.ModelHelper.updateModelData(me.modelId, dataList);
                        // 刷新列表
                        me.refreshGrid();
                    }

                    me.getSelectionModel().deselectAll();
                }

                me.excute(productNo);
            });
        } else {
            me.excute(productNo);
        }
    },

    excute: function (productNo) {
        var me = this;
        // 新增行
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/ProjectTestTableController/insertEmptyRow.rdm', {
            rwInfoDataId: me.rwDataId,
            swbsNodeId: me.swbsArrSelected,
            productNo: productNo ? productNo : ""
        }, false, function (response) {
            if (response.decodedData.success) {
                // 将所有新增行 dataId 保存起来
                var newAddRowDataId = response.decodedData.results;
                // 保存 id 及时间戳
                me.addAddNewRowObj[newAddRowDataId] = new Date().getTime();
                // 刷新表格
                me.refreshGrid();
            }
        });
    },

    /**
     * 构造实物标识下拉列表对象
     * @returns {{itemId: string, xtype: string, fieldLabel: string, labelAlign: string, labelWidth: number, emptyText: string, margin: string, displayField: string, valueField: string, triggerAction: string, queryMode: string, value: *, store: Ext.data.Store, listeners: {change: listeners.change, scope}}}
     * @private
     */
    _buildDataCollabFlowPanelCombobox: function (retVal) {
        var me = this;

        retVal.push(
            {
                itemId: 'dataCollabFlowPanelCombobox',
                xtype: 'combobox',
                fieldLabel: '实物标识',
                labelAlign: 'left',
                labelWidth: 53,
                emptyText: '',
                margin: '0 5',
                displayField: 'text',
                valueField: 'id',
                triggerAction: 'all',
                queryMode: 'local',
                value: me.swbsArrSelected,
                store: Ext.create('Ext.data.Store', {
                    fields: ['id', 'text'],
                    data: me.swbsArr
                }),
                listeners: {
                    /**
                     * 更换选项后刷新导入记录列表
                     */
                    change: function (combobox, newValue, oldValue, eOpts) {
                        var meStore = me.store;
                        var gridCustomFileter = Ext.decode(meStore.proxy.extraParams.customerFilter);
                        var thisCombobox = me.down('#dataCollabFlowPanelCombobox');
                        // 设置列表数据源过滤条件：当下拉列表的值为 全部 时，说明是按钮：全部，查询条件：试验项id
                        var panelTextFlag = '';
                        if (thisCombobox.value == '全部') {
                            gridCustomFileter[0].filterValue = me.rwDataId;
                            gridCustomFileter[0].filterName = 'M_RW_INFO_ID_' + me.modelId;
                            panelTextFlag = 'all';
                        } else {
                            gridCustomFileter[0].filterValue = thisCombobox.value;
                            panelTextFlag = 'singleton';
                        }
                        meStore.proxy.extraParams.customerFilter = Ext.encode(gridCustomFileter);
                        meStore.proxy.proxyConfig.extraParams.customerFilter = meStore.proxy.extraParams.customerFilter;
                        meStore.reload();

                        // 重设下拉列表选中值
                        me.swbsArrSelected = thisCombobox.value;
                        for (var i = 0; i < me.swbsArr.length; i++) {
                            if (me.swbsArr[i].id == thisCombobox.value) {
                                me.selectedComboboxDataIndex = i;
                                break;
                            }
                        }
                        var panel = me.down("#showIndex");
                        me.showIndex = me.selectedComboboxDataIndex + 1;
                        panel.setText(
                            "当前第<span style='color: blue'>" + me.showIndex + "</span>个/总共<span style='color: blue'>" + me.swbsArr.length + "</span>个"
                        );
                    },
                    scope: me
                }
            }, {
                text: "上一个",
                iconCls: 'icon-up',
                handler: function () {
                    var thisCombobox = me.down('#dataCollabFlowPanelCombobox');
                    if (me.selectedComboboxDataIndex == 0) {
                        OrientExtUtil.Common.tip("", "已经是第一个选项");
                        return;
                    }
                    me.selectedComboboxDataIndex--;
                    var preValue = me.swbsArr[me.selectedComboboxDataIndex].id;
                    thisCombobox.setValue(preValue);
                }
            }, {
                text: "下一个",
                iconCls: 'icon-down',
                handler: function () {
                    var thisCombobox = me.down('#dataCollabFlowPanelCombobox');
                    if (me.selectedComboboxDataIndex == me.swbsArr.length - 1) {
                        OrientExtUtil.Common.tip("", "已经是最后一个选项");
                        return;
                    }
                    me.selectedComboboxDataIndex++;
                    var nextValue = me.swbsArr[me.selectedComboboxDataIndex].id;
                    thisCombobox.setValue(nextValue);
                }
            }, {
                itemId: "showIndex",
                disabled: true,
                text: "当前第<span style='color: blue'>" + me.showIndex +
                "</span>个/总共<span style='color: blue'>" + me.swbsArr.length + "</span>个"
            }
        );
    }

});