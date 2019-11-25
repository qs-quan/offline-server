/**
 * 试验条件、合格判据、试验过程
 */
Ext.define('OrientTdm.TestInfo.ExperimentTypeMgr.MainFrame.TestProject.GridPanel.DocGridpanel',{
    extend:  'OrientTdm.Common.Extend.Grid.OrientModelGrid',
    alias: 'widget.DocGridpanel',
    requires: [
        "OrientTdm.TestInfo.ExperimentTypeMgr.Support.CustomExtUtil"
    ],
    initComponent: function () {
        var me = this;
        var modelId = OrientExtUtil.ModelHelper.getModelId(me.modelName, OrientExtUtil.FunctionHelper.getExperimentSchemaId(), false);
        me.modelId = modelId;
        me.modelName = me.modelName;
        me.customerFilter = [new CustomerFilter(me.mainModelName + "_" + OrientExtUtil.FunctionHelper.getExperimentSchemaId() + "_ID", CustomerFilter.prototype.SqlOperation.Equal, "", me.dataId)];

        me.callParent();
        me.addEvents("specialAddButtionSuccessCallBack");
    },

    initEvents: function () {
        var me = this;
        me.callParent();
    },

    //视图初始化
    createToolBarItems: function () {
        var me = this;
        var retV = [];
        Ext.each(me.callParent(arguments), function (btn, index) {
            if (btn.text == "查询" && btn.btnDesc.issystem == 0) {
                btn.itemId = 'PowerDetailButton';
                retV.push(btn);
            }else if ((btn.text == "查询全部" || (!me.isTemplate && btn.text == '删除')) && btn.btnDesc.issystem == 1) {
                retV.push(btn);
            }
        });

        if(!me.isTemplate){
            retV.unshift({
                iconCls: 'icon-create',
                text: "新增",
                tooltip: '新增',
                handler: function(grid, rowIndex, colIndex, item, e, record) {
                    CustomExtUtil.CustomWindowHelper.getDocWinodow({
                        up: me,
                        hasBbar: true,
                        title: '新增',
                        nameReadonly: false,
                        reportName: '',
                        name: ''
                    });
                }
            })
        }
        /*retV.push({
            iconCls: 'icon-import',
            text: "导入",
            handler: function(grid, rowIndex, colIndex, item, e, record) {

            }
        },);*/
        return retV;
    },

    createColumns: function () {
        var me = this;
        var columns = me.callParent(arguments);
        var retVal = [];
        Ext.each(columns, function (column) {
            if (column.dataIndex !=  "M_REPORT_NAME_" + me.modelId)  {
                retVal.push(column);
            }
        });

        // 插入操作列
        retVal.unshift({
            xtype:'actioncolumn',
            header: '操作',
            width: 75,
            dataIndex: 'id',
            items: [{
                iconCls: 'icon-preview',
                tooltip: '预览',
                border: '0 5 0 0',
                handler: function(grid, rowIndex, colIndex, item, e, record) {
                    CustomExtUtil.CustomWindowHelper.getDocWinodow({
                        up: me,
                        hasBbar: false,
                        nameReadonly: true,
                        dataId: record.data['ID'],
                        reportName: record.data['M_REPORT_NAME_' + me.modelId],
                        name: record.data['M_NAME_' + me.modelId],
                        title: '【' + record.data["M_NAME_" + me.modelId] + '】详细内容'
                    });
                }
            },  {
                xtype: "button",
                tooltip: "编辑",
                iconCls: 'icon-update',
                border: '0 5 0 0',
                disabled: me.isTemplate,
                handler: function(grid, rowIndex, colIndex, item, e, record) {
                    CustomExtUtil.CustomWindowHelper.getDocWinodow({
                        up: me,
                        hasBbar: true,
                        nameReadonly: false,
                        dataId: record.data['ID'],
                        reportName: record.data['M_REPORT_NAME_' + me.modelId],
                        name: record.data['M_NAME_' + me.modelId],
                        title: '【' + record.data["M_NAME_" + me.modelId] + '】详细内容'
                    });
                }
            }, {
                xtype: "button",
                tooltip: "删除",
                iconCls: 'icon-delete',
                border: '0 5 0 0',
                disabled: me.isTemplate,
                handler: function(grid, rowIndex, colIndex, item, e, record) {
                    // 手动选数据
                    var sm = me.getSelectionModel();
                    sm.deselectAll();
                    sm.select(rowIndex);

                    // 调用产品的删除按钮删除删除数据
                    var deleteBtn = me.down('toolbar').down('button[text=删除]');
                    deleteBtn.handler(deleteBtn);

                    me.customSuccessCallBack = function(){
                        // 删除实际文件
                        OrientExtUtil.AjaxHelper.doRequest(serviceName + "/FileMngController/deleteFile.rdm", {
                            filePath: 'D://ftpHome//docReports//' + record.data['M_REPORT_NAME_' + me.modelId]
                        }, false);
                        me.customSuccessCallBack = function () {}
                    }
                }
            }, {
                // 下载文件
                iconCls: 'icon-import',
                text: "导出",
                handler: function(grid, rowIndex, colIndex, item, e, record) {
                    OrientExtUtil.AjaxHelper.doRequest(serviceName + "/FileMngController/downloadByFilePath.rdm", {
                        filePath: 'docReports//' + record.data['M_REPORT_NAME_' + me.modelId],
                        fileName: record.data['M_NAME_' + me.modelId],
                        rootDir: 'ftp',
                        isDelete: false
                    }, false);
                    location.href = serviceName + '/FileMngController/downloadByFilePath.rdm?' +
                        'filePath=docReports\\\\' + record.data["M_REPORT_NAME_" + me.modelId] + '&fileName=' + record.data["M_NAME_" + me.modelId] + '.doc' +
                        '&rootDir=ftp&isDelete=false';
                }
            }]
        });
        return retVal;
    }


});