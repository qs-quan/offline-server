/**
 * 图号结构列表
 * Created by dailin on 2019/3/26 15:50.
 * 2019年10月19日 yyyyyyh
 *  mes 获取方式变更，这个废弃
 */

Ext.define('OrientTdm.TestBomBuild.Panel.GridPanel.ProductBHGridpanel',{
    extend: 'Ext.grid.Panel',
    alias: 'widget.productBHGridpanel',
    config: {
        modelId: null,
        dataId: null,
        tabName: null,
        filterJson: null,
        queryUrl: null,
        girdFields: null
    },

    initComponent: function () {
        var me = this;
        // var params = {modelId: me.modelId, dataId: me.dataId, tabName: me.tabName};
        //定义Columns
        me.columns = me.createColumns();
        //定义Store
        me.store = me.createStore();
        //底部按钮栏
        me.bbar = (me.isHideBtn === true)?[]: me.createToolBarItems();
        me.callParent(arguments);
    },

    createColumns: function () {
        return [{
            header: "图号",
            align: 'center',
            dataIndex: 'BH'
        },{
            header: "名称",
            align: 'center',
            dataIndex: 'MC'
        },{
            header: "类型",
            align: 'center',
            dataIndex: 'LX'
        },{
            header: "层级",
            align: 'center',
            dataIndex: 'CJ'
        },{
            header: "版本",
            align: 'center',
            dataIndex: 'BB'
        },{
            header: "密级",
            align: 'center',
            dataIndex: 'MJ'
        },{
            header: "状态",
            align: 'center',
            dataIndex: 'ZT'
        },{
            header: "父编号",
            align: 'center',
            dataIndex: 'FBH'
        },{
            header: "父版本",
            align: 'center',
            dataIndex: 'FBB'
        },{
            header: "归档时间",
            align: 'center',
            dataIndex: 'GDSJ'
        }];
    },

    createStore: function () {
        var me = this;
        return Ext.create('Ext.data.JsonStore', {
            fields: ["_id","BH", "MC", "LX", "CJ", "BB", "MJ", "ZT", "FBH", "FBB", "GDSJ"],
            data : me.data
        });
    },

    createToolBarItems: function () {
        var me = this;
        var toolBarItems = [{
            xtype: 'tbfill'
        },{
            iconCls:'icon-create',
            text:'新增',
            scope:me,
            handler:me.addButtonFunction
        },{
            xtype: 'tbfill'
        }];
        return toolBarItems;
    },

    addButtonFunction: function() {
        var me = this;
        if (OrientExtUtil.GridHelper.hasSelectedOne(me)) {
            // 根据选择的图号调用 pdm 系统获取图号结构，同时根据实物标识调用 mes 系统获取实物数据列表
            me.doQueryFun(OrientExtUtil.GridHelper.getSelectedRecord(me)[0].data.BH);
        }
    },

    reloadGridData: function (queryUrl) {
        this.getStore().load();
    }

});