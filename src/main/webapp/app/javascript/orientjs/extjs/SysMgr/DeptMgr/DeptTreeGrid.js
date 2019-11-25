/**
 * Created by qjs on 2016/10/26.
 */
Ext.define('OrientTdm.SysMgr.DeptMgr.DeptTreeGrid', {
    alias: 'widget.deptTreeGrid',
    extend: 'OrientTdm.Common.Extend.Tree.OrientTreeGrid',
    xtype: 'treeGrid',
    requires: [
        'OrientTdm.SysMgr.DeptMgr.Model.DeptTreeModel'
    ],
    config: {

    },
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        me.mon(me, 'select', me.itemClickListener, me);
    },
    createToolBarItems: function () {
        var me = this;
        var retVal = [{
            xtype: 'trigger',
            width: 230,
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
            text: '新增部门',
            iconCls: 'icon-create',
            handler: Ext.bind(me.onAddDept, me),
            width: 80
        },{
            text: '删除部门',
            iconCls: 'icon-delete',
            handler: Ext.bind(me.onDeleteDept, me),
            width: 80
        }];
        me.actionItems.push({
            iconCls: 'icon-update',
            text: '修改',
            itemId: 'update',
            scope: this,
            handler: this.onUpdateDept
        }, retVal[2]);
        return retVal;
    },
    createStore: function () {
        var me = this;
        return Ext.create('Ext.data.TreeStore', {
            model: 'OrientTdm.SysMgr.DeptMgr.Model.DeptTreeModel',
            proxy: {
                type: 'ajax',
                url: serviceName + '/dept/getByPid.rdm',
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                }
            },
            root: {
                text: 'root',
                id: '-1',
                expanded: true
            }
        });
    },
    itemClickListener: function (tree, record, item) {
        var me = this;
        var dept = record.raw;

    },
    createColumns: function(){
        return [
            {xtype: 'treecolumn', text: '部门', dataIndex: 'name', flex: 1},
            {text: '职能', dataIndex: 'function'},
            {text: '排序', dataIndex: 'order'},
            {text: '备注', dataIndex: 'notes'}
        ];
    },
    onAddDept: function () {
        var me = this;
        var selection = me.getSelectionModel().getSelection();
        var oriData = {};
        //未选中节点则默认在根节点下添加
        if(selection.length==0) {
            oriData.pid = '-2';
        }else{
            var curNodeData = selection[0].data;
            oriData.pid = curNodeData.id;
        }
        var createWin = Ext.create('Ext.Window', {
            title: '新增部门',
            plain: true,
            height: 0.6 * globalHeight,
            width: 0.5 * globalWidth,
            layout: 'fit',
            maximizable: true,
            modal: true,
            items: [Ext.create('OrientTdm.SysMgr.DeptMgr.Create.DeptAddForm', {
                bindModelName: 'CWM_SYS_DEPARTMENT',
                successCallback: function (resp, callBackArguments) {
                    me.fireEvent('refreshTreeAndSelOne');
                    if (callBackArguments) {
                        createWin.close();
                    }
                },
                originalData: oriData
            })]
        });
        createWin.show();
    },
    onUpdateDept: function () {
        var me = this;
        var selection = me.getSelectionModel().getSelection();
        var curNodeData = selection[0].data;

        var updateWin = Ext.create('Ext.Window', {
            title: '修改部门',
            plain: true,
            height: 0.6 * globalHeight,
            width: 0.5 * globalWidth,
            layout: 'fit',
            maximizable: true,
            modal: true,
            items: [Ext.create('OrientTdm.SysMgr.DeptMgr.Update.DeptUpdateForm', {
                bindModelName: 'CWM_SYS_DEPARTMENT',
                successCallback: function () {
                    me.fireEvent('refreshTreeAndSelOne');
                    updateWin.close();
                },
                originalData: curNodeData
            })]
        });
        updateWin.show();
    },
    onDeleteDept: function () {
        var me = this;
        var selection = me.getSelectionModel().getSelection();
        var curNodeData = selection[0].data;

        if (curNodeData.id == -2) {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.rootDelForbidden);
            return;
        }

        OrientExtUtil.TreeHelper.deleteNodes(me, "dept/delete.rdm", function () {
            me.fireEvent("refreshTreeAndSelOne");
        });
    }
    //refreshNode: function (nodeId, refreshParent) {
    //    var rootNode = this.getRootNode();
    //    var currentNode;
    //    if (nodeId === '-1') {
    //        currentNode = rootNode;
    //    } else {
    //        currentNode = rootNode.findChild('id', nodeId);
    //    }
    //
    //    var toRefreshNode = currentNode;
    //    if (refreshParent) {
    //        toRefreshNode = currentNode.parentNode;
    //    }
    //    this.store.load({node: toRefreshNode});
    //}
});