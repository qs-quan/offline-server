/**
 * Created by enjoy on 2016/5/24 0024.
 */
Ext.define('OrientTdm.DataMgr.Import.ImportModelPanel', {
    alias: 'widget.importModelPanel',
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    requires: [
        'OrientTdm.DataMgr.Import.MapModelColumnPanel',
        'OrientTdm.DataMgr.Import.UploadImportFilePanel',
        'OrientTdm.DataMgr.Import.PreviewModelDataPanel'
    ],
    height: (globalHeight - 300) * 0.8,
    config: {
        modelDesc: {},
        successCallback: null,
        btnInstance: {}
    },
    initComponent: function () {
        var me = this;
        var uploadImportFilePanel = Ext.create('OrientTdm.DataMgr.Import.UploadImportFilePanel', {
            title: '1.上传导入文件',
            region: 'north',
            height: 180,
            collapsible: true,
            successCallback: me._afterUpload
        });
        var previewModelDataPanel = Ext.create('OrientTdm.DataMgr.Import.PreviewModelDataPanel', {
            title: '2.数据预览',
            region: 'center',
            layout: 'fit'
        });
        var mapModelColumnPanel = Ext.create('OrientTdm.DataMgr.Import.MapModelColumnPanel', {
            title: '3.字段映射',
            region: 'east',
            collapsed: true,
            collapsible: true,
            modelDesc: me.modelDesc,
            width: 300
        });
        Ext.apply(me, {
            layout: 'border',
            items: [uploadImportFilePanel, previewModelDataPanel, mapModelColumnPanel],
            buttons: [
                {
                    itemId: 'import',
                    text: '4.导入',
                    handler: me._doImport
                },
                {
                    text: '下载模板',
                    scope: me,
                    handler: me._downloadTemplate
                },
                {
                    itemId: 'back',
                    text: '关闭',
                    scope: me.btnInstance,
                    handler: me.btnInstance.doBack
                }
            ],
            centerPanel: previewModelDataPanel,
            eastPanel: mapModelColumnPanel,
            northPanel: uploadImportFilePanel
        });
        me.callParent(arguments);
        me.addEvents('preiveiwData');
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'preiveiwData', me._preiveiwData, me);
    },
    _preiveiwData: function (resp) {
        var me = this;
        //展开面板
        me.eastPanel.expand();
        // me.northPanel.collapse();
        me.uploadresults = resp;
        me.centerPanel._loadFileData(me.uploadresults);
    },
    _afterUpload: function (resp) {
        var me = this.up('importModelPanel');
        me.fireEvent('preiveiwData', resp);
    },
    _doImport: function () {
        var me = this.up("importModelPanel");
        var formPanel = me.eastPanel;

        var gridPanel = me.centerPanel.down('grid');
        if (gridPanel) {
            var modelDesc = me.modelDesc;
            //导入设置
            var importConfig = formPanel.importConfig;
            importConfig.tableName = modelDesc.dbName;
            delete importConfig.analyzeType;
            //获取数据映射
            var relationMap = {};
            if (!formPanel.getForm().isValid()) {
                Ext.Msg.alert("提示", "请选择非空映射列");
                return;
            }

            var oriMap = formPanel.getForm().getValues();
            Ext.each(modelDesc.columns, function (colDesc) {
                var colName = colDesc.sColumnName;
                var fileColName = oriMap[colName];
                if (!fileColName) {
                    return;
                }

                if (colDesc.type == 'C_DateTime' || colDesc.type == 'C_Date') {
                    var timeFormat = oriMap[colName + "_timeformat"];
                    if (!timeFormat) {
                        timeFormat = "时间戳";
                    }
                    relationMap[colName] = {
                        fileColName: fileColName,
                        timeFormat: timeFormat,
                        defalutValue: null,
                        standardFileColName: null,
                        dbColName: colName,
                        dbColType: colDesc.type
                    };
                }
                else if (colDesc.type == 'C_Relation') {
                    relationMap[colName] = {
                        fileColName: null,
                        timeFormat: null,
                        defalutValue: fileColName,
                        standardFileColName: null,
                        dbColName: colName,
                        dbColType: colDesc.type
                    };
                }
                else {
                    relationMap[colName] = {
                        fileColName: fileColName,
                        timeFormat: null,
                        defalutValue: null,
                        standardFileColName: null,
                        dbColName: colName,
                        dbColType: colDesc.type
                    };
                }
            });

            if (Ext.Object.getSize(relationMap) > 0) {
                if (me.needDefaultValue) {
                    me._doSaveSpecialImportData(importConfig, relationMap);
                } else {
                    me._doSaveToDB(importConfig, relationMap);
                }
            }
            else {
                OrientExtUtil.Common.err(OrientLocal.prompt.error, OrientLocal.prompt.mappingFirst);
            }
        }
        else {
            OrientExtUtil.Common.err(OrientLocal.prompt.error, OrientLocal.prompt.uploadFrist);
        }
    },
    _getCreatedDatas: function (datas) {
        var retVal = [];
        Ext.each(datas, function (data) {
            var changeData = data.getChanges();
            retVal.push(changeData);
        });
        return retVal;
    },
    _getUpdatedDatas: function (datas) {
        var retVal = [];
        Ext.each(datas, function (data) {
            var changeData = data.getChanges();
            changeData.ID = data.raw.ID;
            retVal.push(changeData);
        });
        return retVal;
    },
    _getDeleteDatas: function (datas) {
        var retVal = [];
        Ext.each(datas, function (data) {
            retVal.push(data.raw.ID);
        });
        return retVal;
    },
    /**
     * 特殊导入，自定义设置关系
     * @param importConfig
     * @param relationMap
     * @private
     */
    _doSaveSpecialImportData: function (importConfig, relationMap) {
        var me = this;
        importConfig.relationMap = relationMap;
        Ext.Ajax.request({
            url: serviceName + "/dataImportExport/saveSpecialImportData.rdm",
            jsonData: Ext.encode(importConfig),
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            params: {
                modelId: me.modelDesc.modelId,
                defaultValue: me.defaultValue
            },
            success: function (resp) {
                var data = resp.decodedData;
                if (data.success) {
                    OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.saveSuccess);
                    me.successCallback.call();
                }
                else {
                    OrientExtUtil.Common.err(OrientLocal.prompt.error, data.msg);
                }
            },
            failure: function (resp) {
                Ext.Msg.alert("失败", "数据加载失败");
                Ext.getBody().unmask();
            }
        });
    },
    _doSaveToDB: function (importConfig, relationMap) {
        var me = this;
        importConfig.relationMap = relationMap;
        Ext.Ajax.request({
            url: serviceName + "/dataImportExport/saveImportData.rdm",
            jsonData: Ext.encode(importConfig),
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            params: {},
            success: function (resp) {
                var data = resp.decodedData;
                if (data.success) {
                    OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.saveSuccess);
                    me.successCallback.call();
                }
                else {
                    OrientExtUtil.Common.err(OrientLocal.prompt.error, data.msg);
                }
            },
            failure: function (resp) {
                Ext.Msg.alert("失败", "数据加载失败");
                Ext.getBody().unmask();
            }
        });
    },
    _downloadTemplate: function () {
        var me = this;
        window.location.href = serviceName + "/dataImportExport/downloadTemplateFile.rdm?modelId=" + me.modelDesc.modelId;
    }

});