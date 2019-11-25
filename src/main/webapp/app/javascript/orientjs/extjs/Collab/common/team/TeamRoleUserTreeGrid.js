/**
 * Created by Seraph on 16/7/9.
 */
Ext.define('OrientTdm.Collab.common.team.TeamRoleUserTreeGrid', {
    alias: 'widget.teamRoleUserTreeGrid',
    extend: 'OrientTdm.Common.Extend.Tree.OrientTree',
    xtype: 'treeGrid',
    requires: [
        'OrientTdm.Collab.common.team.model.RoleUserTreeModel'
    ],
    config: {
        localMode: false,
        localData: null
    },
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        me.mon(me, 'select', me.itemClickListener, me);

    },
    createToolBarItems: function () {
        var me = this;
        if (me.localMode) {
            return [];
        } else {
            var retVal = [{
                text: '新增角色',
                iconCls: 'icon-create',
                handler: Ext.bind(me.onAddRole, me),
                width: 80
            }, {
                text: '编辑角色',
                iconCls: 'icon-update',
                handler: Ext.bind(me.onEditRole, me),
                width: 80,
                disabled: true
            }, {
                text: '分配用户',
                iconCls: 'icon-assign',
                handler: Ext.bind(me.onAssignUser, me),
                width: 80
            }, {
                text: '删除角色',
                iconCls: 'icon-delete',
                handler: Ext.bind(me.onDeleteRole, me),
                width: 80,
                disabled: true
            }];

            return retVal;
        }
    },
    createStore: function () {
        var me = this;

        if (me.localMode) {
            return me.localData.roleUserTreeStore;
        } else {
            return Ext.create('Ext.data.TreeStore', {
                model: 'OrientTdm.Collab.common.team.model.RoleUserTreeModel',
                listeners: {
                    beforeLoad: function (store, operation) {
                        var node = operation.node;

                        store.getProxy().setExtraParam('modelName', me.modelName);
                        store.getProxy().setExtraParam('dataId', me.dataId);
                        if (node.isRoot()) {
                            store.getProxy().setExtraParam('parId', '-1');
                        } else {
                            if (node.raw.parentNode) {
                                node.raw.parentNode = null;
                            }
                            store.getProxy().setExtraParam('parId', Ext.encode(node.data.roleId));
                        }
                    }
                },
                root: {
                    text: 'root',
                    id: '-1',
                    expanded: true
                },
                proxy: {
                    type: 'ajax',
                    api: {
                        'read': serviceName + '/collabTeam/roleUsers/tree.rdm'
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
        }
    },
    itemClickListener: function (tree, record, item) {
        var me = this;
        var eastPanel = me.ownerCt.eastPanel;

        if (!record.data.leaf) {
            var functionAssignPanel = Ext.create('OrientTdm.Collab.common.team.RoleFunctionAssignPanel', {
                layout: 'border',
                region: 'center',
                bodyStyle: {background: '#fff'},
                roleId: record.data.roleId,
                modelName: me.modelName,
                localMode: me.localMode,
                localData: me.localMode ? me.localData.roleFunctionData[record.data.roleId] : null
            });
            eastPanel.removeAll();
            eastPanel.add(functionAssignPanel);
            eastPanel.doLayout();
            me.ownerCt.eastPanel.expand(true);
        } else {
            eastPanel.removeAll();
        }
        // this.ownerCt.southPanel.collapse(true);

        var tb = me.getDockedItems('toolbar[dock="top"]');
        if (Ext.isEmpty(tb)) {
            this.ownerCt.southPanel.removeAll();
            return;
        }

        var createBtn = tb[0].query('button[text="新增角色"]')[0];
        var assignBtn = tb[0].query('button[text="分配用户"]')[0];
        var modifyBtn = tb[0].query('button[text="编辑角色"]')[0];
        var deleteBtn = tb[0].query('button[text="删除角色"]')[0];

        if (record.data.leaf) {
            createBtn.setDisabled(true);
            assignBtn.setDisabled(true);
            modifyBtn.setDisabled(true);
            deleteBtn.setDisabled(true);
        } else if (record.data.defaultRole) {
            assignBtn.setDisabled(false);
            createBtn.setDisabled(false);
            modifyBtn.setDisabled(true);
            deleteBtn.setDisabled(true);
        } else {
            modifyBtn.setDisabled(false);
            deleteBtn.setDisabled(false);
        }

        this.ownerCt.southPanel.removeAll();
    },
    columns: [
        {xtype: 'treecolumn', text: '角色', dataIndex: 'roleName', flex: 1},
        {text: '用户名', dataIndex: 'userName'},
        {text: '部门', dataIndex: 'deptName'}
    ],
    onAddRole: function () {
        var me = this;
        var createWin = Ext.create('Ext.Window', {
            title: '新增角色',
            plain: true,
            height: 0.2 * globalHeight,
            width: 0.4 * globalWidth,
            layout: 'fit',
            maximizable: true,
            modal: true,
            items: [Ext.create('OrientTdm.Collab.common.team.roleUserMng.RoleUserMngPanel', {
                url: serviceName + '/collabTeam/addRole.rdm',
                baseParams: {
                    modelName: me.modelName,
                    dataId: me.dataId
                },
                successCallback: function (resp, callBackArguments) {
                    if (callBackArguments) {
                        createWin.close();
                    }
                    var rootNode = me.getRootNode();
                    me.refreshNode(rootNode.data.id, false);
                }
            })]
        });
        createWin.show();
    },
    onEditRole: function () {
        var me = this;

        var selection = me.getSelectionModel().getSelection();
        var curNodeData = selection[0].data;

        if (curNodeData.leaf) {
            OrientExtUtil.Common.tip('提示', '请选择角色节点');
            return;
        }

        var win = Ext.create('Ext.Window', {
            title: '编辑角色',
            plain: true,
            height: 0.2 * globalHeight,
            width: 0.4 * globalWidth,
            layout: 'fit',
            maximizable: true,
            modal: true,
            items: [Ext.create('OrientTdm.Collab.common.team.roleUserMng.RoleUserMngPanel', {
                initRoleName: curNodeData.roleName,
                url: serviceName + '/collabTeam/modifyRole.rdm',
                baseParams: {
                    roleId: curNodeData.roleId,
                    oldRoleName: curNodeData.roleName
                },
                successCallback: function () {
                    win.close();
                    var rootNode = me.getRootNode();
                    me.refreshNode(rootNode.data.id, false);
                }
            })]
        });
        win.show();
    },
    onDeleteRole: function () {
        var me = this;
        var selection = me.getSelectionModel().getSelection();
        var curNodeData = selection[0].data;
        if (curNodeData.leaf) {
            OrientExtUtil.Common.tip('提示', '请选择角色节点');
            return;
        }

        Ext.Msg.confirm('提示', '是否删除?',
            function (btn, text) {
                if (btn == 'yes') {
                    var params = {
                        roleId: curNodeData.roleId
                    };
                    OrientExtUtil.AjaxHelper.doRequest(serviceName + '/collabTeam/deleteRole.rdm', params, false, function (response) {
                        var retV = response.decodedData;
                        var success = retV.success;
                        if (success) {
                            OrientExtUtil.Common.tip('提示', '删除成功');
                            var rootNode = me.getRootNode();
                            me.refreshNode(rootNode.data.id, false);
                        }
                    });

                }
            }
        );
    },
    onAssignUser: function () {
        var me = this;
        var selection = this.getSelectionModel().getSelection();
        var curNodeData = selection[0].data;

        if (curNodeData.leaf) {
            OrientExtUtil.Common.tip('提示', '请选择角色节点');
            return;
        }
        var params = {
            region: 'center',
            roleId: curNodeData.roleId,
            assignCallback: function (selectedIds, direction) {
                me.refreshNode(curNodeData.id, false);
            }
        };
        if (me.ids) {
            params.ids = me.ids;
        }
        var assignUserPanel = Ext.create('OrientTdm.Collab.common.team.roleUserMng.AssignUserPanel', params);

        this.ownerCt.southPanel.removeAll();
        this.ownerCt.southPanel.add(assignUserPanel);
        this.ownerCt.southPanel.expand(true);
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
});
