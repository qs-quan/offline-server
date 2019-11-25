/**
 * 词条检索主面板
 * @author : weilei
 */
define(function (require, exports, module) {

    //知识管理：全局变量
    var constant = require('../../util/constant');
    //评论表格
    var dictionGrid = require('./dictionGrid');
    //评论表单
    var dictionSearch = require('./dictionSearch');
    exports.init = function (nodeId, isShow) {

        var isClose = true;
        var title = '词条列表';
        if ('false' == isShow) {
            isClose = false;
            title = '词条检索';
        }
        var centerPanel = new Ext.Panel({
            id: 'dictionMain',
            title: title,
            region: 'center',
            layout: 'border',
            closable: false,
            items: [dictionSearch.init(nodeId, constant, isShow), dictionGrid.init(nodeId, constant, isShow)]
        });
        return centerPanel;
    };
});