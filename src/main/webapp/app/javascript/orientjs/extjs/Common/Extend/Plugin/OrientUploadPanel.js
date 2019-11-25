/**
 * Created by enjoy on 2016/3/28 0028.
 */
Ext.define('OrientTdm.Common.Extend.Plugin.OrientUploadPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.uploadpanel',
    width: 820,
    height: 350,
    upload_url: serviceName + '/modelFile/create.rdm',
    config: {
        fileType: 'common',
        isSingle: false
    },
    columns: [
        {xtype: 'rownumberer'},
        {text: '文件名', width: 200, dataIndex: 'name'},
        {text: '类型', width: 70, dataIndex: 'type'},
        {
            text: '大小', width: 70, dataIndex: 'size', renderer: function (v) {
                return Ext.util.Format.fileSize(v);
            }
        },
        {
            text: '进度', width: 80, dataIndex: 'percent', renderer: function (v) {
                var stml =
                    '<div>' +
                    '<div style="border:1px solid #008000;height:10px;width:70px;margin:2px 0px 1px 0px;float:left;">' +
                    '<div style="float:left;background:#FFCC66;width:' + v + '%;height:8px;"><div></div></div>' +
                    '</div>' +
                    '</div>';
                return stml;
            }
        },
        {
            text: '状态', width: 80, dataIndex: 'status', renderer: function (v) {
                var status;
                if (v == -1) {
                    status = "等待上传";
                } else if (v == -2) {
                    status = "上传中...";
                } else if (v == -3) {
                    status = "<div style='color:red;'>上传失败</div>";
                } else if (v == -4) {
                    status = "上传成功";
                } else if (v == -5) {
                    status = "停止上传";
                }
                return status;
            }
        },
        {
            text: '密级(★)', width: 70, dataIndex: 'secrecy',
            editor: {
                xtype: 'combobox',
                allowBlank: false,
                store: {
                    xtype: 'store',
                    fields: ['name', 'value'],
                    data: [
                        {"value": "非密", "name": "非密"},
                        {"value": "内部", "name": "内部"}
                    ]
                },
                value: '',
                forceSelection: true,
                queryMode: 'local',
                displayField: 'name',
                valueField: 'value',
                allowBlank: false
            }
        },
        {text: '描述(★)', width: 100, dataIndex: 'desc', editor: 'textfield'},
        {
            text: '文件分组(★)', width: 90, dataIndex: 'fileCatalog',
            editor: {
                xtype: 'combobox',
                allowBlank: false,
                store: {
                    xtype: 'store',
                    fields: ['name', 'value'],
                    data: [
                        {"value": "common", "name": "common"},
                        {"value": "ods", "name": "ods"},
                        {"value": "hadoop", "name": "hadoop"}
                    ]
                },
                queryMode: 'local',
                displayField: 'name',
                valueField: 'value'
            }
        },
        {
            xtype: 'actioncolumn',
            width: 50,
            items: [{
                icon: serviceName + '/app/images/icons/default/common/delete.png',
                tooltip: 'Remove',
                handler: function (grid, rowIndex, colIndex) {
                    var id = grid.store.getAt(rowIndex).get('id');
                    grid.store.remove(grid.store.getAt(rowIndex));
                }
            }]
        }
    ],
    plugins: [
        Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        })
    ],
    store: Ext.create('Ext.data.JsonStore', {
        autoLoad: false,
        fields: ['id', 'name', 'type', 'size', 'percent', 'status', 'secrecy', 'fileCatalog', 'desc', 'attachmentId', 'attachmentName']
    }),
    addFileBtnText: '选择文件...',
    uploadBtnText: '上传',
    removeBtnText: '移除所有',
    cancelBtnText: '取消上传',
    completeBtnText: '完成',
    debug: false,
    file_size_limit: 2048,//MB
    file_types: '*.*',
    file_types_description: 'All Files',
    file_upload_limit: 10,
    file_queue_limit: 0,
    post_params: {},
    flash_url: serviceName + "/app/javascript/lib/swfupload-2.5/swfupload.swf",
    flash9_url: serviceName + "/app/javascript/lib/swfupload-2.5/swfupload_fp9.swf",
    initComponent: function () {
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                xtype: 'button',
                itemId: 'addFileBtn',
                iconCls: 'upload-add',
                id: '_btn_for_swf_',
                text: this.addFileBtnText
            }, {xtype: 'tbseparator'}, {
                xtype: 'button',
                itemId: 'uploadBtn',
                iconCls: 'upload-up',
                text: this.uploadBtnText,
                scope: this,
                handler: this.onUpload
            }, {xtype: 'tbseparator'}, {
                xtype: 'button',
                itemId: 'removeBtn',
                iconCls: 'upload-trash',
                text: this.removeBtnText,
                scope: this,
                handler: this.onRemoveAll
            }, {xtype: 'tbseparator'}, {
                xtype: 'button',
                itemId: 'cancelBtn',
                iconCls: 'upload-cancel',
                disabled: true,
                text: this.cancelBtnText,
                scope: this,
                handler: this.onCancelUpload
            }]
        }];

        this.callParent();
        this.down('button[itemId=addFileBtn]').on({
            afterrender: function (btn) {
                var config = this.getSWFConfig(btn);
                this.swfupload = new SWFUpload(config);
                Ext.get(this.swfupload.movieName).setStyle({
                    position: 'absolute',
                    top: 0,
                    left: -2
                });
            },
            scope: this,
            buffer: 300
        });
    },
    getSWFConfig: function (btn) {
        var me = this;
        var placeHolderId = Ext.id();
        var em = btn.getEl().child('em');
        if (em == null) {
            em = Ext.get(btn.getId() + '-btnWrap');
        }
        em.setStyle({
            position: 'relative',
            display: 'block'
        });
        em.createChild({
            tag: 'div',
            id: placeHolderId
        });
        return {
            debug: me.debug,
            flash_url: me.flash_url,
            flash9_url: me.flash9_url,
            upload_url: me.upload_url,
            file_post_name: 'file',
            post_params: me.post_params || {savePath: 'upload\\'},
            file_size_limit: (me.file_size_limit * 1024),
            file_types: me.file_types,
            file_types_description: me.file_types_description,
            file_upload_limit: me.file_upload_limit,
            file_queue_limit: me.file_queue_limit,
            button_width: em.getWidth(),
            button_height: em.getHeight(),
            button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
            button_cursor: SWFUpload.CURSOR.HAND,
            button_placeholder_id: placeHolderId,
            custom_settings: {
                scope_handler: me
            },
            swfupload_preload_handler: me.onSwfPreLoad,
            file_queue_error_handler: me.fileQueueFailure,
            swfupload_load_failed_handler: me.swfLoadFailure,
            upload_start_handler: me.onStartUpload,
            upload_progress_handler: me.uploadProcess,
            upload_error_handler: me.uploadFailure,
            upload_success_handler: me.uploadSuccess,
            upload_complete_handler: me.uploadComplete,
            file_queued_handler: me.onFileQueued
        };
    },
    onSwfPreLoad: function () {
        if (!this.support.loading) {
            Ext.Msg.show({
                title: '提示',
                msg: '浏览器Flash Player版本太低,不能使用该上传功能！',
                width: 250,
                icon: Ext.Msg.ERROR,
                buttons: Ext.Msg.OK
            });
            return false;
        }
    },
    fileQueueFailure: function (file, errorCode, message) {
        switch (errorCode) {
            case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED :
                msg('上传文件列表数量超限,不能选择！');
                break;
            case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT :
                msg('文件大小超过限制, 不能选择！');
                break;
            case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE :
                msg('该文件大小为0,不能选择！');
                break;
            case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE :
                msg('该文件类型不允许上传！');
                break;
        }

        function msg(info) {
            Ext.Msg.show({
                title: '提示',
                msg: info,
                width: 250,
                icon: Ext.Msg.WARNING,
                buttons: Ext.Msg.OK
            });
        }
    },
    swfLoadFailure: function () {
        Ext.Msg.show({
            title: '提示',
            msg: 'SWFUpload加载失败！',
            width: 180,
            icon: Ext.Msg.ERROR,
            buttons: Ext.Msg.OK
        });
    },
    onStartUpload: function (file) {
        var me = this.settings.custom_settings.scope_handler;
        var record = me.store.getById(file.id);
        if (record) {
            var fileCatalog = record.get("fileCatalog");
            var desc = record.get("desc");
            var secrecy = record.get("secrecy");
            this.addPostParam("fileCatalog", fileCatalog);
            this.addPostParam("desc", desc);
            this.addPostParam("secrecy", secrecy);
        }
        me.down('#cancelBtn').setDisabled(false);
    },
    uploadProcess: function (file, bytesLoaded, bytesTotal) {
        var me = this.settings.custom_settings.scope_handler;
        var percent = Math.ceil((bytesLoaded / bytesTotal) * 100);
        percent = percent == 100 ? 99 : percent;
        var rec = me.store.getById(file.id);
        if (rec) {
            rec.set('percent', percent);
            rec.set('status', file.filestatus);
            rec.commit();
        }
    },
    uploadFailure: function (file, errorCode, message) {
        var me = this.settings.custom_settings.scope_handler;
        var rec = me.store.getById(file.id);
        rec.set('percent', 0);
        rec.set('status', file.filestatus);
        rec.commit();
        me.failUploadNumber++;
    },
    uploadSuccess: function (file, serverData, responseReceived) {
        var me = this.settings.custom_settings.scope_handler;
        var rec = me.store.getById(file.id);
        if (rec) {
            var data = Ext.JSON.decode(serverData);
            if (data.success) {
                var atFile = data.results;
                rec.set('attachmentId', atFile.fileid);
                rec.set('attachmentName', atFile.filename);
                rec.set('percent', 100);
                rec.set('status', -4);
                me.successUploadNumber++;
            } else {
                rec.set('percent', 0);
                rec.set('status', SWFUpload.FILE_STATUS.ERROR);
                me.failUploadNumber++;
            }
            rec.commit();
            if (this.getStats().files_queued > 0 && this.uploadStopped == false) {
                this.startUpload();
            } else {
                me.showBtn(me, true);
            }
        }
    },
    getSuccessFiles: function () {
        var store = this.store;
        var files = [];
        for (var i = 0; i < store.getCount(); i++) {
            var rec = store.getAt(i);
            if (rec.get('status') == -4) {
                files.push({
                    attachmentId: rec.get('attachmentId'),
                    attachName: rec.get('name'),
                    attachSecrecy: rec.get('secrecy')
                });
            }
        }
        return files;
    },
    getFailedFiles: function () {
        var store = this.store;
        var files = [];
        for (var i = 0; i < store.getCount(); i++) {
            var rec = store.getAt(i);
            if (rec.get('status') == -3) {
                files.push({
                    attachmentId: rec.get('attachmentId'),
                    attachName: rec.get('name'),
                    attachSecrecy: rec.get('secrecy')
                });
            }
        }
        return files;
    },
    uploadComplete: function (file) {
        var me = this.settings.custom_settings.scope_handler;
        var callback = this.callback;
        if (callback) {
            callback.call(this, file);
        }
        me.needUploadNumber--;
        if (me.needUploadNumber == 0) {
            Ext.Msg.show({
                title: '提示',
                msg: "上传成功" + me.successUploadNumber + "个文件，失败" + me.failUploadNumber + "个文件",
                width: 250,
                icon: Ext.Msg.WARNING,
                buttons: Ext.Msg.OK
            });
        }

    },
    onFileQueued: function (file) {
        var me = this.settings.custom_settings.scope_handler;
        if (me.isSingle == true) {
            var count = me.store.getCount();
            if (count > 0) {
                OrientExtUtil.Common.err(OrientLocal.prompt.error, OrientLocal.prompt.onlyCanUploadOne);
                return;
            }
        }
        var fileType = me.fileType;
        var fileCatalog = fileType == 'C_Ods' ? "ods" : fileType == 'C_Hadoop' ? "hadoop" : "common";

        //校验文件格式
        var attachmentName = file.name;
        var isValid = me.checkFileValid(attachmentName);
        if (!isValid) {
            me.swfupload.cancelUpload(file.id, false);
            OrientExtUtil.Common.err('失败', '文件密级格式不正确，请输入正确格式！例如：XX(公开).doc');
            return;
        }
        //获取文件密级
        var fileName = attachmentName.substr(0, attachmentName.lastIndexOf("."));
        fileName = fileName.substr(fileName.length - 4);
        var secretClass = fileName.charAt(1) + fileName.charAt(2);
        me.store.add({
            id: file.id,
            name: file.name,
            fileName: file.name,
            size: file.size,
            type: file.type,
            status: file.filestatus,
            fileCatalog: fileCatalog,
            percent: 0,
            secrecy: file.secrecy
        });
    },
    onUpload: function () {
        var me = this;
        var isValid = this.checkAllFilesValid();
        if (!isValid) {
            // OrientExtUtil.Common.err('失败', '文件密级格式不正确，请输入正确格式！例如：XX(公开).doc');
            OrientExtUtil.Common.err('失败', '文件密级未设置，请先设置密级！');
            return;
        }
        if (this.swfupload && this.store.getCount() > 0) {
            if (this.swfupload.getStats().files_queued > 0) {
                me.needUploadNumber = this.swfupload.getStats().files_queued;
                me.successUploadNumber = 0;
                me.failUploadNumber = 0;

                this.showBtn(this, false);
                this.swfupload.uploadStopped = false;
                this.swfupload.startUpload();
            }
        }

    },
    checkAllFilesValid: function () {
        var isValid = true;
        var me = this;
        var store = this.store;
        Ext.each(store.data.items, function (item) {
            var fileInfo = item.data;
            var attachmentName = fileInfo.name;
            isValid = me.checkFileValid(attachmentName);
            if(fileInfo.secrecy == ""){
                isValid = false;
            }
        });
        return isValid;
    },
    checkFileValid: function (attachmentName) {
        var isValid = true;
        return isValid;
    },
    showBtn: function (me, bl) {
        me.down('#addFileBtn').setDisabled(!bl);
        me.down('#uploadBtn').setDisabled(!bl);
        me.down('#removeBtn').setDisabled(!bl);
        me.down('#cancelBtn').setDisabled(bl);
        if (bl) {
            me.down('actioncolumn').show();
        } else {
            me.down('actioncolumn').hide();
        }
    },
    onRemoveAll: function () {
        var ds = this.store;
        for (var i = 0; i < ds.getCount(); i++) {
            var record = ds.getAt(i);
            if (record != null) {
                var id = record.get('id');
                if (record.get('status') == -2 || record.get('status') == -1) {
                    this.swfupload.cancelUpload(id, false);
                }
            }
        }
        ds.removeAll();
        //ds.destroy();
        this.swfupload.uploadStopped = false;
    },
    beforeDestroy: function () {
        var me = this;
        me.store.removeAll();
        Ext.destroy(
            me.placeholder,
            me.ghostPanel
        );
        me.callParent();
    },
    onCancelUpload: function () {
        if (this.swfupload) {
            this.swfupload.uploadStopped = true;
            this.swfupload.stopUpload();
            this.showBtn(this, true);
        }
    }

});