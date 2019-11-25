/**
 * Created by Administrator on 2017/7/20 0020.
 */
Ext.define('OrientTdm.Example.Component.SelfPropelledRawDataGrid', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientRefGrid',
    alias: 'widget.selfPropelledRawDataGrid',
    usePage: true,
    height: 300,
    templateName: '自航试验原始数据',
    initComponent: function () {
        var me = this;
        this.callParent(arguments);
    }
});