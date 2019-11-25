/**
 * 评论
 * @author : weilei
 */
define(function (require, exports, module) {

    //保存当前Form
    var curFormPanel;
    //知识管理：全局变量
    var constant = require('../../util/constant');
    //评论事件
    var commentEvent = require('./commentEvent');

    /**
     * 词条新增、编辑界面
     * @param dictionId                      : 词条Id
     * @param window                         : Window
     */
    exports.init = function (dictionId, window) {

        Ext.QuickTips.init();

        var commentId = new Ext.form.Hidden({
            name: 'id'
        });

        //标题文本框
        var commentTheme = new Ext.form.TextField({
            name: 'theme',
            width: '95%',
            fieldLabel: '标题',
            allowBlank: false
        });

        //分类
        var commentClassiFicationId = new Ext.form.TextField({
            name: 'classificationid',
            width: '95%',
            fieldLabel: '分类'
        });

        var commentScoreHidden = new Ext.form.Hidden({
            name: 'score'
        });

        //分数
        var commentScore = new Ext.form.Label({
            name: 'commentScore',
            width: '95%',
            fieldLabel: '分数'
        });
        commentScore.on('afterrender', function () {
            commentScore.getEl().appendChild(exports.initImage());
        });

        //内容
        var commentContent = new Ext.form.HtmlEditor({
            name: 'content',
            width: '95%',
            fieldLabel: '内容',
            height: 200
        });

        //保存按钮
        var saveButton = new Ext.Button({
            text: '保存',
            iconCls: 'cateFormSave',
            handler: function () {
                if (curFormPanel != null && curFormPanel != undefined) {
                    var basicForm = curFormPanel.getForm();
                    basicForm.findField('id').setValue(dictionId);
                    basicForm.findField('score').setValue(commentScoreValue);
                    if (!basicForm.isValid()) {
                        constant.messageBox('标题不能为空！');
                        return;
                    }
                    commentEvent.saveComment(basicForm, constant, dictionId, window);
                }
            }
        });

        //关闭按钮
        var closeButton = new Ext.Button({
            text: '关闭',
            iconCls: 'cateFormClose',
            handler: function () {
                window.close();
            }
        });

        var formPanel = new Ext.form.FormPanel({
            frame: true,
            items: [commentId, commentTheme, commentClassiFicationId, commentScoreHidden, commentScore, commentContent],
            defaults: {anchor: '100%'},
            buttons: [saveButton, closeButton],
            labelWidth: 50,
            buttonAlign: 'center'
        });
        curFormPanel = formPanel;

        return formPanel;
    };

    /**
     * 加载图片
     */
    exports.initImage = function () {

        var imageDiv = document.getElementById('imageDiv');
        if (imageDiv == null || imageDiv == undefined) {
            imageDiv = document.createElement('div');
            imageDiv.id = 'imageDiv';
        }
        for (var i = 0; i < 5; i++) {
            imageDiv.innerHTML += '<img id="image_' + i + '" style="cursor: pointer;" width="16px" height="16px" alt="" src ="'
                + serviceName + '/app/images/knowledge/score-show.png" onclick="javascript:clickImage(this.id)" />';
        }
        return imageDiv;
    };

    /**
     * 图片事件
     */
    clickImage = function (id) {

        var index = parseInt(id.split('_')[1]);
        for (var i = 0; i <= index; i++) {
            var imgObj = document.getElementById('image_' + i);
            imgObj.src = serviceName + '/app/images/knowledge/score-show.png';
        }
        index = parseInt(id.split('_')[1]) + 1;
        commentScoreValue = index;
        for (var i = index; i < 5; i++) {
            var imgObj = document.getElementById('image_' + i);
            imgObj.src = serviceName + '/app/images/knowledge/score-hide.png';
        }
    };

});