/**
 * Created by Administrator on 2016/8/19 0019.
 */
Ext.define('OrientTdm.Example.BtnExtend.TesDetailHtmlForm', {
    extend: 'OrientTdm.Common.Extend.Button.Override.DetailModelDataButton',
    alias: 'widget.tesDetailHtmlForm',
    triggerClicked: function (modelGridPanel) {
        var me = this;
        me.callParent(arguments);
    }
});