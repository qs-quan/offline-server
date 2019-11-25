/**
 * Created by Seraph on 16/7/25.
 */
Ext.define('OrientTdm.Collab.MyTask.mainFrame.MyTaskTree', {
    extend: 'OrientTdm.Common.Extend.Tree.OrientTree',
    requires: [
        'OrientTdm.Collab.MyTask.dataTask.DataTaskListPanel'
    ],
    afterInitComponent: function () {
        var me = this;
        var toSelectNode = me.getRootNode().getChildAt(0);
        me.fireEvent('select', me, toSelectNode);
        me.getSelectionModel().select(toSelectNode);
        this.viewConfig.listeners.refresh = function () {
            this.select(1);
        };
    },
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        me.mon(me, 'select', me.itemClickListener, me);
        me.addEvents("select");
    },
    createStore: function () {
        var me = this;
        var children = [{
            text: "审批任务",
            leaf: true,
            iconCls: 'icon-auditTask'
        }];
        if (TDM_SERVER_CONFIG['COLLAB_ENABLE_PLAN_BREAK']) {
            children.push({
                text: "协同任务",
                leaf: true,
                iconCls: 'icon-collabTask'}
            );
        }
        var retVal = Ext.create("Ext.data.TreeStore", {
            listeners: {
                beforeLoad: function (store, operation) {

                }
            },
            root: {
                text: '根',
                id: '-1',
                expanded: true,
                children: [
                    //{text: "日历视图", leaf: true},
                    {
                        text: "当前任务",
                        expanded: true,
                        iconCls: 'icon-currentTask',
                        children: children
                    },
                    {
                        text: "历史任务",
                        expanded: true,
                        iconCls: 'icon-hisTask',
                        children: Ext.decode(Ext.encode(children))
                    }
                ]
            }
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
        var itemToAdd = null;
        if (record.get("text") === '日历视图') {
            itemToAdd = Ext.create("OrientTdm.Collab.MyTask.Calendar.CalendarTaskPanel", {
                id: 'calendarPanel',
                title: '日历视图',
                closable: true
            });

        } else if (record.get("text")==='通知') {

        } else if (record.get("text")==='协同任务' && record.parentNode.get("text")==='当前任务') {
            itemToAdd = Ext.create("OrientTdm.Collab.MyTask.collabTask.CollabTaskDashboard", {
                id: 'collabTaskListPanel',
                title: '协同任务',
                closable: true
            });
        } else if (record.get("text")==='审批任务' && record.parentNode.get("text")==='当前任务') {
            itemToAdd = Ext.create("OrientTdm.Collab.MyTask.auditTask.AuditTaskDashboard", {
                id: 'auditTaskListPanel',
                title: '审批任务',
                closable: true
            });

        } else if (record.get("text")==='协同任务' && record.parentNode.get("text")==='历史任务') {
            itemToAdd = Ext.create("OrientTdm.Collab.MyTask.historyTask.HistoryTaskDashboard", {
                id: 'hisCollabTaskListPanel',
                title: '历史协同任务',
                closable: true,
                taskType: 'collab'
            });

        } else if (record.get("text")==='审批任务' && record.parentNode.get("text")==='历史任务') {
            itemToAdd = Ext.create("OrientTdm.Collab.MyTask.historyTask.HistoryTaskDashboard", {
                id: 'hisAuditTaskListPanel',
                title: '历史审批任务',
                closable: true,
                taskType: 'audit'
            });

        } else {
            return;
        }

        if (!centerPanel.contains(itemToAdd)) {
            centerPanel.add(itemToAdd);
        }
        centerPanel.setActive(itemToAdd);
    },

    refreshNode: function (nodeId, refreshParent) {
        var rootNode = this.getRootNode();

        var currentNode;
        if (nodeId === '-1') {
            currentNode = rootNode;
        } else {
            currentNode = rootNode.findChild('id', nodeId);
        }

        var toRefreshNode = currentNode;
        if (refreshParent) {
            toRefreshNode = currentNode.parentNode;
        }
        this.store.load({node: toRefreshNode});
    }
})
;