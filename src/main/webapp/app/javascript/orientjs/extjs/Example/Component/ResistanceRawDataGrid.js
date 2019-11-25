/**
 * Created by Administrator on 2017/7/20 0020.
 */
Ext.define('OrientTdm.Example.Component.ResistanceRawDataGrid', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientRefGrid',
    alias: 'widget.resistanceRawDataGrid',
    usePage: true,
    height: 300,
    templateName: '阻力试验原始数据',
    initComponent: function () {
        var me = this;
        this.callParent(arguments);
    }
});