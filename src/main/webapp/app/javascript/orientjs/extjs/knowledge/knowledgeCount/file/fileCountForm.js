/**
 * 词条统计面板
 * @author : weilei
 */
define(function (require, exports, module) {

    //知识管理对象
    var constant = require('../../util/constant');
    //词条统计对象
    var fileCountEvent = require('./fileCountEvent');
    //知识统计对象
    var countItem = require('../countItem');

    exports.init = function () {

        var countPanel = new Ext.form.FormPanel({
            id: 'fileCountForm',
            region: 'north',
            layout: 'column',
            border: false,
            height: 40,
            frame: true,
            labelWidth: 70,
            items: [
                {
                    layout: 'form',
                    width: 70,
                    border: false,
                    items: [countItem.createCountLabel()]
                },
                {
                    layout: 'form',
                    width: 180,
                    border: false,
                    items: [countItem.createStartDate()]
                },
                {
                    layout: 'form',
                    width: 180,
                    border: false,
                    items: [countItem.createEndDateLabel()]
                },
                {
                    layout: 'form',
                    width: 120,
                    border: false,
                    items: [countItem.createCountNum()]
                },
                {
                    layout: 'form',
                    width: 230,
                    border: false,
                    items: [countItem.createFileCountType()]
                },
                {
                    layout: 'form',
                    width: 180,
                    border: false,
                    items: [countItem.createCountView()]
                },
                {
                    layout: 'form',
                    width: 60,
                    border: false,
                    items: [countItem.createCountButton('fileCountForm', fileCountEvent, constant)]
                }, {
                    layout: 'form',
                    width: 60,
                    border: false,
                    items: [countItem.createResetButton('fileCountForm')]
                }
            ]
        });

        return countPanel;
    };

});