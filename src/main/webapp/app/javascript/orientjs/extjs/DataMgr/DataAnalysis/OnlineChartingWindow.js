/**
 * Created by enjoy on 2016/5/24 0024.
 */
Ext.define('OrientTdm.DataMgr.DataAnalysis.OnlineChartingWindow', {
    alias: 'widget.postChartingWindow',
    extend: 'Ext.Window',
    requires: [

    ],
    config: {
        modelId: "",
        colDesc: {}
    },
    initComponent: function () {
        var me = this;

        var store = Ext.create('Ext.data.Store', {
            fields: ["name","value"],
            data: function() {
                var colDesc = me.colDesc;
                var columns = [];
                for(var i=0; i<colDesc.length; i++) {
                    var desc = colDesc[i];
                    if(desc.type=="C_Integer" || desc.type=="C_BigInteger"
                            || desc.type=="C_Decimal" || desc.type=="C_Float" || desc.type=="C_Double") {
                        columns.push({
                            name: desc.text,
                            value: desc.sColumnName
                        });
                    }
                }
                return columns;
            }()
        });

        var form = Ext.create("OrientTdm.Common.Extend.Form.OrientForm", {
            url: serviceName + '/dataAnalysis/postCharting.rdm',
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
                flex: 1,
                defaults: {
                    anchor: "95%",
                    border : false,
                    labelWidth : 40,
                    labelAlign : "right"
                },
                items: [{
                    fieldLabel: 'X轴',
                    name: 'xAxis',
                    xtype: 'combo',
                    mode: 'local',
                    allowBlank: false,
                    store: store,
                    editable: false,
                    emptyText: '--选择X轴--',
                    displayField: 'name',
                    valueField: 'value',
                    triggerAction: 'all',
                    listeners: {
                        'beforequery': function (queryEvent) {

                        },
                        'select': function (combo, record, index) {

                        }
                    }
                }, {
                    xtype: 'textfield',
                    fieldLabel: '模型ID',
                    name: 'modelId',
                    hidden: true,
                    value: me.modelId
                }]
            },
            {
                flex: 2,
                defaults: {
                    anchor: "95%",
                    border : false,
                    labelWidth : 40,
                    labelAlign : "right"
                },
                items: [{
                    fieldLabel: 'Y轴',
                    name: 'yAxis',
                    xtype: 'combo',
                    mode: 'local',
                    allowBlank: false,
                    store: store,
                    multiSelect: true,
                    editable: false,
                    emptyText: '--默认全选中--',
                    showSelectAll: true,
                    displayField: 'name',
                    valueField: 'value',
                    triggerAction: 'all',
                    listeners: {
                        'beforequery': function (queryEvent) {

                        },
                        'select': function (combo, record, index) {

                        }
                    }
                }]
            }]
        });

        Ext.apply(me, {
            title: '图形配置',
            iconCls: 'icon-basicInfo',
            layout: "fit",
            width: 500,
            height: 120,
            constrain: true,
            modal: true,
            buttonAlign: "center",
            items: [form],
            buttons: [/*{
                text: "Post绘图",
                handler: function () {
                    var basicForm = form.getForm();
                    if (basicForm.isValid()) {
                        basicForm.submit({
                            success: function(form, action) {
                                var respText = action.response.responseText;
                                me.postCharting(respText);
                            },
                            failure: function(form, action) {
                                var respText = action.response.responseText;
                                me.postCharting(respText);
                            }
                        });
                    }
                }
            }, */{
                text: "Plotly绘图",
                handler: function () {
                    var basicForm = form.getForm();
                    if (basicForm.isValid()) {
                        var vals = basicForm.getValues();
                        window.open(serviceName + '/app/javascript/orientjs/extjs/DataMgr/DataAnalysis/plotlyDisplay.jsp' +
                            '?conf=' + Ext.encode(vals), "_blank"/*, "top=50,left=50,width=800,height=600"*/);
                        me.close();
                    }
                }
            }, {
                text: "Flot绘图",
                handler: function () {
                    var basicForm = form.getForm();
                    if (basicForm.isValid()) {
                        var vals = basicForm.getValues();
                        window.open(serviceName + '/app/javascript/orientjs/extjs/DataMgr/DataAnalysis/flotDisplay.jsp' +
                            '?conf=' + Ext.encode(vals), "_blank"/*, "top=50,left=50,width=800,height=600"*/);
                        me.close();
                    }
                }
            }]
        });

        me.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
    },
    postCharting: function(respText) {
        var data = Ext.decode(respText);
        Ext.useShims = true;
        var url = "http://" + location.host + serviceName
            + "/app/javascript/orientjs/extjs/DataMgr/DataAnalysis/postDisplay.jsp?SocketIP="+data.SocketIP
            +"&SocketPort="+data.SocketPort
            +"&userid="+data.userid
            +"&metaxml="+encodeURI(data.metaxml);
        window.location.href = "pageoffice://|"+url+"|width=1000px;height=700px;|";
        this.close();
    }
});