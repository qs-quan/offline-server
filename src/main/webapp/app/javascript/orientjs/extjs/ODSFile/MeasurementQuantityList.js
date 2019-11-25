/*
 * Copyright (c) 2016. Orient Company
 *
 */

/**
 * Created by mengbin on 16/3/19.
 */
Ext.define('OrientTdm.ODSFile.MeasurementQuantityList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.measurementQuantityList',
    requires: [
        "OrientTdm.ODSFile.Model.ODSMeasurementQuantityNodeModel"
    ],
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    initConfig: {
        id: '',
        name: '',
        fileId: ''
    },
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
                text: '初始化',
                scope: this,
                handler: this.onSync
            }]
        });
    },
    createColumns: function () {
        return [
            {
                header: '名称',
                width: 100,
                sortable: true,
                dataIndex: 'name',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '类型',
                width: 100,
                sortable: true,
                dataIndex: 'datatype',
                filter: {
                    type: 'string'
                }
            }

        ];
    },

    createStore: function () {
        var listpanel = this;
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.ODSFile.Model.ODSMeasurementQuantityNodeModel',
            autoLoad: true,

            proxy: {
                type: 'ajax',

                // url:'app/javascript/orientjs/extjs/ODSFile/Test/measureinfo.json',
                url: serviceName + '/afxload/getMeasurementQuantityList.rdm?atfxFileId=' + listpanel.initConfig.fileId + '&measurementId=' + listpanel.initConfig.id,
                reader: {
                    type: 'json',

                    root: 'results'

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
