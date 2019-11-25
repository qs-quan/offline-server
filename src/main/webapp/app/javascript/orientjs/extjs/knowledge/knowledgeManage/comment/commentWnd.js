define(function (require, exports, module) {

    //评论表单
    var commentForm = require('./commentForm');

    exports.init = function (dictionId) {

        var window = new Ext.Window({
            title: '评论',
            layout: 'fit',
            width: 650,
            height: 360,
            items: []
        });
        window.add(commentForm.init(dictionId, window));
        window.show();
    };
});