Ext.define('OrientTdm.TestInfo.ExperimentTypeMgr.Support.CustomExtUtil', {
    extend: 'Ext.Base',
    //alias: 'widget.CustomExtUtil',
    alternateClassName: 'CustomExtUtil',
    statics: {
        CustomWindowHelper: {
            getDocWinodow: function(param){
                var reportShortName = '';
                if(param.name != undefined){
                    var reportNameArr = param.reportName.split("_");
                    if(reportNameArr.length > 0){
                        reportShortName = reportNameArr[0];
                    }
                }

                return new Ext.Window({
                    title: param.title,
                    height: 0.95 * globalHeight,
                    width: 0.8 * globalWidth,
                    layout: 'fit',
                    modal: true,
                    items: [
                        Ext.create('Ext.panel.Panel', {
                            layout: 'border',
                            items: [{
                                xtype: 'fieldset',
                                border: '1 5 1 5',
                                region: 'north',
                                title: param.nameReadonly ? '名称' : '第一步：输入名称',
                                items: [{
                                    id: "customName",
                                    xtype: 'textfield',
                                    width: 300,
                                    fieldLabel: '名称',
                                    emptyText: '名称不可为空',
                                    allowBlank: false,
                                    value: param.name,
                                    readOnly: param.nameReadonly
                                }]
                            },Ext.create('OrientTdm.TestInfo.ExperimentTypeMgr.Doc.DocReportViewPanle',{
                                up: param.up,
                                region: 'center',
                                title: param.nameReadonly ? '内容' : '第二步：编辑内容'
                            })]
                        })
                    ],
                    listeners: {
                        'show': function (scope, obj) {
                            this.down('docReportViewPanel').fireEvent('initDocPreview', param.reportName);
                        }
                    },
                    bbar: param.hasBbar != true ?
                            "" :
                            ["->", {
                                    iconCls: 'icon-create',
                                    tooltip: '保存',
                                    text: '保存',
                                    handler: function(grid, rowIndex, colIndex, item, e, record) {
                                        var param_ = param;
                                        var me = this;
                                        // 校验名称
                                        if(Ext.getCmp('customName').validate()){
                                            // 保存文档，新增则创建，编辑则更新文件内容
                                            var docReportViewPanle = me.up().up().items.items[0].items.items[1];
                                            // 保存文件至服务器目录：D:\ftpHome\docReports
                                            // 文件名 - 名称_时间戳.doc
                                            var realReportName = docReportViewPanle.saveToFtpHome();

                                            // 更新试验条件（。。）的相关信息
                                            var name = Ext.getCmp('customName').getValue();

                                            // 新增
                                            if (Ext.isEmpty(docReportViewPanle.reportName)) {
                                                OrientExtUtil.AjaxHelper.doRequest(serviceName + "/PrjDocController/create.rdm", {
                                                    modelName: param_.up.modelName,
                                                    schemaId: "EXPERIMENT",
                                                    parentModelName: 'T_RW_INFO',
                                                    parentDataId: param_.up.dataId,
                                                    name: name,
                                                    reportName: realReportName
                                                }, false);

                                                // 更新
                                            }else{
                                                // 名称和文件名没变时不更新
                                                if(!(name == param_.name && realReportName == param_.reportName)){
                                                    OrientExtUtil.AjaxHelper.doRequest(serviceName + "/PrjDocController/updateInfo.rdm", {
                                                        modelName: param_.up.modelName,
                                                        schemaId: "EXPERIMENT",
                                                        dataId: param_.dataId,
                                                        name: name,
                                                        reportName: realReportName
                                                    }, false);
                                                }
                                                OrientExtUtil.Common.tip('提示', '更新内容成功！');
                                            }

                                            param_.up.fireEvent('refreshGrid');
                                            me.up().up().close();

                                        }else{
                                            OrientExtUtil.Common.tip('提示','名称不能为空！');
                                        }
                                    }}, "->"
                            ]
                }).show();
            }
        },
        RelationModelHelper: {
            /**
             * 根据状态执行不同的操作
             * @param flag
             * @param mainModelId
             * @param dataId
             * @param slaveTableId
             * @param slaveDataId
             */
            createUpDateDelete: function(flag, mainModelId, dataId, slaveTableId, slaveDataId) {
                OrientExtUtil.AjaxHelper.doRequest(serviceName + "/RealtionController/createUpDateDelete.rdm", {
                    flag: flag,
                    masterTableId: mainModelId,
                    masterDataId: dataId,
                    slaveTableId: slaveTableId,
                    slaveDataId: slaveDataId
                }, false);
            },

            /**
             * 获取从Ids
             * @param mainModelId
             * @param dataId
             * @param slaveTableId
             * @param slaveDataId
             * @returns {*}
             */
            getChooseIdsFromMaster: function (mainModelId, dataId, slaveTableId, slaveDataId) {
                var ids;
                OrientExtUtil.AjaxHelper.doRequest(serviceName + "/RealtionController/querySlaveIds.rdm", {
                    masterTableId: mainModelId,
                    masterDataId: dataId,
                    slaveTableId: slaveTableId,
                    slaveDataId: slaveDataId
                }, false, function (response) {
                    if (response.decodedData.success) {
                        ids = response.decodedData.results;
                    }
                });

                return ids;
            }
        }
    }
});