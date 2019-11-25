/**
 * 知识库维护界面
 * @author : weilei
 */
define(function (require, exports, module) {

    //保存当前Form
    var curFormPanel;
    //知识库名称是否存在
    var isExistName = false;

    /**
     * 知识库新增、编辑界面
     * @param operationType                  : 知识库操作类型（新增/编辑）
     * @param title                          : 窗体标题
     * @param record                         : 当前选中记录
     * @param store                          : 数据集
     * @param categoryProtectorEvent         : 知识库维护事件对象
     * @param constant                       : 全局事件对象
     * @param commomEvent                    : 通用事件对象
     */
    exports.initForm = function (operationType, title, record, store, categoryProtectorEvent, constant, commomEvent) {

        var cateId = new Ext.form.Hidden({
            name: 'id'
        });

        //名称文本框
        var cateName = new Ext.form.TextField({
            name: 'name',
            width: '95%',
            fieldLabel: '名称',
            allowBlank: false,
            listeners: {
                change: function () {

                    if (curFormPanel != null && curFormPanel != undefined) {
                        var basicForm = curFormPanel.getForm();
                        basicForm.submit({
                            clientValidation: true,
                            url: serviceName + '/categoryController/checkCategoryByName.rdm',
                            method: 'post',
                            params: {
                                categoryModelName: constant.category.categoryModelName
                            },
                            success: function (form, action) {
                                if (action.result.success) {
                                    constant.messageBox(action.result.msg);
                                    isExistName = true;
                                }
                            },
                            failure: function (form, action) {
                                isExistName = false;
                            }
                        });
                    }
                }
            }

        });

        //关键字文本框
        var cateKeyword = new Ext.form.TextField({
            name: 'keyword',
            width: '95%',
            fieldLabel: '关键字'
        });

        //描述文本域
        var cateDescribe = new Ext.form.TextArea({
            name: 'describe',
            width: '95%',
            height: 145,
            fieldLabel: '描述'
        });

        //保存按钮
        var saveButton = new Ext.Button({
            text: '保存',
            iconCls: 'cateFormSave',
            handler: function () {

                if ('add-category' == operationType) {
                    if (curFormPanel != null && curFormPanel != undefined) {
                        var basicForm = curFormPanel.getForm();
                        commomEvent.setCateId(constant.constant.categoryParentId, basicForm);
                    }
                }

                if (curFormPanel != null && curFormPanel != undefined) {
                    var basicForm = curFormPanel.getForm();
                    if (!basicForm.isValid()) {
                        constant.messageBox('知识库名称不能为空！');
                        return;
                    }
                    if (isExistName) {
                        constant.messageBox('知识库名称已经存在，请重新输入！');
                        return;
                    }
                    commomEvent.saveCategory(operationType, basicForm, store, window, constant);
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

        //知识库面板
        var formPanel = new Ext.form.FormPanel({
            frame: true,
            items: [cateId, cateName, cateKeyword, cateDescribe],
            buttons: [saveButton, closeButton],
            defaults: {anchor: '100%'},
            labelWidth: 55,
            buttonAlign: 'center'
        });
        curFormPanel = formPanel;

        //知识库表单渲染前进行数据初始化
        formPanel.on('afterrender', function () {

            if ('edit-category' == operationType) {
                if (curFormPanel != null && curFormPanel != undefined) {
                    var basicForm = curFormPanel.getForm();

                    commomEvent.setCateId(record.data.categoryId, basicForm);
                    commomEvent.setCateName(record.data.categoryName, true, basicForm);
                    commomEvent.setCateKeyword(record.data.categoryKeyWord, true, basicForm);
                    commomEvent.setCateDescribe(record.data.categoryDescribe, true, basicForm);
                }
            }
        });

        //显示窗体
        var window = new Ext.Window({
            title: title,
            layout: 'fit',
            width: 550,
            height: 285,
            items: [formPanel]
        });

        window.show();
    };
});