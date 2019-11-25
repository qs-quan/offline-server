/**
 * Created by enjoy on 2016/4/30 0030.
 */
Ext.define('OrientTdm.SysMgr.RoleMgr.AssignFunction.AssignFunctionTree', {
    extend: 'OrientTdm.Common.Extend.Tree.OrientTree',
    alias: 'widget.assignFunctionTree',
    requires: [],
    config: {
        roleId: ''
    },
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            hideHeaders: true,
            columns: [{
                xtype: 'treecolumn',
                dataIndex: 'text',
                flex: 1
            }],
            listeners: {
                checkchange: me.checkchange
            }
        });
        me.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
    },
    createToolBarItems: function () {
        return [
            {
                iconCls: 'icon-save',
                text: '保存',
                disabled: false,
                itemId: 'save',
                scope: this,
                handler: this.doSaveAssign
            },
            {
                iconCls: 'icon-refresh',
                text: '刷新',
                disabled: false,
                itemId: 'refresh',
                scope: this,
                handler: this.doRefresh
            },
            {
                iconCls: 'icon-expandAll',
                text: '全部展开',
                disabled: false,
                itemId: 'expandAll',
                scope: this,
                handler: this.expandAll
            }
        ];
    },
    createStore: function () {
        var me = this;
        var retVal = new Ext.data.TreeStore({
            proxy: {
                type: 'ajax',
                url: serviceName + '/role/treeRoleFunctions.rdm',
                extraParams: {
                    roleId: me.roleId
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                }
            },
            sorters: [{
                sorterFn: function (node1, node2) {
                    if (node2.raw.position > node1.raw.position) {
                        return -1;
                    } else if (node2.raw.position < node1.raw.position) {
                        return 1;
                    } else
                        return 0;
                }
            }]
        });
        return retVal;
    },
    doRefresh: function () {
        this.fireEvent('refreshTree', false);
    },
    checkchange: function (node, checked) {
        var me = this;
        node.expand();
        node.eachChild(function (child) {
            child.set('checked', checked);
            me.fireEvent('checkchange', child, checked);
        });
        me.flowToParent(node, checked);
    },
    flowToParent: function (node, checked) {
        var me = this;
        //更新父节点的选中状态
        var parentNode = node.parentNode;
        if (parentNode) {
            if (checked == true) {
                parentNode.set('checked', checked);
                me.flowToParent(parentNode, checked);
            } else if (checked == false) {
                //判断是否所有子节点都未选中
                var allSonUnchecked = true;
                parentNode.eachChild(function (child) {
                    if (child.get('checked') == true) {
                        allSonUnchecked = false;
                    }
                });
                if (allSonUnchecked == true) {
                    parentNode.set('checked', checked);
                    me.flowToParent(parentNode, checked);
                }
            }

        }
    },
    doSaveAssign: function () {
        var me = this;
        var records = this.getView().getChecked();
        var functionIds = [];
        Ext.each(records, function (record) {
            var functionId = record.get('id');
            if ('root' != functionId) {
                functionIds.push(functionId);
            }
        });
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/role/saveAssignFunctions.rdm', {
            functionIds: functionIds,
            roleId: me.roleId
        }, true, function (resp) {
            var respData = resp.decodedData;
            if (respData.success == true) {
                OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.assignSuccess);
            } else
                OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.assignFail);
        });
    },
    expandAll: function () {
        var me = this;
        me.getRootNode().expand(true);
    }
});