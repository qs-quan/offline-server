/**
 * Created by enjoy on 2016/5/3 0003.
 */
Ext.define('OrientTdm.BackgroundMgr.Statistic.Setup.Common.ChooseModelAndColumnBar', {
    extend: 'Ext.toolbar.Toolbar',
    alias: 'widget.chooseModelAndColumnBar',
    requires: [
        'OrientTdm.BackgroundMgr.Statistic.Setup.Common.JsonInputPanel'
    ],
    config: {
        selectListener: Ext.emptyFn,
        btnClickListener: Ext.emptyFn
    },
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            items: [
                '数据类',
                {
                    xtype: 'SimpleColumnDescForSelector',
                    columnDesc: {
                        sColumnName: 'modelid',
                        editAble: true,
                        selector: "{'selectorType': '2','multiSelect': false,'selectorName': '选择模型'}"
                    },
                    listeners: {
                        afterChange: function (rawData) {
                            var value = rawData[0].raw.modelDBName;
                            var selectListener = me.selectListener;
                            if (selectListener) {
                                selectListener.call(me, value);
                            }
                        }
                    }
                },
                '-',
                '字段',
                {
                    name: 'columnid',
                    xtype: 'orientComboBox',
                    remoteUrl: serviceName + '/modelData/getColumnComboboxByModelId.rdm',
                    forceSelection: true,
                    selectOnFocus: true,
                    triggerAction: 'all',
                    queryMode: 'remote',
                    listeners: {
                        beforequery: function (queryEvent) {
                            var modelId = me.down('hidden[name=modelid]').getValue();
                            if (Ext.isEmpty(modelId)) {
                                OrientExtUtil.Common.err(OrientLocal.prompt.error, '请先选择所属模型');
                                return false;
                            } else {
                                //强制从后台重新加载
                                queryEvent.combo.lastQuery = undefined;
                                queryEvent.combo.getStore().getProxy().setExtraParam('modelId', modelId);
                                return true;
                            }
                        },
                        select: function (combo) {
                            var value = combo.getValue();
                            var selectListener = me.selectListener;
                            if (selectListener) {
                                selectListener.call(me, value);
                            }
                        }
                    }
                },
                '-',
                {
                    text: '测试',
                    iconCls: 'icon-startFlow',
                    handler: function () {
                        //open window to input param
                        var inputPanel = Ext.create('OrientTdm.BackgroundMgr.Statistic.Setup.Common.JsonInputPanel');
                        OrientExtUtil.WindowHelper.createWindow(inputPanel, {
                            title: '输入相关参数【请输入json格式的字符串】',
                            buttons: [
                                {
                                    text: '执行',
                                    handler: function () {
                                        var btn = this;
                                        var paramStr = this.up('window').down('textarea[name=jsonInput]').getValue();
                                        if (OrientExtUtil.Common.isJsonStr(paramStr) === true) {
                                            var sql = me.ownerCt.down('textarea[name=sql]').getValue();
                                            var preProcessor = 'defaultStatisticPerProcessor';
                                            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/StatisticSetUp/validateSql.rdm',
                                                {
                                                    sql: sql,
                                                    params: Ext.encode(Ext.decode(paramStr)),
                                                    preProcessor: preProcessor
                                                },
                                                true,
                                                function (resp) {
                                                    btn.up('window').close();
                                                    var btnClickListener = me.btnClickListener;
                                                    if (btnClickListener) {
                                                        btnClickListener.call(me, resp.decodedData.success);
                                                    }
                                                });
                                        } else {
                                            OrientExtUtil.Common.err(OrientLocal.prompt.error, '请输入正确的json串');
                                        }
                                    }
                                },
                                {
                                    text: '关闭',
                                    handler: function () {
                                        this.up('window').close();
                                    }
                                }
                            ]
                        }, 200, 300);
                    }
                }
            ]
        });
        me.callParent(arguments);
    }
});