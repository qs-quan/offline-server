/**
 * Created by panduanduan on 13/07/2017.
 */
Ext.define('OrientTdm.BackgroundMgr.Quantity.Instance.ChooseEndPointFormPanel', {
    extend: 'Ext.window.Window',
    alias: 'widget.chooseEndPointFormPanel',
    requires: [
        'OrientTdm.BackgroundMgr.Quantity.Instance.ModelPathPanel'
    ],
    config: {
        modelId: '',
        dataId: ''
    },
    plain: true,
    autoShow: true,
    maximizable: true,
    height: 600,
    width: 800,
    layout: 'fit',
    modal: true,
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            title: '导出ODS标准文件',
            items: [
                {
                    xtype: 'orientForm',
                    layout: 'hbox',
                    defaults: {
                        flex: 1
                    },
                    layoutConfig: {
                        pack: "center",
                        align: "stretch"
                    },
                    items: [
                        //    {
                        //    xtype: 'SimpleColumnDescForSelector',
                        //    margin: '0 5 0 0',
                        //    columnDesc: {
                        //        sColumnName: 'startModelId',
                        //        text: '起点模型',
                        //        isRequired: true,
                        //        editAble: Ext.isEmpty(me.originalData),
                        //        selector: "{'selectorType': '2','multiSelect': false,'selectorName': '选择模型'}"
                        //    }
                        //},
                        {
                            xtype: 'SimpleColumnDescForSelector',
                            margin: '0 5 0 0',
                            columnDesc: {
                                sColumnName: 'endModelId',
                                text: '终点模型',
                                isRequired: true,
                                editAble: Ext.isEmpty(me.originalData),
                                selector: "{'selectorType': '2','multiSelect': false,'selectorName': '选择模型'}"
                            }
                        }],
                    region: 'center',
                    listeners: {
                        afterrender: function (formPanel) {
                            //var startModelField = formPanel.down('hidden[name=startModelId]');
                            //startModelField.addListener('change', me._drawPath, me);
                            var endModelField = formPanel.down('hidden[name=endModelId]');
                            endModelField.addListener('change', me._drawPath, me);
                        }
                    }
                }, {
                    region: 'south',
                    height: 500,
                    collapsed: true,
                    collapsible: true,
                    layout: 'fit',
                    title: '路径展现',
                    itemId: 'showPathRegion'
                }
            ],
            layout: 'border'
        });
        me.callParent(arguments);
    },
    _drawPath: function (field, newValue, oldValue) {
        var me = this;
        var name = field.getName();
        var formPanel = field.up('orientForm');
        var dictionary = ['endModelId'];
        var modelStartAndEnd = {
            startModelId: me.modelId
        };
        var doDraw = true;
        Ext.each(dictionary, function (itemId) {
            var item = formPanel.down('hidden[name=' + itemId + ']');
            var itemValue = item.getValue();
            if (Ext.isEmpty(itemValue)) {
                doDraw = false;
            }
            modelStartAndEnd[itemId] = itemValue;
        });
        if (doDraw === true) {
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/QuantityInstance/getModelPath.rdm', modelStartAndEnd, true, function (resp) {
                if (resp.decodedData.success == true) {
                    var modelPath = resp.decodedData.results;
                    var container = me.down('#showPathRegion');
                    container.expand();
                    var buttons = [];
                    Ext.each(modelPath, function (model, index) {
                        buttons.push({
                            text: '路径【' + (index + 1) + '】',
                            scope: me,
                            handler: Ext.bind(me._doExport, me, [model], false),
                            listeners: {
                                mouseover: Ext.bind(me._highLightTransition, me, [model], false),
                                mouseout: Ext.bind(me._clearHighLightTransition, me, [model], false),
                                scope: me
                            }
                        });
                    });
                    var modelPathPanel = Ext.create('OrientTdm.BackgroundMgr.Quantity.Instance.ModelPathPanel', Ext.apply(modelStartAndEnd, {
                        modelPath: modelPath,
                        buttons: buttons,
                        buttonAlign: 'center'
                    }));
                    container.removeAll();
                    container.add(modelPathPanel);
                }
            });
        }
    },
    _doExport: function (modelPath) {
        var me = this;
        var param = {
            modelPath: modelPath,
            dataId: me.dataId,
            modelId: me.modelId
        };
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/QuantityInstance/exportTOODS.rdm', param, true, function (resp) {
            window.location.href = serviceName + "/orientForm/downloadByName.rdm?fileName=" + resp.decodedData.results;
        }, true);
    },
    _highLightTransition: function (modelPath) {
        var me = this;
        var modelPathPanel = me.down('modelPathPanel');
        modelPathPanel.fireEvent('highLightTransition', modelPath);
    },
    _clearHighLightTransition: function (modelPath) {
        var me = this;
        var modelPathPanel = me.down('modelPathPanel');
        modelPathPanel.fireEvent('clearHighLightTransition', modelPath);
    }
});