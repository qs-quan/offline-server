/**
 * Created by Administrator on 2016/7/5 0005.
 */
Ext.define('OrientTdm.SysMgr.ModelRightsMgr.Common.ChooseModelColumnList', {
    extend: "Ext.grid.Panel",
    alias: 'widget.chooseModelColumnList',
    requires: [
        "OrientTdm.BackgroundMgr.CustomGrid.Model.ColumnDescExtModel"
    ],
    config: {
        columnDatas: [],
        selecteds: ''
    },
    initComponent: function () {
        var me = this;
        var columns = [{
            text: '名称',
            flex: 1,
            sortable: true,
            dataIndex: 'text'
        }, {
            text: '类型',
            sortable: true,
            dataIndex: 'type',
            renderer: OrientModelHelper.columnTypeRenderer
        }, {
            text: '列表',
            dataIndex: 'listAble',
            width:50,
            xtype: 'checkcolumn'
        }, {
            text: '新增',
            xtype: 'checkcolumn',
            width:50,
            dataIndex: 'addAble'
        }, {
            text: '修改',
            xtype: 'checkcolumn',
            width:50,
            dataIndex: 'modifyAble'
        }, {
            text: '详细',
            xtype: 'checkcolumn',
            width:50,
            dataIndex: 'detailAble'
        }];
        var store = Ext.create("Ext.data.Store", {
            model: "OrientTdm.BackgroundMgr.CustomGrid.Model.ColumnDescExtModel",
            data: me.columnDatas
        });
        Ext.apply(me, {
            multiSelect: true,
            store: store,
            selType: "checkboxmodel",
            columns: columns,
            stripeRow: true,
            margins: '5',
            viewConfig: {
                listeners: {
                    refresh: function () {
                        var columnGrid = this.up("chooseModelColumnList");
                        var selModel = columnGrid.getSelectionModel();
                        var selectedColumnIds = columnGrid.selecteds.split(",");
                        var gridStore = columnGrid.getStore();
                        Ext.each(selectedColumnIds, function (selectedColumnId) {
                            var record = gridStore.getById(selectedColumnId);
                            if (record) {
                                selModel.select(record, true, false);
                            }
                        });
                    }
                }
            }
        });
        me.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
    },
    getSelectedColumnIds: function () {
        var selections = this.getSelectionModel().getSelection();
        return Ext.Array.pluck(selections, "internalId").join(",");
    }
});