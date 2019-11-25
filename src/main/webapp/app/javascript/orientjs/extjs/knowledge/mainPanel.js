/**
 * 知识管理框架入口
 * @author :weilei
 */
define(function(require,exports,module){

    //左面面板
    var leftPanel   = require('./leftPanel');
    //中心面板
    var centerPanel = require('./centerPanel');

    /**
     *  初始化主面板
     */
    exports.init = function(){
        var viewPort = new Ext.Viewport({
            id : 'knMainPanel',
            layout : 'border',
            renderTo: Ext.getBody(),
            items : [leftPanel.init(),centerPanel.init()]
        });
        return viewPort;
    };
});
