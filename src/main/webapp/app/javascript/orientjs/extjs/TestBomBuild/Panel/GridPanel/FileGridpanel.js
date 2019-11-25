/**
 * Created by dailin on 2019/3/30 15:12.
 */

Ext.define('OrientTdm.TestBomBuild.Panel.GridPanel.FileGridpanel', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alternateClassName: 'OrientExtend.FileGridpanel',
    alias: 'widget.fileGridpanel',
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

    createToolBarItems: function () {
        var me = this;
        if(me.hisTaskDetail != null || me.title != '所有附件'){
            return [];
        }

        return [
            {
                iconCls: 'icon-create',
                text: '上传附件',
                itemId: 'create',
                scope: this,
                handler: me.onCreateClick
            }, {
                iconCls: 'icon-delete',
                text: '删除',
                disabled: false,
                itemId: 'delete',
                scope: this,
                handler: me.onDeleteClick
            }, {
                iconCls: 'icon-startproject',
                text: '发起文档审批',
                itemId: 'start',
                disabled: me.groupTask,
                scope: this,
                handler: me._startAudit
            }
        ];
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
        },{
            header: '状态',
            align: 'center',
            flex:1,
            dataIndex: 'fileState',
            renderer: function (value, metaData, record) {
                return me._fileState(value, metaData, record);
            }
        });
        return retVal;
    },

    createStore: function () {
        var me = this;

        // 知识节点的数据来源与项目管理中绑定的知识,数据源
        var fileIds = '';
        if(me.title == '知识'){
            OrientExtUtil.AjaxHelper.doRequest(serviceName + "/KnowledgeController/getKnowledgeFileIds.rdm", {
                nodeId: me.nodeId
            }, false, function (response) {
                if (response.decodedData.success) {
                    fileIds = response.decodedData.results;
                }
            });
        }

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
                    modelId: me.modelId,
                    dataId: me.dataId,
                    nodeId: me.nodeId,
                    fileGroupId: me.fileGroupId,
                    fileIds: fileIds
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
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'changeToolbarDisable', me.changeToolbarDisable, me);
    },
    onCreateClick: function () {
        var me = this;
        //如果是IE浏览器用flash插件上传文件，否则用plupload上传
        if (Ext.isIE) {
            var saveUrl = me.getStore().getProxy().api.create;
            var params = {
                modelId: me.modelId,
                dataId: me.dataId,
                nodeId: me.nodeId,
                userId: userId
            };

            var params = "-userId;" + userId + ";-dataId;" + me.dataId + ";-modelId;" + me.modelId + ";-nodeId;" + me.nodeId;

            new Ext.Window({
                width: 900,
                title: '上传附件',
                height: 400,
                layout: 'fit',
                modal: true,
                items: [
                    {
                        xtype: 'uploadpanel',
                        post_params: {
                            modelId: me.modelId,
                            nodeId: me.nodeId,
                            dataId: me.dataId
                        },
                        upload_url: saveUrl
                    }
                ],
                listeners: {
                    beforeclose: function () {
                        me.fireEvent("refreshGrid");
                    }
                }
            }).show();
        } else {
            var win = Ext.create('Ext.Window', Ext.apply({
                plain: true,
                /* height: globalHeight * 0.5,
                 width: globalWidth * 0.5,*/
                layout: 'fit',
                title: '上传附件',
                maximizable: true,
                modal: true,
                //html: '<iframe width=' + globalWidth * 0.5 + ' height=' + globalHeight * 0.5 + ' src=' + url + '>'
                items: [
                    Ext.create('OrientTdm.TestBomBuild.Panel.PowerH5FileUploadPanel', {
                        modelId: me.modelId,
                        nodeId: me.nodeId,
                        dataId: me.dataId
                    })
                ]
            }));
            win.show();
            win.on('close', function () {
                me.fireEvent("refreshGrid");
            });
        }
    },

    onUploadClient: function () {
        var me = this;
        var params = "-modelId;" + me.modelId + ";-dataId;" + me.dataId + ";-userId;" + userId + ";-nodeId;" + me.nodeId;
        HtmlTriggerHelper.startUpTool("uploadClient", "null", params);
    },

    changeToolbarDisable: function () {
        var me = this;
        var toolbar = me.getDockedItems('toolbar[dock="top"]')[0];
        var btns = toolbar.items.items;
        me.groupTask = false;
        Ext.each(btns, function (btn) {
            if (btn.getText() == '发起文档审批') {
                btn.setDisabled(me.groupTask);
            }
        });
    },

    /**
     * 文件审批发起成功后更新文件信息状态
     * @private
     */
    _successCallback : function(resp, taskUserAssigns){
        var me = this;

        // 变更状态为[审批中]及 如果第一个任务是[申请人发起审批]就走掉
        OrientExtUtil.AjaxHelper.doRequest(serviceName + "/FileMngController/changeFileInfoState.rdm", {
            fileIds: me.selectedId,
            state: '2',
            piId: Ext.decode(resp.responseText).results,
            taskUserAssigns: Ext.encode(taskUserAssigns)
        }, false);

        // 如果第一个任务是[申请人发起审批]就走掉
        /*OrientExtUtil.AjaxHelper.doRequest(serviceName + "/auditFlow/control/achieveFirstTask.rdm", {
            piId: Ext.decode(resp.responseText).results
        }, false);*/

        // 刷新页面
        me.upup.fireEvent("refreshGrid");
    },

    /**
     * 发起文件审批
     * @private
     */
    _startAudit : function(){
        var me = this;
        var selections = me.getSelectionModel().getSelection();
        if(selections.length == 0){
            Ext.Msg.alert('提示', '请选择至少一条文件信息！');
            return
        }
        // 获取所选文件id
        var ii = '', i = '';
        for(var j = 0; j < selections.length; j++){
            var record = selections[j];
            var fileState = record.get("fileState");
            if(fileState == '审批中' || fileState == '已完成' || fileState == '已驳回'){
                Ext.Msg.alert('提示',
                    '<b>文件名</b>：' + record.get("filename") + '<br/>' +
                    '文件' + fileState + '，不能重复发起审批！');
                return
            }
            var fileId = record.get("fileid");
            ii += ',' + fileId;
            i += '[' + fileId + ']';
        }

        // 用这种保存参数的方式是为了省事，减少对产品的代码以及表结构改动
        var params = {
            // 用于获取绑定的审批流程列表
            modelId: me.modelId,
            customModelId: 'CWM_FILE',
            dataIds: me.nodeId + '|' + i,
            successCallback : me._successCallback,
            selectedId : ii.length ? ii.substring(1) : '',
            upup: me,
            auditType : "FILE",
            setShowName: true
        };
        Ext.require('OrientTdm.Collab.common.auditFlow.StartAuditFlowPanel', function () {
            var item = Ext.create('OrientTdm.Collab.common.auditFlow.StartAuditFlowPanel', params);
            // 文件审批给审批流程名称赋值，规则：单个文件：XXX文件的文档审批，多个文件：第一个的名称+等文件的文档审批
            var collabName = selections[0].raw.filename + (selections.length > 1 ? "等文件的" : "的") + "文档审批";
            Ext.getCmp('customName').setValue(collabName);
            OrientExtUtil.WindowHelper.createWindow(item, {
                title: '启动流程'
            }, 650);
        });
    },

    /**
     * 根据流程信息设置文件审批状态
     * @private
     */
    _fileState: function(value, metaData, record){
        var me = this;
        if(value == '未发起'){
            return value;
        }else if(value == '审批中'){
            return value;
        }else if(value == '已完成'){
            return value;
        }else if(value == '已驳回'){
            return value;
        }

        //var decodedData;
        /*OrientExtUtil.AjaxHelper.doRequest(serviceName + "/auditFlow/info/getPiIdAndStatusByBindModel.rdm", {
            modelId: "CWM_FILE",
            dataId: me.nodeId + "|%[" + value + "]%"
        }, false, function (response) {
            if (response.decodedData.success) {
                decodedData = response.decodedData;
            }
        });*/

        /*if(decodedData != null){
            var results = decodedData.results;
            var state = results.state;
            if(state == '审批中'){
                return state;
            }else if(state == '已完成'){
                return state;
            }else if(state == '已驳回'){
                return state;
            }
        }*/

//        return '<a href="javascript:void(0);" onclick="OrientExtend.FileGridpanel.startAudit(' + me.modelId + ',' + me.nodeId + ',' + value + ')">未发起</a>';
    }


});
