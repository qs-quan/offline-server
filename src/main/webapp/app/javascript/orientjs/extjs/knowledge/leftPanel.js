/**
 * 知识管理左面导航
 * @author : weilei
 */
define(function (require, exports, module) {

    //全文检索：左面面板
    var fullText = require('./fullText/leftPanel');
    //知识管理：左面面板
    var fileMngLeftPanel = require('./knowledgeManage/leftPanel');
    //知识库管理：左面面板
    var categoryMngLeftPanel = require('./knowledgeBaseManage/leftPanel');
    //知识统计：左面面板
    var fileCountLeftPanel = require('./knowledgeCount/leftPanel');

    /**
     * 初始化左面面板
     */
    exports.init = function () {

        var leftPanel = new Ext.Panel({
            id: 'knLeftPanel',
            region: 'west',
            layout: 'accordion',
            split: true,
            width: 250,
            collapsible: true,
            layoutConfig: {animate: true},
            items: []
        });
        leftPanel.on('afterrender', function (obj) {
            exports.onLoadItems(obj);
        });
        return leftPanel;
    };

    /**
     * 动态加载功能点
     * @param obj：
     */
    exports.onLoadItems = function (obj) {
        var objectParams = [
            {objectEvent: fullText, objectIcon: 'naviFullText', title: '全文检索'},
            {objectEvent: fileMngLeftPanel, objectIcon: 'naviFile', title: '知识管理'},
            {objectEvent: categoryMngLeftPanel, objectIcon: 'naviCategory', title: '知识库管理'},
            {objectEvent: fileCountLeftPanel, objectIcon: 'naviFileCount', title: '知识统计'}
        ];
        Ext.each(objectParams, function (objectParam) {
            obj.add({
                title: objectParam.title,
                iconCls: objectParam.objectIcon,
                collapsed: true,
                items: [objectParam.objectEvent.init()]
            });
        });
        obj.doLayout();
    };
});