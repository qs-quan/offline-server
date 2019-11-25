/**
 * DS模型表格
 */
Ext.define('OrientTdm.DataMgr.FileMgr.Grid.OrientModelFileGrid', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alternateClassName: 'OrientExtend.ModelFileGrid',
    alias: 'widget.orientModelFileGrid',
    requires: [
        "OrientTdm.DataMgr.FileMgr.Model.ModelFileExtModel",
        "OrientTdm.Common.Util.HtmlTriggerHelper"
    ],
    config: {
        modelId: '',
        dataId: '',
        fileGroupId: ''
    },
    //视图初始化
    createToolBarItems: function () {
        var me = this;
        var retVal = [
            {
                iconCls: 'icon-create',
                text: '上传附件',
                itemId: 'create',
                scope: this,
                handler: me.onCreateClick
            },
            {
                iconCls: 'icon-create',
                text: '客户端上传附件',
                itemId: 'createByClient',
                scope: this,
                handler: me.onUploadClient
            },
            {
                iconCls: 'icon-delete',
                text: '删除',
                disabled: false,
                itemId: 'delete',
                scope: this,
                handler: this.onDeleteClick
            }
        ];
        return retVal;
    },
    createColumns: function () {
        var me = this;
        var retVal = [];
        retVal.push({
            header: '文件名称',
            flex: 1,
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
            width: 200,
            sortable: true,
            dataIndex: 'filedescription',
            filter: {
                type: 'string'
            }
        }, {
            header: '文件大小',
            width: 100,
            sortable: true,
            dataIndex: 'filesize',
            renderer: function (v) {
                return Ext.util.Format.fileSize(v);
            }
        }, {
            header: '上传人',
            width: 150,
            sortable: true,
            dataIndex: 'uploadUserName'
        }, {
            header: '上传时间',
            width: 150,
            sortable: true,
            dataIndex: 'uploadDate'
        }, {
            header: '文件密级',
            width: 150,
            sortable: true,
            dataIndex: 'filesecrecy'
        }, {
            xtype: 'actioncolumn',
            align: 'center',
            header: '下载',
            width: 50,
            items: [{
                icon: serviceName + '/app/images/icons/default/common/download.png',
                tooltip: '下载',
                handler: function (grid, rowIndex, colIndex) {
                    var id = grid.store.getAt(rowIndex).get('id');
                    OrientExtUtil.FileHelper.doDownload(id);
                }
            }]
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
                    modelId: me.modelId,
                    dataId: me.dataId,
                    fileGroupId: me.fileGroupId
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    root: 'results',
                    idProperty: 'fileid',
                    messageProperty: 'msg'
                },
                listeners: {}
            }
        });
        me.store = retVal;
        return me.store;
    },
    beforeInitComponent: function () {

    },
    afterInitComponent: function () {

    },
    initComponent: function () {
        this.callParent(arguments);
        this.addEvents();
    },
    initEvents: function () {
        var me = this;
        me.callParent();

    },
    onCreateClick: function () {
        var me = this;
        //如果是IE浏览器用flash插件上传文件，否则用plupload上传
        if (Ext.isIE) {
            var saveUrl = me.getStore().getProxy().api.create;
            var params = {
                modelId: me.modelId,
                dataId: me.dataId,
                userId: userId
            };

            var params = "-userId;" + userId + ";-dataId;" + me.dataId + ";-modelId;" + me.modelId;

            new Ext.Window({
                width: 900,
                title: '上传附件',
                height: 400,
                layout: 'fit',
                items: [
                    {
                        xtype: 'uploadpanel',
                        post_params: {
                            modelId: me.modelId,
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
                //html: '<iframe width=' + globalWidth * 0.5 + ' height=' + globalHeight * 0.5 + ' src=' + url + '>'
                items: [
                    Ext.create('OrientTdm.DataMgr.FileMgr.H5FileUploadPanel', {
                        modelId: me.modelId,
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
        var params = "-modelId;" + me.modelId + ";-dataId;" + me.dataId + ";-userId;" + userId;
        HtmlTriggerHelper.startUpTool("uploadClient", "null", params);
    }
})
;





