/**
 * Bom权限树
 * Created by dailin on 2019/4/1 13:37.
 */

Ext.define('OrientTdm.RoleBomMgr.Tree.RoleBomTree',{
    extend: 'OrientTdm.TestBomBuild.Tree.Common.CommonBomTree',
    alias: 'widget.roleBomTree',
    config: {
        belongFunctionId: '',
        isShowCruBtn:true,
        onlyShowRefreshBtn:false,
        leftClickShowMenu:true
    },
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        me.mon(me, 'select', me.selectItem, me);
    },
    selectItem: function(tree, node) {
        var me = this;
        me.ownerCt.centerPanel.fireEvent('initModelDataByNode', node);
    },
    createStore: function () {
        var me = this;
        var model = Ext.define("RoleBomTreeModel", { // 定义树节点数据模型
            extend : "Ext.data.Model",
            fields : [{name : "id",type : "string"},
                {name : "text", type : "string"},  // 在页面的呈现-现在是图号将来可能变
                {name : "drawingNumber", type : "string"},  // 图号
                {name : "gs", type : "string"},  // 判断是否是用户创建
                {name : "fbh", type: "string"},  // 父编号
                {name : "iconCls", type : "string"}, // 图标
                {name : "tableId", type : "string"}, // tableId
                {name : "tableName", type : "string"} // tableName
            ]
        });
        return Ext.create('Ext.data.TreeStore', {
            model : model,
            listeners: {
                beforeLoad: function (store, operation) {
                    var node = operation.node;
                    store.getProxy().setExtraParam("nodeName", "");
                    store.getProxy().setExtraParam("isFilter",false);
                }
            },
            proxy : {
                type : 'ajax',
                actionMethods:{
                    create:"POST"
                },
                api: {
                    "read": serviceName + "/TbomQueryController/getSpecifiNode.rdm"
                },
                reader: {
                    type: 'json',
                    root: 'results'
                }
            },
            root : {
                text:"RoleBomTree",
                id:"",
                cj:"-1",
                expanded : true,
                level:1,
                iconCls : (me.rootIconCls===undefined)?"icon-data-node":me.rootIconCls
            }
        });
    },
    createToolBarItems: function () {
        var me = this;
        var toolBar = [];
        if (!me.isShowCruBtn) {
            return toolBar;
        }else{
            toolBar = [];
            return toolBar;
        }
    },

    doRefresh: function() {
        this.fireEvent('initTboms');
    }
});