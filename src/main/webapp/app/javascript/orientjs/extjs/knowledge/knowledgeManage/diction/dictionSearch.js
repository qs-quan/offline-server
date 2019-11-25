/**
 * 词条检索面板
 * @author : weilei
 */
define(function (require, exports, module) {

    //词条事件
    var dictionEvent = require('./dictionEvent');
    //词条Item
    var dictionItem = require('./dictionItem');

    exports.init = function (nodeId, constant, isShow) {

        Ext.QuickTips.init();

        //设置检索面板居中[IE]
        var width = document.body.clientWidth;
        var keywordWidth = '';
        var highWidth = '';
        var margin = '5px';
        if ('false' == isShow) {
            width = document.body.clientWidth * 0.7;
        }
        if (navigator.userAgent.indexOf("MSIE") > 0) {
            keywordWidth = 'marginLeft:' + (width - 620 - 250) / 2 + 'px;';
            highWidth = 'marginLeft:' + (width - 800 - 250) / 2 + 'px;';
            margin = '10px';
            if ('false' == isShow) {
                keywordWidth = 'marginLeft:' + (width - 620) / 2 + 'px;';
                highWidth = 'marginLeft:' + (width - 800) / 2 + 'px;';
                margin = '10px';
            }
        }

        //关键字查询FS
        var keywordSearch = new Ext.form.FieldSet({
            border: false,
            layout: 'column',
            width: 620,
            style: 'margin: ' + margin + ' auto;' + keywordWidth,
            autoHeight: true,
            items: [dictionItem.createDictionKeyword(), dictionItem.createDictionSearchButton()]
        });

        //高级查询FS
        var highSearch = new Ext.form.FieldSet({
            title: '高级查询',
            width: 800,
            collapsible: true,
            autoHeight: true,
            collapsed: true,
            style: 'margin: ' + margin + ' auto;' + highWidth,
            items: [dictionEvent.noHasRomoveButtonPanel(dictionItem)]
        });
        highSearch.on('expand', function () {
            Ext.getCmp('dictionMain').doLayout();
        });
        highSearch.on('collapse', function () {
            Ext.getCmp('dictionMain').doLayout();
        });

        var searchPanel = new Ext.form.FormPanel({
            region: 'north',
            split: true,
            border: false,
            autoHeight: true,
            items: [keywordSearch, highSearch]
        });

        //浏览器大小事件
        Ext.EventManager.onWindowResize(function (width, height) {
            constant.resetStyle(width, keywordSearch);
        });

        //初始化相关对象
        dictionItem.initObj(dictionEvent, dictionItem, highSearch, constant, nodeId);

        return searchPanel;
    };


});