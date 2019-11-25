/**
 * Created by Seraph on 16/8/20.
 */
Ext.define("OrientTdm.Collab.MyTask.util.PanelDisplayHelper", {
    extend: 'Ext.Base',
    alternateClassName: 'MyTaskPanelDisplayHelper',
    statics: {
        showInMainTab: function (newPanel) {
            var myTaskDashboard = Ext.getCmp("myTaskDashboard");
            var rootTab = myTaskDashboard.ownerCt;

            var oldPanel = rootTab.queryById(newPanel.id);
            if (!Ext.isEmpty(oldPanel)) {
                rootTab.remove(oldPanel);
            }

            rootTab.add(newPanel);
            rootTab.setActiveTab(newPanel);
        },
        showInCenterTab: function (newPanel) {
            var myTaskDashboard = Ext.getCmp("myTaskDashboard");
            var rootTab = myTaskDashboard ? myTaskDashboard.ownerCt : Ext.getCmp("orient-center");
            var oldPanel = rootTab.queryById(newPanel.id);
            if (!Ext.isEmpty(oldPanel)) {
                rootTab.remove(oldPanel);
            }

            rootTab.add(newPanel);
            rootTab.setActiveTab(newPanel);
        }
    }
});