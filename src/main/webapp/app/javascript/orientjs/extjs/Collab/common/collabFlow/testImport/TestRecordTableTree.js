/**
 * 测试数据导入数据表树
 */

Ext.define('OrientTdm.Collab.common.collabFlow.testImport.TestRecordTableTree',{
    extend: "OrientTdm.Common.Extend.Tree.OrientTree",
    alias: 'widget.TestRecordTableTree',
    config: {
        belongFunctionId: '',
        isShowCruBtn:true,
        onlyShowRefreshBtn:false,
        leftClickShowMenu:true
    },

    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        // 添加点击事件
        me.mon(me, 'select', me._selectItem, me);
    },

    createStore: function() {
        var me = this;
        var model = Ext.define("TestDataTreeModel", { // 定义树节点数据模型
            extend : "Ext.data.Model",
            fields : [
                {name : "id",type : "string"},
                {name : "text", type : "string"}  // 试验类型名
            ]
        });

        return Ext.create('Ext.data.TreeStore', {
            model : model,
            listeners: {
                beforeLoad: function (store, operation) {
                    var node = operation.node;
                    store.getProxy().setExtraParam("importRecodId", me.item.data['id']);
                }
            },
            proxy : {
                type : 'ajax',
                actionMethods:{
                    create:"POST"
                },
                api: {
                    "read": serviceName + "/TestDataImportRecordController/getTestTypeNode.rdm"
                },
                reader: {
                    type: 'json',
                    root: 'results'
                }
            },
            root : {
                text:"",
                id:'',
                expanded : true,
                level:1,
                iconCls : "icon-list-relation-node"
            }
        });
    },

    /**
     * 树节点点击事件
     * @param tree
     * @param node
     * @private
     */
    _selectItem: function (tree, node) {
        var me = this;
        if (node.raw.id == 'root') {
            return;
        }
        me.ownerCt.centerPanel.fireEvent('initTestDataNode',node, me);
    }

});