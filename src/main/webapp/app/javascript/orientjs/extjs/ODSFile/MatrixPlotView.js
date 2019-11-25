/*
 * Copyright (c) 2016. Orient Company
 *
 */

/**
 * Created by mengbin on 16/4/1.
 */
Ext.define('OrientTdm.ODSFile.MatrixPlotView', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.matrixPlotView',


    initConfig: {
        remoteURL: ''
    },
    initComponent: function () {


        var me = this;
        Ext.apply(this, {
            layout: 'fit',
            html: '<div id="carve"></div>'


        });

        this.callParent(arguments);

        // this.addEvents("afterrender");


    },
    initEvents: function () {
        var me = this;
        me.mon(me, 'afterrender', me.afterrender, me);
        me.callParent();

    },
    draw: function (url) {
        Ext.Ajax.request({
            url: url,
            params: {},
            success: function (response) {
                Ext.getBody().unmask();
                var TESTER = document.getElementById('carve');
                var RetObj = response.decodedData;
                if (RetObj.success == true) {
                    var cols = new Array();
                    var colData = RetObj.results;
                    var data = new Array();
                    for (var i = 0; i < colData.length; i++) {
                        cols.push(colData[i].colName);
                        data.push(colData[i].data);
                    }
                    for (var i = 1; i < data.length; i++) {

                        var traces = [{
                            x: data[0],
                            y: data[i],
                            type: 'scatter'
                        }];
                        if (i == 1) {
                            var layout = {
                                xaxis: {
                                    autorange: true
                                },
                                yaxis: {

                                    autorange: true
                                },
                                margin: {t: 10}
                            };
                            var config = {
                                modeBarButtonsToRemove: ['toImage', 'sendDataToCloud'],
                                displaylogo: false
                            };
                            Plotly.newPlot('carve', traces, layout, config);
                        }
                        else {
                            Plotly.addTraces('carve', traces, i - 1);
                        }
                    }
                }
            }
        });
    }
});
