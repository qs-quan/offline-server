/**
 * 数据表历史版本详情
 */

Ext.define('OrientTdm.TestBomBuild.Panel.GridPanel.TestDataVersion.TestDataVersionDetailList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    requires: [
        "OrientTdm.Common.Util.OrientExtUtil"
    ],
    alias: 'widget.TestDataVersionDetailList',
    config: {
        extraFilter: ''
    },
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    initComponent: function () {
        var me = this;
        me.initEvents();
        me.callParent(arguments);
    },

    // 不显示分页栏
    createFooBar: function(){},

    createStore: function () {
        var me = this;

        var retVal = Ext.create("Ext.data.Store", {
            autoLoad: true,
            fields: me.fields,
            data: me.datas
        });

        me.store = retVal;
        return retVal;
    },

    createColumns: function () {
        return this.columnss;
    }

});