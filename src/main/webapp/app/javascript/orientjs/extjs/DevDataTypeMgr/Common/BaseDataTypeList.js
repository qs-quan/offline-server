/**
 * Created by Administrator on 2016/7/6 0006.
 */
Ext.define("OrientTdm.DevDataTypeMgr.Common.BaseDataTypeList", {
    extend: 'Ext.grid.Panel',
    alias: 'widget.baseDataTypeGrid',
    requires: [
        "Ext.ux.statusbar.StatusBar",
        "OrientTdm.DevDataTypeMgr.Common.DataTypeHelper",
        "OrientTdm.DevDataTypeMgr.Model.DataType",
        'OrientTdm.DevDataTypeMgr.Model.DataSubType'
    ],
    stripeRows: true,
    loadMask: true,
    config: {
        beforeInitComponent: Ext.emptyFn,
        afterInitComponent: Ext.emptyFn,
        subType: false,
        successCallBack: null,
        remoteUrls: {
            "read": '',
            "create": '',
            "update": '',
            "destroy": ''
        },
        subType: false

    },
    initComponent: function () {
        var me = this;
        me.beforeInitComponent.call(me);
        me.cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 2
        });
        var store = me.createStore.call(me);
        store.pageSize = globalPageSize;
        var columns = me.createColumn.call(me);
        var toolBarItems = me.createToolBarItems.call(me);
        var toolBar = Ext.create('Ext.toolbar.Toolbar', {
            items: toolBarItems
        });
        var bbar = me.createBBar.call(me);
        Ext.apply(me, {
            columns: columns,
            dockedItems: [toolBar],
            bbar: bbar,
            store: store,
            plugins: [me.cellEditing]
        });
        me.callParent(arguments);
        me.addEvents("refreshAndSelectOne", 'showHisData');
        me.afterInitComponent.call(me);

    },
    initEvents: function () {
        var me = this;
        me.callParent(arguments);
        me.mon(me, 'refreshAndSelectOne', me._refreshAndSelectOne, me);
        me.mon(me, 'showHisData', me._showHisData, me);
    },
    createBBar: function () {
        return Ext.create("Ext.ux.statusbar.StatusBar", {
            text: '已保存',
            iconCls: 'x-status-valid'
        });
    },
    createStore: function () {
        var me = this;
        var retVal = Ext.create('Ext.data.Store', {
            model: me.subType ? 'OrientTdm.DevDataTypeMgr.Model.DataSubType' : 'OrientTdm.DevDataTypeMgr.Model.DataType',
            autoDestroy: true,
            proxy: {
                type: 'ajax',
                api: {
                    "read": me.remoteUrls["read"],
                    "create": me.remoteUrls["create"],
                    "update": me.remoteUrls["update"],
                    "destroy": me.remoteUrls["destroy"]
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                },
                writer: {
                    type: 'json',
                    // encode:true,
                    //  writeAllFields: true,
                    allowSingle: false,
                    root: 'data'
                }
            },
            listeners: {
                beforesync: function () {
                    me.down("statusbar").showBusy();
                }
            }
        });
        this.store = retVal;
        return retVal;
    },
    createHisStore: function () {
        var me = this;
        var retVal = Ext.create('Ext.data.Store', {
            model: me.subType ? 'OrientTdm.DevDataTypeMgr.Model.DataSubType' : 'OrientTdm.DevDataTypeMgr.Model.DataType',
            autoDestroy: true,
            proxy: {
                type: 'ajax',
                api: {
                    "read": me.remoteUrls["hisUrl"]
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                }
            },
            listeners: {
                beforesync: function () {
                    me.down("statusbar").showBusy();
                }
            }
        });
        this.store = retVal;
        return retVal;
    },
    createToolBarItems: function () {
        var me = this;
        var retVal = [{
            iconCls: 'icon-create',
            text: '新增',
            itemId: 'create',
            scope: this,
            handler: me._onCreateClick
        }, {
            iconCls: 'icon-save',
            text: '保存',
            disabled: false,
            itemId: 'save',
            scope: this,
            handler: me._onSaveClick
        }, {
            iconCls: 'icon-refresh',
            text: '刷新',
            disabled: false,
            itemId: 'refresh',
            scope: this,
            handler: me._onRefreshClick
        }];
        return retVal;
    },
    _onDeleteClick: function (grid, rowIndex) {
        this.getStore().removeAt(rowIndex);
    },
    _onSaveClick: function () {
        var me = this;
        this.store.sync({
            success: function () {
                if (null == me.successCallBack) {
                    me._onRefreshClick();
                } else {
                    me.successCallBack.call(me);
                }
            }
        });
    },
    _onRefreshClick: function () {
        this.down("statusbar").setStatus({
            text: '已保存',
            iconCls: 'x-status-valid'
        });
        this.getSelectionModel().clearSelections();
        var store = this.getStore();
        var lastOptions = store.lastOptions;
        store.reload(lastOptions);
    },
    _refreshAndSelectOne: function (dataId) {
        var me = this;
        this.down("statusbar").setStatus({
            text: '已保存',
            iconCls: 'x-status-valid'
        });
        this.getSelectionModel().clearSelections();
        var store = this.getStore();
        var toClickedRecord = store.findRecord("id", dataId);
        var typeCode = null == toClickedRecord ? "-1" : toClickedRecord.get("datatypecode");
        var lastOptions = store.lastOptions;
        store.load(Ext.apply(lastOptions, {
            callback: function (records) {
                Ext.each(records, function (record) {
                    if (record.get("datatypecode") == typeCode) {
                        me.getSelectionModel().select(record);
                    }
                });
            }
        }));
    },
    _showHisData: function (rowIndex) {
        var me = this;
        var dataTypeId = me.getStore().getAt(rowIndex).get("id");
        if (dataTypeId) {
            var layout = me.ownerCt.getLayout();
            var hisPanel = layout.getNext();
            hisPanel.getStore().getProxy().setExtraParam("dataTypeId", dataTypeId);
            hisPanel.getStore().load();
            layout.setActiveItem(1);
        }
    },
    _controlBtnDisAble: function (disbale) {
        var me = this;
        var toolbar = me.down('toolbar');
        var btns = toolbar.query("button");
        Ext.each(btns, function (btn) {
            btn.setDisabled(!disbale);
        });
    },
    _onBackClick: function () {
        var me = this;
        var layout = me.ownerCt.getLayout();
        layout.setActiveItem(0);
    }
});