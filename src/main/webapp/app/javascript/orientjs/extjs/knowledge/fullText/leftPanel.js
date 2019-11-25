/**
 * 全文检索左面面板
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
                    id: 'fullText',
                    url: '',
                    text: '全文检索',
                    leaf: true,
                    iconCls: 'naviFullSearch'
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