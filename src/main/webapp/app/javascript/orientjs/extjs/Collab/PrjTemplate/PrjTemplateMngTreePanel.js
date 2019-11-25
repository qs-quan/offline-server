/**
 * 试验项目模板管理-左侧树
 */
Ext.define('OrientTdm.Collab.PrjTemplate.PrjTemplateMngTreePanel', {
    alias: 'widget.prjProjectTree',
    extend: 'OrientTdm.Common.Extend.Tree.OrientTree',

    initComponent: function () {
        // 获取试验项目模板表 modelId
        this.modelId = OrientExtUtil.ModelHelper.getModelId("T_PRJ_TEMPLATE", OrientExtUtil.FunctionHelper.getSchemaId(), false);
        //this.rwModelId = OrientExtUtil.ModelHelper.getModelId("T_RW_INFO", OrientExtUtil.FunctionHelper.getSchemaId(), false);
        //this.deviceModelId = OrientExtUtil.ModelHelper.getModelId("T_DEVICE", OrientExtUtil.FunctionHelper.getSYZYSchemaId(), false);
        this.callParent(arguments);
    },

    createStore: function () {
        var me = this;

        return Ext.create('Ext.data.TreeStore', {
            // 定义树节点数据模型
            model: Ext.define("TreeModel", {
                extend: 'Ext.data.Model',
                fields: [
                    'id',
                    'text',
                    'leaf',
                    'iconCls',
                    'pid',
                    'model'
                ]
            }),
            listeners: {
                beforeLoad: function (store, operation) {
                    var sysjglParam = me.sysjglParam;
                    var node = operation.node;
                    if(sysjglParam != undefined){
                        if(node.raw['model'] == 'T_SYLX'){
                            // 试验类型就不查试验项查询
                            store.getProxy().setExtraParam('pid', '3.1415926');
                            store.getProxy().setExtraParam('pname', '');
                        }else if(node.raw['model'] == 'T_RW_INFO'){
                            // 非根节点的精确查询
                            store.getProxy().setExtraParam('pid', '3.1415926');
                            store.getProxy().setExtraParam('pname', '');
                        }else{
                            // 第一次进来
                            store.getProxy().setExtraParam('pid', '');
                            store.getProxy().setExtraParam('pname', sysjglParam.pname);
                        }
                    }else{
                        if (!node.isRoot()) {
                            // 非根节点的精确查询
                            store.getProxy().setExtraParam('pid', node.raw.id);
                            store.getProxy().setExtraParam('pname', '');
                        } else {
                            // 根节点查询，以及模糊查询
                            store.getProxy().setExtraParam('pid', '');
                            store.getProxy().setExtraParam('pname', '');
                        }
                    }
                }
            },
            proxy: {
                type: 'ajax',
                api: {
                    "read": serviceName + "/AllSylxSyxController/queryListWithModel.rdm"
                },
                reader: {
                    type: 'json',
                    root: 'results'
                },
                extraParams: {
                    pid: '',
                    pname: ''
                }
            },
            root: {
                text: 'root',
                id: '-1',
                pid: '',
                model: ''
            }
        });
    },

    createToolBarItems: function () {
        var me = this;

        var retVal = [{
            xtype: 'trigger',
            width: 180,
            triggerCls: 'x-form-clear-trigger',
            onTriggerClick: function () {
                this.setValue('');
                me.clearFilter();
            },
            emptyText: '快速搜索',
            enableKeyEvents: true,
            listeners: {
                keyup: function (field, e) {
                    if (Ext.EventObject.ESC == e.getKey()) {
                        field.onTriggerClick();
                    } else {
                        me.filterByText(this.getRawValue(), 'text');
                    }
                }
            }
        }, {
            iconCls: 'icon-refresh',
            text: '刷新',
            itemId: 'refresh',
            scope: this,
            handler: this.doRefresh
        }];

        return retVal;
    },

    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'select', me.itemClickListener, me);
    },

    itemClickListener: function (tree, record, item) {
        var me = this;

        var centerPanel = me.ownerCt.centerPanel;
        centerPanel.removeAll(true);

        centerPanel.add(Ext.create('OrientTdm.Collab.PrjTemplate.PrjTemplateMngCenterPanel', {
            region: 'center',
            layout: 'border',
            padding: '0 0 0 0',
            pId: record.data['id'],
            model: record.data['model'],
            modelId: me.modelId,
            sysjglParam: me.sysjglParam == undefined ? undefined : me.sysjglParam
           // deviceModelId: me.deviceModelId,
           // rwModelId: me.rwModelId,
            //southPanelName: 'prjTemplatePreview'
        }));
    },

    doRefresh: function () {
        //var selectedNode = this.getSelectionModel().getSelection()[0];
        this.getStore().load();
    }

});