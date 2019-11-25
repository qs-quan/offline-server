/**
 * 数据表 tab panel
 * Created by dailin on 2019/5/23 15:46.
 */

Ext.define('OrientTdm.Collab.common.collabFlow.testImport.TestRecordShowRegion',{
    extend: 'OrientTdm.Common.Extend.Panel.OrientTabPanel',
    alias: 'widget.TestRecordShowRegion',
    requires: [
        'OrientTdm.TestBomBuild.Panel.GridPanel.TestProjectGridpanel'
    ],
    config: {
        belongFunctionId: ''
    },

    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        me.addEvents('initTestDataNode');
    },

    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'initTestDataNode', me.initTestDataNode, me);
    },

    initTestDataNode: function (node, infObj) {
        var me = this;

        var id = "TEST_DATA_" + node.raw.id;
        var testDataPanel = Ext.getCmp(id);

        if(testDataPanel != null) {
            testDataPanel.show();
        }else{
            var retVal = Ext.create('OrientTdm.TestBomBuild.Panel.GridPanel.TestProjectGridpanel', {
                id: id,
                region: 'center',
                importer: me.importer,
                treeNode: node,
                tableName: node.raw.tableName,
                tableId: node.raw.tableId,
                showAnalysisBtns: true,
                isFromData: true,
                modelId: node.raw.tableId,
                isView: 0,
                padding: '0 0 0 5',
                title: '查看【' + node.raw.text + '】数据列表',
                closable: true,
                testDatePanel:{
                    childrenIds: node.raw.ids,
                    rid: infObj.rwInfoObj.rid,
                    nodeId: infObj.rwInfoObj.nodeId
                }
            });
            me.add(retVal);
            retVal.show();
        }
    }

});