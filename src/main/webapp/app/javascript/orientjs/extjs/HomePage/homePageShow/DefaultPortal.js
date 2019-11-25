/**
 * Created by Seraph on 16/8/29.
 */
Ext.define('OrientTdm.HomePage.homePageShow.DefaultPortal', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.defaultPortal',
    requires: [

    ],
    baseCls: 'homePageDefault',
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
    },
    afterInitComponent: function () {
        var me = this;
        me.frame = false;
    }
});