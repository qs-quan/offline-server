/**
 * Created by Administrator on 2017/7/20 0020.
 */
Ext.define('OrientTdm.Example.Component.AssignTestUserGrid', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientRefGrid',
    alias: 'widget.assignTestUserGrid',
    usePage: false,
    height: 300,
    templateName: '人员分配',
    initComponent: function () {
        var me = this;
        this.callParent(arguments);
    },
    beforeInitComponent: function () {
        var me = this;
        me.callParent(arguments);
        var modelDesc = me.modelDesc;
        modelDesc.columns.filter(function (data) {
            if (data.text == '现场人员') {
                data.showCalendar = true;
            }
        });
    }
});