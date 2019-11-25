/*
 * Copyright (c) 2016. Orient Company
 *
 */

/**
 * Created by mengbin on 16/3/18.
 */
Ext.define('OrientTdm.ODSFile.MeasurementNavTreePanel', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.measurmentnavtreepanel',
    rootVisible: false,
    animate: true,
    collapsible: true,
    loadMask: true,
    useArrows: true,
    orientRootId: -1,
    targetPanel:null,
    fileId:'',
    initComponent: function () {
        var me = this;
        me.store = Ext.create('Ext.data.TreeStore', {
            model: 'Post',
            fields: ['id', 'text', 'thumb'],
            proxy: {
                type: 'ajax',
            reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                },

                //url: 'app/javascript/orientjs/extjs/ODSFile/Test/measurement.json'
                url:  serviceName+'/afxload/initATFXFileSummery.rdm?atfxFileId='+me.fileId
              //  url:  serviceName+'/bigdata/ConvertToBigData.rdm?fileId=980'
            }
        });
        me.listeners =  {
           "cellclick": Ext.bind(me.cellClick,me)

        };
        this.callParent(arguments);
    },

    cellClick : function(treePanel, td, cellIndex, record, tr, rowIndex, event, eOpts){
        var  id = record.get("id");
        var name =  record.get("text");
        var fileId = this.fileId;
        var mmeasurePanel = Ext.create("OrientTdm.ODSFile.MeasurementPanel", {
            title: 'MeasureMent',
            initConfig:{
                id:id,
                name:name,
                fileId:fileId
            }
        });

        this.targetPanel.add(mmeasurePanel);

        this.targetPanel.setActiveTab(mmeasurePanel);
    }
});