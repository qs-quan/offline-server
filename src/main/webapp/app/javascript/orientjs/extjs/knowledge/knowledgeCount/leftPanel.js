/**
 * 知识统计左面面板
 * @author : weilei
 */
define(function (require, exports, module) {

    //中心面板
    var centerPanel = require('../centerPanel');

    exports.init = function () {

        //根节点
        var rootNode = new Ext.tree.AsyncTreeNode({
            expand: true,
            children: [
                {
                    id: 'dictionCount',
                    url: '',
                    text: '词条统计',
                    leaf: true,
                    iconCls: 'dictionCount'
                },
                {
                    id: 'fileCount',
                    url: '',
                    text: '文档统计',
                    leaf: true,
                    iconCls: 'fileCount'
                }
            ]
        });

        var leftPanel = new Ext.tree.TreePanel({
            root: rootNode,
            border: false,
            rootVisible: false,
            listeners: {
                click: function (node) {
                    var nodeId = node.attributes.id;
                    var nodeText = node.attributes.text;
                    var nodeUrl = node.attributes.url;
                    centerPanel.loadFunction(nodeId, nodeText, nodeUrl);
                }
            }
        });

        return leftPanel;
    };
});