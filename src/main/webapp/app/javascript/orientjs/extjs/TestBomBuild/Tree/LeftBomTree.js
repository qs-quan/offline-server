/**
 * Created by dailin on 2019/3/23 9:32.
 */
Ext.define('OrientTdm.TestBomBuild.Tree.LeftBomTree',{
    extend: "OrientTdm.Common.Extend.Tree.OrientTree",
    alias: 'widget.leftBomTree',
    config: {
        belongFunctionId: '',
        isShowCruBtn:true,
        onlyShowRefreshBtn:false,
        leftClickShowMenu:true,
        overflowY:'auto',
        overflowX:'auto'
    },

    initComponent: function () {
        var me = this;

        // 添加按钮处理事件，被多次引用的按钮事件放这里面
        var commonButtonHandlderObj = Ext.create('OrientTdm.TestBomBuild.Tree.Toolbar.LeftBomTreeButtonHandler').buttonHandlerObj;
        // 其他属性
        Ext.apply(commonButtonHandlderObj, {
            hideHeaders: true,
            rootVisible: me.rootVisible == undefined ? false : me.rootVisible,
            autoScroll:true,
            collapsible:true,
            collapseDirection:"left",
            animCollapse: "true",
            // 左边按钮栏，独有的按钮事件放自己里面
            lbar: Ext.create('OrientTdm.TestBomBuild.Tree.Toolbar.LeftBomTreeLeftToolbar', {
                scope: me
            }).toolbar,
            // 设置 tree 的显示字段
            columns: [{
                xtype: 'treecolumn',
                dataIndex: 'displayText',
                flex: 1
            }],
            viewConfig: {
                listeners: {
                    // 节点右键点击事件：每次都创建一次菜单对象
                    itemcontextmenu: function (view, rec, node, index, e) {
                        e.stopEvent();
                        // 节点右键菜单对象，独有的按钮事件放自己里面
                        var menu = Ext.create('OrientTdm.TestBomBuild.Tree.Toolbar.LeftBomTreeNodeMenu', {
                            scope: me,
                            rec: rec
                        });
                        menu.showAt(e.getXY());
                        return false;
                    }
                }
            }
        });
        Ext.apply(me, commonButtonHandlderObj);

        me.callParent(arguments);
        // 校验是否有节点删除权限
        // me.hasDeletePower = me.checkDeletePower();
        // 初始化事件
        me.mon(me, 'initTboms', me._initTboms, me);
        // 节点选中事件
        me.mon(me, 'select', me._selectItem, me);
        // 点击空白区域取消选中状态
        me.mon(me, 'containerclick', function(){
            me._setButtonStatus();
            me.getSelectionModel().deselectAll();
        }, me);
    },

    _initTboms: function () {
        //移除所有节点
        this.getRootNode().removeAll();
        // 动态加载新的tbom
        this.getStore().load();
    },

    /**
     * 树上面的搜索栏和按钮
     * @returns {*[]}
     */
    createToolBarItems: function () {
        var me = this;

        return Ext.create('OrientTdm.TestBomBuild.Tree.Toolbar.LeftBomTreeTopToolBar', {
            scope: me
        }).toolbar;
    },

    /**
     * 数据源
     * @returns {Ext.data.TreeStore}
     */
    createStore: function() {
        var me = this;
        var model = Ext.define("TreeModel", { // 定义树节点数据模型
            extend : "Ext.data.Model",
            fields : [
                {name : "id",type : "string"},
                {name : "text", type : "string"},
                {name : "displayText", type : "string"},  // 在页面的呈现-现在是图号将来可能变
                {name : "drawingNumber", type : "string"},  // 图号
                {name : "gs", type : "string"},  // 判断是否是用户创建
                {name : "fbh", type: "string"},  // 父编号
                {name : "cj", type : "string"},  //层级
                {name : "fbh", type : "string"},  //父编号
                {name : "type", type : "string"}, //类型
                {name : "tableName", type : "string"},
                {name : "tableId", type : "string"},
                {name : "dataId", type : "string"},
                {name : "rid", type : "string"},
                {name : "iconCls", type : "string"}
            ]
        });

        return Ext.create('Ext.data.TreeStore', {
            model : model,
            listeners: {
                beforeLoad: function (store, operation) {
                    var node = operation.node;
                    if (!node.isRoot()) {
                        // 非根节点的精确查询
                        store.getProxy().api.read = serviceName + "/TbomQueryController/getChildBom4LeftBomTree.rdm";
                        store.getProxy().setExtraParam("nodeId", node.raw.id);
                        store.getProxy().setExtraParam("cj","0");
                    } else {
                        // 根节点查询，以及模糊查询
                        store.getProxy().api.read = serviceName + "/TbomQueryController/getSpecifiNode.rdm";
                        store.getProxy().setExtraParam("nodeName", node.raw.text);
                        store.getProxy().setExtraParam("isFilter",true);
                    }
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
            // 在后台获取完数据后传到前台进行根据id升序排序
            sorters: [{
                property: 'id',
                direction: 'ASC'
            }],
            root : {
                text:"",
                id:'',
                expanded : true,
                level:1,
                iconCls : (me.rootIconCls===undefined)?"icon-data-node":me.rootIconCls
            }
        });
    },

    /**
     * 节点选中事件
     * @param tree
     * @param node
     * @private
     */
    _selectItem: function (tree, node, item) {
        // 动态设置按钮可用状态
        var me = this;
        this._setButtonStatus(node);

        // 删除上一次的标签
        this.ownerCt.ownerCt.down("#test_OP").removeAll();

        if (node.raw.cj == "1" && !me.hasBind) {
            return;
        }
        this.ownerCt.ownerCt.down("#test_OP").fireEvent("initModelDataByNode", node);
    }

});