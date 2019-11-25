/**
 * 数据模板选择数据左侧面板
 * Created by dailin on 2019/7/8 10:26.
 */

Ext.define('OrientTdm.Collab.ProjectMng.mainFrame.knowledge.LeftFormPanel',{
    extend: 'Ext.form.FormPanel',
    initComponent: function () {

        var me = this;

        //知识库下拉框
        var cateNameCombo = Ext.create('Ext.form.field.ComboBox',{
            store: {
                fields : ['categoryId','categoryParentId','categoryName'],
                proxy: {

                    type : 'ajax',
                    actionMethods:{
                        create:"POST"
                    },
                    api: {
                        "read": serviceName+'/categoryController/getComboxStore.rdm'
                    },
                    reader: {
                        type: 'json'
                    },
                    extraParams : {
                        rootId : '0',
                        categoryModelName : 'T_CATEGORY'
                    }
                },
                autoLoad: true
            },

            width : 150,
            editable   : false,
            emptyText  : '请选择.',
            fieldLabel : '知识库',
            labelWidth : 50,
            valueField : 'categoryId',
            columnWidth: 0.70,
            displayField  : 'categoryName',
            triggerAction : 'all',
            listeners : {
                'select' : function(combo, record, index){
                    var cateTree = combo.ownerCt.up('panel').down('#cateTree');
                    if( null != cateTree && undefined != cateTree){
                        cateTree.show();
                        var rootNode = cateTree.setRootNode({
                            id:record[0].data.categoryId,
                            text:record[0].data.categoryName,
                            iconCls  : 'cateRootNode',
                            parentId : record[0].data.categoryParentId,
                            keyword  : '',
                            expanded : true

                        });
                    }
                }
            }
        });

        //目录结构树
        var cateTree = Ext.create('Ext.tree.TreePanel',{
            itemId : 'cateTree',
            root   : {
                id   : '-1',
                text : '分类管理',
                iconCls  : 'cateRootNode',
                keyword  : '',
                descibe  : '根节点信息不可以操作.',
                parentId : '0',
                expanded : true
            },
            store : me._getTreeLoader(''),
            border : false,
            hidden : true,
            listeners : {
                'select' : function(node, record){
                    var nodeId   = record.data.id;
                    var centerPanel = this.ownerCt.ownerCt.centerPanelComponent;
                    centerPanel.fireEvent('refreshByTreeNodeChange',nodeId);
                    // centerPanel.loadFunction(nodeId,nodeText,nodeUrl);
                }
            }
        });

        Ext.apply(me,{
            width  : 300,
            split  : true,
            border : false,
            bodyStyle  : 'padding:5px',
            labelWidth : 105,
            items  : [
                {
                    layout : 'column',
                    border : false,
                    items : [cateNameCombo]
                },cateTree]
        });

        me.callParent(arguments);
    },

    _getTreeLoader: function(operationType){
        var me = this;
        var model = Ext.define("SelectedTreeModel", { // 定义树节点数据模型
            extend : "Ext.data.Model",
            fields : [
                {name : "id",type : "string"},
                {name : "text", type : "string"},
                {name : "keyword", type : "string"},
                {name : "descibe", type : "string"},
                {name : "parentId", type: "string"},
                {name : "expanded", type : "string"},
                {name : "iconCls", type : "string"}
            ]
        });

        return Ext.create('Ext.data.TreeStore', {
            model : model,
            listeners: {
                beforeLoad: function (store, operation) {
                    var node = operation.node;
                    store.getProxy().setExtraParam("parentId", node.raw.id);
                }
            },
            proxy : {
                type : 'ajax',
                actionMethods:{
                    create:"POST"
                },
                api: {
                    "read": serviceName+'/categoryController/getCategoryDataForTree.rdm'
                },
                reader: {
                    type: 'json',
                    root: 'results'
                },
                extraParams : {
                    rootId : '-1',
                    operationType: '',
                    categoryModelName : 'T_CATEGORY'
                }
            },
            root : {
                text:"",
                id:'-1',
                expanded : true,
                level:1,
                iconCls : 'cateRootNode'
            }
        });
    }
});