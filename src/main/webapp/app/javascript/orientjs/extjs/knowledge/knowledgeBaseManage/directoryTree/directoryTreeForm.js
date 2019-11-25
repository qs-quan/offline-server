/**
 * 目录树表单
 * @author : weilei
 */
define(function (require, exports, module) {

    //根节点
    var rootNode;
    //保存当前Form
    var curFormPanel;
    //操作类型
    var operationType = "edit-category";
    //知识管理：全局变量
    var constant = require('../../util/constant');
    //通用方法
    var commomEvent = require('../commonEvent');

    exports.init = function () {

        var cateId = new Ext.form.Hidden({
            name: 'id'
        });

        var cateParentId = new Ext.form.Hidden({
            name: 'parentId'
        });

        //名称文本框
        var cateName = new Ext.form.TextField({
            name: 'name',
            width: '95%',
            disabled: true,
            fieldLabel: '名称',
            allowBlank: false
        });

        //关键字文本框
        var cateKeyword = new Ext.form.TextField({
            name: 'keyword',
            width: '95%',
            disabled: true,
            fieldLabel: '关键字'
        });

        //描述文本域
        var cateDescribe = new Ext.form.TextArea({
            name: 'describe',
            width: '95%',
            height: 145,
            disabled: true,
            fieldLabel: '描述'
        });

        //新增按钮
        var addButton = new Ext.Button({
            text: '新增',
            name: 'cateCreatorAdd',
            iconCls: 'cateCreatorAdd',
            disabled: true,
            handler: function () {

                if (null != curFormPanel && undefined != curFormPanel) {
                    var basicForm = curFormPanel.getForm();
                    var cateId = commomEvent.getCateId(basicForm);
                    if ('-1' == cateId) {
                        constant.messageBox('请先选择一个知识库！');
                        return;
                    }
                    commomEvent.setCateName('', true, basicForm);
                    commomEvent.setCateKeyword('', true, basicForm);
                    commomEvent.setCateDescribe('', true, basicForm);

                    var formButtons = basicForm.buttons;
                    var index = 0;
                    formButtons.forEach(function () {
                        var formButton = formButtons[index];
                        commomEvent.setAddButton(false, formButton);
                        commomEvent.setSaveButton(true, formButton);
                        commomEvent.setDeleteButton(false, formButton);
                        index++;
                    });
                    operationType = "add-category";
                }
            }
        });

        //保存按钮
        var saveButton = new Ext.Button({
            text: '保存',
            name: 'cateCreatorSave',
            iconCls: 'cateFormSave',
            disabled: true,
            handler: function () {

                if (null != curFormPanel && undefined != curFormPanel) {
                    var basicForm = curFormPanel.getForm();
                    if (!basicForm.isValid()) {
                        constant.messageBox('节点名称不能为空！');
                        return;
                    }
                    commomEvent.saveCategory(operationType, basicForm, rootNode, null, constant);
                    operationType = "edit-category";
                }
            }
        });

        //关闭按钮
        var deleteButton = new Ext.Button({
            text: '删除',
            name: 'cateCreatorDelete',
            iconCls: 'cateCreatorDelete',
            disabled: true,
            handler: function () {

                if (null != curFormPanel && undefined != curFormPanel) {
                    var basicForm = curFormPanel.getForm();
                    var cateId = commomEvent.getCateId(basicForm);
                    commomEvent.deleteCategory(cateId, rootNode, constant);
                    basicForm.reset();
                    addButton.disable();
                    saveButton.disable();
                    deleteButton.disable();
                }
            }
        });

        //知识库面板
        var formPanel = new Ext.form.FormPanel({
            frame: true,
            items: [cateId, cateParentId, cateName, cateKeyword, cateDescribe],
            buttons: [addButton, saveButton, deleteButton],
            defaults: {anchor: '100%'},
            labelWidth: 55,
            buttonAlign: 'right'
        });

        /*根据用户角色权限，控制其操作权限（新增、编辑、删除、下载）*/
        formPanel.on('afterrender', function () {
            if (!constant.isHasOperation('数据录入')) addButton.hide();
            if (!constant.isHasOperation('数据修改')) saveButton.hide();
            if (!constant.isHasOperation('数据删除')) deleteButton.hide();
        });
        curFormPanel = formPanel;

        //主面板
        var centerPanel = new Ext.Panel({
            title: '节点管理',
            split: true,
            region: 'center',
            layout: 'fit',
            items: [formPanel]
        });

        return centerPanel;
    };

    /**
     * 表单项赋值
     * @param curNode :当前选择节点
     * @param rootnode:根节点
     */
    exports.loadData = function (curNode, rootnode) {

        rootNode = rootnode;
        if (null != curFormPanel && undefined != curFormPanel) {
            var basicForm = curFormPanel.getForm();

            commomEvent.setCateId(curNode.attributes.id, basicForm);
            commomEvent.setCatePId(curNode.attributes.parentId, basicForm);
            var flag = false;
            if ("0" != curNode.attributes.parentId) flag = true;
            commomEvent.setCateName(curNode.attributes.text, flag, basicForm);
            commomEvent.setCateKeyword(curNode.attributes.keyword, flag, basicForm);
            commomEvent.setCateDescribe(curNode.attributes.descibe, flag, basicForm);

            var formButtons = basicForm.buttons;
            var index = 0;
            formButtons.forEach(function () {
                var formButton = formButtons[index];
                commomEvent.setAddButton(true, formButton);
                commomEvent.setSaveButton(flag, formButton);
                commomEvent.setDeleteButton(flag, formButton);
                index++;
            });
        }
    }
});