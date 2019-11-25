/*
 * Copyright (c) 2016. Orient Company
 *
 */

/**
 * Created by mengbin on 16/3/17.
 */
Ext.define('OrientTdm.ODSFile.ODSDashboard', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.odsFileDashBoard',
    filepath: 'atfxFilePath',
    config: {
        fileId: '13240'
    },
    initComponent: function () {
        var me = this;
        var centerPanel = Ext.create("OrientTdm.Common.Extend.Panel.OrientTabPanel", {
            region: 'center',
            padding: '0 0 0 5',
            items: [
                {
                    title: '简介',
                    iconCls: 'icon-basicInfo',
                    html: '<h1>文件的基本属性和AOEnvirment的信息</h1>'
                }
            ]
        });

        var leftPanel = Ext.create("OrientTdm.ODSFile.MeasurementNavTreePanel", {
            orientRootId: 4,
            width: 250,
            minWidth: 250,
            maxWidth: 400,
            region: 'east',
            fileId:me.fileId,
            targetPanel: centerPanel
        });
        Ext.apply(this, {
            layout: 'border',
            items: [leftPanel, centerPanel]
        });


        this.callParent(arguments);
    }
});