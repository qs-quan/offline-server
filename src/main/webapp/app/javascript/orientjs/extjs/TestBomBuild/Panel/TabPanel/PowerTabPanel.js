/**
 * Created by dailin on 2019/3/25 18:05.
 */
Ext.define('OrientTdm.TestBomBuild.Panel.TabPanel.PowerTabPanel',{
    extend: 'OrientTdm.Common.Extend.Panel.OrientTabPanel',
    alias: 'widget.powerTabPanel',
    config: {},

    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        me.addEvents('initModelDataByNode');
        me.addEvents('removeItems');
    },

    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'initModelDataByNode', me.initModelDataByNode, me);
        me.mon(me, 'removeItems', me.removeItems, me);
    },

    removeItems: function() {
        var me = this;
        me.items.each(function (item, index) {
            me.remove(item);
        });
    },

    initModelDataByNode: function (treeNode) {
        var me = this;

        // 删除旧的 tab 页
        me.removeAll();

        // 信息节点呈现表单
        if (treeNode.raw.type == 'relation'){
            Ext.create('OrientTdm.TestBomBuild.Panel.TabPanel.PowerRelationTabPanel', {
                scope: me,
                treeNode: treeNode
            });

        // 关联节点呈现表单
        } else if (treeNode.raw.type == 'package') {
            Ext.create('OrientTdm.TestBomBuild.Panel.TabPanel.PowerPackageTabPanel', {
                scope: me,
                treeNode: treeNode
            });
        // 附件管理呈现表单
        }else if (treeNode.raw.type == 'file') {
            Ext.create('OrientTdm.TestBomBuild.Panel.TabPanel.PowerFileTabPanel', {
                scope: me,
                treeNode: treeNode
            });
        }
    }

});



