/**
 * Created by Seraph on 16/7/26.
 */
/**
 * Created by Seraph on 16/7/6.
 */
Ext.define('OrientTdm.Collab.MyTask.plan.PlanTaskTree', {
    extend: 'OrientTdm.Collab.ProjectMng.mainFrame.ProjectTree',
    requires: [
        "OrientTdm.Collab.ProjectMng.mainFrame.model.ProjectTreeNodeModel"
    ],
    initComponent: function () {
        var me = this;

        Ext.apply(
            this, {
                rootVisible : true
            }
        );
        me.callParent(arguments);

    },
    config: {
        rootId : null,
        rootModel : null,
        rootData : null
    },
    createStore: function () {
        var me = this;

        var params = {
            modelName : me.rootModel,
            dataId : me.rootId
        };

        var rootNode;
        OrientExtUtil.AjaxHelper.doRequest("projectTree/nodeInfo.rdm", params, false, function (response) {
            rootNode = Ext.decode(response.responseText);
        });

        var retVal = Ext.create("Ext.data.TreeStore", {
            model: 'OrientTdm.Collab.ProjectMng.mainFrame.model.ProjectTreeNodeModel',
            listeners: {
                beforeLoad: function (store, operation) {
                    var node = operation.node;
                    store.getProxy().setExtraParam("functionModule", "planMng");
                    store.getProxy().setExtraParam("modelName", Ext.encode(node.data.modelName));
                    store.getProxy().setExtraParam("dataId", node.data.dataId);

                    if (!node.isRoot()) {
                        if (node.raw.parentNode) {
                            node.raw.parentNode = null;
                        }
                    }
                }
            },
            root: Ext.apply(rootNode, {
                expanded: true
            })
        });
        return retVal;
    },
    createToolBarItems: function () {
        var me = this;

        var retVal = [{
            xtype: 'trigger',
            width: 120,
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
                        me.filterByText(this.getRawValue(), "text");
                    }
                }
            }
        }, {
            text: '控制',
            iconCls: 'blist',
            menu : {
                items: [{
                    text: '提交任务', handler: Ext.bind(me.onSubmit, me)
                }, {
                    text: '修改', handler: Ext.bind(me.onEditNode, me)
                }, {
                    text: '删除', handler: Ext.bind(me.onDeleteNode, me)
                }, '-', {
                    text: '新增任务',
                    menu: {
                        showSeparator: false,
                        items: [{
                            text: '手工创建',
                            handler: Ext.bind(me.onCreateNode, me, [{toCreateModelName : 'CB_TASK'}])
                        }, '-',{
                            text: '导入',
                            handler: me.onCreateByHandClicked
                        }
                        ]
                    }
                }]
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
    refreshNode: function (nodeId, refreshParent) {
        var rootNode = this.getRootNode();

        var currentNode;
        var isRoot = false;
        if(nodeId === this.rootModel + "_" + this.rootId){
            currentNode = rootNode;
            isRoot = true;
        }else{
            currentNode = rootNode.findChild('id', nodeId);
        }

        var toRefreshNode = currentNode;
        if(refreshParent && !isRoot){
            toRefreshNode = currentNode.parentNode;
        }
        this.store.load({node: toRefreshNode});
    },
    onSubmit: function () {
        var me = this;
        Ext.bind(me.doSubmit, me);

        if(me.rootModel === 'CB_TASK'){
            var params = { flowTaskId : me.rootData.flowTaskId };
            var items = [];

            OrientExtUtil.AjaxHelper.doRequest("flow/info/nextFlowNodes.rdm", params, false, function (response) {
                var retV = Ext.decode(response.responseText);

                for(var i=0; i<retV.length; i++){
                    var nextTaskInfo = retV[i];
                    items.push({
                        xtype: 'button',
                        text : retV[i].name,
                        name : me.rootData.flowTaskId,
                        nextTaskInfo : retV[i],
                        handler: Ext.bind(me.doSubmit, me, [{transition : nextTaskInfo.transition}])
                    });
                }
            });

            if(items.length == 1){
                me.doSubmit(items[0].transition);
            }else{
                var win = new Ext.Window({
                    title : '请选择下个任务',
                    width: 0.5 * globalWidth,
                    height: 0.1 * globalHeight,
                    layout: 'fit',
                    tbar : items
                });
                win.show();
            }
        }else{
            me.doSubmit();
        }
    },
    doSubmit : function (transition) {
        var me = this;
        var url = '/' + me.rootModel.toLowerCase() + '/submit.rdm';

        var params = {
            dataId : me.rootId,
            transitionName : transition
        };
        OrientExtUtil.AjaxHelper.doRequest(serviceName + url, params, false, function (response) {
            var retV = Ext.decode(response.responseText);
        });
    }
});