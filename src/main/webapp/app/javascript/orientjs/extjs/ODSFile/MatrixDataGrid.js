/*
 * Copyright (c) 2016. Orient Company
 *
 */

/**
 * Created by mengbin on 16/3/21.
 */
Ext.define('OrientTdm.ODSFile.MatrixDataGrid', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.SubMatrixList',
    requires: [
        "OrientTdm.ODSFile.Model.ODSSubMatrixNodeModel"
    ],
    initConfig: {
        subMatrixId: '',
        name: '',
        fileId: '',
        columns: []
    },
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    //视图初始化
    createToolBarItems: function () {
        var retVal = [];
        return retVal;
    },
    createColumns: function () {
        var columns = new Array();

        for (var i = 0; i < this.initConfig.columns.length; i++) {


            if (i == this.initConfig.columns.length - 1) {
                var col = {
                    header: this.initConfig.columns[i],
                    flex: 1,
                    dataIndex: i.toString()
                }
                columns.push(col);
            }
            else {
                var col = {
                    header: this.initConfig.columns[i],
                    width: 200,
                    dataIndex: i.toString()
                }
                columns.push(col);
            }

        }
        return columns;

    },

    createStore: function () {
        var listpanel = this;
        var colums = new Array();
        var strCols = "";

        Ext.define('matrixColumns', {
            extend: 'Ext.data.Model',
            fields: []//['aa','bb','cc']
        });

        //var matrixmodel = Ext.ModelManager.getModel('matrixColumns');
        //matrixmodel.fields.add('aa');
        //matrixmodel.fields.add('bb');
        //matrixmodel.fields.add('cc');
        for (var i = 0; i < this.initConfig.columns.length; i++) {

            var col = this.initConfig.columns[i];
            strCols = strCols + "," + col;

            var item = new Ext.data.Field({name: col, type: 'string'});
            var tt = i.toString();
            matrixColumns.prototype.fields.add({name: tt, type: 'string'});
            colums.push(item);
        }
        //var aa = 'aa';
        //matrixColumns.prototype.fields.add({ name: aa, type: 'string' });
        strCols = strCols.substr(1);
        var retVal = Ext.create('Ext.data.Store', {
            model: 'matrixColumns',
            autoLoad: true,
            proxy: {
                type: 'ajax',

                url: serviceName + '/afxload/getMatrixDataList.rdm?atfxFileId=' + listpanel.initConfig.fileId + '&subMatrixId=' + listpanel.initConfig.subMatrixId + '&columnNames=' + strCols,
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    root: 'results',
                    totalProperty: 'totalProperty',
                    idProperty: 'ID',
                    messageProperty: 'msg'
                },

                listeners: {
                    exception: function (proxy, response, operation) {
                        Ext.MessageBox.show({
                            title: '读写数据异常',
                            msg: operation.getError(),
                            icon: Ext.MessageBox.ERROR,
                            buttons: Ext.Msg.OK
                        });
                    }
                }
            }
        });
        return retVal;
    },
    onSync: function () {
        var me = this;
        Ext.getBody().mask("请稍后...", "x-mask-loading");
        Ext.Ajax.request({
            url: 'app/javascript/orientjs/extjs/ODSFile/Test/measureinfo.json',
            params: {},
            success: function (response) {
                Ext.getBody().unmask();
                me.fireEvent("refreshGrid");
            }
        });
    }


});
