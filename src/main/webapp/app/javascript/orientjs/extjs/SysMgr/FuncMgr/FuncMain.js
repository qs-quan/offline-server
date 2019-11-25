/**
 * Created by enjoy on 2016/3/16 0016.
 */
Ext.define('OrientTdm.SysMgr.FuncMgr.FuncMain', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.FuncMain',
    requires: [
        "OrientTdm.SysMgr.FuncMgr.FuncTree",
        "OrientTdm.SysMgr.FuncMgr.FuncForm"
    ],
    initComponent: function () {
        var me = this;
        var init = true;
        var westPanel = Ext.create("OrientTdm.SysMgr.FuncMgr.FuncTree", {
            title: '功能点维护',
            region: 'west',
            width: 320,
            padding: '0 0 0 5',
            listeners: {
                load: function (store, record, successful) {
                    if (init && record.get("id") == "0") {
                        init = false;
                        westPanel.fireEvent("itemclick", westPanel, record);
                        westPanel.getSelectionModel().select(record);
                    }
                }
            }
        });
        var centerPanel = Ext.create("OrientTdm.SysMgr.FuncMgr.FuncForm", {
            region: 'center',
            padding: '0 0 0 5',
            bindModelName: "CWM_SYS_FUNCTION",
            successCallback: function () {
                westPanel.fireEvent("refreshTreeAndSelOne");
            }
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