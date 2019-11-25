/**
 * Created by Administrator on 2017/4/7 0007.
 */
/**
 * Created by enjoy on 2016/3/18 0018.
 */
Ext.define('OrientTdm.Common.Extend.Form.Common.ManyToManyModelDataDetailPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    requires: [],
    alias: 'widget.manyToManyModelDataDetailPanel',
    autoScroll: true,
    config: {
        data: [],
        modelId: null
    },
    initComponent: function () {
        var me = this;
        var tbars = [];
        //var firstItem = null;
        Ext.each(me.data, function (record, index) {
            //tbars.push({
            //    iconCls: 'icon-detail',
            //    text: record.name,
            //    bindData: record.id,
            //    handler: me.doDetailForm
            //});
            //if (0 == index) {
            //    firstItem = me._getDetailForm(record.id);
            //}
            record.text = record.name;
            record.expanded = true;
            record.leaf = true;
        });
        //
        //Ext.apply(me, {
        //    tbar: {
        //        items: tbars,
        //        xtype: 'toolbar',
        //        autoScroll: true
        //    },
        //    items: [firstItem]
        //});
        Ext.apply(me, {
            layout: 'border',
            items: [
                {
                    xtype: 'treepanel',
                    autoScroll: true,
                    rootVisible: false,
                    useArrows: true,
                    frame: true,
                    region: 'west',
                    title: '关联数据',
                    width: 250,
                    store: new Ext.data.TreeStore({
                        root: {
                            text: '根',
                            id: '-1',
                            expanded: true,
                            children: me.data
                        }
                    }),
                    viewConfig: {
                        stripeRows: true,
                        listeners: {
                            refresh: function () {
                                this.select(0);
                            }
                        }
                    },
                    listeners: {
                        select: me.doDetailForm
                    }
                },
                {
                    itemId: 'detailRegion',
                    xtype: 'orientPanel',
                    items: [],
                    region: 'center'
                }
            ]
        });
        this.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
    },
    doDetailForm: function (tree, record) {
        var currentButton = this;
        var refDataId = record.getId();
        var me = this.up('manyToManyModelDataDetailPanel');
        var detailForm = me._getDetailForm(refDataId);
        me.down('#detailRegion').removeAll();
        me.down('#detailRegion').add(detailForm);
    },
    _getDetailForm: function (refDataId) {
        var me = this;
        var refModelId = me.modelId;
        var params = {
            modelId: refModelId,
            dataId: refDataId
        };
        var detailForm = null;
        //查看模型数据详细信息
        OrientExtUtil.AjaxHelper.doRequest(serviceName + "/modelData/getGridModelDescAndData.rdm", params, false, function (response) {
            //1.获取模型字段描述 字段名称 显示名 类型...
            //2.获取模型操作描述 新增/修改/删除/查询/导入/导出...
            var modelDesc = response.decodedData.results.orientModelDesc;
            me.modelDesc = modelDesc;
            var modelData = response.decodedData.results.modelData;
            detailForm = Ext.create("OrientTdm.Common.Extend.Form.OrientDetailModelForm", {
                title: '查看【<span style="color: red; ">' + modelDesc.text + '</span>】数据',
                bindModelName: modelDesc.dbName,
                modelDesc: modelDesc,
                originalData: modelData
            });
        });
        return detailForm;
    }
});