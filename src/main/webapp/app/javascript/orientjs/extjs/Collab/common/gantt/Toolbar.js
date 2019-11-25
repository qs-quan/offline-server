Ext.define("OrientTdm.Collab.common.gantt.Toolbar", {
    extend: "Ext.Toolbar",
    requires: [
        'OrientTdm.Collab.common.auditFlow.ChooseAuditAssignGraphPanel'
    ],
    gantt: null,
    initComponent: function () {
        var gantt = this.gantt;
        var me = this;

        var items = [
            {
                xtype: 'buttongroup',
                title: '视图工具',
                columns: 3,
                items: [
                    {
                        iconCls: 'icon-prev',
                        text: '向前',
                        handler: function () {
                            gantt.shiftPrevious();
                        }
                    },
                    {
                        iconCls: 'icon-next',
                        text: '向后',
                        handler: function () {
                            gantt.shiftNext();
                        }
                    },
                    {
                        text: '全部折叠',
                        iconCls: 'icon-collapseall',
                        handler: function () {
                            gantt.collapseAll();
                        }
                    },
                    {
                        text: '全屏查看',
                        iconCls: 'icon-fullscreen',
                        disabled: !this._fullScreenFn,
                        handler: function () {
                            this.showFullScreen();
                        },
                        scope: this
                    },
                    {
                        text: '适中',
                        iconCls: 'zoomfit',
                        handler: function () {
                            gantt.zoomToFit();
                        }
                    },
                    {
                        text: '全部展开',
                        iconCls: 'icon-expandall',
                        handler: function () {
                            gantt.expandAll();
                        }
                    }
                ]
            },
            {
                xtype: 'buttongroup',
                title: '日期尺度',
                columns: 2,
                items: [
                    {
                        text: '6周',
                        handler: function () {
                            gantt.switchViewPreset('weekAndMonth');
                        }
                    },
                    {
                        text: '10周',
                        handler: function () {
                            gantt.switchViewPreset('weekAndDayLetter');
                        }
                    },
                    {
                        text: '1年',
                        handler: function () {
                            gantt.switchViewPreset('monthAndYear');
                        }
                    },
                    {
                        text: '5年',
                        handler: function () {
                            var start = new Date(gantt.getStart().getFullYear(), 0);

                            gantt.switchViewPreset('monthAndYear', start, Ext.Date.add(start, Ext.Date.YEAR, 5));
                        }
                    }
                ]
            },
            {
                xtype: 'buttongroup',
                title: '高级显示',
                columns: 2,
                items: [
                    {
                        text: '展示基线',
                        iconCls: 'showbaseline',
                        enableToggle: true,
                        pressed: true,
                        handler: function () {
                            gantt.el.toggleCls('sch-ganttpanel-showbaseline');
                        }
                    },
                    {
                        text: '高亮关键路径',
                        iconCls: 'togglebutton',
                        enableToggle: true,
                        handler: function (btn) {
                            var v = gantt.getSchedulingView();
                            if (btn.pressed) {
                                v.highlightCriticalPaths(true);
                            } else {
                                v.unhighlightCriticalPaths(true);
                            }
                        }
                    },
                    {
                        iconCls: 'action',
                        text: '跳转至最后',
                        handler: function (btn) {
                            var latestEndDate = new Date(0),
                                latest;
                            gantt.taskStore.getRootNode().cascadeBy(function (task) {
                                if (task.get('EndDate') >= latestEndDate) {
                                    latestEndDate = task.get('EndDate');
                                    latest = task;
                                }
                            });
                            gantt.getSchedulingView().scrollEventIntoView(latest, true);
                        }
                    },
                    {
                        xtype: 'textfield',
                        emptyText: '搜索任务',
                        width: 150,
                        enableKeyEvents: true,
                        listeners: {
                            keyup: {
                                fn: function (field, e) {
                                    var value = field.getValue();
                                    var regexp = new RegExp(Ext.String.escapeRegex(value), 'i');

                                    if (value) {
                                        gantt.taskStore.filterTreeBy(function (task) {
                                            return regexp.test(task.get('name'))
                                        });
                                    } else {
                                        gantt.taskStore.clearTreeFilter();
                                    }
                                },
                                buffer: 300,
                                scope: this
                            },
                            specialkey: {
                                fn: function (field, e) {
                                    if (e.getKey() === e.ESC) {
                                        field.reset();

                                        gantt.taskStore.clearTreeFilter();
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        ];

        if (gantt.enableControl) {

            var controlBtns = [];

            var canSetBaseline = gantt.controlStatus.canSetBaseline;
            var canEditBaseline = gantt.controlStatus.canEditBaseline;

            if (canSetBaseline) {
                controlBtns.push({
                    text: '设定基线',
                    iconCls: 'icon-setbaseline',
                    enableToggle: true,
                    handler: function () {
                        me.doStartBaselineSetAuditFlow();
                    }
                });
            } else if (canEditBaseline) {
                controlBtns.push({
                    text: '修改基线',
                    iconCls: 'icon-editbaseline',
                    enableToggle: true,
                    handler: function () {
                        me.doStartBaselineEditAuditFlow();
                    }
                });
            } else {
                var text;
                var piId;
                if (gantt.controlStatus.baselineSetAuditIsLastest == true) {
                    text = "基线设置审批进度";
                    piId = gantt.controlStatus.baselineSetAuditFlowInfo.piId;
                } else {
                    text = "基线修改审批进度";
                    piId = gantt.controlStatus.baselineEditAuditFlowInfo.piId;
                }
                controlBtns.push({
                    text: text,
                    iconCls: "icon-baselineAuditStatus",
                    handler: function () {
                        var flowDiagPanel = Ext.create("OrientTdm.Collab.common.auditFlow.MonitAuditFlowPanel", {
                            piId: piId
                        });

                        var win = Ext.create('Ext.Window', {
                            plain: true,
                            height: 600,
                            width: 800,
                            layout: 'fit',
                            maximizable: false,
                            title: text,
                            modal: true,
                            items: [flowDiagPanel]
                        });

                        win.show();
                    }
                });
            }

            controlBtns.push({
                text: '启动项目',
                iconCls: 'icon-startproject',
                enableToggle: true,
                // disabled : !gantt.controlStatus.canStartProject,
                handler: function () {
                    var params = {
                        projectId: gantt.dataId
                    };

                    OrientExtUtil.AjaxHelper.doRequest(serviceName + "/project/start.rdm", params, false, function (response) {
                        var retV = response.decodedData;
                        var success = retV.success;
                        if (success) {
                            gantt.refresh();
                        }
                    });
                }
            });

            controlBtns.push({
                text: '提交项目',
                iconCls: 'icon-submitproject',
                enableToggle: true,
                disabled : !gantt.controlStatus.canSubmitProject,
                handler: function () {
                    var params = {
                        projectId: gantt.dataId
                    };

                    OrientExtUtil.AjaxHelper.doRequest(serviceName + "/project/commit.rdm", params, false, function (response) {

                    });
                }
            });

            items.unshift({
                xtype: 'buttongroup',
                title: '操作',
                columns: 2,
                items: controlBtns
            });
        };

        Ext.apply(this, {
            items: items
        });

        this.callParent(arguments);
    },

    applyPercentDone: function (value) {
        this.gantt.getSelectionModel().selected.each(function (task) {
            task.setPercentDone(value);
        });
    },

    showFullScreen: function () {
        this.gantt.el.down('.x-panel-body').dom[this._fullScreenFn]();
    },

    doStartBaselineSetAuditFlow: function () {
        var me = this;
        var gantt = this.gantt;
        var params = {
            rootModelName: gantt.modelName,
            rootDataId: gantt.dataId
        };
        OrientExtUtil.AjaxHelper.doRequest(serviceName + "/gantt/baseLine/set.rdm", params, false, function (response) {
            var retV = response.decodedData;
            var success = retV.success;
            if (success) {
                var pdId = TDM_SERVER_CONFIG.BASELINE_AUDIT_NAME;
                var item = Ext.create('OrientTdm.Collab.common.auditFlow.ChooseAuditAssignGraphPanel', {
                    pdId: pdId
                });
                OrientExtUtil.WindowHelper.createWindow(item, {
                    title: '基线审批',
                    buttons: [
                        {
                            text: '关闭',
                            iconCls: 'icon-close',
                            handler: function () {
                                this.up('window').close();
                            }
                        },
                        {
                            text: '启动',
                            iconCls: 'icon-startFlow',
                            handler: function () {
                                var currentWin = this.up('window');
                                var chooseUserGraphPanel = currentWin.down('chooseAuditAssignGraphPanel');
                                var assigners = chooseUserGraphPanel.getAssignInfos();
                                var taskUserAssigns = {};
                                Ext.each(assigners, function (assigner) {
                                    if (!Ext.isEmpty(assigner.assign_username)) {
                                        if (assigner.assign_username.indexOf(',') != -1) {
                                            //用户组
                                            taskUserAssigns[assigner.taskName] = {
                                                candidateUsers: assigner.assign_username
                                            };
                                        } else {
                                            //单用户
                                            taskUserAssigns[assigner.taskName] = {
                                                currentUser: assigner.assign_username
                                            };
                                        }
                                    }
                                });
                                var bindDatas = {};
                                bindDatas[gantt.modelName] = gantt.dataId;
                                var params = {
                                    pdId: pdId,
                                    auditType: 'WbsBaseLineAudit',
                                    bindDatas: [{
                                        model: gantt.modelName,
                                        dataId: gantt.dataId,
                                        processType: 'gantt'
                                    }],
                                    taskUserAssigns: taskUserAssigns
                                };
                                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/auditFlow/control/start.rdm', params, true, function (resp) {
                                    var fatherPanel = me.up('ganttPanel');
                                    fatherPanel.refresh();
                                    currentWin.close();
                                }, true);
                            }
                        }
                    ]
                });
            }
        });
    },

    doStartBaselineEditAuditFlow: function () {
        var me = this;
        var gantt = this.gantt;
        var params = {
            rootModelName: gantt.modelName,
            rootDataId: gantt.dataId
        };

        var pdId = TDM_SERVER_CONFIG.BASELINE_CHANGE_AUDIT_NAME;
        var item = Ext.create('OrientTdm.Collab.common.auditFlow.ChooseAuditAssignGraphPanel', {
            pdId: pdId
        });
        OrientExtUtil.WindowHelper.createWindow(item, {
            title: '基线修改审批',
            buttons: [
                {
                    text: '关闭',
                    iconCls: 'icon-close',
                    handler: function () {
                        this.up('window').close();
                    }
                },
                {
                    text: '启动',
                    iconCls: 'icon-startFlow',
                    handler: function () {
                        var currentWin = this.up('window');
                        var chooseUserGraphPanel = currentWin.down('chooseAuditAssignGraphPanel');
                        var assigners = chooseUserGraphPanel.getAssignInfos();
                        var taskUserAssigns = {};
                        Ext.each(assigners, function (assigner) {
                            if (!Ext.isEmpty(assigner.assign_username)) {
                                if (assigner.assign_username.indexOf(',') != -1) {
                                    //用户组
                                    taskUserAssigns[assigner.taskName] = {
                                        candidateUsers: assigner.assign_username
                                    };
                                } else {
                                    //单用户
                                    taskUserAssigns[assigner.taskName] = {
                                        currentUser: assigner.assign_username
                                    };
                                }
                            }
                        });
                        var bindDatas = {};
                        bindDatas[gantt.modelName] = gantt.dataId;
                        var params = {
                            pdId: pdId,
                            auditType: 'WbsBaseLineEditAudit',
                            bindDatas: [{
                                model: gantt.modelName,
                                dataId: gantt.dataId,
                                processType: 'gantt'
                            }],
                            taskUserAssigns: taskUserAssigns
                        };
                        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/auditFlow/control/start.rdm', params, true, function (resp) {
                            var fatherPanel = me.up('ganttPanel');
                            fatherPanel.refresh();
                            currentWin.close();
                        }, true);
                    }
                }
            ]
        })
    },

    // Experimental, not X-browser
    _fullScreenFn: (function () {
        var docElm = document.documentElement;

        if (docElm.requestFullscreen) {
            return "requestFullscreen";
        }
        else if (docElm.mozRequestFullScreen) {
            return "mozRequestFullScreen";
        }
        else if (docElm.webkitRequestFullScreen) {
            return "webkitRequestFullScreen";
        }
    })()
})
;
