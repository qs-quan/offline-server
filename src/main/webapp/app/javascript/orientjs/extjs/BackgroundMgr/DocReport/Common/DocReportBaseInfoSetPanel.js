/**
 * Created by enjoyjava on 01/12/2016.
 */
Ext.define('OrientTdm.BackgroundMgr.DocReport.Common.DocReportBaseInfoSetPanel', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.docReportBaseInfoSetPanel',
    requires: [],
    layout: 'hbox',
    defaults: {
        flex: 1
    },
    layoutConfig: {
        pack: "center",
        align: "stretch"
    },
    initComponent: function () {
        var me = this;
        var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
        Ext.apply(this, {
            items: [
                {
                    name: 'reportName',
                    xtype: 'textfield',
                    fieldLabel: '模板名称',
                    margin: '0 5 0 0',
                    afterLabelTextTpl: required,
                    labelAlign: 'right',
                    allowBlank: false,
                    listeners: {
                        blur: function (field) {
                            if (!field.isValid()) {
                                OrientExtUtil.Common.err(OrientLocal.error, '报告名称不可为空', function () {
                                    field.focus();
                                });
                            }
                        }
                    }
                }, {
                    xtype: 'SimpleColumnDescForSelector',
                    margin: '0 5 0 0',
                    columnDesc: {
                        editAble: Ext.isEmpty(me.originalData.get('modelId')),
                        isRequired: true,
                        sColumnName: 'modelId',
                        text: '绑定数据库模型',
                        selector: "{'selectorType': '2','multiSelect': true,'selectorName': '选择模型'}"
                    },
                    listeners: {
                        'afterlayout': function (container) {
                            var field = container.down('textfield');
                            field.on('change', me._switchModel, me);
                        }
                    }
                }, {
                    xtype: 'hiddenfield',
                    name: 'id'
                }
            ]
        });
        me.addEvents({
            initRefPanel: true
        });
        me.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.mon(me, 'initRefPanel', me._initRefPanel, me);
        me.callParent(arguments);
    },
    _switchModel: function (textfield, newValue, oldValue) {
        var me = this;
        var reportName = me.down('textfield[name=reportName]').getValue();
        var selectorField = textfield.up('SimpleColumnDescForSelector');
        if (reportName) {
            var mainPanel = me.up('docReportMaker');
            var westPanel = mainPanel.down('docReporChoosePanel');
            var centerPanel = mainPanel.down('docReportViewPanel');
            if (Ext.isEmpty(oldValue)) {
                //limit modify
                selectorField.changeEditStatus(false);
                //show modelTree
                if (westPanel) {
                    westPanel.modelId = selectorField.down('hidden').getValue();
                    westPanel.fireEvent('reconfigByModelId');
                }
                if (centerPanel) {
                    centerPanel.fireEvent('initDocPreview');
                }
            } else if (Ext.isEmpty(newValue)) {
                selectorField.changeEditStatus(true);
                if (centerPanel) {
                    centerPanel.fireEvent('cleanPreview');
                }
            }
        } else {
            if (!Ext.isEmpty(newValue)) {
                OrientExtUtil.Common.err(OrientLocal.error, '报告名称不可为空', function () {
                    //clear data
                    selectorField._clearValue();
                });
            }
        }
    },
    _initRefPanel: function () {
        var me = this;
        var modelId = me.originalData.get('modelId');
        var mainPanel = me.up('docReportMaker');
        var westPanel = mainPanel.down('docReporChoosePanel');
        var centerPanel = mainPanel.down('docReportViewPanel');
        if (westPanel) {
            westPanel.modelId = modelId;
            westPanel.fireEvent('reconfigByModelId');
        }
        if (centerPanel) {
            //get reportRealName
            var reportPath = me.originalData.get('filePath');
            var realReportName = reportPath.substring(reportPath.lastIndexOf('\\') + 1, reportPath.length);
            centerPanel.fireEvent('initDocPreview',realReportName);
        }
    }
});