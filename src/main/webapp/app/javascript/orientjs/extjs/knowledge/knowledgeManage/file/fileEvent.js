/**
 * 文档事件
 * @author : weilei
 */
define(function (require, exports, module) {

    /**
     * 获取枚举数据
     */
    exports.loadEnumData = function (restriction_name) {

        var securityData = new Ext.data.ArrayStore({
            url: serviceName + '/fileController/getEnmuDataByResName.rdm',
            baseParams: {
                restriction_name: restriction_name
            },
            autoDestroy: true,
            fields: ['ID', 'VALUE', 'DISPLAY_VALUE']
        });
        return securityData;
    };

    /**
     * 上传文档
     * @param operationType ：操作类型（新增：add-file；编辑：edit-）
     * @param basicForm     ：form
     * @param store         ：数据刷新对象
     * @param window        ：窗体对象
     * @param constant      :全局常量
     */
    exports.saveFile = function (operationType, basicForm, stroe, window, constant) {
        var url = serviceName + '/fileController/editFileForIE.rdm';
        if (navigator.userAgent.indexOf("MSIE") > 0) url = serviceName + '/fileController/editFileForIE.rdm';
        else if (navigator.userAgent.indexOf("Chrome") > 0) url = serviceName + '/fileController/editFileForChrome.rdm';

        var resultMsg = "";
        if ('edit-file' == operationType) resultMsg = "编辑";
        else resultMsg = "新增";

        var params = {
            operationType: operationType,
            fileModelName: constant.file.fileModelName
        };

        if ('edit-file' == operationType) {
            basicForm.submit({
                clientValidation: true,
                url: url,
                method: 'post',
                params: params,
                success: function (form, action) {
                    constant.messageBox('编辑成功！');
                    window.close();
                    stroe.reload();
                },
                failure: function (form, action) {
                    constant.messageBox(resultMsg + '失败，请联系系统管理员！');
                }
            });
        } else {

            basicForm.submit({
                clientValidation: true,
                url: url,
                method: 'post',
                params: params,
                waitMsg: '正在上传，请等待...',
                success: function (form, action) {
                    constant.messageBox('新增成功！');
                    window.close();
                    stroe.reload();
                },
                failure: function (form, action) {
                    constant.messageBox(resultMsg + '失败，请联系系统管理员！');
                }
            });
        }
    };

    /**
     * 删除文档
     * @param selections   :选择文档记录集合
     * @param store        :刷新数据集
     * @param constant     :全局常量
     */
    exports.deleteFile = function (selections, store, constant) {

        var fileId = '';
        for (var i = 0; i < selections.length; i++) fileId += selections[i].data.id + ',';
        if (fileId.length > 0) fileId = fileId.substring(0, fileId.length - 1);

        var url = serviceName + '/fileController/deleteFile.rdm';
        var params = {
            fileId: fileId,
            fileModelName: constant.file.fileModelName
        };
        constant.deleteData(url, params, store);
    };

    /**
     * 下载文档
     * @param selections   :选择文档记录集合
     * @param store        :刷新数据集
     * @param constant     :全局常量
     */
    exports.downloadFile = function (selections, store, constant) {

        var fileId = '';
        for (var i = 0; i < selections.length; i++) fileId += selections[i].data.id + ',';
        if (fileId.length > 0) {
            fileId = fileId.substring(0, fileId.length - 1);
            var url = serviceName + '/fileController/downloadFile.rdm'
                + '?fileId=' + fileId
                + '&fileModelName=' + constant.file.fileModelName;
            window.location.href = url;
        }
    };

    /**
     * 文件预览
     * @param fileId   :文件ID
     * @param fileType :文件类型
     * @param constant :全局常量
     */
    exports.previewFile = function (fileId, fileType, constant) {

        /*
         * 1、如果是音频/视频文件，下载预览
         * 2、如果是文本文件，采用webOffice预览
         * 3、如果是txt文件，  采用openOffice预览
         * 4、如果是图片文件，采用CSS预览
        */
        var officeType = constant.images.officeType;
        var pdfType = constant.images.pdfType;
        if (officeType.indexOf(fileType) != -1) exports.previewFileByPageOffice(fileId, fileType, constant);
        else if (pdfType.indexOf(fileType) != -1) exports.previewFileByPageOffice(fileId, fileType, constant);
        else constant.messageBox('不支持此类型文件的在线预览！');
    }

    /**
     * webOffice方式预览文件
     * @param fileId   :文件ID
     * @param fileType :文件类型
     * @param constant :全局常量
     */
    exports.previewFileByPageOffice = function (fileId, fileType, constant) {
        //检查文件是否存在
        Ext.Ajax.request({
            url: serviceName + '/fileController/checkFileIsExist.rdm',
            method: 'post',
            params: {
                fileId: fileId,
                fileModelName: 'T_FILE'
            },
            success: function (response, opts) {
                var result = Ext.decode(response.responseText);
                var fileName = result.fileName;
                var filePath = result.filePath;

                var viewUrl = serverBathPath + "/app/views/file/";
                if (fileType == "pdf") {
                    viewUrl = viewUrl + "PageOffice_View_Pdf.jsp";
                } else {
                    viewUrl = viewUrl + "PageOffice_View_Doc.jsp";
                }

                viewUrl = viewUrl + "?fileName=" + fileName + "&filePath=" + filePath + "&fileType=" + fileType;
                if ("success" == result.flag) window.open(viewUrl, '', 'height=700,width=1000,top=150,left=300');//window.location.href="pageoffice://|"+viewUrl+"|width=900px;height=800px;|";
                else constant.messageBox('文件不存在！');
            },
            failure: function (response, opts) {
                constant.messageBox('预览失败，请联系系统管理员！');
            }
        });
    }

    /**
     * openOffice方式预览文件
     * @param fileId   :文件ID
     * @param fileType :文件类型
     * @param constant :全局常量
     */
    exports.previewFileByOpenOffice = function (fileId, fileName, constant) {

        //检查文件是否转换完毕
        Ext.Ajax.request({
            url: serviceName + '/fileController/checkSwfFileIsExist.rdm',
            method: 'post',
            params: {
                fileId: fileId,
                fileModelName: constant.file.fileModelName
            },
            success: function (response, opts) {
                var result = Ext.decode(response.responseText);
                if ("success" == result) initSwfFile(fileId, fileName);
                else constant.messageBox(result);
            },
            failure: function (response, opts) {
                constant.messageBox('预览失败，请联系系统管理员！');
            }
        });
    }

    exports.initSwfFile = function (fileId, fileName) {

        var height = document.body.clientHeight * 0.9;
        var height = document.body.clientHeight * 0.9;
        //跳转至播放页面
        var time = new Date();
        var url = "/jsp/fileManager/file.do?doInitFile"
            + "&fileId=" + fileId
            + "&fileName=" + fileName
            + "&time=" + time.toString();
        var window = new Ext.Window({
            title: '文件预览',
            width: 830,
            height: height,
            layout: 'fit',
            resizable: true,
            autoScroll: false,
            items: []
        });
        var panel = new Ext.Panel({
            html: '<iframe src="' + serviceName + url + '" width="100%" height="100%" >'
        });
        window.add(panel);
        window.show();
    };

    /**
     * 加载数据
     * @param operationType :操作类型
     * @param curFormPanel  :当前表单
     * @param record        :选中记录
     */
    exports.initData = function (operationType, curFormPanel, record) {

        if ('edit-file' == operationType || 'detail-file' == operationType) {
            if (curFormPanel != null && curFormPanel != undefined) {

                var basicForm = curFormPanel.getForm();
                var fileIdField = basicForm.findField('id');
                var fileNameField = basicForm.findField('name');
                var fileKeywordField = basicForm.findField('keyword');
                var fileSmmaryField = basicForm.findField('defineSummary');
                var filePreviewField = basicForm.findField('previewArea');
                var fileSecurityField = basicForm.findField('security');

                fileIdField.setValue(record.data.id);
                fileNameField.setValue(record.data.name);
                fileKeywordField.setValue(record.data.keyword);
                fileSmmaryField.setValue(record.data.defineSummary);
                filePreviewField.setValue(record.data.previewArea);
                fileSecurityField.setValue(record.data.security);
            }
        }
    };

    // 文件历史查看
    exports.checkHistoryVersion = function (selections, store, constant) {
        //数据
        var store = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
                method: 'post',
                url: serviceName + '/fileController/getFileDataForHistoryByFileName.rdm'
            }),
            reader: new Ext.data.JsonReader({
                totalProperty: 'totalCounts',
                root: 'result',
                fields: [
                    {
                        xtype: 'string',
                        name: 'id'
                    },
                    {
                        xtype: 'string',
                        name: 'name'
                    },
                    {
                        xtype: 'string',
                        name: 'keyword'
                    },
                    {
                        xtype: 'string',
                        name: 'defineSummary'
                    },
                    {
                        xtype: 'string',
                        name: 'previewArea'
                    },
                    {
                        xtype: 'string',
                        name: 'security'
                    },
                    {
                        xtype: 'string',
                        name: 'author'
                    },
                    {
                        xtype: 'string',
                        name: 'uploadTime'
                    },
                    {
                        xtype: 'string',
                        name: 'downloadNum'
                    },
                    {
                        xtype: 'string',
                        name: 'clickNum'
                    },
                    {
                        xtype: 'string',
                        name: 'previewNum'
                    },
                    {
                        xtype: 'string',
                        name: 'type'
                    }
                ]
            }),
            baseParams: {
                start: constant.constant.fm_start,
                limit: constant.constant.fm_limit,
                categoryId: nodeId,
                fileModelName: constant.file.fileModelName,
                fileName: selections[0].data.name,
                type: selections[0].data.type
            }
        });
        store.load();

        //复选框
        var csm = new Ext.grid.CheckboxSelectionModel();
        //序号列
        var rowColumn = new Ext.grid.RowNumberer({
            width: 35,
            header: '序号',
            renderer: function (value, metadata, record, rowIndex) {
                return constant.constant.fm_start + 1 + rowIndex;
            }
        });
        //列模型
        var columnModel = new Ext.grid.ColumnModel([
            csm,
            rowColumn,
            {
                hidden: true,
                dataIndex: 'id'
            },
            {
                width: 200,
                fixed: true,
                header: '文档名称',
                dataIndex: 'name',
                renderer: function (value, metedata, record, rowIndex, colIndex, store) {
                    return value + "." + record.data.type;
                }
            },
            {
                width: 200,
                header: '文档关键字',
                dataIndex: 'keyword'
            },
            {
                width: 300,
                header: '文档摘要',
                dataIndex: 'defineSummary'
            },
            {
                width: 100,
                fixed: true,
                header: '文档可见范围',
                dataIndex: 'previewArea'
            },
            {
                width: 100,
                fixed: true,
                header: '文档密级',
                dataIndex: 'security'
            },
            {
                width: 100,
                fixed: true,
                header: '作者',
                dataIndex: 'author'
            },
            {
                width: 150,
                fixed: true,
                header: '创建时间',
                dataIndex: 'uploadTime'
            },
            {
                width: 100,
                fixed: true,
                hidden: true,
                header: '下载次数',
                dataIndex: 'downloadNum'
            },
            {
                width: 100,
                fixed: true,
                header: '点击次数',
                hidden: true,
                dataIndex: 'clickNum'
            },
            {
                width: 100,
                fixed: true,
                hidden: true,
                header: '预览次数',
                dataIndex: 'previewNum'
            },
            {
                hidden: true,
                dataIndex: 'type'
            },
            {
                header: '预览',
                xtype: 'actioncolumn',
                width: 40,
                fixed: true,
                items: [
                    {
                        tooltip: '预览文件',
                        handler: function (grid, rowIndex, colIndex, o, event) {

                            var selectRecord = store.getAt(rowIndex);
                            var fileId = selectRecord.data.id;
                            var fileType = selectRecord.data.type;

                            var officeType = constant.images.officeType;
                            var pdfType = constant.images.pdfType;
                            if (officeType.indexOf(fileType) != -1) exports.previewFileByPageOffice(fileId, fileType, constant);
                            else if (pdfType.indexOf(fileType) != -1) exports.previewFileByPageOffice(fileId, fileType, constant);
                            else constant.messageBox('不支持此类型文件的在线预览！');
                        }
                    }
                ],
                renderer: function (v, meta, record) {

                    var fileType = record.data.type;
                    if (constant.images.imageType.indexOf(fileType) != -1) this.items[0].icon = constant.images.icon_image;
                    else if (constant.images.vedioType.indexOf(fileType) != -1) this.items[0].icon = constant.images.icon_vedio;
                    else if (constant.images.officeType.indexOf(fileType) != -1) this.items[0].icon = constant.images.icon_office;
                    else if (constant.images.pdfType.indexOf(fileType) != -1) this.items[0].icon = constant.images.icon_pdf;
                    else this.items[0].icon = constant.images.icon_text;
                }
            }, {
                header: '下载',
                xtype: 'actioncolumn',
                width: 40,
                fixed: true,
                items: [
                    {
                        tooltip: '下载文件',
                        handler: function (grid, rowIndex, colIndex, o, event) {
                            var selections = grid.getSelectionModel().getSelections();
                            if (selections.length < 1) {
                                constant.messageBox('请选择一个文档！');
                                return;
                            }
                            var fileId = '';
                            for (var i = 0; i < selections.length; i++) fileId += selections[i].data.id + ',';
                            if (fileId.length > 0) {
                                fileId = fileId.substring(0, fileId.length - 1);
                                var url = serviceName + '/fileController/downloadFile.rdm'
                                    + '?fileId=' + fileId
                                    + '&fileModelName=' + constant.file.fileModelName;
                                window.location.href = url;
                            }
                        }
                    }
                ],
                renderer: function (v, meta, record) {

                    var fileType = record.data.type;
                    if (constant.images.imageType.indexOf(fileType) != -1) this.items[0].icon = constant.images.icon_image;
                    else if (constant.images.vedioType.indexOf(fileType) != -1) this.items[0].icon = constant.images.icon_vedio;
                    else if (constant.images.officeType.indexOf(fileType) != -1) this.items[0].icon = constant.images.icon_office;
                    else if (constant.images.pdfType.indexOf(fileType) != -1) this.items[0].icon = constant.images.icon_pdf;
                    else this.items[0].icon = constant.images.icon_text;
                }
            }
        ]);
        //分页栏
        var pageBar = new Ext.PagingToolbar({
            store: store,
            pageSize: constant.constant.fm_limit,
            emptyMsg: '没有记录。',
            displayMsg: '显示第{0} 条到 {1} 条记录，一共 {2} 条。',
            displayInfo: true,
            prependButtons: true,
            doLoad: function (start) {
                constant.constant.fm_start = start;
                var pageSize = this.pageSize;
                store.setBaseParam('start', start);
                store.setBaseParam('limit', pageSize);
                store.reload();
            }
        });
        //文档列表
        var gridPanel = new Ext.grid.GridPanel({
            id: 'historyGrid',
            sm: csm,
            bbar: pageBar,
            store: store,
            split: true,
            colModel: columnModel,
            loadMask: true,
            closable: false,
            enableHdMenu: false,
            enableColumnHide: false,
            viewConfig: {
                forceFit: true
            }
        });
        //Window
        var win = new Ext.Window({
            title: "历史文件",
            layout: 'fit',
            width: 900,
            height: 500,
            items: [gridPanel]
        });

        win.show();
    }

});