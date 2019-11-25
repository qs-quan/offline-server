/**
 * 知识引用窗体
 * @author : weilei
 */
define(function (require, exports, module) {

    var relCenterPanel = require('./relCenterPanel');

    exports.init = function (callback) {

        var window = new Ext.Window({
            modal: true,
            title: '关联知识',
            width: Ext.getBody().getViewSize().width * 0.8,
            height: Ext.getBody().getViewSize().height * 0.8,
            layout: 'fit',
            items: [relCenterPanel.init()]
        });

        window.show();
        window.on('close', function () {
            var resultValue = exports.getSelectionValues();
            callback.call(this, resultValue)
        });

    };

    /**
     * 回调函数返回值
     */
    exports.getSelectionValues = function () {

        var map = new Map();
        var dictionPanel = Ext.getCmp('dicGridPanel');
        var filePanel = Ext.getCmp('fullTextPanel');
        var operation = '';
        var dataId = '';
        if (filePanel != null && filePanel != undefined) {
            operation = 'searchFile';
            var selections = filePanel.getSelectionModel().getSelections();
            for (var i = 0; i < selections.length; i++) {
                dataId += selections[i].data.id + ',';
            }
            if (dataId.length > 0) {
                dataId = dataId.substring(0, dataId.length - 1);
            }
            map.put(operation, dataId);
        }

        operation = '';
        dataId = '';
        if (dictionPanel != null && dictionPanel != undefined) {
            operation = 'searchDiction';
            var selections = dictionPanel.getSelectionModel().getSelections();
            for (var i = 0; i < selections.length; i++) {
                dataId += selections[i].data.dictionId + ',';
            }
            if (dataId.length > 0) {
                dataId = dataId.substring(0, dataId.length - 1);
            }
            map.put(operation, dataId);
        }
        return map;
    };

});