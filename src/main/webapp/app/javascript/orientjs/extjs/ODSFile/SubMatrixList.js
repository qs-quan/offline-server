/*
 * Copyright (c) 2016. Orient Company
 *
 */

/**
 * Created by mengbin on 16/3/21.
 */
Ext.define('OrientTdm.ODSFile.SubMatrixList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.SubMatrixList',
    requires: [
        "OrientTdm.ODSFile.Model.ODSSubMatrixNodeModel"
    ],
    initConfig: {
        id: '',
        name: '',
        filepath: ''
    },
    beforeInitComponent: Ext.emptyFn,
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
                flex: 1,
                sortable: true,
                dataIndex: 'name',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '行数',
                width: 100,
                dataIndex: 'rowcount',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '通道数',
                width: 100,
                dataIndex: 'colcount',
                filter: {
                    type: 'string'
                }
            }

        ];
    },

    createStore: function () {
        var listpanel = this;
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.ODSFile.Model.ODSSubMatrixNodeModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',

                url: serviceName + '/afxload/getSubMatrixList.rdm?atfxFileId=' + listpanel.initConfig.filepath + '&measurementId=' + listpanel.initConfig.id,
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
    },

    afterInitComponent: function () {
        //set set selection
        var me = this;
        this.on("selectionchange", this.initMatrixGrid);
    },

    initMatrixGrid: function (model, selected, opts) {
        var datas = selected;

    }

});
