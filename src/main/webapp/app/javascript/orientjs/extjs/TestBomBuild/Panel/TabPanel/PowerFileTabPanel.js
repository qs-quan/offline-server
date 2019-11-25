/**
 * 构造文件节点
 */
Ext.define("OrientTdm.TestBomBuild.Panel.TabPanel.PowerFileTabPanel", {
    extend: 'Ext.Base',

    constructor: function (config) {
        var me = config.scope;
        var treeNode = config.treeNode;

        var modelId = parseInt(treeNode.raw.cj) > 2 ?
            OrientExtUtil.ModelHelper.getModelId('T_RW_INFO', OrientExtUtil.FunctionHelper.getSchemaId(), false):
            '';
        if (treeNode.raw.cj == 4 && treeNode.raw.text == '知识') {
            var fileModelId = OrientExtUtil.ModelHelper.getModelId('T_FILE', OrientExtUtil.FunctionHelper.getKnowledgeSchemaId());
            var retVal = Ext.create('OrientTdm.Collab.ProjectMng.mainFrame.KnowledgeList', {
                title: '知识库',
                // isBom: true,
                iconCls: 'icon-basicDataType',
                modelId: fileModelId,
                isPositive: '1',
                taskId: treeNode.parentNode.raw.dataId, // record.raw.dataId,
                isView: 0,
                region: 'center',
                padding: '0 0 0 5',
                layout: 'fit',
                hasToolBar: false
            });

        } else {
            //所有附件面板
            var retVal = Ext.create('OrientTdm.TestBomBuild.Panel.TabPanel.FileTabPanel', {
                modelId: modelId,
                dataId: '',
                layout:'fit',
                nodeId: treeNode.parentNode.raw.id,
                title: '查看【' + treeNode.raw.text + '】'
            });
        }

        me.insert(0,retVal);
        me.setActiveTab(retVal);
    }
});