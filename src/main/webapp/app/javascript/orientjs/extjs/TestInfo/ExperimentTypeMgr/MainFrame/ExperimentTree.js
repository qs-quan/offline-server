/**
 * 试验类型（最终叶节点应当是试验项目）树
 * Created by dailin on 2019/8/5 14:59.
 */

Ext.define('OrientTdm.TestInfo.ExperimentTypeMgr.MainFrame.ExperimentTree', {
    alias: 'widget.experimentTree',
    extend: 'OrientTdm.Common.Extend.Tree.OrientTree',
    requires: [
        'OrientTdm.TestInfo.ExperimentTypeMgr.MainFrame.Model.ExperimentTreeNodeModel'
    ],

    config: {},

    initComponent: function () {
        var me = this;
        me.rootNode = {
            text: '根节点',
            dataId: '-1',
            id: '-1',
            expanded: true,
            modelName: 'T_EXPERIMENT_TREE',
            modelId: OrientExtUtil.ModelHelper.getModelId('T_EXPERIMENT_TREE', OrientExtUtil.FunctionHelper.getExperimentSchemaId(), false)
        };

        Ext.apply(me, {
            viewConfig: {
                listeners: {
                    itemcontextmenu: function (view, rec, node, index, e) {
                        e.stopEvent();
                        if(me.isTemplate){
                            return false
                        }

                        var menu = Ext.create('OrientTdm.TestInfo.ExperimentTypeMgr.Button.TreeBtnObj').initComponent(me, true, rec.raw);
                        menu.showAt(e.getXY());
                        return false;
                    }
                }
            },
            lbar: me.createLeftBar()
        });
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
        me.isInit = true;
        var retVal = Ext.create('Ext.data.TreeStore', {
            model: 'OrientTdm.TestInfo.ExperimentTypeMgr.MainFrame.Model.ExperimentTreeNodeModel',
            listeners: {
                beforeLoad: function (store, operation) {
                    var node = operation.node;
                    // 试验数据管理
                    if(me.upup.upId == 'sysjgl'){
                        store.getProxy().api.read = serviceName + "/ExperimentController/nextLayerNodes.rdm";
                        store.getProxy().setExtraParam('modelName', 'T_EXPERIMENT_TREE');
                        store.getProxy().setExtraParam('nodeId', node.data.id);

                    // 试验模版的模版预览
                    }else if(me.isInit && me.isTemplate){
                        store.getProxy().api.read = me.upup.queryUrl;
                        store.getProxy().setExtraParam('modelName', me.upup.param.modelName);
                        store.getProxy().setExtraParam('dataId', me.upup.param.dataId);
                        me.isInit = false;

                    }else{
                        store.getProxy().api.read = serviceName + "/ExperimentController/nextLayerNodes.rdm";
                        store.getProxy().setExtraParam('modelName', 'T_EXPERIMENT_TREE');
                        store.getProxy().setExtraParam('nodeId', node.data.id);
                    }
                    store.getProxy().setExtraParam('type', me.isTemplate ? me.upup.param.type : '0');
                }
            },
            // 初始化后新增的排序都排在现有的顺序后面
            sorters: [{
                property: 'id',
                direction: 'ASC'
            }],
            root: me.rootNode
        });

        return retVal;
    },

    createLeftBar: function () {
        if(this.isTemplate){
            return [];
        }

        return Ext.create('OrientTdm.TestInfo.ExperimentTypeMgr.Button.TreeBtnObj').initComponent(this, false);
    },

    createToolBarItems: function () {
        var me = this;

        var retVal = [{
            xtype: 'tbspacer'
        }, {
            xtype: 'trigger',
            width: 160,
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
        }, ' ', {
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
		
		// 设置按钮是否可用
        if(!me.isTemplate){
		    me._setButtonStatus(record);
        }

        // 判断是那个tab的路径
        if (record.data.modelName != "T_EXPERIMENT_TREE") {
            var tabPanelPath = record.data.modelName == "T_SYLX" ?
                'OrientTdm.TestInfo.ExperimentTypeMgr.MainFrame.TestType.TestTypeTabPanel' :
                'OrientTdm.TestInfo.ExperimentTypeMgr.MainFrame.TestProject.TestProjectTabPanel';
            // 创建tab
            var tab = Ext.create(tabPanelPath, {
                mainModelName: record.data.modelName,
                mainModelId: OrientExtUtil.ModelHelper.getModelId(record.data.modelName, OrientExtUtil.FunctionHelper.getExperimentSchemaId()),
                dataId: record.data.dataId,
                isTemplate: me.isTemplate
            });

            centerPanel.add(tab);
        }
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

    containerclick: function () {
        //点击空白区域 选中 根节点
        this.getSelectionModel().select(this.getRootNode(), false, true);
		
		// 设置按钮可用状态
        if(!this.isTemplate){
		    this._setButtonStatus();
        }
    },
	
	/**
	 * 设置按钮状态
	 * @param record
	 */
	_setButtonStatus: function (record) {
	    var me = this;
	    var lbar = this.down('toolbar[dock=left]');
	    var btns = lbar.items.items;

	    // 先重置所有可用
	    if(record == undefined){
	        Ext.each(btns, function (item) {
	            if(item.name == 'createfolder' || item.name == 'import' || item.name == 'import_private'){
	                item.setDisabled(false);
	            }else{
	                item.setDisabled(true);
	            }
	        });
	        return
	    }else{
	        for (var i = 0; i < btns.length; i++) {
	            btns[i].setDisabled(false);
	        }
	    }
	
        // 试验项节点不能导入
	    var info = record.data;

	    if(info.modelName == 'T_SYLX'){
            lbar.down('button[name=createfolder]').setDisabled(true);
            //lbar.down('button[name=import]').setDisabled(true);
        }if(info.modelName == 'T_RW_INFO'){
            lbar.down('button[name=createfolder]').setDisabled(true);
            lbar.down('button[name=createbyhand]').setDisabled(true);
           // lbar.down('button[name=import]').setDisabled(true);
            lbar.down('button[name=import_private]').setDisabled(true);
        }
	}

});