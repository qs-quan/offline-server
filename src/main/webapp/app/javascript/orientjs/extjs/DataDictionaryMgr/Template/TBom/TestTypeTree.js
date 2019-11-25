/**
 * Created by dailin on 2019/7/9 10:59.
 */

Ext.define('OrientTdm.DataDictionaryMgr.Template.TBom.TestTypeTree',{
    // extend: 'OrientTdm.Common.Extend.Tree.OrientTree',
    extend: "OrientTdm.TestBomBuild.Tree.Common.CommonBomTree",
    alias: 'widget.testTypeTree',

    initComponent: function () {
        var me = this;
        /*  Ext.apply(me,{
             rootVisible: true
          });*/
        me.title = "试验类型";
        me.callParent(arguments);
        // 添加点击事件
        me.mon(me, 'select', me._selectItem, me);
    },

    createStore: function() {
        var me = this;
        var model = Ext.define("TestDataTreeModel", { // 定义树节点数据模型
            extend : "Ext.data.Model",
            fields : [{name : "id",type : "string"},
                {name : "text", type : "string"}  // 试验类型名
            ]
        });

        return Ext.create('Ext.data.TreeStore', {
            model : model,

            proxy : {
                type : 'ajax',
                actionMethods:{
                    create:"POST"
                },
                extraParam:{
                    schemaId: OrientExtUtil.FunctionHelper.getSchemaId()
                },
                api: {
                    "read": serviceName + "/DictionaryController/getTestTypeNode.rdm"
                },
                reader: {
                    type: 'json',
                    root: 'results'
                }
            },
            root : {
                text:'试验类型',
                id:'root',
                expanded : true,
                level:1,
                iconCls : "icon-list-relation-node"
            },
            // 在后台获取完数据后传到前台进行根据id升序排序
            sorters: [{
                property: 'id',
                direction: 'ASC'
            }]
        });
    },

    _selectItem: function (tree, node) {
        var me = this;
        if (node.raw.ID == 'root') {
            return;
        }
        me.ownerCt.centerPanel.fireEvent('initUserDataByTypeNode',node.raw);
    }
});