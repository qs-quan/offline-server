/**
 * Created by enjoy on 2016/4/6 0006.
 */
Ext.define('OrientTdm.BackgroundMgr.ProcessDefinition.Common.AuditFLowTaskOpinionSettingList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.auditFLowTaskOpinionSettingList',
    requires: [
        'OrientTdm.BackgroundMgr.ProcessDefinition.Model.TaskOpinionSettingExtModel',
        'OrientTdm.Common.Extend.Grid.OrientMemoryEditGrid'
    ],
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    usePage: false,
    config: {
        pdId: ''
    },
    //视图初始化
    createToolBarItems: function () {
        var me = this;
        var retVal = [];
        retVal.push({
            text: '返回',
            iconCls: 'icon-back',
            handler: me._back,
            scope: me
        }, '->', {
            xtype: 'tbtext',
            text: '★所在列可双击编辑'
        });
        return retVal;
    },
    createColumns: function () {
        var me = this;
        return [
            {
                header: '任务名称',
                sortable: true,
                width: 150,
                dataIndex: 'taskName'
            },
            {
                header: '意见设置(★)',
                sortable: true,
                flex: 1,
                dataIndex: 'opinion'
            }
        ];
    },
    createStore: function () {
        var me = this;
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.BackgroundMgr.ProcessDefinition.Model.TaskOpinionSettingExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    "read": serviceName + '/AuditFlowOpinionSetting/init.rdm',
                    "create": serviceName + '/AuditFlowOpinionSetting/create.rdm',
                    "update": serviceName + '/AuditFlowOpinionSetting/update.rdm',
                    "destroy": serviceName + '/AuditFlowOpinionSetting/delete.rdm'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                },
                extraParams: {
                    pdId: me.pdId
                },
                writer: {
                    type: 'json',
                    allowSingle: true
                }
            }
        });
        this.store = retVal;
        return retVal;
    },
    initComponent: function () {
        var me = this;
        me.cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 2,
            listeners: {
                edit: function (editor, e) {
                    if (e.record.dirty) {
                        me.saveRecord(function () {
                            e.record.commit();
                        });
                    }
                },
                validateedit: function (editor, e) {

                }
            }
        });
        Ext.apply(me, {
            plugins: [me.cellEditing]
        });
        me.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'celldblclick', me.celldblclick, me);
    },
    celldblclick: function (view, td, cellIndex, record, tr, rowIndex) {
        var me = this;
        var belongGrid = view.up('grid');
        //存在checkbox
        var clickedColumn = belongGrid.columns[cellIndex - 1];
        var clickedcolumnIndex = clickedColumn.dataIndex;
        if ('opinion' == clickedcolumnIndex) {
            var gridData = [];
            //类型选择器
            var opinion = record.get(clickedcolumnIndex);
            //转化为数组形式
            if (Ext.isEmpty(opinion)) {
                gridData.push({
                    '意见名称': '审批意见'
                });
            } else {
                Ext.each(opinion.split(','), function (loop) {
                    gridData.push({
                        '意见名称': loop
                    });
                })
            }
            var item = Ext.create('OrientTdm.Common.Extend.Grid.OrientMemoryEditGrid', {
                gridData: gridData
            });
            OrientExtUtil.WindowHelper.createWindow(item, {
                title: '意见设置',
                buttons: [
                    {
                        text: '关闭',
                        iconCls: 'icon-close',
                        handler: function () {
                            this.up('window').close();
                        }
                    },
                    {
                        text: '保存',
                        iconCls: 'icon-save',
                        handler: function () {
                            var currWin = this.up('window');
                            var grid = currWin.down('orientMemoryEditGrid');
                            var opinionData = grid.getGridData();
                            var modifyValue = Ext.Array.pluck(opinionData, '意见名称').join(',');
                            if (opinion != modifyValue) {
                                record.set(clickedcolumnIndex, modifyValue);
                                me.saveRecord(function () {
                                    currWin.close();
                                });
                            } else {
                                currWin.close();
                            }
                        }
                    }
                ]
            },600, 800);
        }
    },
    saveRecord: function (successCallback) {
        var me = this;
        me.getStore().sync(
            {
                success: successCallback
            }
        );
    },
    _back: function () {
        var me = this;
        var fatherPanel = me.up('pdCard');
        if (fatherPanel) {
            var layout = fatherPanel.getLayout();
            layout.setActiveItem(0);
        }
    }
});