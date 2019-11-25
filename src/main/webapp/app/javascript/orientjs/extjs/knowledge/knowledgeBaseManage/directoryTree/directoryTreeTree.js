/**
 * 目录树
 * @author : weilei
 */
define(function (require, exports, module) {

    //知识管理：全局变量
    var constant = require('../../util/constant');
    //目录树表单
    var directoryTreeForm = require('./directoryTreeForm');

    /**
     * 界面初始化
     */
    exports.init = function () {

        //加载知识库数据
        var cateNameStore = new Ext.data.ArrayStore({
            url: serviceName + '/categoryController/getCategoryDataForCombo.rdm',
            baseParams: {
                rootId: constant.constant.categoryParentId,
                categoryModelName: constant.category.categoryModelName
            },
            autoDestroy: true,
            fields: ['categoryId', 'categoryParentId', 'categoryName']
        });

        //知识库下拉框
        var cateNameCombo = new Ext.form.ComboBox({
            mode: 'remote',
            store: cateNameStore,
            width: 200,
            editable: false,
            emptyText: '请选择.',
            fieldLabel: '所属知识库',
            valueField: 'categoryId',
            displayField: 'categoryName',
            triggerAction: 'all',
            listeners: {
                'select': function (combo, record, index) {
                    var cateTree = Ext.getCmp('cateCreatorTree');
                    if (null != cateTree && undefined != cateTree) {
                        var rootNode = cateTree.getRootNode();
                        rootNode.attributes.id = record.data.categoryId;
                        rootNode.attributes.parentId = record.data.categoryParentId;
                        rootNode.reload();
                    }
                }
            }
        });

        //目录结构树
        var cateTree = new Ext.tree.TreePanel({
            id: 'cateCreatorTree',
            root: constant.getRootNode(),
            loader: constant.getTreeLoader(''),
            border: false,
            listeners: {
                'click': function (node) {
                    directoryTreeForm.loadData(node, this.getRootNode());
                }
            }
        });

        var mainPanel = new Ext.form.FormPanel({
            width: 300,
            split: true,
            region: 'west',
            bodyStyle: 'padding:5px',
            labelWidth: 70,
            items: [cateNameCombo, cateTree]
        });

        return mainPanel;
    };

});
