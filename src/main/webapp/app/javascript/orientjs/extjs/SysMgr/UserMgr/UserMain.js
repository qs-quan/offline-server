/**
 * Created by qjs on 2016/10/21.
 */
Ext.define('OrientTdm.SysMgr.UserMgr.UserMain', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.UserMain',
    requires: [
        "OrientTdm.SysMgr.UserMgr.UserDeptTree",
        "OrientTdm.SysMgr.UserMgr.UserList"
    ],initComponent: function () {
        var me = this;
        var init = true;
        var westPanel = Ext.create("OrientTdm.SysMgr.UserMgr.UserDeptTree", {
            region: 'west',
            width: 200,
            padding: '0 0 0 5',
            listeners: {
                load: function(store, record, successful) {
                    if(init && record.get("id")=="0") {
                        init = false;
                        westPanel.fireEvent("itemclick", westPanel, record);
                        westPanel.getSelectionModel().select(record);
                    }
                }
            }
        });
        var centerPanel = Ext.create("OrientTdm.SysMgr.UserMgr.UserList", {
            region: 'center',
            padding: '0 0 0 5'
        });

        Ext.apply(me, {
            layout: 'border',
            items: [westPanel, centerPanel],
            westPanel: westPanel,
            centerPanel: centerPanel
        });
        me.callParent(arguments);
    }
});
