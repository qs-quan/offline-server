/**
 * Created by enjoy on 2016/5/17 0017.
 */
Ext.define('OrientTdm.DataMgr.SchemaData.SchemaTree', {
    alias: 'widget.schemaTree',
    extend: 'OrientTdm.Common.Extend.Tree.OrientTree',
    requires: [
        "OrientTdm.DataMgr.SchemaData.Model.SchemaNodeModel"
    ],
    config: {
        belongFunctionId: '',
        schemaId:''
    },
    initComponent: function () {
        var me = this;
        var params = {
            belongFunctionId: me.belongFunctionId
        };
        OrientExtUtil.AjaxHelper.doRequest(serviceName + "/modelTree/getSchemaCombobox.rdm", params, false, function (response) {
            var retV = response.decodedData;
            var success = retV.success;
            if (success) {
                var results = retV.results;
                me.schemaId = results instanceof Array ? results[0]["id"] : results["id"];
            }
        });
        Ext.apply(me, {
            hideHeaders: true,
            columns: [{
                xtype: 'treecolumn',
                dataIndex: 'text',
                flex: 1
            }],
            bbar: [{
                xtype: 'trigger',
                triggerCls: 'x-form-clear-trigger',
                onTriggerClick: function () {
                    this.setValue('');
                    me.clearFilter();
                },
                emptyText: '快速搜索(只能搜索已展开节点)',
                width: "95%",
                enableKeyEvents: true,
                listeners: {
                    keyup: function (field, e) {
                        if (Ext.EventObject.ESC == e.getKey()) {
                            field.onTriggerClick();
                        } else {
                            me.filterByText(this.getRawValue(), "text");
                        }
                    }
                }
            }]
        });
        me.callParent(arguments);
        me.addEvents("initSchemaTree");
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'select', me.selectItem, me);
        me.mon(me, 'initSchemaTree', me._initSchemaTree, me);
    },
    createToolBarItems: function () {
        var me = this;
        var retVal = [
            Ext.create("OrientTdm.Common.Extend.Form.Field.OrientComboBox", {
                remoteUrl: serviceName + '/modelTree/getSchemaCombobox.rdm?belongFunctionId=' + me.belongFunctionId,
                displayField: 'name',
                hideLabel: true,
                initFirstRecord: true,
                width: 180,
                style:{
                    margin:'0 0 0 0'
                },
                listeners: {
                    select: function (combobox, record) {
                        var schemaId = record instanceof Array ? record[0].get("id") : record.get("id");
                        //为避免数据重复，不触发事件
                        me.fireEvent("initSchemaTree", schemaId);
                    }
                }
            }),
            {xtype: 'tbfill'},
            {
                iconCls: 'icon-refresh',
                text: '刷新',
                itemId: 'refresh',
                scope: this,
                handler: this.doRefresh
            }
        ];
        return retVal;
    },
    createStore: function () {
        var me = this;
        var retVal = Ext.create("Ext.data.TreeStore", {
            model: 'OrientTdm.DataMgr.SchemaData.Model.SchemaNodeModel'
        });
        return retVal;
    },
    selectItem: function (tree, node) {
        if (this.ownerCt.centerPanelComponent) {
            this.ownerCt.centerPanelComponent.fireEvent("initModelDataBySchemaNode", node);
        }
    },
    doRefresh: function () {
        var selectedNode = this.getSelectionModel().getSelection()[0];
        this.getStore().load({
            node: selectedNode
        });
    },
    _initSchemaTree: function (schemaId) {
        var me = this;
        //移除所有节点
        var rootNode = this.getRootNode();
        rootNode.removeAll();
        //动态加载新的tbom
        me.getStore().getProxy().setExtraParam("schemaId", schemaId);
        me.getStore().load();
    },
    afterInitComponent: function () {
        this.viewConfig.listeners.refresh = function () {
            //去除默认的选中事件
        };
    }
});