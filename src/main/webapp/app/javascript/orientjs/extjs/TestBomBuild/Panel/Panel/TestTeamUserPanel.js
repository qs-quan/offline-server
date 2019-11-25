/**
 * 试验团队人员分配的左右界面
 * Created by dailin on 2019/8/13 2:05.
 */

Ext.define('OrientTdm.TestBomBuild.Panel.Panel.TestTeamUserPanel',{
    extend: 'OrientTdm.TestBomBuild.Panel.Panel.TestTeamUserButtonPanel',
    alias: 'widget.testTeamUserPanel',

    requires: [
        'OrientTdm.TestBomBuild.Panel.GridPanel.TestTeamUserGridpanel'
    ],
    initComponent: function () {
        var me = this;
        //创建按钮操作区域
        var buttonPanel = me.createButtonPanel();
        var unSelectedGrid = Ext.create('OrientTdm.TestBomBuild.Panel.GridPanel.TestTeamUserGridpanel', {
            roleId: me.roleId,
            thId: me.thId,
            title: '未分配用户',
            assigned: false
        });
        var selectedGrid = Ext.create('OrientTdm.TestBomBuild.Panel.GridPanel.TestTeamUserGridpanel', {
            roleId: me.roleId,
            thId: me.thId,
            assigned: true,
            title: '已分配用户'
        });
        Ext.apply(me, {
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [unSelectedGrid, buttonPanel, selectedGrid]
        });
        this.callParent(arguments);
    }

});