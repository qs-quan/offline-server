/**
 * 目录树编制主界面
 * @author : weilei
 */
define(function (require, exports, module) {

    //目录：tree
    var directoryTreeTree = require('./directoryTreeTree');
    //目录：form
    var directoryTreeForm = require('./directoryTreeForm');

    /**
     * 初始化主面板
     */
    exports.init = function (nodeId) {

        var categoryCreatorPanel = new Ext.Panel({
            id: 'categoryCreatorPanel',
            title: '目录树编制',
            layout: 'border',
            layout: 'fit',
            closable: true,
            items: [
                {
                    layout: 'border',
                    items: [directoryTreeTree.init(), directoryTreeForm.init()]
                }
            ]
        });

        return categoryCreatorPanel;
    };

    /**
     * 判断Tab面板是否存在
     */
    exports.isExistPanel = function (nodeId) {

        var object = Ext.getCmp('categoryCreatorPanel');
        if (null == object || undefined == object) {
            return null;
        }
        return object;
    }
});