/**
 * 全文检索面板
 * @author : weilei
 */
define(function (require, exports, module) {

    //全文检索事件
    var fullTextEvent = require('./fullTextEvent');
    //全文检索Item
    var fullTextItem = require('./fullTextItem');

    exports.init = function (constant, isShow) {

        Ext.QuickTips.init();

        //设置检索面板居中[IE]
        var width = document.body.clientWidth;
        var isCollapsed = true;
        if ('false' == isShow) {
            isCollapsed = false;
            width = document.body.clientWidth * 0.7;
        }
        var keywordWidth = '';
        var highWidth = '';
        var margin = '5px';
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
            items: [fullTextItem.createFileKeyword(), fullTextItem.createFileSearchButton()]
        });

        //高级查询FS
        var highSearch = new Ext.form.FieldSet({
            title: '高级查询',
            width: 800,
            collapsible: true,
            autoHeight: true,
            collapsed: true,
            style: 'margin: ' + margin + ' auto;' + highWidth,
            items: [fullTextEvent.noHasRomoveButtonPanel(fullTextItem)]
        });

        highSearch.on('expand', function () {
            Ext.getCmp('fullTextMain').doLayout();
        });
        highSearch.on('collapse', function () {
            Ext.getCmp('fullTextMain').doLayout();
        });

        var fullTextForm = new Ext.form.FormPanel({
            id: 'fullTextForm',
            region: 'north',
            split: true,
            border: false,
            collapsible: isCollapsed,
            autoHeight: true,
            items: [keywordSearch, highSearch],
            listeners: {
                'render': function () {
                    this.findByType('textfield')[0].focus(true, true);
                }
            }
        });
        if ('false' != isShow) {
            fullTextForm.setTitle('检索条件');
        }
        //浏览器大小事件
        Ext.EventManager.onWindowResize(function (width, height) {
            constant.resetStyle(width, highSearch);
        });

        //初始化相关对象
        fullTextItem.initObj(fullTextEvent, fullTextItem, highSearch, constant);

        return fullTextForm;
    };


});