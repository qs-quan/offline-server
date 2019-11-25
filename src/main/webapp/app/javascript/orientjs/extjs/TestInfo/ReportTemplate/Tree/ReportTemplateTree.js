/**
 * Created by dailin on 2019/8/25 2:35.
 */

Ext.define('OrientTdm.TestInfo.ReportTemplate.Tree.ReportTemplateTree', {
    alias: 'widget.reportTemplateTree',
    extend: 'OrientTdm.Common.Extend.Tree.OrientTree',
    requires: [
        'OrientTdm.TestInfo.ReportTemplate.Model.ReportTemplateTreeNodeModel'
    ],

    config: {},

    initComponent: function () {
        var me = this;
        me.modelName = "T_BGMBFL";
        me.schameId = OrientExtUtil.FunctionHelper.getSchemaId();
        me.modelId = OrientExtUtil.ModelHelper.getModelId(me.modelName, me.schameId, false);
        me.rootNode = {
            text: '根节点',
            id: '-1',
            expanded: true
        };
        if (me.hasBar) {
            Ext.apply(me, {
                viewConfig: {
                    listeners: {
                        // 节点右键点击事件：每次都创建一次菜单对象
                        itemcontextmenu: function (view, rec, node, index, e) {
                            e.stopEvent();
                            var menu = me._createMenuBtn(rec, true);
                            menu.showAt(e.getXY());
                            return false;
                        }
                    }
                }
            });
            me.lbar = me._createMenuBtn();
        }
        me.callParent(arguments);
    },

    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'select', me.itemClickListener, me);
        me.mon(me, 'containerclick', me.containerclick, me);
    },

    createStore: function () {
        var me = this;
        var retVal = Ext.create('Ext.data.TreeStore', {
            model: 'OrientTdm.TestInfo.ReportTemplate.Model.ReportTemplateTreeNodeModel',
            listeners: {
                beforeLoad: function (store, operation) {
                    var node = operation.node;
                    // 试验数据管理
                    store.getProxy().setExtraParam('pid', node.raw.id);
                }
            },
            root: me.rootNode
        });

        return retVal;
    },

    createToolBarItems: function () {
        var me = this;

        var retVal = [{
            xtype: 'tbspacer'
        }, {
            xtype: 'trigger',
            width: 120,
            style: {
                margin: '0 0 0 22'
            },
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
        },' ', {
            iconCls: 'icon-refresh',
            text: '刷新',
            itemId: 'refresh',
            scope: this,
            handler: this.doRefresh
        }];

        return retVal;
    },

    itemClickListener: function (tree, record, item) {
        var me = this;
        var centerPanel = me.ownerCt.centerPanel;
        centerPanel.removeAll();
        centerPanel.add(Ext.create('OrientTdm.TestInfo.ReportTemplate.Panel.ReportTemplateList',{
            hasBar: me.hasBar,
            nodeId: record.raw.id
        }));
    },

    _refreshNode: function (nodeId, refreshParent) {
        var me = this;
        var rootNode = this.getRootNode();

        var currentNode;
        if (nodeId === '-1') {
            currentNode = rootNode;
        } else {
            currentNode = rootNode.findChild('id', nodeId, true) || rootNode;
        }

        var toRefreshNode = currentNode;
        if (refreshParent && currentNode.isRoot() == false) {
            toRefreshNode = currentNode.parentNode;
        }
        this.store.load({
            node: toRefreshNode,
            callback: function () {
                me.getSelectionModel().select(currentNode);
            }
        });
    },

    doRefresh: function () {
        var selectedNode = this.getSelectionModel().getSelection()[0];
        this.getStore().load({
            node: selectedNode
        });
    },

    _createMenuBtn: function (rec, isShowText) {
        var me = this;
        var toolbar = [];

            // 新增按钮
            me._pushBtn(toolbar, {
                iconCls: 'icon-create',
                itemId: 'create',
                handler: function () {
                    me._createTreeNode();
                }
            }, isShowText, '新增');
            toolbar.push('-');

            // 编辑按钮
            me._pushBtn(toolbar, {
                iconCls: 'icon-update',
                itemId: 'modify',
                handler:function () {
                    me._modifyTreeNode();
                }
            }, isShowText, '编辑');

            // 删除按钮
            me._pushBtn(toolbar, {
                iconCls: 'icon-delete',
                itemId: 'delete',
                disabled: me.hasDeletePower == false,
                handler: function () {
                    me._deleteTreeNode();
                }
            }, isShowText, '删除');
            toolbar.push('-');

            return  isShowText ? Ext.create('Ext.menu.Menu',{
                items: toolbar
            }) : toolbar;

    },

    /**
     * 新增模板类型
     * @private
     */
    _createTreeNode: function () {
        var me = this;
        var params = {
            modelId: me.modelId,
            schemaId: me.schameId
        };
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelData/getGridModelDesc.rdm', params, false, function (response) {
            var modelDesc = response.decodedData.results.orientModelDesc;
            var createForm = Ext.create('OrientTdm.Common.Extend.Form.OrientAddModelForm', {

                buttonAlign: 'center',
                buttons: [
                    {
                        itemId: 'save',
                        text: '保存',
                        scope: me,
                        iconCls: 'icon-save',
                        handler: function (btn) {
                            var me = this;
                            btn.up('form').fireEvent('saveOrientForm', {
                                modelId: params.modelId
                            });
                        }
                    },
                    {
                        itemId: 'back',
                        text: '取消',
                        scope: me,
                        iconCls: 'icon-close',
                        handler: function () {
                            win.close();
                        }
                    }
                ],
                successCallback: function (response) {
                    var selection = me.getSelectionModel().getSelection();
                    if (response.success) {
                        var dataId = response.results;
                        var curNodeData = selection.length != 0 ? selection[0].raw : me.rootNode;
                        if (curNodeData.id != "-1") {
                            curNodeData = selection[0].raw;
                            var dataList = {
                                ID: dataId
                            };
                            dataList['T_BGMBFL_' + me.schameId + "_ID"] = curNodeData.id;
                            OrientExtUtil.ModelHelper.updateModelData(me.modelId, [dataList]);
                        }
                        me._refreshNode(curNodeData.id, false);
                        this.up('window').close();
                    }
                },
                bindModelName: modelDesc.dbName,
                actionUrl:  serviceName + '/modelData/saveModelData.rdm',
                modelDesc: modelDesc
            });

            var win = new Ext.Window({
                title: '新增' + modelDesc.text,
                width: 0.4 * globalWidth,
                height: 0.8 * globalHeight,
                layout: 'fit',
                model: true,
                items: [createForm],
                listeners: {
                    'beforeshow': function () {
                        var items = createForm.items.items[0].items.length;
                        win.setHeight(items * 210);
                    }
                }
            });
            win.show();
        });
    },

    _modifyTreeNode: function () {
        var me = this;
        var selection = me.getSelectionModel().getSelection();
        var curNodeData = selection.length != 0 ? selection[0].raw : me.rootNode;
        if (curNodeData.id == "-1") {
            OrientExtUtil.Common.info('提示', '请选择一条数据');
            return;
        }
        var params = {
            dataId: curNodeData.id,
            modelId: me.modelId
        };
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelData/getGridModelDescAndData.rdm', params, false, function (response) {
            var modelDesc = response.decodedData.results.orientModelDesc;
            var modelData = response.decodedData.results.modelData;

            var form = Ext.create('OrientTdm.Common.Extend.Form.OrientModifyModelForm', {
                buttonAlign: 'center',
                buttons: [
                    {
                        itemId: 'save',
                        text: '保存',
                        iconCls: 'icon-save',
                        scope: me,
                        handler: function (btn) {
                            var me = this;
                            btn.up('form').fireEvent('saveOrientForm', {
                                modelId: params.modelId
                            });
                        }
                    },
                    {
                        itemId: 'back',
                        text: '取消',
                        iconCls: 'icon-close',
                        scope: me,
                        handler: function () {
                            win.close();
                        }
                    }
                ],
                successCallback: function () {
                    me._refreshNode(curNodeData.pid == "" ? "-1" : curNodeData.pid, false);
                    this.up('window').close();
                },
                bindModelName: modelDesc.dbName,
                actionUrl: serviceName + '/modelData/updateModelData.rdm',
                modelDesc: modelDesc,
                originalData: modelData
            });

            var win = new Ext.Window({
                title: '编辑' + modelDesc.text,
                width: 0.4 * globalWidth,
                height: 0.8 * globalHeight,
                layout: 'fit',
                items: [form],
                listeners: {
                    'beforeshow': function () {
                        var items = form.items.items[0].items.length;
                        win.setHeight(items * 160);
                    }
                }
            });
            win.show();
        });
    },

    _deleteTreeNode: function () {
        var me = this;
        var selection = me.getSelectionModel().getSelection();
        var curNodeData = selection.length != 0 ? selection[0].raw : me.rootNode;
        if (curNodeData.id == "-1") {
            OrientExtUtil.Common.info('提示', '请选择一条数据');
            return;
        }
        Ext.Msg.confirm('提示', '是否删除?', function (btn, text) {
            if (btn == 'yes') {
                OrientExtUtil.ModelHelper.deleteModelData(me.modelId, curNodeData.id, true);
                me._refreshNode(curNodeData.pid == "" ? "-1" : curNodeData.pid, false);
            }
        });

    },

    /**
     * 根据按钮栏的的不同设置按钮属性
     * @param toolbar
     * @param btn
     * @param isShowText
     * @param text
     * @private
     */
    _pushBtn : function (toolbar, btn, isShowText, text) {
        if(isShowText){
            btn.text = text;
        }else{
            btn.tooltip = text;
        }
        toolbar.push(btn);
    },

    /**
     * 点击空白区域 选中 根节点
     */
    containerclick: function () {
        this.getSelectionModel().select(this.getRootNode(), false, true);
    }

});