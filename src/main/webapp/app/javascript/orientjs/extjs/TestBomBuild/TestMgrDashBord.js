/**
 * Created by dailin on 2019/2/27 10:24.
 */
Ext.define('OrientTdm.TestBomBuild.TestMgrDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.testMgrDashBord',

    initComponent: function () {
        var me = this;

        var bomTreepanel = Ext.create('OrientTdm.TestBomBuild.Tree.LeftBomTree',{
            id: 'leftBomTreePanel',
            itemId: 'leftBomTreePanel',
            bodyStyle: 'overflow-x:hidden; overflow-y:scroll',
            title: '产品结构导航',
            useArrows: false,
            rootVisible: false,
            width: 200,
            autoWidth: true,
            flex: 1,
            isShowCruBtn: true,
            height: '100%',
            layout: 'fit'
        });

        var mainPanel = Ext.create("OrientTdm.TestBomBuild.Panel.TabPanel.PowerTabPanel",{
            id: 'test_OP',
            itemId: 'test_OP',
            items: [],
            height: '100%',
            flex: 4,
            layout: 'fit'
        });

        Ext.apply(me,{
            // itemId: 'bomDashBord', 如果设置了itemId会出现多次点击功能节点会出现多个标签页
            layout: {type:'hbox', align:'center'},
            items: [
                bomTreepanel,
                {xtype: 'splitter'},
                mainPanel
            ]
        });

        me.callParent(arguments);
    }

});