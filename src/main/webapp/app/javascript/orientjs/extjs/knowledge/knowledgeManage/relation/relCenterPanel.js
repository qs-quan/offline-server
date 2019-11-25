/**
 * 知识引用中心面板
 * @author : weilei
 */
define(function (require, exports, module) {

    var filePanel = require('../../fullText/fullTextMain');
    var dictionMain = require('../diction/dictionMain');

    exports.init = function () {

        var centerPanel = new Ext.TabPanel({
            tabWidth: 120,
            items: [filePanel.init('false'), dictionMain.init('ALL', 'false')]
        });
        return centerPanel;
    };

});