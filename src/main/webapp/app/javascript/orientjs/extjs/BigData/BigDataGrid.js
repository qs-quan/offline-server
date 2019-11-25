/*
 * Copyright (c) 2016. Orient Company
 *
 */

/**
 * Created by mengbin on 16/5/30.
 */
Ext.define('OrientTdm.BigData.BigDataGrid', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.BigDataGrid',
    requires: [

    ],
    initConfig: {
        hQueryInfo:null,
        gridData:null
    },
    beforeInitComponent:function(){


        if(this.initConfig.gridData == null){

           //获取数据查询数据
        }


    },
    afterInitComponent: Ext.emptyFn,
    //视图初始化
    createToolBarItems: function () {
        var retVal = [];
        return retVal;
    },
    createFooBar: function () {
        return Ext.create('Ext.toolbar.Toolbar', {
            weight: 1,
            dock: 'bottom',
            ui: 'footer',
            items: ['->', {
                iconCls: 'icon-init',
                text: '下一页',
                scope: this,
                handler: this.onNext
            }]
        });

    },
    createColumns: function () {
        var me = this;
        var retVal = [];
        //获取模型操作描述
        if(this.initConfig.hQueryInfo!= null){
            var colNames = this.initConfig.hQueryInfo.colNameList;

            var  i = 0 ;
            Ext.each(colNames, function (colName) {


                retVal[i] = {
                    header: colName,
                    dataIndex: colName
                };
                i++

            });
        }


        return retVal;

    },

    createStore: function () {

        var  me = this;
        var fields = [];
        var gridData = {};
        if(this.initConfig.hQueryInfo!=null){
            var queryinfo = this.initConfig.hQueryInfo;
            gridData = this.initConfig.gridData;
            var colNames = this.initConfig.hQueryInfo.colNameList;
            Ext.each(colNames, function (column) {
                fields.push({
                    name: column
                });
            });


        }



        var retVal = Ext.create('Ext.data.Store', {
            fields: fields,
            data : gridData,
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    root: 'reslutdata'
                }
            }
        });
        me.store = retVal;
        return retVal;
    },

    initComponent: function () {
        var me = this;
        me.beforeInitComponent.call(me);
        //定义Store
        var store = me.createStore.call(me);
        //定义Columns
        var columns = me.createColumns.call(me);
        //定义contextmenu
        var toolBarItems = me.createToolBarItems.call(me);
        var contextMenu = Ext.create('Ext.menu.Menu', {
            items: toolBarItems
        });
        //定义top菜单栏
        var toolBar = Ext.create('Ext.toolbar.Toolbar', {
            items: toolBarItems
        });
        //定义bottom菜单栏
        //定义底部按钮
        var footBar = me.createFooBar.call(me);
        Ext.apply(me, {
            viewConfig: {
                stripeRows: true,
                listeners: {
                    itemcontextmenu: function (view, rec, node, index, e) {
                        e.stopEvent();
                        contextMenu.showAt(e.getXY());
                        return false;
                    }
                }
            },
            dockedItems: [toolBar, footBar],
            columns: columns,
            store: store,
            selModel: {
                mode: me.multiSelect ? 'MULTI' : 'SINGLE'
            },
            selType: "checkboxmodel"
        });
        me.afterInitComponent.call(me);
        this.callParent(arguments);
        this.addEvents("refreshGrid");
    },

    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'doSearch', me.doSearch, me);
    },
    onNext: function () {
        var me = this;
        Ext.getBody().mask("请稍后...", "x-mask-loading");


        Ext.Ajax.request({
            url: serviceName+'/bigdatashow/queryData.rdm',
            params: {queryInfo:Ext.encode(me.initConfig.hQueryInfo)},
            success: function (response) {

                Ext.getBody().unmask();
                var retObj = response.decodedData;
                if(retObj.success==true){
                    hQueryInfo =  retObj.results.queryInfo;
                    gridData = {'reslutdata': retObj.results.reslutdata}

                    me.initConfig.gridData = gridData;
                    me.initConfig.hQueryInfo = hQueryInfo;

                    var cols = [];
                    //获取模型操作描述
                    if(me.initConfig.hQueryInfo!= null){
                        var colNames = me.initConfig.hQueryInfo.colNameList;

                        var  i = 0 ;
                        Ext.each(colNames, function (colName) {


                            cols[i] = {
                                header: colName,
                                dataIndex: colName
                            };
                            i++

                        });
                    }

                    var fields = [];
                    var gridData = {};
                    if(me.initConfig.hQueryInfo!=null){
                        var queryinfo = me.initConfig.hQueryInfo;
                          gridData = me.initConfig.gridData;
                        var colNames = me.initConfig.hQueryInfo.colNameList;
                        Ext.each(colNames, function (column) {
                            fields.push({
                                name: column
                            });
                        });
                    }
                    var store = Ext.create('Ext.data.Store', {
                        fields: fields,
                        data : gridData,
                        proxy: {
                            type: 'memory',
                            reader: {
                                type: 'json',
                                root: 'reslutdata'
                            }
                        }
                    });

                    me.reconfigure(store,cols);
                }
                else{

                }


            },
            failure: function(){
                Ext.getBody().unmask();
            },
            exception: function(){
                Ext.getBody().unmask();
            }

        });



    },

    doSearch: function (extraParams) {
        //形成新的QueryInfo
        var me = this;
        Ext.getBody().mask("请稍后...", "x-mask-loading");


        Ext.Ajax.request({
            url: serviceName+'/bigdatashow/queryData.rdm',
            params: {queryInfo:Ext.encode(me.initConfig.hQueryInfo)},
            success: function (response) {

                Ext.getBody().unmask();
                var retObj = response.decodedData;
                if(retObj.success==true){
                    hQueryInfo =  retObj.results.queryInfo;
                    gridData = {'reslutdata': retObj.results.reslutdata}

                    me.initConfig.gridData = gridData;
                    me.initConfig.hQueryInfo = hQueryInfo;

                    var cols = [];
                    //获取模型操作描述
                    if(me.initConfig.hQueryInfo!= null){
                        var colNames = me.initConfig.hQueryInfo.colNameList;

                        var  i = 0 ;
                        Ext.each(colNames, function (colName) {


                            cols[i] = {
                                header: colName,
                                dataIndex: colName
                            };
                            i++

                        });
                    }

                    var fields = [];
                    var gridData = {};
                    if(me.initConfig.hQueryInfo!=null){
                        var queryinfo = me.initConfig.hQueryInfo;
                        gridData = me.initConfig.gridData;
                        var colNames = me.initConfig.hQueryInfo.colNameList;
                        Ext.each(colNames, function (column) {
                            fields.push({
                                name: column
                            });
                        });
                    }
                    var store = Ext.create('Ext.data.Store', {
                        fields: fields,
                        data : gridData,
                        proxy: {
                            type: 'memory',
                            reader: {
                                type: 'json',
                                root: 'reslutdata'
                            }
                        }
                    });

                    me.reconfigure(store,cols);
                }
                else{

                }


            },
            failure: function(){
                Ext.getBody().unmask();
                Ext.MessageBox.show({
                    title: '查询异常',
                    msg: '系统出错',
                    icon: Ext.MessageBox.ERROR,
                    buttons: Ext.Msg.OK
                });
            },
            exception: function(){
                Ext.getBody().unmask();
                Ext.MessageBox.show({
                    title: '查询异常',
                    msg: '系统出错',
                    icon: Ext.MessageBox.ERROR,
                    buttons: Ext.Msg.OK
                });
            }

        });
    }


});
