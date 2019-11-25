/**
 * 知识库管理通用事件
 * @author : weilei
 */
define(function (require, exports, module) {

    /**
     * 知识库保存
     * @param operationType ：操作类型（新增：add-category；编辑：edit-category）
     * @param basicForm     ：form
     * @param object        ：数据刷新对象
     * @param window        ：窗体对象
     * @param constant      :全局变量
     */
    exports.saveCategory = function (operationType, basicForm, object, window, constant) {

        var url = serviceName + '/categoryController/editCategory.rdm';
        var resultMsg = "";
        if ('edit-category' == operationType) {
            resultMsg = "编辑";
        } else {
            resultMsg = "新增";
        }

        basicForm.submit({
            clientValidation: true,
            url: url,
            method: 'post',
            params: {
                operationType: operationType,
                categoryModelName: constant.category.categoryModelName
            },
            success: function (form, action) {
                constant.messageBox(action.result.msg);
                if (null != window) {
                    window.close();
                }
                object.reload();
                if ('add-category' == operationType) {
                    //表单值重置，同时只显示新增按钮
                    basicForm.reset();
                    var formButtons = basicForm.buttons;
                    var index = 0;
                    formButtons.forEach(function () {
                        var formButton = formButtons[index];
                        exports.setAddButton(true, formButton);
                        exports.setSaveButton(false, formButton);
                        exports.setDeleteButton(false, formButton);
                        index++;
                    });
                }
            },
            failure: function (form, action) {
                constant.messageBox(resultMsg + '失败，请联系系统管理员！');
            }
        });
    };

    /**
     * 删除知识库
     * @param cateId ：删除节点Id
     * @param object ：数据刷新对象
     * @param constant     :全局变量
     */
    exports.deleteCategory = function (categoryId, object, constant) {

        var url = serviceName + '/categoryController/deleteCategory.rdm';
        var params = {
            categoryId: categoryId,
            categoryModelName: constant.category.categoryModelName
        };
        constant.deleteData(url, params, object);
    };


    /**
     * Id赋值
     * @param value
     * @param basicForm
     */
    exports.setCateId = function (value, basicForm) {

        var cateIdField = basicForm.findField('id');
        if (cateIdField != null && cateIdField != undefined) {
            cateIdField.setValue(value);
        }
    };

    /**
     * Id
     * @param value
     * @param basicForm
     */
    exports.getCateId = function (basicForm) {

        var cateIdField = basicForm.findField('id');
        var cateId = '';
        if (cateIdField != null && cateIdField != undefined) {
            cateId = cateIdField.getValue();
        }
        return cateId;
    };

    /**
     * PId
     * @param value :
        * @param basicForm
     */
    exports.setCatePId = function (value, basicForm) {

        var cateParentIdField = basicForm.findField('parentId');
        if (cateParentIdField != null && cateParentIdField != undefined) {
            cateParentIdField.setValue(value);
        }
    };

    /**
     * 名称
     * @param value
     * @param flag :
        *                true ：可以操作
     *             false ：不可以操作
     * @param basicForm
     */
    exports.setCateName = function (value, flag, basicForm) {

        var cateNameField = basicForm.findField('name');
        if (cateNameField != null && cateNameField != undefined) {
            cateNameField.setValue(value);
            if (flag) cateNameField.enable();
            else cateNameField.disable();
        }
    };

    /**
     * 关键字
     * @param value
     * @param flag :
        *                true ：可以操作
     *             false ：不可以操作
     * @param basicForm
     */
    exports.setCateKeyword = function (value, flag, basicForm) {

        var cateKeywordField = basicForm.findField('keyword');
        if (cateKeywordField != null && cateKeywordField != undefined) {
            cateKeywordField.setValue(value);
            if (flag) cateKeywordField.enable();
            else cateKeywordField.disable();
        }
    };

    /**
     * 描述
     * @param value
     * @param flag :
        *                true ：可以操作
     *             false ：不可以操作
     * @param basicForm
     */
    exports.setCateDescribe = function (value, flag, basicForm) {

        var cateDescribeField = basicForm.findField('describe');
        if (cateDescribeField != null && cateDescribeField != undefined) {
            cateDescribeField.setValue(value);
            if (flag) cateDescribeField.enable();
            else cateDescribeField.disable();
        }
    };

    /**
     * 新增按钮
     * @param flag :
        *                true ：可以操作
     *             false ：不可以操作
     * @param formButton
     */
    exports.setAddButton = function (flag, formButton) {

        if ("cateCreatorAdd" == formButton.name) {
            if (flag) formButton.enable();
            else formButton.disable();
        }
    };

    /**
     * 编辑按钮
     * @param flag :
        *                true ：可以操作
     *             false ：不可以操作
     * @param formButton
     */
    exports.setSaveButton = function (flag, formButton) {

        if ("cateCreatorSave" == formButton.name) {
            if (flag) formButton.enable();
            else formButton.disable();
        }
    };

    /**
     * 删除按钮
     * @param flag :
        *                true ：可以操作
     *             false ：不可以操作
     * @param formButton
     */
    exports.setDeleteButton = function (flag, formButton) {

        if ("cateCreatorDelete" == formButton.name) {
            if (flag) formButton.enable();
            else formButton.disable();
        }
    };

});