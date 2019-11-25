/**
 * Created by Seraph on 16/9/26.
 */
Ext.define('OrientTdm.TestInfo.ExperimentTypeMgr.Template.TemplateDashboard', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    initComponent: function () {
        var me = this;

        var centerPanel = Ext.create("OrientTdm.Common.Extend.Panel.OrientPanel", {
            region: 'center',
            layout: 'fit'
        });
        var children = [];
        if(me.treeDataId == '-1'){
            children.push({
                text : "试验类型",
                leaf : true,
                type: 'LX',
                iconCls: 'icon-dir-node'
            })
        }else{
            children.push({
                text : "试验项",
                leaf : true,
                type: 'RW',
                iconCls: 'icon-list-relation-node'
            })
        }

        var leftPanel = Ext.create("Ext.tree.Panel", {
            collapsible: true,
            width: 150,
            region: 'west',
            rootVisible: false,
            store: Ext.create('Ext.data.TreeStore', {
                root: {
                    expanded: true,
                    children: children
                }
            }),
            listeners: {
                'select': function (tree, record, item) {
                    var me = this;

                    var centerPanel = me.ownerCt.centerPanel;
                    centerPanel.removeAll(true);

                    var content = Ext.create("OrientTdm.TestInfo.ExperimentTypeMgr.Template.TemplateCenterPanel", {
                        region: 'center',
                        layout: 'border',
                        padding: '0 0 0 0',
                        type: record.raw.type,
                        typeName: record.raw.type == 'LX' ? '试验类型' : '试验项',
                        treeDataId: me.treeDataId
                    });

                    centerPanel.add(content);
                },
                afterrender: function(){
                    this.getSelectionModel().selectAll();
                }
            }
        });



        Ext.apply(this, {
            layout: 'border',
            items: [leftPanel, centerPanel],
            westPanel: leftPanel,
            centerPanel: centerPanel
        });

        this.callParent(arguments);
    }
});