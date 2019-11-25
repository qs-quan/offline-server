/**
 * 试验团队人员 treeView界面
 * Created by dailin on 2019/8/12 0:58.
 */

Ext.define('OrientTdm.TestBomBuild.Panel.GridPanel.TestTeamRoleUser', {
    extend: 'OrientTdm.Common.Extend.Tree.OrientTree',
    alias: 'widget.testTeamRoleUser',
    xtype: 'treeGrid',
    requires: [
        'OrientTdm.TestBomBuild.Model.TestTeamRoleUserTreeModel'
    ],
    config: {
        localMode: false,
        localData: null,
        power: '-1'
    },
    columns: [{
            xtype:'actioncolumn',
            header: '操作',
            width: 50,
            dataIndex: 'id',
            items: ['-', {
                iconCls: 'icon-assign',
                tooltip: '选择用户',
                border: '0 5 0 0',
                getClass: function(v, meta, record) {
                    // 设置只有角色节点可以选择用户
                    return record.data.leaf ? '' : 'icon-assign';
                },
                handler: function(grid, rowIndex, colIndex, item, e, record) {
                    // 用户节点是叶子节点，不可以进行分配用户
                    grid.getSelectionModel().select(record);
                    if (record.data.leaf) {
                        return ;
                    }
                    if (this.up().up().power == '-1') {
                        OrientExtUtil.Common.tip('提示', '权限不足，无法设置人员！');
                        return ;
                    }

                    var assignUserPanel = Ext.create('OrientTdm.TestBomBuild.Panel.Panel.TestTeamUserPanel', {
                        region: 'center',
                        height: 0.37 * globalHeight,
                        roleId: record.data.roleId,
                        thId: this.up().up().dataId,
                        assignCallback: function (selectedIds, direction) {
                            // 操作完成刷新节点，直接刷rootNode会使southpanel收起
                            // var rootNode = grid.up('testTeamRoleUser').getRootNode();
                            grid.up('testTeamRoleUser').refreshNode(record.data.id, false);
                        }
                    });

                    // 将最下面的panel先清空内容，再插入人员选择界面放，然后展开界面
                    grid.up('testTeamRoleUser').ownerCt.southPanel.removeAll();
                    grid.up('testTeamRoleUser').ownerCt.southPanel.add(assignUserPanel);
                    grid.up('testTeamRoleUser').ownerCt.southPanel.expand(true);
                }
            }, '-']
        }, {
            xtype: 'treecolumn',
            text: '角色',
            dataIndex: 'roleName',
            flex: 2
        }, {
            text: '用户名',
            dataIndex: 'userName',
            flex: 1
        }, {
            text: '部门',
            dataIndex: 'deptName',
            flex: 1
        }
    ],

    initComponent: function () {
        var me = this;

        // 获取当前用户 是经理 还是 相当于可以拉人，还是什么都不能操作
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomRoleController/getChooseUserPower.rdm', {
            dataId: me.dataId
        }, false, function (response) {
            if (response.decodedData.success) {
                me.power = response.decodedData.results;
            }
        });
        me.callParent(arguments);
    },

    createStore: function () {
        var me = this;

        return Ext.create('Ext.data.TreeStore', {
            model: 'OrientTdm.TestBomBuild.Model.TestTeamRoleUserTreeModel',
            listeners: {
                beforeLoad: function (store, operation) {
                    var node = operation.node;

                    store.getProxy().setExtraParam('dataId', me.dataId);
                    if (!node.isRoot()) {
                        store.getProxy().setExtraParam('roleId', node.data.roleId);
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
                    'read': serviceName + '/TbomRoleController/getRoleTreeNodes.rdm'
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
    },

    /*_cellClickListener: function (tree, td, index, record) {
        // 点击actionColumn时，无需防止误操作。其他行不是选中列时，关闭设置框
        if (index == "0") {
            return;
        }

        var testTeamUserPanel = this.ownerCt.southPanel.down('testTeamUserPanel');
        if (testTeamUserPanel && testTeamUserPanel.relationId != record.data.relationId) {
            this.ownerCt.southPanel.removeAll();
        }
    },*/

    // 刷新节点
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
