/**
 * Created by Administrator on 2016/8/3 0003.
 */
Ext.define('OrientTdm.Example.AutoBuildExGrid', {
    extend: 'Ext.window.Window',
    requires: [
        'OrientTdm.BaseRequires'
    ],
    initComponent: function () {
        var me = this;
        var modelGrid = Ext.create("OrientTdm.Common.Extend.Grid.OrientModelGrid", {
            modelId: 226,
            isView: 0,
            templateId: 360
        });
        Ext.apply(me, {
            autoScroll: true,
            autoShow: true,
            layout: 'fit',
            width: 800,
            height: 600,
            items: [modelGrid]

        });
        this.callParent(arguments);
    }
});