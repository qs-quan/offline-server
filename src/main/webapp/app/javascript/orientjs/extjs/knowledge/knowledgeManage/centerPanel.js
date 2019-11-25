/**
 * 知识管理中心面板
 * @author : weilei
 */
define(function (require, exports, module) {

    //文件列表
    var fileGrid = require('./file/fileGrid');
    //词条列表
    var dictionGrid = require('./diction/dictionGrid');
    //词条主界面
    var dictionMain = require('./diction/dictionMain');
    //词条Item
    var dictionItem = require('./diction/dictionItem');

    exports.init = function (nodeId) {

        var centerPanel = new Ext.Panel({
            id: 'fileManagerPanel',
            title: '知识管理',
            layout: 'fit',
            closable: true,
            items: [
                {
                    xtype: "tabpanel",
                    activeTab: 0,
                    items: [fileGrid.init(nodeId), dictionMain.init(nodeId)]
                }
                // {
                //     layout: 'border',
                //     items: [fileGrid.init(nodeId), dictionMain.init(nodeId)]
                // }
            ]
        });

        return centerPanel;
    };

    /**
     * 判断Tab面板是否存在
     */
    exports.isExistPanel = function (nodeId) {

        var object = Ext.getCmp('fileManagerPanel');
        if (object == null || object == undefined) {
            return null;
        } else {
            fileGrid.reloadData(nodeId);
            dictionGrid.reloadData(nodeId);
            dictionItem.reloadData(nodeId);
            return object;
        }
    };
});