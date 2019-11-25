/**
 * 试验团队人员主界面
 * Created by dailin on 2019/8/13 2:31.
 */

Ext.define('OrientTdm.TestBomBuild.Panel.Panel.TestTeamPanel', {
    alias: 'widget.testTeamPanel',
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',

    initComponent: function () {
        var me = this;
        var centerPanel = Ext.create('OrientTdm.TestBomBuild.Panel.GridPanel.TestTeamRoleUser', {
            // title: '试验团队',
            region: 'center',
            dataId: me.dataId
        });

        var southPanel = Ext.create("OrientTdm.Common.Extend.Panel.OrientPanel", {
            region: 'south',
            height: 0.4 * globalHeight,
            collapsed: true,
            collapsible: true
        });

        Ext.apply(this, {
            layout: 'border',
            items: [centerPanel, southPanel],
            centerPanel: centerPanel,
            southPanel: southPanel
        });

        this.callParent(arguments);
    }
});