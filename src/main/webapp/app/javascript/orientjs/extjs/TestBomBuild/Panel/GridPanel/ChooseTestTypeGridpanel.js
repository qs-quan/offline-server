/**
 * 试验类型选择
 * Created by dailin on 2019/5/31 9:28.
 */

Ext.define('OrientTdm.TestBomBuild.Panel.GridPanel.ChooseTestTypeGridpanel',{
    extend: 'OrientTdm.Common.Extend.Grid.OrientModelGrid',
    alias:"widget.ChooseTestTypeGridpanel",
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
    },

    createColumns: function() {
        var me = this;
        var columns = me.callParent(arguments);
        var retV = [];
        Ext.each(columns, function (column) {
            if (column.dataIndex.indexOf('M_RYID_') < 0 && column.dataIndex.indexOf('M_MS_') < 0) {
                retV.push(column);
            }
        });
        return retV;
    },
    createToolBarItems: function () {
        return [];
    }

});