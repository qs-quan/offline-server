/**
 * 测试数据导入记录标签页
 */

Ext.define('OrientTdm.Collab.common.collabFlow.testImport.TestImportRecordTabPanel',{
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.TestImportRecordTabPanel',

    initComponent: function () {
        var me = this;
        var item = me.item;

        // 右侧数据列表
        var centerPanel = Ext.create('OrientTdm.Collab.common.collabFlow.testImport.TestRecordShowRegion', {
            region: 'center',
            importer: me.importer,
            padding: '0 0 0 5'
        });

        // 左侧数据表树
        var tbomPanel = Ext.create('OrientTdm.Collab.common.collabFlow.testImport.TestRecordTableTree', {
            title: '测试数据表',
            region: 'west',
            width: 280,
            minWidth: 280,
            maxWidth: 400,
            item: me.item,
            rwInfoObj: me.rwInfoObj
        });

        Ext.apply(me, {
            layout: 'border',
            items: [centerPanel, tbomPanel],
            westPanel: tbomPanel,
            centerPanel: centerPanel
        });
        me.callParent(arguments);
    }
});