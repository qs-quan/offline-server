/*
 * Copyright (c) 2016. Orient Company
 *
 */

/**
 * Created by mengbin on 16/3/19.
 */
Ext.define('OrientTdm.ODSFile.MeasurementInfo', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.measurementInfo',
    initConfig:{
        id:'',
        name:'',
        fileId:''
    },
    initComponent: function () {
        var me = this;


        var centerPanel = Ext.create("OrientTdm.ODSFile.MeasurementInfoList",{
            region: 'center',
            padding: '0 0 0 5',
            title:'测试信息',
            initConfig:{
                fileId:me.initConfig.fileId,
                name:me.initConfig.name,
                id:me.initConfig.id

            }

        });
        var southPanel = Ext.create("OrientTdm.ODSFile.MeasurementQuantityList",{
            region: 'south',
            padding: '0 0 0 5',
            title:'测试变量',
            initConfig:{
                fileId:me.initConfig.fileId,
                name:me.initConfig.name,
                id:me.initConfig.id

            }

        });


        Ext.apply(this, {
            layout: 'border',
            items: [centerPanel,southPanel]
        });


        this.callParent(arguments);


    }
});