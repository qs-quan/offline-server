/**
 * Created by Seraph on 16/7/8.
 */
Ext.define('OrientTdm.Collab.common.team.RoleFunctionAssignPanel', {
    alias: 'widget.teamRoleFunctionAssignPanel',
    extend: 'OrientTdm.Common.Extend.Tree.OrientTree',
    requires: [
        'OrientTdm.Collab.common.team.model.RoleFunctonTreeNodeModel'
    ],
    initComponent: function () {
        var me = this;

        me.callParent(arguments);
    },
    config : {
        roleId : null,
        modelName : null,
        localMode : false,
        localData : null
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'checkchange', me.checkChangeListener, me);
    },
    createStore: function () {
        var me = this;

        if(me.localMode){
            return Ext.create('Ext.data.TreeStore', {
                model: 'OrientTdm.Collab.common.team.model.RoleFunctonTreeNodeModel',
                root: {
                    text: 'root',
                    id: '-1',
                    expanded: true,
                    children : me.localData
                }
            });
        }

        var retVal = Ext.create('Ext.data.TreeStore', {
            model: 'OrientTdm.Collab.common.team.model.RoleFunctonTreeNodeModel',
            listeners: {
                beforeLoad: function (store, operation) {
                    var node = operation.node;

                    store.getProxy().setExtraParam('modelName', Ext.encode(me.modelName));
                    store.getProxy().setExtraParam('roleId', Ext.encode(me.roleId));
                    if (node.isRoot()) {
                        store.getProxy().setExtraParam('pId', null);
                    } else {
                        store.getProxy().setExtraParam('pId', node.data.id);
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
                    'read': serviceName + '/collabTeam/roleFunctionTreeNodes.rdm'
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
        return retVal;
    },
    createToolBarItems: function () {
        var me = this;
        if(me.localMode){
            return [];
        }else{
            var retVal = [{
                text: '保存',
                iconCls: 'icon-saveSingle',
                xtype: 'button',
                width: 80,
                handler: Ext.bind(me.onSaveFunctionAssign, me)
            }];

            return retVal;
        }
    },
    checkChangeListener: function (node, checked, eOpts) {
        node.cascadeBy(function (curNode) {
            // curNode.checked = checked;

        });
    },
    onSaveFunctionAssign: function () {
        var me = this;
        var nodes = me.getChecked();

        var functionIds = '';
        for(var i=0; i<nodes.length; i++){
            functionIds += nodes[i].data.id + ',';
        }
        if(functionIds.length > 0){
            functionIds = functionIds.substr(0, functionIds.length-1);
        }
        var params = {
            roleId : me.roleId,
            functionIds : functionIds
        };

        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/collabTeam/saveAssignFunctions.rdm', params, false, function (response) {
            var retV = response.decodedData;
            var success = retV.success;
            if (success) {
                OrientExtUtil.Common.tip('提示', '修改成功');
            }else{
                me.getStore().reload();
            }
        });
    }
});