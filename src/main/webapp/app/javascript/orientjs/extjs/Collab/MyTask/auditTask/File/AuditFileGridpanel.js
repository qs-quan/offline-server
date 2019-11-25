/**
 * 审批附件列表
 */

Ext.define('OrientTdm.Collab.MyTask.auditTask.File.AuditFileGridpanel', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alternateClassName: 'OrientExtend.AuditFileGridpanel',
    alias: 'widget.AuditFileGridpanel',
    requires: [
        "OrientTdm.DataMgr.FileMgr.Model.ModelFileExtModel",
        "OrientTdm.Common.Util.HtmlTriggerHelper"
    ],
    config: {
        modelId: '',
        dataId: '',
        nodeId: '',
        fileGroupId: ''
    },

    initEvents: function() {
        var me = this;
        me.callParent(arguments);
        me.mon(me, 'changeCollabToolbarDisable', me._changeToolbarDisable, me);
    },

    /**
     * 按钮栏
     * @returns {*[]}
     */
    createToolBarItems: function () {
        var me = this;

        if(me.taskName == '申请人发起审批'){
            return [{
                iconCls: 'icon-create',
                    text: '上传审批附件',
                itemId: 'create',
                scope: this,
                handler: me._onCreateClick
            }];
        }else{
            return [];
        }

        // 已办任务不显示按钮
        /*return me.showTbar != undefined && !me.showTbar ?
            []:
            [{
                iconCls: 'icon-select',
                text: '审批通过',
                itemId: 'create',
                scope: this,
                handler: me._approve,
                disabled: me.groupTask
            },{
                iconCls: 'icon-close',
                text: '审批驳回',
                disabled: false,
                itemId: 'delete',
                scope: this,
                handler: me._refuse,
                disabled: me.groupTask
            }];*/
    },

    /**
     * 上传审批附件点击事件
     * @private
     */
    _onCreateClick: function () {
        var me = this;
        //如果是IE浏览器用flash插件上传文件，否则用plupload上传
        if (Ext.isIE) {
            var saveUrl = me.getStore().getProxy().api.create;
            var params = {
                piId: me.piId,
                modelId: me.modelId,
                dataId: me.dataId,
                nodeId: me.nodeId,
                userId: userId
            };

            var params = "-userId;" + userId + ";-dataId;" + me.dataId + ";-modelId;" + me.modelId + ";-nodeId;" + me.nodeId + ";-piId;" + me.piId;

            new Ext.Window({
                width: 900,
                title: '上传附件',
                height: 400,
                layout: 'fit',
                items: [{
                    xtype: 'uploadpanel',
                    post_params: {
                        piId: me.piId,
                        modelId: me.modelId,
                        nodeId: me.nodeId,
                        dataId: me.dataId
                    },
                    upload_url: saveUrl
                }],
                listeners: {
                    beforeclose: function () {
                        me.fireEvent("refreshGrid");
                    }
                }
            }).show();
        } else {
            var win = Ext.create('Ext.Window', Ext.apply({
                plain: true,
                layout: 'fit',
                title: '上传附件',
                maximizable: true,
                items: [
                    Ext.create('OrientTdm.TestBomBuild.Panel.PowerH5FileUploadPanel', {
                        piId: me.piId,
                        modelId: me.modelId,
                        nodeId: me.nodeId,
                        dataId: me.dataId
                    })
                ]
            }));
            win.show();
            win.on('close', function () {
                // 查询更新后的审批文件列表
                var reloadFiles = "";
                OrientExtUtil.AjaxHelper.doRequest("MineTaskController/reload.rdm", {
                    piId: me.piId
                }, false, function (response) {
                    var result = Ext.decode(response.responseText);
                    reloadFiles = result['results'];
                })

                // 重置查询参数
                if(reloadFiles){
                    var extraParam = me.getStore().getProxy().extraParams;
                    extraParam['fileIds'] = reloadFiles;
                    me.getStore().load();
                }else{
                    me.fireEvent("refreshGrid");
                }
            });
        }
    },

    _changeToolbarDisable: function () {
        var me = this;
        var toolbar = me.getDockedItems('toolbar[dock="top"]')[0];
        var btns = toolbar.items.items;
        me.groupTask = false;
        Ext.each(btns, function (btn) {
            btn.setDisabled(me.groupTask);
        });
    },

    createColumns: function () {
        var me = this;
        var retVal = [];
        retVal.push({
            header: '文件名称',
            flex:1,
            align:'center',
            sortable: true,
            dataIndex: 'filename',
            filter: {
                type: 'string'
            },
            renderer: function (value, metaData, record) {
                var retVal = "";
                if (!Ext.isEmpty(value)) {
                    var template = "<a target='_blank' class='attachment'  onclick='OrientExtend.FileColumnDesc.handleFile(\"#fileId#\",\"#fileType#\")' title='#title#'>#name#</a>";
                    var fileDesc = record.data;
                    var fileId = fileDesc.fileid;
                    var fileName = fileDesc.filename;
                    var fileType = fileDesc.fileCatalog;
                    retVal += template.replace("#name#", fileName).replace("#title#", fileName).replace("#fileId#", fileId).replace("#fileType#", fileType);
                }
                return retVal;
            }
        }, {
            header: '文件描述',
            flex:1,
            align:'center',
            sortable: true,
            dataIndex: 'filedescription',
            filter: {
                type: 'string'
            },
            renderer:function(value,metal){
                if (value === "-6"){
                    metal.css ='x-grid-font-red';
                    return "解析失败的文件类型！";
                }

                return value;
            }
        }, {
            header: '文件大小',
            flex:1,
            align:'center',
            sortable: true,
            dataIndex: 'filesize',
            renderer: function (v) {
                return Ext.util.Format.fileSize(v);
            }
        }, {
            header: '上传人',
            flex:1,
            align:'center',
            sortable: true,
            dataIndex: 'uploadUserName'
        }, {
            header: '上传时间',
            flex:1,
            align:'center',
            sortable: true,
            dataIndex: 'uploadDate'
        }, {
            header: '文件密级',
            flex:1,
            align:'center',
            sortable: true,
            dataIndex: 'filesecrecy'
        }, {
            header: '文件版本',
            flex:1,
            align:'center',
            dataIndex: 'edition'
        }, {
            xtype: 'actioncolumn',
            align: 'center',
            header: '下载',
            flex:1,
            items: [{
                icon: serviceName + '/app/images/icons/default/common/download.png',
                tooltip: '下载',
                handler: function (grid, rowIndex, colIndex) {
                    var id = grid.store.getAt(rowIndex).get('id');
                    OrientExtUtil.FileHelper.doDownload(id);
                }
            }]
        }, {
            header: '状态',
            flex: 1,
            align: 'center',
            dataIndex: 'fileState'
        });

        return retVal;
    },
    createStore: function () {
        var me = this;
        var retVal = Ext.create('Ext.data.Store', {
            model: "OrientTdm.DataMgr.FileMgr.Model.ModelFileExtModel",
            autoLoad: true,
            proxy: {
                type: 'ajax',
                actionMethods: {
                    create: 'POST',
                    read: 'POST',
                    update: 'POST',
                    destroy: 'POST'
                },
                api: {
                    "read": Ext.isEmpty(me.queryUrl) ? serviceName + "/modelFile/list.rdm" : me.queryUrl,
                    "create": Ext.isEmpty(me.createUrl) ? serviceName + "/modelFile/create.rdm" : me.createUrl,
                    "update": Ext.isEmpty(me.updateUrl) ? serviceName + "/modelFile/update.rdm" : me.updateUrl,
                    "delete": Ext.isEmpty(me.deleteUrl) ? serviceName + "/modelFile/delete.rdm" : me.deleteUrl
                },
                extraParams: {
                    modelId: '',
                    dataId: '',
                    nodeId: me.nodeId,
                    fileGroupId: me.fileGroupId,
                    fileIds: me.fileFilter != undefined ? me.fileFilter : ''
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    root: 'results',
                    totalProperty: 'totalProperty',
                    idProperty: 'fileid',
                    messageProperty: 'msg'
                },
                listeners: {}
            }
        });
        me.store = retVal;
        return me.store;
    },

    beforeInitComponent: function () {},

    afterInitComponent: function () {},

    initComponent: function () {
        this.callParent(arguments);
        // this.addEvents('onStructClick');
    },

    /**
     * 文件审批通过
     * @private
     */
    _approve: function () {
        this._postFileRequest('3');
    },

    /**
     * 文件审批拒绝
     * @private
     */
    _refuse: function () {
        this._postFileRequest('4');
    },

    /**
     * 发送文件驳回或通过状态变更请求
     * @param state
     * @private
     */
    _postFileRequest: function (state) {
        var me = this;

        // 判断是否已经接收任务
        var auditTaskDetailPanel = Ext.getCmp('auditTaskDetailPanel');
        if(auditTaskDetailPanel){
            var items = auditTaskDetailPanel.getTbar().items;
            Ext.each(items, function (item) {
                if(item.text == '接收任务'){
                    if(!item.disabled){
                        Ext.Msg.alert("任务未接收，无法进行审批操作！");
                        return;
                    }
                }
            });
        }

        var selectedId = '';
        var nameAndEdition = [];
        var selected = me.getSelectionModel().getSelection();
        for(var j = 0; j < selected.length; j++){
            var record = selected[j];
            var fileState = record.get("fileState");
            if(fileState == '已完成' || fileState == '已驳回'){
                Ext.Msg.alert('提示',
                    '<b>文件名</b>：' + record.get("filename") + '<br/>' +
                    '文件' + fileState + '，不能重复审批！');
                return
            }else{
                selectedId += ',' + record.get("fileid");
                nameAndEdition.push(record.get("filename") + "_" + record.get("edition"));
            }
        }
        // 未指定文件信息，全部通过或全部驳回
        if(selectedId.length == 0){
            Ext.Msg.confirm('提示', '未指定审批文件，是否提交全部未审批文件?', function (btn, text) {
                if (btn == 'yes') {
                    var fileList = me.store.data.items;
                    for(var i = 0; i < fileList.length; i++){
                        var item = fileList[i].data;
                        var fileState = item['fileState'];
                        if(fileState != '已完成' && fileState != '已驳回'){
                            selectedId += ',' + item['fileid'];
                            nameAndEdition.push(record.get("filename") + "_" + record.get("edition"));
                        }
                    }

                    if(selectedId.length > 0){
                        me._postRequest(selectedId, state, nameAndEdition);
                    }
                }
            })
        }else{
            me._postRequest(selectedId, state, nameAndEdition);
        }
    },
    /**
     * 请求
     * @param selectedId
     * @param state
     * @private
     */
    _postRequest: function (selectedId, state, nameAndEdition) {
        var me = this;

        // 完成、驳回操作需要编写审批意见，然后才允许提交文件
        if(state == 4 || state == 3){
            var upAttribute = me.upAttribute;
            var item = Ext.create('OrientTdm.Common.Extend.Form.OrientForm', {
                successCallback: function(){
                    var sc = this;
                    // 变更文件状态
                    OrientExtUtil.AjaxHelper.doRequest(serviceName + "/FileMngController/changeFileInfoState.rdm", {
                        fileIds:  selectedId.length > 0 ? selectedId.substring(1) : '',
                        state: state // 变更状态为 [已完成/已驳回]
                    }, false, function () {
                        OrientExtUtil.Common.tip('提示', '文件已' + (state == 3 ? "已完成"  : "已驳回") + '！');
                        me.fireEvent("refreshGrid");

                        // 关闭审批意见弹出框
                        sc.up().close();
                        // 刷新历史审批意见列表
                        Ext.getCmp('AuditTaskHisOpinionList').refreshGrid();
                    })
                },
                actionUrl: serviceName + '/auditFlow/control/commitTaskOpinions.rdm',
                items: [{
                    xtype: 'textarea',
                    name: "审批意见",
                    grow: true,
                    fieldLabel: "请输入审批意见",
                    anchor: '100%',
                    allowBlank: false,
                    height: 175,
                    emptyText: "审批意见不能为空！"
                }]
            });

            OrientExtUtil.WindowHelper.createWindow(item, {
                title: "审批意见",
                bbar: [{
                        xtype: 'tbfill'
                    },{
                        iconCls: 'icon-select',
                        xtype: 'button',
                        text: '提交',
                        handler: function () {
                            var opinionForm = this.up('window').down('orientForm');
                            // 校验通过
                            if (opinionForm.isValid()) {
                                opinionForm.fireEvent('saveOrientForm', {
                                    selecttdFiles: nameAndEdition.join(","),
                                    flowid: upAttribute.piId,
                                    activity: upAttribute.taskName,
                                    handlestatus: '',
                                    value: opinionForm.getValues()['审批意见'],
                                    flowTaskId: upAttribute.taskId
                                });
                            }
                        }
                    },{
                        iconCls: 'icon-close',
                        xtype: 'button',
                        text: '取消',
                        handler: function () {
                            this.up().up().close();
                        }
                }]
            }, 260, 500);
        }
    }

});
