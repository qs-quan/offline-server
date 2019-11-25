/**
 * 评论事件
 * @author : weilei
 */
define(function (require, exports, module) {

    /**
     * 知识库保存
     * @param basicForm     ：form
     * @param constant      : 全局常量
     * @param dictionId     ：词条Id
     * @param window        : 评论Wnd
     */
    exports.saveComment = function (basicForm, constant, dictionId, window) {

        var url = serviceName + '/commentController/editComment.rdm';
        basicForm.submit({
            clientValidation: true,
            url: url,
            method: 'post',
            params: {
                commentModelName: constant.comment.commentModelName
            },
            success: function (form, action) {
                constant.messageBox(action.result.msg);
                window.close();
            },
            failure: function (form, action) {
                constant.messageBox('评论失败，请联系系统管理员！');
            }
        });
    };

    /**
     * 删除评论
     * @param selections   :选择词条节点集合
     * @param store        :刷新数据集
     * @param constant     :全局常量
     */
    exports.deleteComment = function (selections, store, constant) {

        var commentId = '';
        for (var i = 0; i < selections.length; i++) {
            commentId += selections[i].data.commentId + ',';
        }
        if (commentId.length > 0) {
            commentId = commentId.substring(0, commentId.length - 1);
        }
        var url = serviceName + '/commentController/deleteComment.rdm';
        var params = {
            commentId: commentId,
            commentModelName: constant.comment.commentModelName
        };
        constant.deleteData(url, params, store);
    };

});