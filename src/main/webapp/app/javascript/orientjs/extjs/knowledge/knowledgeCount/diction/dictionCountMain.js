/**
 * 词条统计主界面
 * @author : weilei
 */
define(function (require, exports, module) {

    //统计面板
    var dictionCountForm = require('./dictionCountForm');
    //图形面板
    var dictionCountChart = require('./dictionCountChart');

    /**
     * 初始化主面板
     */
    exports.init = function (funName) {

        var dictionCountMain = new Ext.Panel({
            id: 'dictionCountMain',
            title: funName,
            layout: 'border',
            closable: true,
            items: [dictionCountForm.init(), dictionCountChart.init()]
        });

        return dictionCountMain;
    };

    /**
     * 判断Tab面板是否存在
     */
    exports.isExistPanel = function (nodeId) {

        var object = Ext.getCmp('dictionCountMain');
        if (null == object || 'undefined' == object) {
            return null;
        }
        return object;
    }
});