/**
 * Created by enjoy on 2016/5/3 0003.
 */
Ext.define('OrientTdm.BackgroundMgr.Statistic.Setup.Common.StatisticSetUpForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.statisticSetUpForm',
    bodyStyle: 'border-width:0 0 0 0; background:white',
    requires: [
        'OrientTdm.BackgroundMgr.Statistic.Setup.Common.ChooseModelAndColumnBar',
        'OrientTdm.BackgroundMgr.Statistic.Setup.Common.StatisticChartSetUpGrid'
    ],
    initComponent: function () {
        var me = this;
        var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
        var id = me.originalData ? me.originalData.getId() : Date.parse(new Date());
        var buttons = [
            {
                text: '保存并关闭',
                iconCls: 'icon-saveAndClose',
                handler: function () {
                    me.fireEvent("saveOrientForm", {}, true);
                }
            }
        ];
        if (me.originalData == null) {
            buttons.push({
                text: '保存',
                iconCls: 'icon-save',
                handler: function () {
                    me.fireEvent("saveOrientForm");
                }
            });
        }
        Ext.apply(this, {
            items: [
                {
                    xtype: 'fieldset',
                    collapsible: true,
                    title: '1.设置基本信息设置',
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            layout: 'hbox',
                            combineErrors: true,
                            defaults: {
                                flex: 1
                            },
                            items: [
                                {
                                    name: 'name',
                                    xtype: 'textfield',
                                    fieldLabel: '统计名称',
                                    margin: '0 5 0 0',
                                    afterLabelTextTpl: required,
                                    allowBlank: false
                                }
                            ]
                        }, {
                            xtype: 'hiddenfield',
                            name: 'id'
                        }]
                }, {
                    xtype: 'fieldset',
                    collapsible: true,
                    title: '2.编写sql语句',
                    layout: 'fit',
                    items: [
                        {
                            xtype: 'orientPanel',
                            itemId: 'sqlSetUpPanel',
                            height: 200,
                            bbar: Ext.create("Ext.ux.statusbar.StatusBar", {
                                text: '未通过校验',
                                iconCls: 'x-status-error'
                            }),
                            tbar: {
                                xtype: 'chooseModelAndColumnBar',
                                selectListener: function (value) {
                                    me.codeMirror.focus();
                                    me.codeMirror.replaceSelection(value);
                                },
                                btnClickListener: function (successful) {
                                    if (successful === true) {
                                        me.down('#sqlSetUpPanel').down('statusbar').setStatus({
                                            text: '已通过校验',
                                            iconCls: 'x-status-valid'
                                        });
                                    }
                                }
                            },
                            padding: '0 0 5 0',
                            items: [
                                {
                                    name: 'sql',
                                    xtype: 'textarea',
                                    listeners: {
                                        afterrender: function (field) {
                                            var itemId = this.getItemId() + '-inputEl';
                                            me.codeMirror = CodeMirror.fromTextArea(document.getElementById(itemId), {
                                                mode: "text/x-sql",
                                                indentWithTabs: true,
                                                smartIndent: true,
                                                lineNumbers: false,
                                                matchBrackets: true,
                                                autofocus: true,
                                                extraKeys: {
                                                    "Ctrl-Space": "autocomplete"
                                                }
                                            });
                                            var sqlArea = this;
                                            me.codeMirror.setValue(me.originalData ? me.originalData.get('sql') : '');
                                            me.codeMirror.on('change', function (component) {
                                                sqlArea.setValue(component.getValue());
                                            });
                                        },
                                        bodyresize: function (panel, width, height) {
                                            me.codeMirror.setSize(width, height);
                                        },
                                        change: function () {
                                            me.down('#sqlSetUpPanel').down('statusbar').setStatus({
                                                text: '未通过校验',
                                                iconCls: 'x-status-error'
                                            });
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype: 'fieldset',
                    collapsible: true,
                    title: '3.设置图形',
                    height: 150,
                    layout: 'fit',
                    items: [
                        {
                            xtype: 'statisticChartSetUpGrid',
                            belongStatisSetUpId: id,
                            padding: '0 0 5 0'
                        }
                    ]
                }, {
                    xtype: 'hiddenfield',
                    name: 'id'
                }
            ],
            buttons: buttons
        });
        me.callParent(arguments);
    },
    customValidate: function () {
        var me = this;
        //validate has choosed cahrt
        var selectChartGrid = me.down('statisticChartSetUpGrid');
        var data = selectChartGrid.getStore().data;
        var errorMsg = '';
        if (data.length == 0) {
            errorMsg = '请至少添加一个图形展现方式';
        } else {
            data.each(function (record) {
                if (Ext.isEmpty(record.get('belongStaticChartInstanceId'))) {
                    errorMsg = '请确保图形都已设置所属图形实例';
                }
            });
        }
        if (Ext.isEmpty(errorMsg)) {
            return true;
        } else {
            OrientExtUtil.Common.err(OrientLocal.prompt.error, errorMsg);
            return false;
        }
    }
});