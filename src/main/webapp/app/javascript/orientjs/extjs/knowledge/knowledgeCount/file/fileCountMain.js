/**
 * 文档统计主界面
 * @author : weilei
 */
define(function (require, exports, module) {

    //统计面板
    var fileCountForm = require('./fileCountForm');
    //图形面板
    var fileCountChart = require('./fileCountChart');

    /**
     * 初始化主面板
     */
    exports.init = function (funName) {

        var fileCountMain = new Ext.Panel({
            id: 'fileCountMain',
            title: funName,
            layout: 'border',
            closable: true,
            items: [fileCountForm.init(), fileCountChart.init()]
        });

        return fileCountMain;
    };

    /**
     * 判断Tab面板是否存在
     */
    exports.isExistPanel = function (nodeId) {

        var object = Ext.getCmp('fileCountMain');
        if (null == object || 'undefined' == object) {
            return null;
        }
        return object;
    }
});