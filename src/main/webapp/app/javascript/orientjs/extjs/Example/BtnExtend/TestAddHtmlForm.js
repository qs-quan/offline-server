/**
 * Created by Administrator on 2016/8/19 0019.
 */
Ext.define('OrientTdm.Example.BtnExtend.TestAddHtmlForm', {
    extend: 'OrientTdm.Common.Extend.Button.Override.AddModelDataButton',
    alias: 'widget.testApprovalBtn',
    triggerClicked: function (modelGridPanel) {
        var me = this;
        me.callParent(arguments);
    }
});