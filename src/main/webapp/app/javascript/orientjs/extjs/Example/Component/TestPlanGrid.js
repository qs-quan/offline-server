/**
 * Created by Administrator on 2017/7/20 0020.
 */
Ext.define('OrientTdm.Example.Component.TestPlanGrid', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientRefGrid',
    alias: 'widget.testPlanGrid',
    usePage: false,
    height: 300,
    templateName: '试验大纲模板',
    initComponent: function () {
        var me = this;
        this.callParent(arguments);
    }
});