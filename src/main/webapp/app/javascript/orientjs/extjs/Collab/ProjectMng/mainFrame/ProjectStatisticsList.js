/**
 * 项目统计列表
 */
Ext.define('OrientTdm.Collab.ProjectMng.mainFrame.ProjectStatisticsList',{
    extend: 'Ext.grid.Panel',
    alias: 'widget.ProjectStatisticsList',
    initComponent: function () {
        var me = this;
        //定义Columns
        me.columns = me.createColumns();
        //定义Store
        me.store = me.createStore();
        me.tbar = me.createToolBar();
        me.callParent(arguments);
        if (me.startDate != undefined) {
            me.down("#startDate").setValue(Ext.util.Format.date(new Date(parseInt(me.startDate)),'Y年m月d日'));
        }
        if (me.endDate != undefined) {
            me.down("#endDate").setValue(Ext.util.Format.date(new Date(parseInt(me.endDate)),'Y年m月d日'));
        }
    },

    createToolBar: function () {
        var me = this;
        return [{
            xtype: 'textfield',
            itemId: 'startDate',
            editable: false,
            emptyText: '项目开始时间'
        },{
            xtype: 'textfield',
            itemId: 'endDate',
            editable: false,
            emptyText: '项目结束时间'
        }];
    },

    createColumns: function () {
        return [{
            header: "项目状态",
            align: 'center',
            flex: 1,
            dataIndex: 'status'
        },{
            header: "数量",
            align: 'center',
            flex: 1,
            dataIndex: 'count'
        }];
    },

    createStore: function () {
        var me = this;
        return Ext.create('Ext.data.JsonStore', {
            fields: ["status","count"],
            data : me.data
        });
    }
});