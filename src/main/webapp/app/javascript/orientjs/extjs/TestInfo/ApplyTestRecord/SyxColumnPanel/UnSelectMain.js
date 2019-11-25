Ext.define('OrientTdm.TestInfo.ApplyTestRecord.SyxColumnPanel.UnSelectMain', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.UnSelectMain',

    initComponent: function () {
        var me = this;

        // 组装右边试验项面板属性
        Ext.apply(me.gridConfig, {
            //region: 'center',
            title: '试验项',
            itemId: 'UnSelect4SYLX',
            height: '100%',
            flex: 5,
            layout: 'fit',
            customerFilter: Ext.isEmpty(me.gridConfig.customerFilter) ? "" : me.gridConfig.customerFilter
        });

        Ext.apply(this, {
            layout: 'fit',
            title: '<span style="color: blue; ">未选数据</span>',
            items: [{
                xtype: 'panel',
                layout: {
                    type:'hbox',
                    align:'center'
                },
                items: [
                    // 构建左边试验类型树
                    Ext.create('OrientTdm.TestInfo.ApplyTestRecord.SyxColumnPanel.UnSelectSylxTreePanel', {
                        height: '100%',
                        flex: 1,
                        layout: 'fit'
                    }),
                    Ext.create('OrientTdm.Common.Extend.Grid.OrientModelGrid', me.gridConfig)
                ]
            }]
        });

        this.callParent(arguments);
    }

});