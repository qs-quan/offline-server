/**
 * Created by enjoy on 2016/6/2 0002.
 */
Ext.define('OrientTdm.HomePage.Portal.ChoosePortalWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.choosePortalWin',
    requires: [
        'OrientTdm.SysMgr.PortalMgr.PortalList'
    ],
    height: 400,
    width: 670,
    plain: true,
    modal: true,
    layout: 'fit',
    title: '选择磁贴',
    closeAction: 'destroy',
    initComponent: function () {
        var me = this;
        var portalList = Ext.create("OrientTdm.SysMgr.PortalMgr.PortalList", {
            afterInitComponent: me.removeToolbars
        });
        Ext.apply(me, {
            items: [portalList],
            buttons: [{
                text: '保存',
                iconCls: 'icon-save',
                handler: function () {
                    var selectedRecords = OrientExtUtil.GridHelper.getSelectedRecord(me.down("portalList"));
                    me.fireEvent("selected", selectedRecords);
                }
            }]
        });
        me.callParent();
        this.addEvents(
            'selected'
        );
    },
    removeToolbars: function () {
        this.store.getProxy().api.read = serviceName + "/home/listUnSelectedUserPortal.rdm";
        Ext.Array.erase(this.dockedItems, 0, 1);
    }
});