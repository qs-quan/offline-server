/**
 * Created by enjoy on 2016/3/19 0019.
 * 模型字段级其关联子表树形展现
 */
Ext.define('OrientTdm.BackgroundMgr.CustomForm.Common.RefModelTree', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.refModelTree',
    rootVisible: false,
    animate: true,
    collapsible: true,
    loadMask: true,
    useArrows: true,
    config: {
        orientModelId: -1
    },
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
            fields: ['id', 'text'],
            proxy: {
                type: 'ajax',
                reader: 'json',
                url: serviceName + '/modelData/getRefModel.rdm',
                extraParams: {
                    modelId: me.orientModelId,
                    isMain: true
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                }
            }
        });
        this.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'cellclick', me.insertHtml, me);
    },
    insertHtml: function (treePanel, td, index, node) {
        var me = this;
        //获取关联模型ID
        var modelId = node.get('id');
        //后台获取
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelFormView/getFormViewHtml.rdm', {
            bindModelID: modelId,
            bindTemplateId: 1203
        }, true, function (resp) {
            var retVal = resp.decodedData.results;
            editor.execCommand('inserthtml', retVal, 1);
        });
    }
});
