/**
 * Created by enjoy on 2016/3/19 0019.
 * 模型字段级其关联子表树形展现
 */
Ext.define('OrientTdm.BackgroundMgr.CustomForm.Common.ModelColumnTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.modelColumnTree',
    rootVisible: false,
    animate: true,
    collapsible: true,
    loadMask: true,
    useArrows: true,
    orientModelId: -1,
    bindTemplateId: -1,
    viewConfig: {
        plugins: {
            ptype: 'treeviewdragdrop',
            enableDrag: true,
            enableDrop: false
        }
    },
    initComponent: function () {
        var me = this;
        me.store = Ext.create('Ext.data.TreeStore', {
            fields: ['id', 'text', 'dbName', 'type', 'modelId'],
            proxy: {
                type: 'ajax',
                url: serviceName + '/modelFormView/getModelColumn.rdm?orientModelId=' + me.orientModelId,
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    root: 'results',
                    messageProperty: 'msg'
                }
            }
        });
        this.initColumnControls();
        this.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'cellclick', me.insertHtml, me);
    },
    insertHtml: function (treePanel, td, index, node) {
        var me = this;
        if (editor && me.columnControls) {
            editor.execCommand('inserthtml', me.columnControls[node.getData().dbName], 1);
        }
    },
    initColumnControls: function () {
        var me = this;
        //初始化字段的前端展现
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelFormView/initColumnControls.rdm', {
            modelId: me.orientModelId,
            templateId: me.bindTemplateId
        }, true, function (response) {
            var respData = response.decodedData;
            if (respData.results) {
                me.columnControls = respData.results;
            }
        });
    }
});
