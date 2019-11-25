/**
 * Created by enjoy on 2016/3/16 0016.
 */
Ext.define('OrientTdm.SysMgr.DeptMgr.DeptMain', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.DeptMain',
    requires: [
        "OrientTdm.SysMgr.DeptMgr.DeptTree",
        "OrientTdm.SysMgr.DeptMgr.DeptForm"
    ],
    initComponent: function () {
        var me = this;
        //var init = true;
        //var westPanel = Ext.create("OrientTdm.SysMgr.DeptMgr.DeptTree", {
        //    region: 'west',
        //    width: 250,
        //    padding: '0 0 0 5',
        //    listeners: {
        //        load: function(store, record, successful) {
        //            if(init && record.get("id")=="0") {
        //                init = false;
        //                westPanel.fireEvent("itemclick", westPanel, record);
        //                westPanel.getSelectionModel().select(record);
        //            }
        //        }
        //    }
        //});
        //var centerPanel = Ext.create("OrientTdm.SysMgr.DeptMgr.DeptForm", {
        //    region: 'center',
        //    padding: '0 0 0 5',
        //    bindModelName: "CWM_SYS_DEPARTMENT",
        //    successCallback: function () {
        //        westPanel.fireEvent("refreshTreeAndSelOne");
        //    }
        //});
        //
        //Ext.apply(me, {
        //    layout: 'border',
        //    items: [westPanel, centerPanel],
        //    westPanel: westPanel,
        //    centerPanel: centerPanel
        //});


        var centerPanel = Ext.create("OrientTdm.SysMgr.DeptMgr.DeptTreeGrid", {
            region: 'center',
            padding: '0 0 0 5'
        });

        Ext.apply(me, {
            layout: 'border',
            items: [centerPanel],
            centerPanel: centerPanel
        });

        me.callParent(arguments);
    }
});
