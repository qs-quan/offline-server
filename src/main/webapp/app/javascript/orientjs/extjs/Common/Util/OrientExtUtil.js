/**
 * Created by enjoy on 2016/3/16 0016.
 * Ext组件相关通用函数
 */

Ext.define("OrientTdm.Common.Util.OrientExtUtil", {
    extend: 'Ext.Base',
    alternateClassName: 'OrientExtUtil',
    statics: {
        HomeHelper: {
            getPortalloadConfig: function (homeContainer) {
                return {
                    url: serviceName + '/home/listUserPortal.rdm',
                    autoLoad: true,
                    loadMask: true,
                    renderer: function (loader, response, active) {
                        var portals = response.decodedData.results;
                        var portalCount = portals.length;
                        var target = loader.getTarget();
                        target.removeAll();
                        var windowWidth = Ext.getBody().getWidth();
                        var cols = windowWidth >= 1440 ? 3 : 2;
                        switch (portalCount) {
                            case 0:
                                cols = 1;
                                break;
                            case 1:
                                cols = 1;
                                break;
                            case 2:
                                cols = 2;
                                break;
                            case 3:
                                cols = 3;
                                break;
                            default : //大于等于4则显示两列
                                cols = 2;
                                break;
                        }
                        var rows = Math.ceil(portals.length / cols);
                        var lastPortalColumn;
                        Ext.each(portals, function (portal, index) {
                            if (index % rows == 0) {
                                lastPortalColumn = Ext.create("OrientTdm.HomePage.Portal.PortalColumn", {
                                    columnWidth: 1 / cols
                                });
                                target.add(lastPortalColumn);
                            }
                            var item = {};
                            if (!Ext.isEmpty(portal.jspath)) {
                                item = Ext.create(portal.jspath);
                            } else if (!Ext.isEmpty(portal.url)) {

                                item = Ext.create("OrientTdm.Common.Extend.Panel.OrientPanel", {
                                    padding: '0 0 0 5',
                                    layout: 'fit',
                                    html: '<iframe width="100%" height="100%" marginwidth="0" framespacing="0" marginheight="0" frameborder="0" src = "' + portal.url + '"></iframe>'
                                });
                            }
                            if (portal.title == "") {
                                var portlet = Ext.create("OrientTdm.HomePage.Portal.Portlet", {
                                    items: [item],
                                    height: (Ext.getBody().getHeight() - 300) / rows,
                                    frame: false,
                                    listeners: {
                                        'close': Ext.bind(homeContainer.onPortletClose, homeContainer, [portal])
                                    }
                                });
                                lastPortalColumn.add(portlet);
                            } else {
                                var iconUrl = portal.iconUrl;
                                if (iconUrl == null || iconUrl == "") {
                                    iconUrl = "app/images/homepage/default.png";
                                }
                                var portlet = Ext.create("OrientTdm.HomePage.homePageShow.CustomPortlet", {
                                    title: '<img width ="16" height="16" src="' + iconUrl + '" style="vertical-align:top;margin-right:4px;margin-top:-2px""/>' + portal.title,
                                    items: [item],
                                    height: (Ext.getBody().getHeight() - 300) / rows,
                                    listeners: {
                                        'close': Ext.bind(homeContainer.onPortletClose, homeContainer, [portal])
                                    }
                                });
                                lastPortalColumn.add(portlet);
                            }
                        });
                        return true;

                    }

                }
            },
            refreshNoticeMsgCount: function () { //刷新消息数目
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/msg/getUserMsgsCnt.rdm?readed=false', {
                    userId: window.userId
                }, true, function (resp) {
                    var currentMsgCount = resp.decodedData;
                    window.document.getElementById('msgCnt').innerHTML = "(" + currentMsgCount + ")";
                });
            }
        },
        FunctionHelper: {
            getSchemaId: function () {
                return '560';
            },
            getSYZYSchemaId: function () {
                return '462';
            },
            getTestDataSchemaId: function () {
                return '500';
            },
            getKnowledgeSchemaId: function () {
                // 根据自身情况来
                return '520';
            },
            getExperimentSchemaId: function () {
                return '540';
            },
            functionClicked: function (treePanel, td, cellIndex, record, tr, rowIndex, event, eOpts, responsePanel) {
                var functionPanelId = "function-" + record.get("id");
                if (responsePanel) {
                    if (responsePanel.getXTypes().indexOf('tabpanel') != -1) {
                        var functionPanel = responsePanel.child('panel[itemId=' + functionPanelId + ']');
                        if (!functionPanel) {
                            functionPanel = OrientExtUtil.FunctionHelper.createFunctionPanel(record.data, true);
                            responsePanel.add(functionPanel);
                        }
                        responsePanel.setActiveTab(functionPanel);
                    } else {
                        responsePanel.removeAll();
                        responsePanel.add(OrientExtUtil.FunctionHelper.createFunctionPanel(record.data, true));
                        responsePanel.doLayout();
                    }
                }
            },
            createFunctionPanel: function (functionDesc, initId) {
                var retVal = {};
                //判断是url 还是 js
                if (!Ext.isEmpty(functionDesc.url)) {
                    retVal = Ext.create("OrientTdm.Common.Extend.Panel.OrientPanel", {
                        padding: '0 0 0 5',
                        layout: 'fit',
                        title: functionDesc.name,
                        html: '<iframe width="100%" height="100%" marginwidth="0" framespacing="0" marginheight="0" frameborder="0" src = "' + me.functionDesc.url + '"></iframe>'
                    });
                } else if (!Ext.isEmpty(functionDesc.js)) {
                    //加载第一个面板
                    Ext.require(functionDesc.js);
                    var icon = functionDesc.hasChildrens ? '' : functionDesc.icon;
                    var smalIcon = icon.indexOf('_small') != -1 ? icon : icon.replace('.', '_small.');
                    var initParam = {
                        title: functionDesc.name,
                        icon: smalIcon
                    };
                    if (initId) {
                        Ext.apply(initParam, {
                            itemId: "function-" + functionDesc.id,
                            layout: 'fit',
                            closable: true,
                            functionDesc: functionDesc
                        });
                    }
                    retVal = Ext.create(functionDesc.js, initParam);
                } else {
                    retVal = null;
                }
                return retVal;
            }
        },
        FormHelper: {
            generateFormData: function (form) {
                var formValue = {};
                //准备提交数据
                Ext.iterate(form.getValues(), function (key, value) {
                    formValue[key] = value;
                }, this);
                return formValue;
            },
            createGridByColumns: function (columns, collapsed) {
                //创建展现形式为表格的类型字段
                var retVal = [];
                Ext.each(columns, function (column) {
                    var columnWebDesc = {
                        xtype: 'fieldset',
                        border: '1 1 1 1',
                        collapsible: true,
                        collapsed: collapsed,
                        title: column.text,
                        items: [
                            {
                                xtype: column.className,
                                columnDesc: column
                            }
                        ]
                    };
                    retVal.push(columnWebDesc);
                });
                return retVal;
            },
            getModelData: function (modelDataForm) {
                var retVal = {};
                var form = modelDataForm.getForm();
                if (!Ext.isEmpty(modelDataForm.originalData)) {
                    if (modelDataForm.originalData instanceof Ext.data.Model) {
                        modelDataForm.formValue = Ext.apply(modelDataForm.originalData.getData(), OrientExtUtil.FormHelper.generateFormData(form));
                    }
                    else {
                        modelDataForm.formValue = Ext.apply(modelDataForm.originalData, OrientExtUtil.FormHelper.generateFormData(form));
                    }
                } else
                    modelDataForm.formValue = OrientExtUtil.FormHelper.generateFormData(form);
                //拼接模型参数
                Ext.apply(retVal, {
                    formData: Ext.encode({
                        fields: modelDataForm.formValue
                    })
                });
                return retVal;
            }
        },
        GridHelper: {
            getSelectRecordIds: function (grid) {
                var retVal = [];
                var selections = grid.getSelectionModel().getSelection();
                Ext.each(selections, function (record) {
                    retVal.push(record.get("id"));
                });
                return retVal;
            },
            deleteRecords: function (grid, url, afterDeleteCallback) {
                var selections = grid.getSelectionModel().getSelection();
                if (selections.length === 0) {
                    OrientExtUtil.Common.err(OrientLocal.prompt.info, OrientLocal.prompt.atleastSelectOne);
                } else {
                    OrientExtUtil.Common.confirm(OrientLocal.prompt.confirm, OrientLocal.prompt.deleteConfirm, function (btn) {
                        if (btn == 'yes') {
                            var toDelIds = OrientExtUtil.GridHelper.getSelectRecordIds(grid);
                            Ext.getBody().mask("请稍后...", "x-mask-loading");
                            Ext.Ajax.request({
                                url: url,
                                params: {
                                    toDelIds: toDelIds
                                },
                                success: function (response) {
                                    Ext.getBody().unmask();
                                    if (afterDeleteCallback) {
                                        afterDeleteCallback.call(grid);
                                    }
                                }
                            });
                        }
                    });
                }
            },
            hasSelectedOne: function (grid) {
                var retVal = false;
                var selections = grid.getSelectionModel().getSelection();
                if (selections.length === 0) {
                    OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.atleastSelectOne);
                } else if (selections.length > 1) {
                    OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.onlyCanSelectOne);
                } else {
                    retVal = true;
                }
                return retVal;
            },
            hasSelected: function (grid) {
                var retVal = false;
                var selections = grid.getSelectionModel().getSelection();
                if (selections.length === 0) {
                    OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.atleastSelectOne);
                } else {
                    retVal = true;
                }
                return retVal;
            },
            getSelectedRecord: function (grid) {
                return grid.getSelectionModel().getSelection();
            }
        },
        WindowHelper: {
            createWindow: function (item, config, height, width) {
                var win = Ext.create('Ext.Window', Ext.apply({
                        plain: true,
                        autoShow: true,
                        maximizable: true,
                        height: height || 650,
                        width: width || 800,
                        layout: 'fit',
                        modal: true,
                        items: Ext.isArray(item) ? item : [
                            item
                        ]
                    }, config)
                );
                return win;
            }
        },
        TreeHelper: {
            /**
             * 试验数据管理树的获取上层节点id
             * @param id 当前节点id
             * @param frequency 次数
             */
            getParentNodes: function (id, frequency) {
                var nodeId = "";
                OrientExtUtil.AjaxHelper.doRequest(serviceName + "/TbomQueryController/getParentNodeIds.rdm", {
                    frequency: frequency,
                    nodeId: id
                }, false, function (response) {
                    nodeId = Ext.Array.pluck(response.decodedData, 'nodeId').join(",");
                });
                return nodeId;
            },

            /**
             * 获取指定的子节点
             * @param cj 层级
             * @param id 节点Id
             * @param filter 要选择的子节点
             */
            getChildNode: function (cj, id, filter) {
                var nodeIds = '';
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomQueryController/getChildBom.rdm', {
                    cj: cj,
                    nodeId: id
                }, false, function (response) {
                    // 不指定
                    if (filter == '') {
                        nodeIds = Ext.Array.pluck(response.decodedData, 'id').join(',');
                    } else {
                        Ext.each(response.decodedData, function (item) {
                            if (filter == item.text) {
                                nodeIds = item.id;
                            }
                        });
                    }
                });

                return nodeIds;
            },
            getSelectNodeIds: function (tree) {
                var retVal = [];
                var selections = tree.getSelectionModel().getSelection();
                Ext.each(selections, function (record) {
                    retVal.push(record.get("id"));
                });
                return retVal;
            },
            getSelectNodes: function (tree) {
                var retVal = [];
                var selections = tree.getSelectionModel().getSelection();
                return selections;
            },
            deleteNodes: function (tree, url, afterDeleteCallback) {
                var selections = tree.getSelectionModel().getSelection();
                if (selections.length === 0) {
                    OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.atleastSelectOne);
                } else {
                    Ext.MessageBox.confirm(OrientLocal.prompt.confirm, OrientLocal.prompt.deleteConfirm, function (btn) {
                        if (btn == 'yes') {
                            var toDelIds = OrientExtUtil.TreeHelper.getSelectNodeIds(tree);
                            Ext.getBody().mask("请稍后...", "x-mask-loading");
                            Ext.Ajax.request({
                                url: url,
                                params: {
                                    toDelIds: toDelIds
                                },
                                success: function (response) {
                                    Ext.getBody().unmask();
                                    if (afterDeleteCallback) {
                                        afterDeleteCallback.call(tree);
                                    }
                                }
                            });
                        }
                    });
                }
            }
        },
        AjaxHelper: {
            doRequest: function (url, params, async, successCallBack, isJsonSubmit, scope) {
                OrientExtUtil.Common.mask('请求中,请稍等...');
                var ajaxInitConfig = {
                    "url": url,
                    "timeout": 100000000,
                    "async": async,
                    "success": function (response) {
                        OrientExtUtil.Common.unmask();
                        if (successCallBack) {
                            successCallBack.call(scope || this, response);
                        }
                    },
                    failure: function (response, opts) {
                        OrientExtUtil.Common.unmask();
                    }
                };
                if (isJsonSubmit == true) {
                    ajaxInitConfig["jsonData"] = params;
                } else {
                    ajaxInitConfig["params"] = params;
                }
                Ext.Ajax.request(ajaxInitConfig);
            }
        },
        FileHelper: {
            getFileInfoById: function (fileId) {
                var cwmfileInfo = {};
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelFile/getFileInfoById.rdm', {
                    fileId: fileId
                }, false, function (response) {
                    if (response.decodedData.success) {
                        cwmfileInfo = response.decodedData.results[0];
                    }
                });
                return cwmfileInfo;
            },
            doDownload: function (fileId) {
                var path = serviceName + "/orientForm/download.rdm?fileId=" + fileId;
                window.location.href = path;
            },
            doDownloadByFilePath: function (filePath, fileName, rootDir, isDelete) {
                var path = serviceName + "/FileMngController/downloadByFilePath.rdm?filePath=" + filePath + "&fileName=" + fileName
                    + "&rootDir=" + rootDir + "&isDelete=" + isDelete;
                window.location.href = path;
            },
            showVideo: function (fileId, type) {
                type = "ck";
                if (type == "ck") {
                    OrientExtUtil.AjaxHelper.doRequest(serviceName + "/modelFile/isConverCompleted.rdm", {
                        fileId: fileId
                    }, true, function (resp) {
                        var retVal = resp.decodedData.results;
                        if (retVal) {
                            var path = "app/views/file/ckVideoPreview.jsp?fileId=" + fileId;
                            var h = screen.availHeight - 35;
                            var w = screen.availWidth - 5;
                            var vars = "top=0,left=0,height=" + h + ",width=" + w + ",status=no,toolbar=no,menubar=no,location=no,resizable=1,scrollbars=1";
                            window.open(path, '_blank', vars);
                        }
                        else {
                            Ext.Msg.alert("提示", "视频未转换为MP4格式，无法播放");
                        }
                    });
                }
                else if (type == "vlc") {
                    var path = "app/views/file/vlcVideoPreview.jsp?fileId=" + fileId;
                    var h = screen.availHeight - 35;
                    var w = screen.availWidth - 5;
                    var vars = "top=0,left=0,height=" + h + ",width=" + w + ",status=no,toolbar=no,menubar=no,location=no,resizable=1,scrollbars=1";
                    window.open(path, '_blank', vars);
                }

            },
            openHadoopPanel: function (fileId) {
                //校验是否已经转化成功
                if (OrientExtUtil.FileHelper.isConverSuccess(fileId)) {
                    var hadoopPanelClass = 'OrientTdm.BigData.BigDataDashboard';
                    var centerPanel = Ext.getCmp('orient-center');
                    var hadoopPanelId = "hadoop-" + fileId;
                    var hadoopPanel = centerPanel.child('panel[id=' + hadoopPanelId + ']');
                    if (!hadoopPanel) {
                        Ext.require(hadoopPanelClass, function () {
                            var firstVisitHadoopPanel = Ext.create(hadoopPanelClass, {
                                id: hadoopPanelId,
                                layout: 'fit',
                                closable: true,
                                title: 'Hadoop数据查看',
                                fileId: fileId
                            });
                            centerPanel.add(firstVisitHadoopPanel);
                            centerPanel.setActiveTab(firstVisitHadoopPanel);
                        });
                    } else {
                        centerPanel.setActiveTab(hadoopPanel);
                    }
                } else
                    OrientExtUtil.Common.err(OrientLocal.prompt.error, OrientLocal.prompt.dataConvering);
            },
            openOdsPanel: function (fileId) {
                //校验是否已经转化成功
                if (OrientExtUtil.FileHelper.isConverSuccess(fileId)) {
                    var odsPanelClass = 'OrientTdm.ODSFile.ODSDashboard';
                    var centerPanel = Ext.getCmp('orient-center');
                    var odsPanelId = "Ods-" + fileId;
                    var odsPanel = centerPanel.child('panel[id=' + odsPanelId + ']');
                    if (!odsPanel) {
                        Ext.require(odsPanelClass, function () {
                            var firstVisitodsPanel = Ext.create(odsPanelClass, {
                                id: odsPanelId,
                                layout: 'fit',
                                closable: true,
                                title: 'ods数据查看',
                                fileId: fileId
                            });
                            centerPanel.add(firstVisitodsPanel);
                            centerPanel.setActiveTab(firstVisitodsPanel);
                        });
                    } else {
                        centerPanel.setActiveTab(odsPanel);
                    }
                } else
                    OrientExtUtil.Common.err(OrientLocal.prompt.error, OrientLocal.prompt.dataConvering);
            },
            isConverSuccess: function (fileId) {
                var retVal = false;
                //校验是否转化成功
                OrientExtUtil.AjaxHelper.doRequest(serviceName + "/modelFile/isConverCompleted.rdm", {
                    fileId: fileId
                }, false, function (resp) {
                    retVal = resp.decodedData.results;
                });
                return retVal;
            },
            previewDoc: function (reportId, dataId) {
                if (Ext.isIE) {
                    var h = screen.availHeight - 35;
                    var w = screen.availWidth - 5;
                    var vars = "top=0,left=0,height=" + h + ",width=" + w + ",status=no,toolbar=no,menubar=no,location=no,resizable=1,scrollbars=1";
                    window.open(serviceName + '/DocReports/generateReportForIE.rdm?reportId=' + reportId + '&dataId=' + dataId, '_blank', vars);
                } else
                    window.location.href = serviceName + '/DocReports/generateReport.rdm?reportId=' + reportId + '&dataId=' + dataId;
            }
        },
        StatisticUtil: {
            constructChart: function (statisticId, chartConfig, params, callBack, scope) {
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/StatisticSetUp/doStatisic.rdm', {
                    statisticId: statisticId,
                    statisticName: chartConfig.statisticName != null ? chartConfig.statisticName : '',
                    params: null != params ? Ext.encode(params) : ''
                }, true, function (resp) {
                    var panelItems = [];
                    var respData = resp.decodedData.results;
                    var charts = respData.statisticEntity.charts;
                    Ext.each(charts, function (chart) {
                        var chartFrontHandler = chart.customHandler || chart.belongStatisticChartInstanceHandler;
                        Ext.require(chartFrontHandler);
                        var chartId = chart.id;
                        var chartResult = respData.chartResultMap[chartId];
                        Ext.apply(chartConfig, {
                            itemId: 'charts_' + chartId,
                            chartData: chartResult,
                            chartSet: chart,
                            purpose: 'realData'
                        });
                        if (chartId && chartResult) {
                            var chartItem = Ext.create(chartFrontHandler, chartConfig);
                            panelItems.push(chartItem);
                        }
                    });
                    if (callBack) {
                        callBack.call(scope || this, panelItems);
                    }
                });
            }
        },
        ValidateHelper: {
            isImage: function (fileName) {
                var imageRegexp = /\.jpg$|\.gif|\.png|\.bmp|\.jpeg$/i;
                return imageRegexp.exec(fileName.toLowerCase()) != null;
            }
        },
        Common: {
            job: function (fn, delay) {
                var job = new Ext.util.DelayedTask(fn);
                job.delay(delay);
            },
            task: function (fn, interval) {
                var task = Ext.TaskManager.start({
                    run: fn,
                    interval: interval
                });
            },
            mask: function (msg, parent) {
                if (Ext.isEmpty(parent)) {
                    parent = Ext.getBody();
                }
                //msg = '正在处理中，请稍候...';
                msg = '';
                //OrientTdm.MaskObj = parent.mask(msg,'orientMask');
                OrientTdm.MaskObj = Ext.create('Ext.LoadMask', {
                    target: parent,
                    // 只遮盖容器内部区域(不含标题)
                    useTargetEl: true,
                    cls: 'orientMask',
                    msg: msg
                });
                OrientTdm.MaskObj.show();
                Ext.DomHelper.insertFirst(Ext.query('div.x-mask-msg.x-mask-loading')[0], {
                    cls: 'x-orientMask-icon'
                });
            },
            unmask: function () {
                try {
                    OrientTdm.MaskObj.hide();
                } catch (e) {
                    //
                }
            },
            tip: function (title, msg) {
                if (Ext.isEmpty()) {
                    title = '提示';
                }
                // title = '<i class="fa fa-bell-o"></i> ' + title;
                Ext.example.msg(title, msg);
                /*Ext.create('widget.uxNotification', {
                 position: 't',
                 cls: 'ux-notification-light',
                 closable: true,
                 title: OrientExtUtil.Common.title(title),
                 slideInDuration: 200,
                 autoCloseDelay: 1500,
                 slideInAnimation: 'ease',
                 minWidth: 200,
                 maxWidth: 600,
                 html: msg
                 }).show();*/
            },
            title: function (title) {
                return OrientExtUtil.Common.merge('<span class="app-container-title-normal">{0}</span>', title);
            },
            merge: function (string, v0, v1, v2, v3, v4, v5, v7, v8, v9) {
                var msg = Ext.String.format(string, v0, v1, v2, v3, v4, v5, v7, v8, v9);
                return msg;
            },
            hide: function () {
                try {
                    Ext.MessageBox.hide();
                } catch (e) {
                    // do nothing
                }
            },
            wait: function (msg, waitText) {
                if (Ext.isEmpty(waitText)) {
                    waitText = '处理中...';
                }
                if (Ext.isEmpty(msg)) {
                    msg = '系统正在处理您的请求，请稍候...';
                }
                Ext.MessageBox.show({
                    msg: msg,
                    wait: true,
                    waitConfig: {
                        interval: 1,
                        increment: 280,
                        text: '<span class="app-normal">' + waitText + '</span>'
                    }
                });
            },
            confirm: function (title, msg, fn) {
                if (Ext.isEmpty(title)) {
                    title = '请确认';
                }
                Ext.Msg.show({
                    title: '<span class="app-container-title-normal">' + title + '</span>',
                    msg: msg,
                    buttons: Ext.Msg.YESNO,
                    fn: fn,
                    buttonText: {
                        yes: '<span class="app-normal">确定</span>',
                        no: '<span class="app-normal">取消</span>'
                    },
                    icon: Ext.Msg.QUESTION
                });
            },
            err: function (title, msg, fn) {
                if (Ext.isEmpty(title)) {
                    title = '提示';
                }
                Ext.Msg.show({
                    title: '<span class="app-container-title-normal">' + title + '</span>',
                    msg: msg,
                    buttons: Ext.Msg.OK,
                    buttonText: {
                        ok: '<span class="app-normal">确定</span>'
                    },
                    fn: fn,
                    icon: Ext.Msg.ERROR
                });
            },
            info: function (title, msg, fn) {
                if (Ext.isEmpty(title)) {
                    title = '提示';
                }
                Ext.Msg.show({
                    title: '<span class="app-container-title-normal">' + title + '</span>',
                    msg: msg,
                    buttons: Ext.Msg.OK,
                    fn: fn,
                    buttonText: {
                        ok: '<span class="app-normal">确定</span>'
                    },
                    icon: Ext.Msg.INFO
                });

            },
            isJsonStr: function (str) {
                var isJson = false;
                if (str && typeof(str) == 'string') {
                    try {
                        Ext.decode(str);
                        isJson = true;
                    } catch (err) {

                    }
                }
                return isJson;
            },
            isObjNull: function (obj) {
                if (obj == null) {
                    return true;
                }
                else {
                    if (obj instanceof Object) {
                        for (var key in obj) {
                            return false;
                        }
                        return true;
                    }
                    else {
                        throw new Error("obj不是对象");
                    }
                }
            }
        },
        ModelHelper: {
            getModelId: function (tableName, schemaId, isView) {
                var modelId;
                if (isView == true || isView == "1") {
                    isView = "1";
                }
                else {
                    isView = "0";
                }
                var params = {
                    tableName: tableName,
                    schemaId: schemaId,
                    isView: isView
                };
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelData/getModelId.rdm', params, false, function (response) {
                    var retV = Ext.decode(response.responseText);
                    modelId = retV.results;

                });
                return modelId;
            },
            getDisplayDataByModelId: function (modelId, formData) {
                var displayData = "";
                var params = {
                    modelId: modelId,
                    formData: Ext.encode(formData)
                };
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomQueryController/getDisplayDataByModelId.rdm', params, false, function (response) {
                    var retV = Ext.decode(response.responseText);
                    displayData = retV.results;

                });
                return displayData;
            },
            getTemplateId: function (modelId, templateName) {
                var templateId;
                var params = {
                    modelId: modelId,
                    templateName: templateName
                };
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelData/getTemplateId.rdm', params, false, function (response) {
                    var retV = Ext.decode(response.responseText);
                    templateId = retV.results;

                });
                return templateId;
            },
            getModelDesc: function (modelId, templateId, isView) {
                if (isView == true || isView == "1") {
                    isView = "1";
                }
                else {
                    isView = "0";
                }

                var params = {
                    modelId: modelId,
                    templateId: templateId,
                    isView: isView
                };
                var retValue = null;
                OrientExtUtil.AjaxHelper.doRequest(serviceName + "/modelData/getGridModelDesc.rdm", params, false, function (response) {
                    var retV = Ext.decode(response.responseText);
                    if (retV.success) {
                        retValue = retV.results.orientModelDesc;
                    }
                });
                return retValue;
            },
            getModelData: function (modelName, schemaId, dataId) {
                var param = {
                    modelName: modelName,
                    schemaId: schemaId,
                    dataId: dataId
                };
                var retValue = "";
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelData/getModelDataByDataId.rdm', param, false, function (response) {
                    var retV = Ext.decode(response.responseText);
                    retValue = retV.results
                });
                return retValue;
            },
            createDataQuery: function (modelName, schemaId, customerFilter, ascCol, descCol, single, isView) {
                if (isView == true || isView == "1") {
                    isView = "1";
                }
                else {
                    isView = "0";
                }

                var param = {
                    modelName: modelName,
                    schemaId: schemaId,
                    customerFilter: Ext.isEmpty(customerFilter) ? "" : Ext.encode(customerFilter),
                    ascCol: Ext.isEmpty(ascCol) ? "" : ascCol,
                    descCol: Ext.isEmpty(descCol) ? "" : descCol,
                    single: Ext.isEmpty(single) ? false : single,
                    isView: isView
                };
                var retValue = "";
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelData/createDataQuery.rdm', param, false, function (response) {
                    var retV = Ext.decode(response.responseText);
                    retValue = retV.results
                });
                return retValue;
            },
            updateModelData: function (modelId, dataList) {
                var param = {
                    modelId: modelId,
                    dataList: Ext.encode(dataList)
                };
                var retValue = false;
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelData/updateModelDataList.rdm', param, false, function (response) {
                    var retV = Ext.decode(response.responseText);
                    retValue = retV.success
                });
                return retValue;
            },
            deleteModelData: function (modelId, toDelIds, isCascade) {
                var param = {
                    modelId: modelId,
                    toDelIds: toDelIds,
                    isCascade: isCascade ? 'true' : 'false'
                };
                var retValue = false;
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelData/deleteModelData.rdm', param, false, function (response) {
                    var retV = Ext.decode(response.responseText);
                    retValue = retV.success
                });
                return retValue;
            }
        },
        SysMgrHelper: {
            getDefaultName: function () {
                return '试验经理授权角色';
            },
            getGuestUserId: function () {
                return '260'
            },
            getUserInfo: function (userId, userName) {
                var user = null;
                var params = {
                    userId: userId,
                    userName: userName
                };
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/user/getUserInfo.rdm', params, false, function (response) {
                    var retVal = Ext.decode(response.responseText);
                    user = retVal.results;
                });
                return user;
            },
            getCustomRoleIds: function () {
                var roleIds = "";
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/role/getCustomRoleIds.rdm', {}, false, function (response) {
                    if (response.decodedData.success) {
                        roleIds = response.decodedData.results;
                    }
                });
                return roleIds;
            }
        },
        JSFunctionHelp: {
            //当fn返回true时执行object[methodName]，否则不执行（若无条件判断情况请用Ext.Function.interceptBefore）
            conditionInterceptBefore: function (object, methodName, fn, scope) {
                var method = object[methodName] || Ext.emptyFn;

                return (object[methodName] = function () {
                    var ret = fn.apply(scope || this, arguments);
                    if (ret) {
                        method.apply(this, arguments);
                    }
                    return ret;
                });
            },
            //当object[methodName]返回true时执行fn，否则不执行，一般与conditionInterceptBefore结合使用（若无条件判断情况请用Ext.Function.interceptAfter）
            conditionInterceptAfter: function (object, methodName, fn, scope) {
                var method = object[methodName] || Ext.emptyFn;

                return (object[methodName] = function () {
                    var ret = method.apply(this, arguments);
                    if (ret) {
                        ret = fn.apply(scope || this, arguments);
                    }
                    return ret;
                });
            }
        },
        IEHelper: {
            indexOf: function (arr, item) {
                if (!Array.prototype.indexOf) {
                    Array.prototype.indexOf = function (elt) {
                        var len = this.length >>> 0;

                        var from = Number(arguments[1]) || 0;
                        from = (from < 0)
                            ? Math.ceil(from)
                            : Math.floor(from)
                        if (from < 0) {
                            if (from in this && this[from] === elt)
                                return from;
                            return -1;
                        }
                    };
                    return arr.indexOf(item);
                }
            }
        }

    }
})
;
