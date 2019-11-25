/*
 * Copyright (c) 2016. Orient Company
 *
 */

/**
 * Created by mengbin on 16/5/30.
 */

Ext.define('OrientTdm.BigData.BigDataDashboard', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.bigdataDashboard',
    config: {
        fileId: ''
    },
    initComponent: function () {
        var me = this;

        var hQueryInfo = null;
        var gridData = null;
        //  var northPanel = null;
        // var dataPanel = null;

        Ext.getBody().mask("请稍后...", "x-mask-loading");

        Ext.Ajax.request({
            url: serviceName + '/bigdatashow/initQueryInfo.rdm?bigdataFileId=' + me.fileId,
            async: false,
            params: {},
            success: function (response) {

                Ext.getBody().unmask();
                var retObj = response.decodedData;
                if (retObj.success == true) {
                    hQueryInfo = retObj.results.queryInfo;
                    gridData = {'reslutdata': retObj.results.reslutdata}
                }
                else {
                    //Ext.MessageBox.show({
                    //    title: '读写数据异常',
                    //    msg: retObj.errMessage,
                    //    icon: Ext.MessageBox.ERROR,
                    //    buttons: Ext.Msg.OK
                    //});
                }


            },
            failure: function () {
                Ext.getBody().unmask();
            },
            exception: function () {
                Ext.getBody().unmask();
            }

        });


        /*
         var conn = Ext.lib.Ajax.getConnectionObject().conn;
         conn.open("POST", serviceName+'/bigdatashow/initQueryInfo.rdm',false);
         conn.send("bigdataFileId=980");

         if (conn.status == "200") {
         Ext.getBody().unmask();
         var retObj = Ext.decode(conn.responseText);
         if(retObj.success==true){
         hQueryInfo =  retObj.results.queryInfo;
         gridData = {'reslutdata': retObj.results.reslutdata}
         }
         else{
         Ext.MessageBox.show({
         title: '读写数据异常',
         msg: retObj.errMessage,
         icon: Ext.MessageBox.ERROR,
         buttons: Ext.Msg.OK
         });
         }
         }
         else{
         Ext.getBody().unmask();
         }
         */
        var northPanel = Ext.create("OrientTdm.BigData.BigDataQueryPanel", {
            region: 'north',
            title: '查询',
            padding: '0 0 0 5',
            split: true,
            collapsible: false,
            height: 300,
            layout: 'fit',
            initConfig: {
                hQueryInfo: hQueryInfo,
                gridData: gridData
            }
        });
        var dataPanel = Ext.create("OrientTdm.BigData.BigDataGrid", {
            id: 'bigdataGrid',
            region: 'center',
            padding: '0 0 0 5',
            initConfig: {
                hQueryInfo: hQueryInfo,
                gridData: gridData
            }

        });


        Ext.apply(this, {
            layout: 'border',
            items: [northPanel, dataPanel]
        });


        this.callParent(arguments);
    }
});
