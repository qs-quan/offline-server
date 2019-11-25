/**
 * 试验申请管理
 */
Ext.define('OrientTdm.TestInfo.ApplyTestRecord.ApplyTestRecordMgrDashboard', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.applyTestRecordMgrDashboard',

    initComponent: function () {

        Ext.apply(this, {
            layout: 'fit',
            items: [{
                xtype: 'panel',
                layout: 'border',
                items: [{
                        xtype: 'panel',
                        layout: 'border',
                        region: 'center',
                        items: [
                            Ext.create('OrientTdm.TestInfo.ApplyTestRecord.ApplyTestGrid', {})
                        ]
                    }, {
                        xtype: 'panel',
                        id: 'applyTestFlowPanel',
                        title: '流程图',
                        layout: 'border',
                        region: 'east',
                        autoShow: true,
                        autoRender: true,
                        width: 1,
                        // 是否能折叠
                        collapsible: true,
                        // 折叠方向
                        collapseDirection:"right",
                        // 折叠动画
                        animCollapse: true,
                        // 初始化时是否折叠,初始化时得展开，不然初次点击超链接展开时会加载失败
                        //collapsed: true,
                        items: []
                }]
            }]
        });

        this.callParent(arguments);
    }

});