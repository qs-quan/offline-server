/**
 *  知识库维护事件
 * @author : weilei
 */
define(function (require, exports, module) {

    /**
     * 删除知识库
     * @param selections   :选择类别节点集合
     * @param store        :刷新数据集
     * @param commomEvent  :通用事件对象
     * @param constant     :全局变量
     */
    exports.deleteCategory = function (selections, store, commomEvent, constant) {

        var cateId = '';
        for (var i = 0; i < selections.length; i++) {
            cateId += selections[i].data.categoryId + ',';
        }
        if (cateId.length > 0) {
            cateId = cateId.substring(0, cateId.length - 1);
        }
        commomEvent.deleteCategory(cateId, store, constant);
    };
});