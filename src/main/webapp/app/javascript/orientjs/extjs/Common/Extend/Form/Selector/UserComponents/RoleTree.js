/**
 * Created by Administrator on 2016/7/20 0020.
 */
Ext.define('OrientTdm.Common.Extend.Form.Selector.UserComponents.RoleTree', {
    extend: 'OrientTdm.Common.Extend.Tree.OrientTree',
    alias: 'widget.roleTree',
    requires: [
        "OrientTdm.SysMgr.RoleMgr.Model.RoleListExtModel"
    ],
    config: {
        chooseRoleIds: ''
    },
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    initComponent: function () {
        var roleTree = this;
        Ext.apply(roleTree, {
            displayField: "name",
            hideHeaders: true,
            columns: [{
                xtype: 'treecolumn',
                dataIndex: 'name',
                flex: 1
            }]
        });
        roleTree.callParent(arguments);
    },
    initEvents: function () {
        var roleTree = this;
        roleTree.callParent();
        roleTree.mon(roleTree, 'select', roleTree.selectItem, roleTree);
    },
    createToolBarItems: function () {
        var roleTree = this;
        var retVal = [{
            xtype: 'trigger',
            triggerCls: 'x-form-clear-trigger',
            onTriggerClick: function () {
                this.setValue('');
                roleTree.clearFilter();
            },
            emptyText: '快速搜索',
            enableKeyEvents: true,
            listeners: {
                keyup: function (field, e) {
                    if (Ext.EventObject.ESC == e.getKey()) {
                        field.onTriggerClick();
                    } else {
                        roleTree.filterByText(this.getRawValue(), "name");
                    }
                }
            }

        }];
        return retVal;
    },
    createStore: function () {
        var me = this;
        var retVal = new Ext.data.TreeStore({
            model: 'OrientTdm.SysMgr.RoleMgr.Model.RoleListExtModel',
            proxy: {
                type: 'ajax',
                api: {
                    "read": Ext.isEmpty(me.chooseRoleIds) ? serviceName + "/role/list.rdm" : serviceName + "/role/listByIdFilter.rdm"
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                },
                extraParams: {
                    filterTH: me.filterTH,
                    ids: me.chooseRoleIds
                }
            },
            listeners: {
                load: function (store, record) {
                    if ('root' == record.data.id) {
                        Ext.each(record.childNodes, function (childNode) {
                            childNode.data.leaf = true;
                        });
                    }
                }
            }
        });
        return retVal;
    },
    selectItem: function (tree, node) {
        var roleId = node.getId();
        var me = this.up('userFilterPanel');
        var centerPanel = me.ownerCt.centerPanel;
        if (centerPanel) {
            centerPanel.filterByRoleId(roleId);
        }
    }
});