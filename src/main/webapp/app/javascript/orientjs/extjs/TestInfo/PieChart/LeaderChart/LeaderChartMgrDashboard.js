/**
 * 角色统计图表
 */
Ext.define('OrientTdm.TestInfo.PieChart.LeaderChart.LeaderChartMgrDashboard', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.LeaderChartMgrDashboard',
    requires: ['OrientTdm.Common.Extend.Form.Selector.ChooseUserPanel'],

    initComponent: function () {
        var me = this;
        me.depId = '';
        me.userId = '';

        Ext.apply(me, {
            layout: 'border',
            items: [{
                region: 'center',
                title: '统计视图【任务】',
                autoScroll: true,
                itemId: 'leaderDepStatisticPanel',
                tbar: me._createTooolbar(),
                listeners: {
                    afterLoadData: function () {
                        me._getChartParam();
                    }
                }
            }]
        });
        me.callParent(arguments);
    },

    /**
     * 加载统计图表
     * @param param
     * @private
     */
    _getChartParam: function () {
        var me = this.scpoe;

        if (me.userId != "" && me.down("#roleType").getValue() == null) {
            OrientExtUtil.Common.info('提示', "选择人员后必须设置角色类型");
            return;
        }
        // 部门下拉列表
        // var leaderChartDepComonbox = Ext.getCmp('leaderChartDepComonbox');
        // if(leaderChartDepComonbox != undefined && !leaderChartDepComonbox.validate()){
        //     //OrientExtUtil.Common.info('提示', '未选择需要查看统计结果的部门！');
        //     //return;
        // }

        // 开始日期
        var startDate = me.down('#leaderChartStartDate').value;
        if (startDate != undefined) {
            startDate = new Date(startDate).getTime();
        }
        // 结束日期
        var endDate = me.down('#leaderChartEndDate').value;
        if (endDate != undefined) {
            endDate = new Date(endDate).getTime();
        }
        if (startDate > endDate) {
            OrientExtUtil.Common.info('项目时间', '项目结束时间不能大于开始时间！');
            return;
        }
        // 项目编号
        var projectNo = me.down('#projectNo').value;
        // 试验类型
        var testType = me.down('#testType').value;
        // 项目状态
        var testStatus = me.down('#testStatus').value;

        // 如果没有查询条件则不查询
        var roleBtn = me.down("#roleType");
        var roleType = '';
        if(!roleBtn.disabled){
            roleType = roleBtn.value;
        }
        if(startDate || endDate || roleType || me.userId || me.depId || projectNo || testType || testStatus){
            /* == manger ? '试验经理试验项统计' : "试验经理试验项统计";*/
            var statisticType = me.down("#statisticType").value;
            OrientExtUtil.StatisticUtil.constructChart('', {
                    height: me.getHeight() - 30,
                    statisticName: statisticType == "th" ? "试验统计" : "试验项统计"
                }, {
                    startDate: startDate,
                    endDate: endDate,
                    roleType: roleType,
                    isLeaderChart: 'TRUE',
                    userId: me.userId,
                    deptId: me.depId,
                    projectNo: projectNo,
                    testType: testType,
                    testStatus: testStatus
                }, function (statisticCharts) {
                    // 清除原先的统计图，更换新的统计图
                    var panel = me.down('#leaderDepStatisticPanel');
                    panel.removeAll();
                    panel.add(statisticCharts);
                }, me
            );
        }

    },

    _createTooolbar: function () {
        var me = this;

        var toolbar = [];
        //项目图号
        toolbar.push({
            xtype: "textfield",
            itemId: 'projectNo',
            fieldLabel: '项目图号',
            labelWidth: 60,
            flex: 1,
            listeners: {
                'change': function (combobox, newValue, oldValue) {

                }
            }
        });

        //试验类型
        var testTypeStore = me.createTestTypeStore();
        toolbar.push({
            xtype: 'combobox',
            itemId: 'testType',
            fieldLabel: '试验类型',
            labelWidth: 60,
            flex: 1,
            emptyText: '试验类型',
            displayField: "display",
            valueField: "type",
            store: testTypeStore,
            listeners: {
                'change': function (combobox, newValue, oldValue) {

                }
            }
        });

        //试验类型
        toolbar.push({
            xtype: 'combobox',
            itemId: 'testStatus',
            fieldLabel: '试验状态',
            labelWidth: 60,
            flex: 1,
            emptyText: '试验状态',
            listeners: {
                'change': function (combobox, newValue, oldValue) {

                }
            },
            store: [
                ["未开始", '未开始'],
                ["进行中", '进行中'],
                ["已完成", '已完成']
            ]
        });

        // 部门
        // 判断当前登录用户角色，如果是所长，提供选择部门的下拉列表，如果是部门主任则默认为当前登录用户所在部门
        var activeUserRoleNames = '';
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/CustomRoleController/getCurrentUserRoleNames.rdm', {}, false, function (response) {
            activeUserRoleNames = response.decodedData;
        });
        if (activeUserRoleNames.length > 0 && activeUserRoleNames.indexOf('所长') > -1) {
            // 部门可在人员选择时实现过滤
            toolbar.push({
                itemId: 'leaderChartDepComonbox',
                xtype: 'textfield',
                fieldLabel: '选择部门',
                labelWidth: 60,
                // width: 150,
                flex: 1,
                readOnly: true, // 只读
                emptyText: '--选择部门--',
                listeners: {
                    focus: function (scope, the, ops) {
                        me._selectDeptWindow();
                    }
                }
            }, '-');

        } else {
            me.depId = deptId;
        }

        // 选择人员
        var userBtnObjParam = {};
        if (activeUserRoleNames.length > 0 && (
            activeUserRoleNames.indexOf('所长') > -1 || activeUserRoleNames.indexOf('部长') > -1 || activeUserRoleNames.indexOf('主任')
        )) {
            // 人员选择后则按个人进行统计
            me.isLeader = true;
            userBtnObjParam.disabled = false;
            userBtnObjParam.listeners = {
                focus: function () {
                    me._selectUserWindow();
                }
            };
        } else {
            // 不是所长，部长或者主任，只能统计与自己相关的
            me.isLeader = false;
            me.userId = userId;
            userBtnObjParam.value = userAllName;
            userBtnObjParam.disabled = true;
        }
        var userBtnObj = {
            xtype: 'textfield',
            itemId: 'chooseUserCombobox',
            fieldLabel: '选择人员',
            labelWidth: 60,
            disabled: true,
            flex: 1,
            readOnly: true, // 只读
            emptyText: '--未选人员，则按部门统计--'
        };
        Ext.apply(userBtnObj, userBtnObjParam);
        toolbar.push(userBtnObj, '-');


        toolbar.push({
                xtype: 'combobox',
                itemId: 'roleType',
                fieldLabel: '角色类型',
                labelWidth: 60,
                flex: 1,
                disabled: me.isLeader,
                listeners: {
                    'change': function (combobox, newValue, oldValue) {
                        var statisticType = this.up().up().down("#statisticType");
                        if (newValue == "tester") {
                            statisticType.setValue("tester");
                            statisticType.setDisabled(true);
                        } else {
                            statisticType.setDisabled(false);
                        }
                    }
                },
                store: [
                    // 经理可以统计试验任务和试验试验，测试人员只能统计与自己相关的试验项
                    ["manger", '试验经理'],
                    ["tester", '测试人员']
                ]
            }, '-', {
                xtype: 'combobox',
                itemId: 'statisticType',
                fieldLabel: '统计内容',
                disabled: true,
                labelWidth: 60,
                flex: 1,
                value: "rw",
                store: [
                    ["th", '试验'],
                    ["rw", '试验项']
                ]
            }, '-', {
                xtype: 'datefield',
                labelWidth: 80,
                flex: 1,
                fieldLabel: '预计开始时间',
                itemId: 'leaderChartStartDate',
                emptyText: '预计开始时间'
            }, '-', {
                xtype: 'datefield',
                itemId: 'leaderChartEndDate',
                labelWidth: 80,
                flex: 1,
                fieldLabel: '预计结束时间',
                emptyText: '预计结束时间'
            }, '-', {
                text: '统计',
                iconCls: 'icon-query',
                itemId: 'query',
                width: 60,
                handler: me._getChartParam,
                scpoe: me
            }, '-', {
                text: '清空',
                iconCls: 'icon-clear',
                width: 60,
                handler: function () {
                    if (this.up().down('#leaderChartDepComonbox') != null) {
                        this.up().down('#leaderChartDepComonbox').reset();
                        me.depId = '';
                    }
                    if (!this.up().down('#chooseUserCombobox').disabled) {
                        this.up().down('#chooseUserCombobox').reset();
                        me.userId = '';
                    }

                    this.up().down('#projectNo').reset();
                    this.up().down('#testType').reset();
                    this.up().down('#testStatus').reset();

                    this.up().down('#roleType').reset();
                    this.up().down("#roleType").setDisabled(me.isLeader);
                    if (me.isLeader) {
                        this.up().down('#roleType').setValue('manger');
                    }
                    this.up().down('#statisticType').reset();
                    this.up().down('#statisticType').setDisabled(true);
                    this.up().down('#leaderChartStartDate').reset();
                    this.up().down('#leaderChartEndDate').reset();

                    // 清除已有的饼图
                    this.up().up().removeAll();
                }
            }
        );

        // 部门以下拉列表的形式展示
        // 查询
        /*var results = '';
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/dept/getByPid.rdm',{
            node: '-2'
        },false, function (response) {
            var result = Ext.decode(response.responseText);
            results = result.results;
        });*/

        /*toolbar.unshift({
            id: 'leaderChartDepComonbox',
            xtype : 'combobox',
            iconCls: 'icon-create',
            name : 'currYear',
            fieldLabel : '选择部门',
            labelAlign : 'left',
            labelWidth : 60,
            emptyText : '--选择需要查看统计结果的部门--',
            margin : '5 5 5 5',
            displayField : 'text',
            valueField : 'id',
            triggerAction : 'all',
            queryMode: 'local',
            store: Ext.create('Ext.data.Store', {
                fields: ['id', 'text'],
                data: results
            }),
            validator: function(val) {
                if (!val) {
                    return '未选择需要查看统计结果的部门';
                }
                return true;
            },
            listeners:{
                change: function (scope, newValue) {
                    me.depId = newValue;
                }
            }
        }, '-');*/

        return toolbar;
    },

    /**
     * 选择部门窗口
     * @private
     */
    _selectDeptWindow: function () {
        var me = this;

        new Ext.Window({
            width: 0.8 * globalWidth,
            title: '选择部门数据',
            height: 0.8 * globalHeight,
            layout: 'fit',
            modal: true,
            items: [{
                xtype: 'tableEnumPanel',
                // 写死了部门表ID
                modelId: '3654',
                isMulti: false,
                selectedValue: me.depId == "" ? "" : [me.depId]
            }],
            buttons: [{
                text: '保存',
                handler: function () {
                    var selectedData = this.up('window').down("tableEnumPanel").getSelectedData();
                    if (selectedData == undefined || selectedData.length == 0 || selectedData == []) {
                        OrientExtUtil.Common.info('提示', '未选择需要查看统计结果的部门！');
                        return false;
                    }
                    for (var i = 0; i < selectedData.length; i++) {
                        me.depId = selectedData[i].ID;
                        me.down('#leaderChartDepComonbox').setValue(selectedData[i].NAME);
                    }
                    this.up("window").close();
                }
            }]
        }).show();
    },

    /**
     * 选择人员
     * @private
     */
    _selectUserWindow: function () {
        var me = this;
        var userSelectorPanel = Ext.create('OrientTdm.Common.Extend.Form.Selector.ChooseUserPanel', {
            selectedValue: me.userId,
            filterType: '0',
            filterValue: me.depId,
            multiSelect: false,
            showCalendar: false,
            saveAction: function (saveData, callBack) {
                if (saveData[0] != undefined) {
                    me.userId = saveData[0].id;
                    me.down("#chooseUserCombobox").setValue(saveData[0].name);
                    me.down("#roleType").setDisabled(false);
                    this.up('window').close();
                } else {
                    OrientExtUtil.Common.tip('提示', '请至少选择一条记录');
                }

            }
        });
        var win = Ext.create('Ext.Window', {
            plain: true,
            height: 700,
            width: 900,
            layout: 'fit',
            maximizable: true,
            title: '选择用户',
            modal: true,
            style: {
                'z-index': 1000
            },
            items: [userSelectorPanel]
        });
        win.show();
    },

    createTestTypeStore: function () {
        var store = Ext.create("Ext.data.Store", {
            autoLoad: true,
            proxy: {
                type: "ajax",
                url: serviceName + "/UserTestDataInfoStatisticsController/getTestType.rdm",
                pageSize: 5,
                reader: {
                    type: "json",
                    totalProperty: "totalproperty",
                    root: "results"
                }
            },
            fields: [{
                name: "type",
                type: "string"
            }, {
                name: "display",
                type: "string"
            }]
        });
        return store;
    }

});