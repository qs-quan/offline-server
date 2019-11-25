/**
 * 仿照的OrientTdm.DataMgr.Import.UploadImportFilePanel，可能注释较少
 * Created by dailin on 2019/4/26 13:17.
 */

Ext.define('OrientTdm.TestBomBuild.Panel.PowerXmlUploadImportFilePanel', {
    alias: 'widget.powerXmlUploadImportFilePanel',
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    layout: 'fit',
    requires: [],
    initComponent: function () {
        var me = this;
        me.actionUrl = me.actionUrl ? me.actionUrl : serviceName + '/dataImportExport/uploadAndPreview.rdm';
        Ext.apply(me, {
            layout: "hbox",
            bodyStyle: 'padding:5px 5px 0',
            fieldDefaults: {
                labelAlign: 'right'
            },
            defaults: {
                border: false,
                xtype: 'panel',
                flex: 1,
                layout: 'anchor'
            },
            items: [{
                defaults: {
                    anchor: "95%"
                },
                items: [
                    {
                        xtype: 'filefield',
                        fieldLabel: '数据文件',
                        name: 'dataFile',
                        allowBlank: false,
                        emptyText: '选择一个数据文件',
                        buttonText: '',
                        buttonConfig: {
                            iconCls: 'icon-upload'
                        },
                        validator: function(value){
                            var rowSplit = me.down("textfield[name=rowSplit]");
                            var columnSplit = me.down("textfield[name=columnSplit]");
                            if (/.+\.xml$/i.test(value)) {
                                rowSplit.enable();
                                columnSplit.enable();
                                return true;
                            } else {
                                this.invalidText = '请选择一个xml文件.';
                                return false;
                            }
                        }
                    }, {
                        xtype: 'numberfield',
                        fieldLabel: '数据开始行',
                        allowBlank: false,
                        name: 'startLine',
                        value: 1
                    }, {
                        xtype: 'combo',
                        fieldLabel: "列分隔符",
                        name: "columnSplit",
                        value: "",
                        emptyText: '选择或输入列分隔符',
                        store: Ext.create('Ext.data.ArrayStore', {
                            fields: ["name", "value"],
                            data: [
                                ["逗号", ","],
                                ["制表符", "\\t"],
                                ["空格", " "]
                            ]
                        }),
                        queryMode: 'local',
                        displayField: 'name',
                        valueField: 'value'
                    }
                ]
            },
                {
                    defaults: {
                        anchor: "95%"
                    },
                    items: [
                        {
                            xtype: "radiogroup",
                            fieldLabel: "是否有表头",
                            columns: 2,
                            allowBlank: false,
                            afterLabelTextTpl: '<span style="color:red;font-weight:bold" data-qtip="必填项">*</span>',
                            items: [
                                {
                                    name: "hasHead",
                                    boxLabel: "是",
                                    inputValue: true
                                },
                                {
                                    name: "hasHead",
                                    boxLabel: "否",
                                    inputValue: false
                                }
                            ]
                        }, {
                            xtype: 'numberfield',
                            fieldLabel: '数据结束行',
                            name: 'endLine',
                            value: -1
                        }, {
                            xtype: 'combo',
                            fieldLabel: "行分隔符",
                            name: "rowSplit",
                            value: "",
                            emptyText: '选择或输入行分隔符',
                            store: Ext.create('Ext.data.ArrayStore', {
                                fields: ["name", "value"],
                                data: [
                                    ["回车", "\\n"]
                                ]
                            }),
                            queryMode: 'local',
                            displayField: 'name',
                            valueField: 'value'
                        }
                    ]
                }],
            buttons: [
                {
                    text: '上传',
                    handler: function () {
                        // 数据结束行
                        var endLine = me.down("textfield[name=endLine]");
                        var endLineVal = endLine.getValue();
                        if((!endLineVal && !endLineVal===0) || endLineVal < 0) {
                            endLine.setValue(-1);
                        }

                        // 行分隔符
                        var rowSplit = me.down("textfield[name=rowSplit]");
                        var rowSplitVal = rowSplit.getValue();
                        if(!rowSplitVal) {
                            rowSplit.setValue(encodeURIComponent("\n"));
                        }
                        else {
                            var encode = encodeURIComponent(eval("'"+rowSplitVal+"'"));
                            rowSplit.setValue(encode);
                        }

                        // 列分割符
                        var columnSplit = me.down("textfield[name=columnSplit]");
                        var columnSplitVal = columnSplit.getValue();
                        if(!columnSplitVal) {
                            columnSplit.setValue(",")
                        }
                        else {
                            var encode = encodeURIComponent(eval("'"+columnSplitVal+"'"));
                            columnSplit.setValue(encode);
                        }

                        // 保存进行解析
                        me.fireEvent("saveOrientForm");

                        Ext.Function.defer(function(){
                            endLine.setValue(endLineVal);
                            rowSplit.setValue(rowSplitVal);
                            columnSplit.setValue(columnSplitVal);
                        }, 150);
                    }
                }
            ]
        });
        me.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
    }
});