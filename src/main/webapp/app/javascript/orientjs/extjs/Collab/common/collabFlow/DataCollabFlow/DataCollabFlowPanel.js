/**
 * 协同任务详情的数据界面的下半部分
 * Created by dailin on 2019/4/11 13:37.
 */

Ext.define('OrientTdm.Collab.common.collabFlow.DataCollabFlow.DataCollabFlowPanel',{
    extend: 'OrientTdm.Common.Extend.Grid.OrientModelGrid',
    alias: 'widget.dataCollabFlowPanel',

    initComponent: function () {
        var me = this;

        // 设置实物标识下拉列表数据源
        me.swbsArr = [];
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomQueryController/getThAllSwbs.rdm',{
            rwNodeId: me.nodeId
        }, false, function (response) {
            if (response.decodedData.success) {
                me.swbsArr = response.decodedData.results;
            }
        });
        // 设置默认值
        if(me.swbsArr.length > 0 && me.swbsArr[0].id != undefined){
            me.swbsArrSelected = me.swbsArr[0].id;
        }

        var dataCollabFlowPanelButtonHandler = Ext.create('OrientTdm.Collab.common.collabFlow.DataCollabFlow.DataCollabFlowPanelButtonHandler').buttonHandlerObj;
        Ext.apply(dataCollabFlowPanelButtonHandler, {
            region: 'center',
            minHeight: '600',
            // 设置导入记录列表过滤条件, 实物标识节点
            customerFilter: [new CustomerFilter('M_NODE_ID_' + me.modelId, CustomerFilter.prototype.SqlOperation.Equal, '', me.swbsArrSelected)]
        });
        Ext.apply(me, dataCollabFlowPanelButtonHandler);
        me.callParent(arguments);
        me.addEvents('changeToolbarDisable');
        me.addEvents('checkEmptyDataResult');
    },

    initEvents: function() {
        var me = this;
        me.callParent(arguments);
        me.mon(me, 'checkEmptyDataResult', me._checkEmptyDataResult, me);
        me.mon(me, 'changeToolbarDisable', me.changeToolbarDisable, me);
    },

    createToolBarItems: function () {
        var me = this;

        var retV = [];

        // 设置实物标识下拉列表
        retV.push({
            itemId: 'dataCollabFlowPanelCombobox',
            xtype : 'combobox',
            fieldLabel : '实物标识',
            labelAlign : 'left',
            labelWidth : 53,
            emptyText : '',
            margin : '0 5',
            displayField : 'text',
            valueField : 'id',
            triggerAction : 'all',
            queryMode: 'local',
            store: Ext.create('Ext.data.Store', {
                fields: ['id', 'text'],
                data: me.swbsArr
            }),
            listeners: {
                /**
                 * 更换选项后刷新导入记录列表
                 */
                change: function () {
                    var meStore = me.store;
                    var gridCustomFileter = Ext.decode(meStore.proxy.extraParams.customerFilter);
                    var thisCombobox = me.down('#dataCollabFlowPanelCombobox');
                    gridCustomFileter[0].filterValue = thisCombobox.value;
                    meStore.proxy.extraParams.customerFilter = Ext.encode(gridCustomFileter);
                    meStore.proxy.proxyConfig.extraParams.customerFilter = meStore.proxy.extraParams.customerFilter;
                    meStore.reload();
                    me.swbsArrSelected = thisCombobox.value;
                },
                /**
                 * 获得焦点时重新加载数据
                 */
                focus: function(){
                    me.swbsArr = me.getSwbs();
                    me.down('#dataCollabFlowPanelCombobox').store.loadData(me.swbsArr);
                },
                scope: me
            },
            value: me.swbsArrSelected
        }, '-');

        if(!((me.rootData.name.indexOf('部门经理') > -1 && me.rootData.name.indexOf('试验过程') > -1) || me.hisTaskDetail != null)){
            retV.push({
                // 导入记录详情按钮
                xtype: 'button',
                text: '详情',
                iconCls: 'icon-detail',
                handler: function () {
                    me._showTestImportDetail();
                }
            });

            // 【总结】节点才需要生成文档
            if(me.rootData.name.indexOf('总结') > -1){
                var btns = me.modelDesc.btns;
                Ext.each(btns, function (btn) {
                    if(btn.name == '修改' && btn.issystem == 0){
                        retV.push({
                            iconCls: 'icon-' + btn.code,
                            text: '编辑数据结果',
                            scope: me,
                            btnDesc: btn,
                            handler: Ext.bind(me.onGridToolBarItemClicked, me),
                            listeners: {
                                click: function (eopts, param) {
                                    var selects = me.getSelectionModel().getSelection();
                                    if(selects.length != 1){
                                        OrientExtUtil.Common.info('提示', '请选择一条数据！');
                                        return false;
                                    }
                                }
                            }
                        });
                    }
/*
                    if(btn.name == '详细' && btn.issystem == 1){
                        retV.push({
                            iconCls: 'icon-' + btn.code,
                            text: '查看数据结果',
                            scope: me,
                            btnDesc: btn,
                            handler: Ext.bind(me.onGridToolBarItemClicked, me)
                        });
                    }*/
                });

                retV.push({
                    xtype: "button",
                    text: "生成报告",
                    iconCls: 'icon-generateDoc',
                    disabled: me.groupTask,
                    handler: function () {
                        OrientExtUtil.Common.info('提示', '开发中……');
                        //me._documentGeneration();
                    }
                });
            }else{
                retV.push({
                    // 采集系统测试记录
                    xtype: 'button',
                    text: '采集数据',
                    iconCls: 'icon-startCollabFlow',
                    disabled: me.groupTask,
                    handler: function () {
                        me._startCollection();
                    }
                });
                if (deptName.indexOf("航空") > -1) {
                    // 航空部自动测试记录
                    retV.push({
                        xtype: 'button',
                        text: '航空部自动测试数据导入',
                        iconCls: 'icon-import',
                        disabled: me.groupTask,
                        handler: function () {
                            me._dataImport();
                        }
                    });
                }
                if (deptName.indexOf("情报") > -1) {
                    // 情报部自动测试记录
                    retV.push({
                        xtype: 'button',
                        text: '情报部自动测试数据导入',
                        iconCls: 'icon-import',
                        disabled: me.groupTask,
                        handler: function () {
                            me._xmlImport();
                        }
                    });
                }

                /*{
                    // 环视系统 - 原始数据
                    xtype: "button",
                    text: "设备原始数据",
                    iconCls: 'icon-query',
                    disabled: me.groupTask,
                    handler: function () {
                        me._equipmentDataWindow('通过委托编号查询设备原始数据', me._equipmentRawData);
                    }
                }*/
            }
        }

        return retV;
    },

    /**
     * 总结节点提交时判断导入记录的数据结果是否已编辑
     * @returns {boolean}
     * @private
     */
    _checkEmptyDataResult: function(){
        var me = this;

        if(me.rootData.name.indexOf('总结') == -1){
            return true;
        }

        var errMsg = '';
        me.store.each(function (item) {
            var dataResult = item.data['M_DATA_RESULT_' + me.modelId];
            if(dataResult == null || dataResult == undefined || dataResult.length == 0){
                errMsg = errMsg + '<br>导入记录【<font color="red">' + item.data['M_BH_' + me.modelId] + '</font>】未编辑数据结果！';
            }
        });

        if(errMsg.length > 0){
            OrientExtUtil.Common.info('提示', errMsg.substr('4'));
            return false;
        }

        return true;
    },

    createColumns: function () {
        var me = this;
        var retVal = [];
        //获取模型操作描述
        var modelDesc = me.modelDesc;
        if (modelDesc && modelDesc.columns) {
            Ext.each(modelDesc.columns, function (column) {
                if (Ext.Array.contains(modelDesc.listColumnDesc, column.id)) {
                    if("数据结果" == column.text){
                        column.sortable = false;
                    }
                    retVal[Ext.Array.indexOf(modelDesc.listColumnDesc, column.id)] = OrientModelHelper.createGridColumn(column);
                }
            });
        }
        return retVal;
    },

});