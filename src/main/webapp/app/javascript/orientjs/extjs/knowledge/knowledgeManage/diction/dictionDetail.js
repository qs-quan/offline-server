/**
 * 词条详细主面板
 * @author : weilei
 */
define(function (require, exports, module) {

    //评论列表
    var commentGrid = require('../comment/commentGrid');
    var constant;

    exports.init = function (id, name, solution, constant) {

        //问题文本框
        var dictionName = new Ext.form.TextField({
            value: name,
            readOnly: true,
            fieldLabel: '问题',
            listeners: {
                'focus': function (obj) {
                    obj.blur();
                }
            }
        });

        //答案文本域
        var dictionSolution = new Ext.form.HtmlEditor({
            value: solution,
            height: 150,
            readOnly: true,
            fieldLabel: '答案',
            listeners: {
                'focus': function (obj) {
                    obj.blur();
                }
            }
        });

        //评论列表
//		var commentGridPanel = commentGrid.init(id, constant);
        var commentGridPanel = commentGrid.getCommentGridPanel();
        if (commentGridPanel != null && commentGridPanel != undefined) commentGrid.reloadData(id);
        else commentGridPanel = commentGrid.init(id, constant);

        //formPanel
        var detailPanel = new Ext.form.FormPanel({
            frame: true,
            items: [dictionName, dictionSolution],
            region: 'north',
            defaults: {anchor: '99%'},
            autoHeight: true,
            labelWidth: 50
        });

        //window
        var window = new Ext.Window({
            title: '详细',
            layout: 'border',
            width: 900,
            height: 450,
            items: [detailPanel, commentGridPanel]
        });
        window.show();

    };

});