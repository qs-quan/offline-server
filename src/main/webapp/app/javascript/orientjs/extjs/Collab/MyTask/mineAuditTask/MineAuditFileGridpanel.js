/**
 * 我发起的审批任务
 */

Ext.define('OrientTdm.Collab.MyTask.mineAuditTask.MineAuditFileGridpanel', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alternateClassName: 'OrientExtend.MineAuditFileGridpanel',
    alias: 'widget.MineAuditFileGridpanel',
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

    /**
     * 补充审批文件
     * @returns {Array}
     */
    createToolBarItems: function () {
        var me = this;
        return [{
            iconCls: 'icon-create',
            text: '上传审批附件',
            itemId: 'create',
            scope: this,
            handler: me._onCreateClick
        },{
            iconCls: 'icon-delete',
            text: '删除',
            itemId: 'delete',
            scope: this,
            disabled: false,
            handler: me._onDeleteClick
        }];
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
                modal: true,
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
                        var reloadFiles = "";
                        OrientExtUtil.AjaxHelper.doRequest("MineTaskController/reload.rdm", {
                            piId: me.piId
                        }, false, function (response) {
                            var result = Ext.decode(response.responseText);
                            reloadFiles = result['results'];
                        });

                        // 重置查询参数
                        if(reloadFiles){
                            var extraParam = me.getStore().getProxy().extraParams;
                            extraParam['fileIds'] = reloadFiles;
                        }
                        me.getStore().load();
                    }
                }
            }).show();
        } else {
            var win = Ext.create('Ext.Window', Ext.apply({
                plain: true,
                layout: 'fit',
                title: '上传附件',
                maximizable: true,
                modal: true,
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
                });

                // 重置查询参数
                if(reloadFiles){
                    var extraParam = me.getStore().getProxy().extraParams;
                    extraParam['fileIds'] = reloadFiles;
                }
                me.getStore().load();
            });
        }
    },

    _onDeleteClick:function(){
        var me = this;
        if (me.getStore() && me.getStore().getProxy() && me.getStore().getProxy().api) {
            OrientExtUtil.GridHelper.deleteRecords(me, me.getStore().getProxy().api['delete'], function () {
                me.fireEvent('refreshGrid');
            });
        } else {
            OrientExtUtil.Common.err(OrientLocal.prompt.error, '未定义删除Url');
        }
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

    initComponent: function () {
        var me = this;
        Ext.merge(me,{
            listeners:{
                select: function () {
                    var disabled = false;
                    var btn = me.down("#delete");
                    var selectedData = me.getSelectedData();
                    Ext.each(selectedData, function (item) {
                        if ( item.data.fileState == "已完成") {
                            disabled = true;
                        }
                    });
                    btn.setDisabled(disabled);
                },
                deselect: function () {
                    var disabled = false;
                    var btn = me.down("#delete");
                    var selectedData = me.getSelectedData();
                    Ext.each(selectedData, function (item) {
                        if ( item.data.fileState != "已完成") {
                            disabled = true;
                        }
                    });
                    btn.setDisabled(disabled);
                }
            }
        });
        this.callParent(arguments);
    },

    initEvents: function () {
        var me = this;
        me.callParent();
    }

});
