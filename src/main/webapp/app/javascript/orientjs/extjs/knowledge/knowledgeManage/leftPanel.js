/**
 * 知识管理左面面板
 * @author : weilei
 */
define(function (require, exports, module) {

    //知识管理：全局变量
    var constant = require('../util/constant');
    //中心面板
    var centerPanel = require('../centerPanel');

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

        //知识库标签
        var cateName = new Ext.form.Label({
            text: '知识库：',
            style: 'font-size:12px;margin:3px 3px;'
        });

        //知识库下拉框
        var cateNameCombo = new Ext.form.ComboBox({
            mode: 'remote',
            store: cateNameStore,
            width: 150,
            editable: false,
            emptyText: '请选择.',
            fieldLabel: '知识库',
            valueField: 'categoryId',
            columnWidth: 0.70,
            displayField: 'categoryName',
            triggerAction: 'all',
            listeners: {
                'select': function (combo, record, index) {
                    var cateTree = Ext.getCmp('cateTree');
                    if (null != cateTree && undefined != cateTree) {
                        cateTree.show();
                        var rootNode = cateTree.getRootNode();
                        rootNode.attributes.id = record.data.categoryId;
                        rootNode.setText(record.data.categoryName);
                        rootNode.attributes.parentId = record.data.categoryParentId;
                        rootNode.reload();
                    }
                }
            }
        });

        //知识库刷新
        var refreshButton = new Ext.Button({
            iconCls: 'toolbarrefresh',
            style: 'margin:0 0 0 3px;',
            handler: function () {
                cateNameStore.reload();
            }
        });

        //目录结构树
        var cateTree = new Ext.tree.TreePanel({
            id: 'cateTree',
            root: constant.getRootNode(),
            loader: constant.getTreeLoader(''),
            border: false,
            hidden: true,
            listeners: {
                'click': function (node) {
                    var nodeId = 'fileManger';
                    var nodeText = node.attributes.id;
                    var nodeUrl = '';
                    centerPanel.loadFunction(nodeId, nodeText, nodeUrl);
                }
            }
        });

        var leftPanel = new Ext.form.FormPanel({
            width: 300,
            split: true,
            border: false,
            bodyStyle: 'padding:5px',
            labelWidth: 105,
            items: [
                {
                    layout: 'column',
                    border: false,
                    items: [cateName, cateNameCombo, refreshButton]
                }, cateTree]
        });

        return leftPanel;
    };

});