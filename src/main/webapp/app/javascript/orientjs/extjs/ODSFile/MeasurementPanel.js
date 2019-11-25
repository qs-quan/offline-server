/*
 * Copyright (c) 2016. Orient Company
 *
 */

/**
 * Created by mengbin on 16/3/18.
 */
Ext.define('OrientTdm.ODSFile.MeasurementPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientTabPanel',
    alias: 'widget.measurementPanel',
    tabPosition : 'bottom',
    icon:'app/images/top/logo.png',
    initConfig:{
        id:'',
        name:'',
        fileId:''
    },
    initComponent: function(){
        var me = this;
        var informationPanel = Ext.create("OrientTdm.ODSFile.MeasurementInfo", {
            initConfig:{
                fileId:me.initConfig.fileId,
                name:me.initConfig.name,
                id:me.initConfig.id

            },
            title: 'information'
        });
        var submatrixPanel = Ext.create("OrientTdm.ODSFile.SubMatrix", {
            initConfig:{
                fileId:me.initConfig.fileId,
                name:me.initConfig.name,
                id:me.initConfig.id

            },
            title: 'submatrix',
            id:'submatrix-'+me.initConfig.id

        });

        Ext.apply(this, {
           // layout: 'border',
            items: [informationPanel,submatrixPanel]
        });
        this.callParent(arguments);
    }
})