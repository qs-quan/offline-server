/**
 * Created by enjoy on 2016/4/19 0019.
 */
Ext.define('OrientTdm.Common.Extend.Form.Field.FileColumnDesc', {
    extend: 'Ext.form.field.Display',
    alias: 'widget.FileColumnDesc',
    alternateClassName: 'OrientExtend.FileColumnDesc',
    mixins: {
        CommonField: "OrientTdm.Common.Extend.Form.Field.CommonField"
    },
    config: {
        columnDesc: null
    },
    msgTarget: 'side',
    submitValue: true,
    statics: {
        deleteFile: function (fileId, belongItemId) {
            var field = Ext.getCmp(belongItemId);
            if (field) {
                //获取原来的data
                var data = field.data;
                //移除选中的data
                var index = -1;
                Ext.each(data, function (fileDesc, loopIndex) {
                    if (fileDesc.id == fileId) {
                        index = loopIndex;
                        return false;
                    }
                });
                data.splice(index, 1);
                field.setValue(data);
            }
        },
        handleFile: function (fileId, fileType) {
            if ('C_File' == fileType) {
                OrientExtUtil.FileHelper.doDownload(fileId);
            } else if ('C_Hadoop' == fileType) {
                OrientExtUtil.FileHelper.openHadoopPanel(fileId);
            } else if ('C_Ods' == fileType || 'ods' == fileType) {
                OrientExtUtil.FileHelper.openOdsPanel(fileId);
            }
        },
        deleteGridFile: function (gridId, recordId, columnName) {
            //移除表格中的文件信息
            var grid = Ext.getCmp(gridId);
            if (grid) {
                var record = grid.getStore().getById(recordId);
                if (record) {
                    record.set(columnName, null);
                }
            }
        },
        directUpLoadFile: function (belongItemId) {
            var field = Ext.getCmp(belongItemId);
            var fileType = field.columnDesc.type;
            if (Ext.isIE) {
                new Ext.Window({
                    width: 820,
                    title: '上传附件',
                    height: 400,
                    layout: 'fit',
                    modal: true,
                    items: [
                        {
                            xtype: 'uploadpanel',
                            fileType: field.columnDesc.type
                        }
                    ],
                    listeners: {
                        beforeclose: function () {
                            var uploadpanel = this.down('uploadpanel');
                            if (uploadpanel) {
                                var attachs = uploadpanel.getSuccessFiles();
                                if (attachs == undefined || attachs == []) return;
                                var data = field.data;
                                var modelSecrecy = "公开";
                                for (var i = 0; i < attachs.length; i++) {
                                    var fileId = attachs[i].attachmentId;
                                    var name = attachs[i].attachName;
                                    var secrecy = attachs[i].attachSecrecy;
                                    //获取最高密级
                                    modelSecrecy = field.getMaxSecrecy(modelSecrecy, secrecy);
                                    data.push({
                                        id: fileId,
                                        name: name,
                                        fileType: fileType
                                    });
                                }
                                field.setValue(data);
                                field.validate();
                                field.setModelSecrecy(modelSecrecy);
                            }
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
                        Ext.create('OrientTdm.TestBomBuild.Panel.PowerH5FileUploadPanel', {})
                    ],
                    listeners: {
                        beforeclose: function () {
                            var fileIds = document.getElementById('powerH5FileUploadPanelFrame').contentDocument.getElementsByName("fileId")[0]['value'];
                            var data = field.data;
                            if (fileIds != "") {
                                Ext.each(fileIds.split(","), function (fileId) {
                                    var fileInfo = OrientExtUtil.FileHelper.getFileInfoById(fileId);
                                    data.push({
                                        id: fileId,  // fileId
                                        name: fileInfo.filename,  // aaaa.txt
                                        fileType: fileType
                                    });
                                    field.setValue(data);
                                    field.validate();
                                });
                            }
                        }
                    }
                }));
                win.show();
            }
        }
    },
    initComponent: function () {
        var me = this;
        var itemId = me.getId();
        var fileType = me.columnDesc.type;
        if (Ext.isEmpty(me.columnDesc)) {
            throw("未绑定字段描述");
        }
        //公用属性初始化
        this.mixins.CommonField.initCommonAttr.call(this, me.columnDesc);
        //增加特殊属性
        me.data = [];
        //采用模板方式加载数据
        var writeTplArray = [
            '<tpl for=".">',
            '<span class="attachement-span">',
            '<span fileId="{id}" name="attach">',
            '<a class="attachment" target="_blank" onclick="OrientExtend.FileColumnDesc.handleFile(\'{id}\',\'' + fileType + '\')" title="{name}">',
            '{name}',
            '</a>',
            '</span>',
            '<a href="javascript:;" onclick="OrientExtend.FileColumnDesc.handleFile(\'{id}\',\'' + fileType + '\');" title="下载" class="download">',
            '</a>',
            '&nbsp;',
            '<a href="javascript:;" onclick="OrientExtend.FileColumnDesc.deleteFile(\'{id}\',\'' + itemId + '\',\'' + fileType + '\');" class="cancel">',
            '</a>',
            '</span>',
            '</tpl>',
            '<a href="javascript:;" class="link selectFile" onclick="OrientExtend.FileColumnDesc.directUpLoadFile(\'' + itemId + '\',\'' + fileType + '\');">选择</a>'
        ];
        var readTplArray = [
            '<tpl for=".">',
            '<span class="attachement-span">',
            '<span fileId="{id}" name="attach">',
            '<a class="attachment" target="_blank" onclick="OrientExtend.FileColumnDesc.handleFile(\'{id}\',\'' + fileType + '\')" title="{name}">',
            '{name}',
            '</a>',
            '</span>',
            '<a href="javascript:;" onclick="OrientExtend.FileColumnDesc.handleFile(\'{id}\',\'' + fileType + '\');" title="下载" class="download">',
            '</a>',
            '</span>',
            '</tpl>'
        ];
        me.tpl = new Ext.XTemplate(
            me.columnDesc.editAble != false ? writeTplArray : readTplArray
        );
        var value = me.tpl.apply(me.data);
        Ext.apply(me, {
            value: value
        });
        me.callParent(arguments);
    },
    //重载设置值 增加传入文件描述json的支持
    setValue: function (value) {
        var me = this;
        value = value || [];
        //判断是否需要json转化
        if (this.mixins.CommonField.isJsonStr.call(this, value)) {
            value = Ext.decode(value);
        }
        var showValue = Ext.isArray(value) ? me.tpl.apply(value) : value;
        me.data = Ext.isArray(value) ? value : [];
        me.setRawValue(me.valueToRaw(showValue));
        return me.mixins.field.setValue.call(me, showValue);
    },
    //重载提交数据
    getSubmitValue: function () {
        var me = this;
        return JSON.stringify(me.data);
    },
    validate: function () {
        var me = this;
        if (me.data.length == 0 && me.allowBlank == false) {
            me.markInvalid("此项为必填项!");
            return false;
        } else {
            me.clearInvalid();
            return true;
        }
    },
    //定制：获取最大密级
    getMaxSecrecy: function (modelSecrecy, secrecy) {
        if (modelSecrecy != secrecy) {
            if (secrecy == '机密') {
                modelSecrecy = secrecy;
            } else if (modelSecrecy != '机密' && secrecy == '秘密') {
                modelSecrecy = secrecy;
            } else if (modelSecrecy != '机密' && modelSecrecy != '秘密' && secrecy == '内部') {
                modelSecrecy = secrecy;
            }
        }
        return modelSecrecy;
    },
    //定制：赋值给model密级字段
    setModelSecrecy: function (modelSecrecy) {
        var me = this;
        var modelId = me.columnDesc.modelId;
        //密级字段赋值
        var secrecyObj = me.ownerCt.ownerCt.down('[name=C_MJ_' + modelId + ']');
        if (secrecyObj != null && secrecyObj != undefined) {
            secrecyObj.setValue(modelSecrecy);
        }
    },
    customReadOnly: function () {
        //自定义只读组件形态

    }
});