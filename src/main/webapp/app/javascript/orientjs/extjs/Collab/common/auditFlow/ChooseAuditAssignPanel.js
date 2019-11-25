/**
 * Created by Administrator on 2016/8/24 0024.
 */
Ext.define('OrientTdm.Collab.common.auditFlow.ChooseAuditAssignPanel', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.chooseAuditAssignPanel',
    requires: [
        'OrientTdm.Collab.common.auditFlow.Model.AuditAssignExtModel'
    ],
    padding: '0 0 5 0',
    config: {
        bindId: '',
        beforeInitComponent: Ext.emptyFn,
        afterInitComponent: Ext.emptyFn
    },
    initComponent: function () {
        var me = this;
        me.beforeInitComponent.call(me);
        me.cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 2
        });
        var store = me.createStore.call(me);
        var columns = me.createColumn.call(me);
        Ext.apply(me, {
            columns: columns,
            store: store,
            plugins: [me.cellEditing],
            useArrows: true,
            rootVisible: false,
            multiSelect: true
        });
        me.callParent(arguments);
        me.afterInitComponent.call(me);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'celldblclick', me.celldblclick, me);
    },
    createStore: function () {
        var me = this;
        var retVal = Ext.create('Ext.data.TreeStore', {
            model: 'OrientTdm.Collab.common.auditFlow.Model.AuditAssignExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    "read": serviceName + '/auditFlow/info/getAllTaskAssigner.rdm'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                },
                extraParams: {
                    bindId: me.bindId
                }
            }
        });
        return retVal;
    },
    createColumn: function () {
        var me = this;
        return [
            {
                xtype: 'treecolumn',
                header: '任务名称',
                width: 200,
                sortable: true,
                dataIndex: 'taskName'
            }, {
                header: '执行人(★)',
                flex: 1,
                dataIndex: 'assign_display'
            }
        ];
    },
    celldblclick: function (view, td, cellIndex, record, tr, rowIndex) {
        var me = this;
        var belongGrid = view.up('chooseAuditAssignPanel');
        var clickedColumn = belongGrid.columns[cellIndex];
        var clickedcolumnIndex = clickedColumn.dataIndex;
        if ('assign_display' == clickedcolumnIndex) {
            //弹出人员选择器
            var selectedValue = record.get('assign');
            var item = Ext.create('OrientTdm.Common.Extend.Form.Selector.ChooseUserPanel', {
                selectedValue: selectedValue,
                multiSelect: true,
                saveAction: function (selectedValue, callBack) {
                    if (selectedValue.length > 0) {
                        record.set('assign_display', Ext.Array.pluck(selectedValue, 'name').join(','));
                        record.set('assign', Ext.Array.pluck(selectedValue, 'id').join(','));
                        record.set('assign_username', Ext.Array.pluck(selectedValue, 'userName').join(','));
                        callBack.call(this);
                    } else {
                        OrientExtUtil.Common.err(OrientLocal.prompt.error, OrientLocal.prompt.atleastSelectOne);
                    }
                }
            });
            OrientExtUtil.WindowHelper.createWindow(item, {
                title: '设置人员'
            });
        }
    },
    getAssignInfos: function () {
        //获取执行人信息
        var me = this;
        var retVal = [];
        Ext.each(me.getRootNode().childNodes, function (record) {
            retVal.push({
                taskName: record.get('taskName'),
                assign_username: record.get('assign_username')
            });
        });
        return retVal;
    }
});