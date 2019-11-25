/**
 * Created by Administrator on 2017/7/20 0020.
 */
Ext.define('OrientTdm.Example.Component.AssignTestEquiGrid', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientRefGrid',
    alias: 'widget.assignTestEquiGrid',
    usePage: false,
    height: 300,
    templateName: '设备分配',
    initComponent: function () {
        var me = this;
        this.callParent(arguments);
    }
});