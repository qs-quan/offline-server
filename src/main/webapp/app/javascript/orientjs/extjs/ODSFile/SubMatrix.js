/*
 * Copyright (c) 2016. Orient Company
 *
 */

/**
 * Created by mengbin on 16/3/21.
 */
Ext.define('OrientTdm.ODSFile.SubMatrix', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.subMatrix',

    initConfig:{
        id:'',
        name:'',
        fileId:''
    },
    initComponent: function () {
        var me = this;
        var matrixList = Ext.create("OrientTdm.ODSFile.SubMatrixTreeList",{
            region: 'center',
            padding: '0 0 0 0',
            title:'参数列表',
            initConfig:{
                fileId:me.initConfig.fileId,
                name:me.initConfig.name,
                id:me.initConfig.id
            }

        });
        var southPanel = Ext.create("OrientTdm.Common.Extend.Panel.OrientPanel",{
            region: 'south',
            id:'odsmatrixdatagrid',
            title:'数据列表',
            padding: '0 0 0 5',
            split: true,
            collapsible: true,
            collapsed:true,
            height:0.4 * globalHeight,
            layout:'fit',
            collapseMode:'mini'

        });
        Ext.apply(this, {
            layout: 'border',
            items: [matrixList,southPanel]
        });
        this.callParent(arguments);
    }
});