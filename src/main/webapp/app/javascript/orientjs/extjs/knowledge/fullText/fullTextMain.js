/**
 * 全文检索主面板
 * @author : weilei
 */
define(function (require, exports, module) {

    //知识管理：全局变量
    var constant = require('../util/constant');
    //全文检索表格
    var fullTextGrid = require('./fullTextGrid');
    //全文检索表单
    var fullTextForm = require('./fullTextForm');

    exports.init = function (isShow) {

        var isClose = true;
        if ('false' == isShow) {
            isClose = false;
        }
        var centerPanel = new Ext.Panel({
            id: 'fullTextMain',
            title: '全文检索',
            closable: isClose,
            layout: 'fit',
            items: [
                {
                    layout: 'border',
                    items: [fullTextForm.init(constant, isShow), fullTextGrid.init(constant, isShow)]
                }
            ]
        });
        return centerPanel;
    };

    /**
     * 判断Tab面板是否存在
     */
    exports.isExistPanel = function () {

        var object = Ext.getCmp('fullTextMain');
        if (object == null || object == undefined) return null;
        else return object;
    };
});