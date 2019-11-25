/*
 * Copyright (c) 2016. Orient Company
 *
 */

/**
 * Created by mengbin on 16/3/21.
 */
Ext.define('OrientTdm.ODSFile.SubMatrixTreeList', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.subMatrixTreeList',
    rootVisible: false,
    animate: true,
    collapsible: false,
    loadMask: true,
    useArrows: true,
    orientRootId: -1,
    initConfig:{
        id:'',
        name:'',
        fileId:''
    },
    initComponent: function () {
        var me = this;

        Ext.define('matrixdata', {
            extend: 'Ext.data.Model',
            fields: [
                {name: 'id',       type: 'string'},
                {name: 'name',     type: 'string'},
                {name: 'rowcount', type: 'string'},
                {name: 'colcount', type: 'string'},
                {name: 'thumb',    type: 'string'},
                {name: 'type',     type: 'string'}
            ]
        });

        me.store = Ext.create('Ext.data.TreeStore', {

            rootVisible: true,
            model:'matrixdata',
          //  fields: ['id', 'name', 'rowcount', 'colcount','thumb', 'type'],

            proxy: {
                type: 'ajax',
                reader: {
                    type: 'json'

                },
                //url: 'app/javascript/orientjs/extjs/ODSFile/Test/MatrixTree.json'
               url: serviceName+'/afxload/getSubMatrixTree.rdm?atfxFileId='+me.initConfig.fileId+'&measurementId='+me.initConfig.id

            }
        });
        me.columns =  {
            items: [
                {
                    text: "名称",
                    dataIndex: "name",
                    xtype: 'treecolumn'
                },{
                    text: "类型",
                    dataIndex: "type"
                },{
                    text: "行数",
                    dataIndex: "rowcount"
                },{
                    text: "列数",
                    dataIndex: "colcount"
                }
            ],
            defaults: {
                flex: 1
            }
        };


        var toolBar = Ext.create('Ext.toolbar.Toolbar', {
            items: [{

                    // xtype: 'button', // 默认的工具栏类型
                    text: '查看数据',
                    scope: this,
                   handler:this.onViewMatrix

            },
                {

                    // xtype: 'button', // 默认的工具栏类型
                    text: '查看图形',
                    scope: this,
                    handler:this.onViewPlot

                }
            ]
        });
        me.dockedItems = [toolBar];
        this.callParent(arguments);
    },

    onViewPlot:function(){


        var me = this;

        var checkedItems = this.getChecked();
        var parent =null;
        var columns = new Array();
        for(var i = 0; i< checkedItems.length;i++) {
            if(parent==null){
                parent = checkedItems[i].parentNode;
            }
            else{
                if(parent != checkedItems[i].parentNode){
                    alert("选择相同的Item");
                    return;
                }
            }
            columns.push(checkedItems[i].get("name"));
        }
        var submatrixId =  parent.get("id");
        var submatrixPanel = Ext.getCmp('odsmatrixdatagrid');

        var southPanel = Ext.create("OrientTdm.ODSFile.MatrixPlotView",{

        });

        submatrixPanel.expand();
        submatrixPanel.removeAll();
        submatrixPanel.add(southPanel);

        var strCols ="";
        for( var i = 0; i< columns.length;i++){
            strCols = strCols+","+columns[i];
        }
        strCols =  strCols.substr(1);
        var url = serviceName+'/afxload/getMatrixPlotData.rdm?atfxFileId='
                                +me.initConfig.fileId+'&subMatrixId='+submatrixId+'&columnNames='+strCols;
        southPanel.draw(url);
        submatrixPanel.doLayout();


    },

    onViewMatrix:function(){

        var me = this;
        var checkedItems = this.getChecked();
        var parent =null;
        var columns = new Array();
        for(var i = 0; i< checkedItems.length;i++) {
            if(parent==null){
                parent = checkedItems[i].parentNode;
            }
            else{
                if(parent != checkedItems[i].parentNode){
                    alert("选择相同的Item");
                    return;
                }
            }
            columns.push(checkedItems[i].get("name"));
        }

        var submatrixId =  parent.get("id");
        var submatrixPanel = Ext.getCmp('odsmatrixdatagrid');//Ext.getCmp('submatrix-'+me.initConfig.id);
        //var exsitPanel = Ext.getCmp('submatrix_south_'+me.initConfig.id);
        //if(exsitPanel!=null){
        //    submatrixPanel.remove(exsitPanel);
        //}
        var southPanel = Ext.create("OrientTdm.ODSFile.MatrixDataGrid",{
            layout: 'fit',
            padding: '0 0 0 5',
            id:'submatrix_south_'+me.initConfig.id,
            initConfig:{
                subMatrixId:submatrixId,
                name:me.submatrixname,
                fileId:me.initConfig.fileId,
                columns:columns
            }
        });
        submatrixPanel.expand();
        submatrixPanel.removeAll();
        submatrixPanel.add(southPanel);
        submatrixPanel.doLayout();

    }
});