/**
 * Created by enjoy on 2016/5/3 0003.
 */
Ext.define('OrientTdm.DataMgr.FileMgr.Grid.OrientModelImageFileGrid', {
    extend: 'Ext.view.View',
    alias: 'widget.orientModelImageFileGrid',
    singleSelect: true,
    overItemCls: 'x-view-over',
    id: 'img-chooser-view',
    itemSelector: 'div.thumb-wrap',
    requires: [
        "OrientTdm.DataMgr.FileMgr.Model.ModelFileExtModel"
    ],
    config: {
        modelId: '',
        dataId: '',
        fileGroupId: '-4'
    },
    tpl: [
        '<tpl for=".">',
        '<div class="thumb-wrap">',
        '<div class="thumb">',
        (!Ext.isIE6 ? '<img src="preview/imagePreview{sFilePath}"/>' :
            '<div style="width:200px;height:150px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'preview/imagePreview{sFilePath}\')"></div>'),
        '</div>',
        '<span>{filename}</span>',
        '</div>',
        '</tpl>'
    ],

    initComponent: function () {
        var me = this;
        this.store = Ext.create('Ext.data.Store', {
            model: "OrientTdm.DataMgr.FileMgr.Model.ModelFileExtModel",
            autoLoad: true,
            proxy: {
                type: 'ajax',
                actionMethods: {
                    create: 'POST',
                    read: 'POST',
                    update: 'POST',
                    destroy: 'POST'
                },
                api: {
                    "read": Ext.isEmpty(me.queryUrl) ? "modelFile/list.rdm" : me.queryUrl
                },
                extraParams: {
                    modelId: me.modelId,
                    dataId: me.dataId,
                    /*出问题删nodeId*/
                    nodeId: me.nodeId,
                    fileGroupId: me.fileGroupId
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    root: 'results',
                    idProperty: 'ID',
                    messageProperty: 'msg'
                },
                listeners: {},
                pageParam: undefined
            }
        });
        this.callParent(arguments);
        this.store.sort();
    }
});