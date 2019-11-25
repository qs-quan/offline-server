/**
 * Created by qjs on 2017/2/22.
 * 绑定附件的列表
 */
Ext.define('OrientTdm.Collab.Data.PVMData.Common.PVMFileList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.PVMFileList',
    requires: [
        "OrientTdm.DataMgr.FileMgr.Model.ModelFileExtModel"
    ],
    config: {
        extraFilter: '',
        storeData: null,
        data: []
    },
    usePage: false,
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    initComponent: function () {
        var me = this;
        me.extraFilter = {};
        me.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
    },
    //视图初始化
    createToolBarItems: function () {
        var me = this;
        var retVal = [];
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
                    var fileJson = record.data;
                    if (OrientExtUtil.ValidateHelper.isImage(value)) {
                        metaData.tdAttr = "data-qtip=\"<img src='" + serviceName + "/preview/imagePreview" + fileJson.filePath + "' style='height: 200px;'>\" data-qwidth=\"200\"";
                    }
                    var template = "<a target='_blank' class='attachment'  onclick='OrientExtUtil.FileHelper.doDownload(\"#fileId#\")' title='#title#'>#name#</a>";
                    var fileId = fileJson.fileid;
                    var fileName = value;
                    retVal += template.replace("#name#", fileName).replace("#title#", fileName).replace("#fileId#", fileId);
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
        var storeData = [];
        var oriData = me.data;
        var allData = Ext.decode(oriData);
        if (allData[0].fileId) {
            var fileIds = allData[0].fileId.split(',');//CWM_File中的所有文件Id
            if (fileIds.length > 0) {
                for (var i in fileIds) {
                    var id = fileIds[i];
                    var fileModel = {};
                    var params = {
                        fileId: id
                    };
                    OrientExtUtil.AjaxHelper.doRequest("modelFile/getFileInfoById.rdm", params, false, function fileCallback(response) {
                        fileModel = response.decodedData.results[0];
                        storeData.push(fileModel);
                    });
                }
            }
        }

        var retVal = Ext.create("Ext.data.JsonStore", {
            autoLoad: true,
            model: 'OrientTdm.DataMgr.FileMgr.Model.ModelFileExtModel',
            proxy: {
                type: 'memory'
            },
            data: storeData
        });

        this.store = retVal;
        return retVal;
    }
});