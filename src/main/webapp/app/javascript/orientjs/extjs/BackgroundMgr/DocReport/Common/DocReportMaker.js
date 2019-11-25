/**
 * Created by enjoyjava on 01/12/2016.
 */
Ext.define('OrientTdm.BackgroundMgr.DocReport.Common.DocReportMaker', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.docReportMaker',
    layout: 'border',
    config: {
        //保存成功后操作
        successCallback: Ext.emptyFn,
        //保存URL
        actionUrl: '',
        //默认数据Record类型
        originalData: null
    },
    requires: [
        'OrientTdm.BackgroundMgr.DocReport.Common.DocReportBaseInfoSetPanel',
        'OrientTdm.BackgroundMgr.DocReport.Common.DocReporChoosePanel',
        'OrientTdm.BackgroundMgr.DocReport.Common.DocReportViewPanle',
        'OrientTdm.BackgroundMgr.DocReport.Model.DocReportExtModel'
    ],
    initComponent: function () {
        var me = this;
        me.originalData = me.originalData || Ext.create('OrientTdm.BackgroundMgr.DocReport.Model.DocReportExtModel');
        //base info set panel
        var baseInfoPanel = Ext.create('OrientTdm.BackgroundMgr.DocReport.Common.DocReportBaseInfoSetPanel', {
            region: 'north',
            height: 72,
            originalData: me.originalData,
            title: '<span style="color: red;">1.</span>选择所属模型'
        });
        //model and column choose panel
        var choosePanel = Ext.create('OrientTdm.BackgroundMgr.DocReport.Common.DocReporChoosePanel', {
            region: 'west',
            width: 350,
            modelId: me.originalData.get('modelId'),
            isView: me.originalData.get('isView'),
            title: '<span style="color: red;">2.</span>选择待插入元素'
        });
        //doc maker panel
        var docViewPanel = Ext.create('OrientTdm.BackgroundMgr.DocReport.Common.DocReportViewPanle', {
            region: 'center',
            title: '<span style="color: red;">3.</span>插入元素'
        });
        Ext.apply(me, {
            items: [baseInfoPanel, choosePanel, docViewPanel],
            buttons: [
                {
                    text: '保存',
                    iconCls: 'icon-save',
                    scope: me,
                    handler: me._saveDocReport
                },
                {
                    text: '关闭',
                    iconCls: 'icon-close',
                    scope: me,
                    handler: me._closeDocReport
                }
            ],
            listeners: {
                afterlayout: me._initData
            }
        });
        me.callParent(arguments);
    },
    _saveDocReport: function () {
        var me = this;
        var docReportViewPanel = me.down('docReportViewPanel');
        //get main modelId
        var docReportBaseInfoSetPanel = me.down('docReportBaseInfoSetPanel');
        //get report name
        var reportName = docReportBaseInfoSetPanel.down('textfield[name=reportName]').getValue();
        var isDisabled = false;
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/DocReports/modifyIsDisable.rdm', {
            reportName: reportName
        }, false, function (response) {
            isDisabled = response.decodedData;
        });
        if (isDisabled) {
            var msg = reportName.indexOf('军检') > -1 ? '没有新建军检报告模板的权限' : '没有新建常规报告模板的权限';
            OrientExtUtil.Common.tip('提示', msg);
            return;
        }

        //save report to ftpHome
        var realName = docReportViewPanel.saveToFtpHome();

        var selectorField = docReportBaseInfoSetPanel.down('SimpleColumnDescForSelector');
        var mainModelId = selectorField.down('hidden').getValue();
        //save info to db
        var reportid = me.originalData.getId();
        if (!reportid) {
            var params = {
                reportName: reportName,
                modelId: mainModelId,
                isView: '0',
                filePath: realName
            };
            if (me.nodeId) {
                params.nodeId = me.nodeId;
            }
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/DocReports/saveSepcial.rdm', params, true, function (resp) {
                alert('保存成功');
                if (me.successCallback) {
                    me.successCallback.call(me);
                }
            }, true);
        } else {
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/DocReports/updateSepcial.rdm', {
                reportName: reportName,
                reportId: reportid
            }, true, function (resp) {
                alert('保存成功');
                if (me.successCallback) {
                    me.successCallback.call(me);
                }
            });
        }

    },
    _closeDocReport: function () {
        var me = this;
        if (me.up('window')) {
            me.up('window').close();
        }
    },
    _initData: function () {
        var me = this;
        if (me.originalData && !Ext.isEmpty(me.originalData.get('modelId'))) {
            //init other panel
            me.down('docReportBaseInfoSetPanel').fireEvent('initRefPanel');
        }
    }
});