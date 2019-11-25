/**
 * 协同任务详情的数据界面的下半部分的按钮点击事件
 */
Ext.define('OrientTdm.Collab.common.collabFlow.DataCollabFlow.DataCollabFlowPanelButtonHandler',{
    extend: 'Ext.Base',

    constructor: function (config) {
        var me = this;
        this.buttonHandlerObj = {
            _documentGeneration: me._documentGeneration,
            changeToolbarDisable: me.changeToolbarDisable,
            _equipmentRawData: me._equipmentRawData,
            _showTestImportDetail: me._showTestImportDetail,
            _equipmentDataWindow: me._equipmentDataWindow,
            _startCollection: me._startCollection,
            _dataImport: me._dataImport,
            _xmlImport: me._xmlImport
        };
    },

    /**
     * 生成测试报告
     * @private
     */
    _documentGeneration: function () {
        var me = this;
        var dataId = me.dataId;
        var nodeId = me.nodeId;
        var listPanel = Ext.create('OrientTdm.TestInfo.ReportTemplate.ReportTemplateMgrDashBoard', {
            hasBar: false,
            region: 'center',
            padding: '0 0 0 5',
            title: '报告模板'
        });

        /* var listPanel = Ext.create('OrientTdm.TestBomBuild.Panel.GridPanel.DocReportGridpanel', {
             modelId: modelId,
             region: 'center',
             padding: '0 0 0 5',
             title: '报告模板'
         });*/

        var win = Ext.create('widget.window',{
            title: '选择报告模板',
            width: 0.5 * globalWidth,
            height: 0.5 * globalHeight,
            buttonAlign: 'center',
            modal: true,
            buttons: [{
                xtype: "button",
                text: "确定",
                handler: function () {
                    var wordPanel = Ext.create('OrientTdm.BackgroundMgr.DocReport.Power.PowerDocPreviewPanel',{
                        testTypeId: dataId,
                        templateId: OrientExtUtil.GridHelper.getSelectRecordIds(listPanel.down('reportTemplateList')).join(","),
                        flex:2,
                        testTypeNodeId: nodeId
                    });
                    var wordWin = new Ext.Window({
                        width: 0.8* globalWidth,
                        height: 0.9 * globalHeight,
                        layout:'fit',
                        constrain:true,
                        constrainHeader:true,
                        modal:true,
                        plain:true,
                        autoScroll:true, // 滚动条设置
                        items:[wordPanel],
                        listeners:{
                            'beforeclose': function () {
                                win.close();
                            }
                        }
                    });
                    wordWin.show();
                }
            }],
            layout: 'fit',
            modal: true,
            items: [listPanel]
        });

        win.show();
        /*var dataIds = OrientExtUtil.GridHelper.getSelectRecordIds(me);
        var modelId = OrientExtUtil.ModelHelper.getModelId("T_RW_INFO", OrientExtUtil.FunctionHelper.getSchemaId(), false);
        var listPanel = Ext.create('OrientTdm.TestBomBuild.Panel.GridPanel.DocReportGridpanel', {
            modelId: modelId,
            region: 'center',
            padding: '0 0 0 5',
            title: '报告模板'
        });

        var win = Ext.create('widget.window',{
            title: '选择报告模板',
            width: 0.5 * globalWidth,
            height: 0.5 * globalHeight,
            buttonAlign: 'center',
            buttons: [{
                xtype: "button",
                text: "确定",
                handler: function () {
                    // 判断里面进行了不是选中一条后的tip提示的处理，所以直接返回
                    if (!OrientExtUtil.GridHelper.hasSelectedOne(listPanel)) {
                        return;
                    }
                    var reportId = OrientExtUtil.GridHelper.getSelectRecordIds(listPanel).join(",");
                    OrientExtUtil.AjaxHelper.doRequest(serviceName + '/DocReports/generateReportSpecial.rdm',{
                        reportId: reportId,
                        nodeId: me.nodeId,
                        dataIds: me.dataId
                    },false, function (response) {
                        var path = 'DocTemplate' +'%2F' + response.decodedData;
                        OrientExtUtil.FileHelper.doDownloadByFilePath(path, me.text + "报告.doc");
                        win.close();
                    });

                }
            }],
            layout: 'fit',
            modal: true,
            items: [listPanel]
        });

        win.show();*/
    },

    /**
     * 设置 toolbar 按钮可用性
     */
    changeToolbarDisable: function () {
        var me = this;
        var toolbar = me.getDockedItems('toolbar[dock="top"]')[0];
        var btns = toolbar.items.items;
        me.groupTask = false;
        Ext.each(btns, function (btn) {
            if (btn.getText() != '详情') {
                btn.setDisabled(me.groupTask);
            }
        });
    },

    /**
     * 设备原始数据窗口的查询按钮操作
     * @param win window 弹窗
     * @param gridpanel 数据列表
     * @private
     */
    _equipmentRawData: function (win, gridpanel, delegateNumber) {
        var me = this;

        // 读取统计图标配置
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/StatisticSetUp/doStatisic.rdm',{
            wtbh: delegateNumber,
            statisticName: '原始数据',
            // {"{{bh}}":"123456"}
            params : '{"{{bh}}":"' + delegateNumber + '"}'
        },false, function (response) {
            var panelItems = [];
            var respData = response.decodedData.results;
            // 图表信息
            var charts = respData.statisticEntity.charts;

            /**
             * 图表需要的参数
             * 图表标题 : chartData.title
             *      用户输入的委托编号
             * y 轴字段 names : chartData.legendData
             *      ['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
             * x 轴字段数据 ： chartData.xaxis
             *      ['周一','周二','周三','周四','周五','周六','周日']
             * y 轴字段属性及数据 ： chartData.seriesVal
             *     {
                        name:'邮件营销',
                        type:'line',
                        stack: '总量',
                        data:[120, 132, 101, 134, 90, 230, 210]
                    }
             */
            // 遍历关联的图表信息，选多个图表就有多个
            Ext.each(charts, function (chart) {
                var chartFrontHandler = chart.customHandler || chart.belongStatisticChartInstanceHandler;
                Ext.require(chartFrontHandler);
                var chartId = chart.id;
                var chartResult = respData.chartResultMap[chartId];

                if (chartId && chartResult) {
                    OrientExtUtil.AjaxHelper.doRequest(serviceName + '/HsTestDataController/doDeviceSource.rdm',{
                        wtbh: delegateNumber,
                        nodeId: me.nodeId
                    },false, function (resp) {
                        var result = resp.decodedData.results;
                        if(result != null){
                            result.title = '委托编号：' + delegateNumber;
                            var chartItem = Ext.create(chartFrontHandler, {
                                chartData: result,
                                purpose: 'realData'
                            });
                            panelItems.push(chartItem);
                        }else{
                            OrientExtUtil.Common.info('提示', '与环试系统连接失败或不存在该委托编号的原始数据！');
                            return;
                        }
                    });
                }
            });

            if(panelItems.length == 0){
                OrientExtUtil.Common.info('提示', '不存在该委托编号的原始数据！');
                return;
            }
            // 图表弹出框
            var staticWindow = OrientExtUtil.WindowHelper.createWindow(panelItems, {
                title: '原始数据图表',
                autoScroll: true,
                buttons: [{
                    text: '关闭',
                    iconCls: 'icon-close',
                    handler: function () {
                        this.up('window').close();
                    }
                }]
            });
            // 窗口最大化 
            staticWindow.maximize(true);
            win.close();
        });
    },

    /**
     * 导入记录详情按钮
     * 创建一个标签页，左右结构，左边数据表树，右边数据列表
     * @private
     */
    _showTestImportDetail: function(){
        var me = this;

        // 只能选一条数据
        if (!OrientExtUtil.GridHelper.hasSelectedOne(me)) {
            return;
        }

        var item = me.getSelectionModel().getSelection()[0];
        var text = '',
            importer = '',
            importResult = '';
        for(var i in item.data){
            if(i.indexOf('M_BH_') != -1){
                text = item.data[i];
            } else if (i == 'M_IMPORT_' + me.modelId) {
                importer = item.data[i];
            }else if(i == 'M_RESULT_' + me.modelId){
                importResult = item.data[i];
            }
        }

        if(importResult != '结构化数据'){
            OrientExtUtil.Common.info('提示', '所选记录不是结构化数据，请下载查看！');
            return;
        }

        var id = "testDataList_" + item.data.id;
        var testDataTabPanel = Ext.getCmp(id);
        if(testDataTabPanel != null){
            testDataTabPanel.show();
        }else{
            testDataTabPanel = Ext.create('OrientTdm.Collab.common.collabFlow.testImport.TestImportRecordTabPanel', {
                id: id,
                importer: importer,
                iconCls: 'icon-basicDataType',
                layout:'border',
                item: item,
                isView: 0,
                title: '查看【' + text + '】数据列表',
                closeAction : 'destroy',
                closable : true,
                rwInfoObj: {
                    nodeId: me.nodeId,
                    dataId: me.dataId,
                    rid: me.rid
                }
            });
            me.up().up().up().add(testDataTabPanel);
            me.up().up().up().doLayout();
            testDataTabPanel.show();
        }
    },

    /**
     * 点击环视的四个按钮时弹出委托编号输入的弹窗
     * @param title 标题
     * @param func 查询操作的方法
     * @private
     */
    _equipmentDataWindow: function (title, func) {
        var me = this;
        var win = Ext.create('widget.window', {
            title: title,
            layout: 'fit',
            modal: true,
            items: [Ext.create('OrientTdm.Common.Extend.Panel.OrientPanel', {
                items: [{
                    margin: '5 15 5 15',
                    xtype:'textfield',
                    fieldLabel:'委托编号',
                    width: 300,
                    emptyText:'输入不可为空'
                }]
            })],
            buttonAlign: 'center',
            buttons: [{
                    xtype: 'button',
                    text: '提交',
                    handler: function () {
                        // 获取委托编号

                        var delegateNumber = win.down('textfield').getValue();
                        if (delegateNumber == '') {
                            OrientExtUtil.Common.info('提示', '请输入委托编号');
                            return;
                        }

                        func(win, me, delegateNumber);
                    }
                }, {
                    xtype: 'button',
                    text: '关闭',
                    handler: function () {
                        win.close();
                    }
                }
            ],
            listeners:{
                close: function () {
                    me.fireEvent('refreshGrid');
                }
            }
        });
        win.show();
    },

    /**
     * 采集系统测试记录
     * @private
     */
    _startCollection: function () {
        var me = this;

        var win = Ext.create('Ext.Window', {
            plain: true,
            title: '数据采集',
            modal: true,
            items: [
                Ext.create('OrientTdm.TestBomBuild.Panel.PowerUploadImportFilePanel', {
                    successCallback: function (resp) {
                        var cwmfileId =  Ext.isIE ? resp.result : resp.results.fileid;
                        // 开始进行各种操作了
                        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/AcquisitionTestDataController/insertAcquisitionTestData.rdm',{
                            //nodeId: me.nodeId,
                            fileId: cwmfileId,
                            swbsNodeId: me.swbsArrSelected
                        }, false, function (response) {
                            if (response.decodedData.success) {
                                win.close();
                                me.fireEvent('refreshGrid');
                            }
                        });
                    }
                })
            ],
            listeners:{
                close: function () {
                    me.fireEvent('refreshGrid');
                }
            }
        });
        win.show();
    },

    /**
     * 航空部自动测试记录
     * @private
     */
    _dataImport: function () {
        var me = this;

        var win = Ext.create('Ext.Window', {
            plain: true,
            title: '航空部自动测试数据导入',
            modal: true,
            items: [
                Ext.create('OrientTdm.TestBomBuild.Panel.PowerUploadImportFilePanel', {
                    successCallback: function (resp) {
                        var cwmfileId =  Ext.isIE ? resp.result : resp.results.fileid;
                        // 开始进行各种操作了
                        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/HkDataController/insertHkAutoTestInfo.rdm',{
                            //nodeId: me.nodeId,
                            fileId: cwmfileId,
                            swbsNodeId: me.swbsArrSelected
                        }, false, function (response) {
                            if (response.decodedData.success) {
                                win.close();
                                me.fireEvent('refreshGrid');
                            }
                        });
                    }
                })
            ],
            listeners:{
                close: function () {
                    me.fireEvent('refreshGrid');
                }
            }
        }).show();
    },

    /**
     * 情报部门的导入
     * @private
     */
    _xmlImport: function () {
        var me = this;

        var win = Ext.create('Ext.Window', {
            plain: true,
            title: '情报部自动测试数据导入',
            maximizable: false,
            modal: true,
            items: [
                Ext.create('OrientTdm.TestBomBuild.Panel.PowerUploadImportFilePanel', {
                    successCallback: function (resp) {
                        var cwmfileId =  Ext.isIE ? resp.result : resp.results.fileid;
                        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/QbTestDataController/insertQbAutoTestInfo.rdm',{
                            //nodeId: me.nodeId,
                            fileId: cwmfileId,
                            swbsNodeId: me.swbsArrSelected
                        }, false, function (response) {
                            if (response.decodedData.success) {
                                win.close();
                                me.fireEvent("refreshGrid");
                            }
                        });
                    }
                })
            ],
            listeners:{
                close: function () {
                    me.fireEvent('refreshGrid');
                }
            }
        }).show();
    }

});