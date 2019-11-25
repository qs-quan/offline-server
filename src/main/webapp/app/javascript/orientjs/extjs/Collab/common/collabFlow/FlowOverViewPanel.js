/**
 * Created by Administrator on 2016/9/7 0007.
 */
Ext.define('OrientTdm.Collab.common.collabFlow.FlowOverViewPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.flowOverViewPanel',
    config: {
        containId: ''
    },
    requires: [],
    initComponent: function () {
        var me = this;
        var sid = new Date().getTime();
        Ext.apply(me, {
            html: '<div id="' + me.containId + '" style="position:absolute; overflow:hidden; left:0px; top:0px;' +
            ' right:0px; bottom:0px; z-index:100;"></div>'
        });
        this.callParent(arguments);
    }
});