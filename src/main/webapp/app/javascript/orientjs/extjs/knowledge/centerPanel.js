/**
 * 知识管理内容面板
 * @author : weilei
 */
define(function (require, exports, module) {

    /**
     * 初始化中心面板
     */
    exports.init = function () {

        var centerPanel = new Ext.TabPanel({
            id: 'knCenterPanel',
            region: 'center',
            tabWidth: 120,
            plugins: new Ext.ux.TabCloseMenu(),
            defaults: {autoScroll: true},
            minTabWidth: 80,
            enableTabScroll: true,
            items: []
        });
        return centerPanel;
    };

    /**
     * 加载功能点
     * @param funId   :功能点Id
     * @param funName :功能点名称
     * @param funUrl  :功能点Url
     */
    exports.loadFunction = function (funId, funName, funUrl) {

        var centerPanel = Ext.getCmp('knCenterPanel');
        if (centerPanel != null && centerPanel != undefined) {
            switch (funId) {

                //全文检索
                case 'fullText': {
                    var jsModule = require('./fullText/fullTextMain');
                    exports.loadPanel(jsModule, centerPanel, 'true');
                    break;
                }
                //知识库维护
                case 'knowledgeBaseMaintain': {
                    var jsModule = require('./knowledgeBaseManage/knowledgeBase/knowledgeBaseGrid');
                    exports.loadPanel(jsModule, centerPanel, '');
                    break;
                }
                //目录树编制
                case 'directoryTreeFormation': {
                    var jsModule = require('./knowledgeBaseManage/directoryTree/directoryTreeMain');
                    exports.loadPanel(jsModule, centerPanel, '');
                    break;
                }
                //知识管理
                case 'fileManger': {
                    var jsModule = require('./knowledgeManage/centerPanel');
                    exports.loadPanel(jsModule, centerPanel, funName);
                    break;
                }
                //词条统计
                case 'dictionCount': {
                    var jsModule = require('./knowledgeCount/diction/dictionCountMain');
                    exports.loadPanel(jsModule, centerPanel, funName);
                    break;
                }
                //文档统计
                case 'fileCount': {
                    var jsModule = require('./knowledgeCount/file/fileCountMain');
                    exports.loadPanel(jsModule, centerPanel, funName);
                    break;
                }
            }
        }
    };

    /**
     * 加载HTML
     * @param centerPanel :中心面板
     * @param funId       :功能点Id
     * @param funName     :功能点名称
     * @param funUrl      :功能点Url
     */
    exports.loadHTML = function (centerPanel, funId, funName, funUrl) {

        var tabId = funId ? funId : "";
        var iFramePanel = new Ext.ux.ManagedIframePanel({
            id: 'center_tab_' + tabId,
            title: funName,
            tabTip: funName,
            layout: 'fit',
            margins: '0 5 5 0',
            closable: true,
            defaultSrc: 'about:blank'
        });
        iFramePanel.enable();
        iFramePanel.setSrc(funUrl);
        centerPanel.add(iFramePanel).show();
    };

    /**
     * 加载Tab面板
     * @param jsModule    :js对象
     * @param centerPanel :中心面板
     * @param nodeId      :节点Id(知识管理使用)
     */
    exports.loadPanel = function (jsModule, centerPanel, nodeId) {

        var curPanel = jsModule.isExistPanel(nodeId);
        if (null == curPanel) {
            curPanel = jsModule.init(nodeId);
            centerPanel.add(curPanel).show();
        } else {
            curPanel.show();
        }
    };
});