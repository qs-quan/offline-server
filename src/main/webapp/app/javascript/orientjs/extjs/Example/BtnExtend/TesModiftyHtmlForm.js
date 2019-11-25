/**
 * Created by Administrator on 2016/8/19 0019.
 */
Ext.define('OrientTdm.Example.BtnExtend.TesModiftyHtmlForm', {
    extend: 'OrientTdm.Common.Extend.Button.Override.ModifyModelDataButton',
    alias: 'widget.testModiftyHtmlForm',
    triggerClicked: function (modelGridPanel) {
        var me = this;
        me.callParent(arguments);
    }
});