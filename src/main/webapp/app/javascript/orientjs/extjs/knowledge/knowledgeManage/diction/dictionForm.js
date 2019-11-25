/**
 * 词条表单
 * @author : weilei
 */
define(function (require, exports, module) {

    //保存当前Form
    var curFormPanel;

    /**
     * 词条新增、编辑界面
     * @param operationType                  : 词条操作类型（新增/编辑）
     * @param title                          : 窗体标题
     * @param record                         : 当前选中记录
     * @param store                          : 数据集
     * @param nodeId                         : 目录Id
     * @param dictionEvent                   : 词条操作事件
     * @param constant                       : 全局常量
     */
    exports.init = function (operationType, title, record, store, nodeId, dictionEvent, constant) {

        Ext.QuickTips.init();

        var dictionId = new Ext.form.Hidden({
            name: 'id'
        });

        //问题文本框
        var dictionName = new Ext.form.TextField({
            name: 'name',
            width: '95%',
            fieldLabel: '问题',
            allowBlank: false
        });

        //答案文本域
        var dictionSolution = new Ext.form.HtmlEditor({
            name: 'solution',
            width: '95%',
            height: 290,
            fieldLabel: '答案'
        });

        //答案原始数据值
        var dictionOriginalSolution = new Ext.form.Hidden({
            name: 'originalSolution'
        });

        //保存按钮
        var saveButton = new Ext.Button({
            text: '保存',
            iconCls: 'cateFormSave',
            handler: function () {
                if ('add-diction' == operationType) {
                    if (curFormPanel != null && curFormPanel != 'undefined') {
                        var basicForm = curFormPanel.getForm();
                        var dictionIdField = basicForm.findField('id');
                        if (dictionIdField != null && dictionIdField != 'undefined') {
                            dictionIdField.setValue(nodeId);
                        }
                    }
                }

                if (curFormPanel != null && curFormPanel != 'undefined') {
                    var basicForm = curFormPanel.getForm();
                    if (!basicForm.isValid()) {
                        constant.messageBox('词条不能为空！');
                        return;
                    }
                    dictionOriginalSolution.setValue(dictionSolution.getRawValue());
                    dictionEvent.saveDiction(operationType, basicForm, store, window, constant);
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
            items: [dictionId, dictionName, dictionSolution, dictionOriginalSolution],
            defaults: {anchor: '100%'},
            labelWidth: 50,
            buttonAlign: 'center'
        });
        if ('detail-diction' == operationType) {
            dictionName.setReadOnly(true);
            dictionSolution.setReadOnly(true);
            formPanel.addButton(closeButton);
        } else {
            formPanel.addButton(saveButton);
            formPanel.addButton(closeButton);
        }
        curFormPanel = formPanel;

        formPanel.on('afterrender', function () {

            if ('add-diction' != operationType) {
                if (curFormPanel != null && curFormPanel != undefined) {

                    var basicForm = curFormPanel.getForm();
                    var dictionIdField = basicForm.findField('id');
                    var dictionNameField = basicForm.findField('name');
                    var dictionSolutionField = basicForm.findField('solution');

                    if (dictionIdField != null && dictionIdField != undefined) {
                        dictionIdField.setValue(record.data.dictionId);
                    }
                    if (dictionNameField != null && dictionNameField != undefined) {
                        dictionNameField.setValue(record.data.dictionName);
                    }
                    if (dictionSolutionField != null && dictionSolutionField != undefined) {
                        dictionSolutionField.setValue(record.data.dictionSolution);
                    }
                }
            }
        });

        var window = new Ext.Window({
            title: title,
            layout: 'fit',
            width: 635,
            height: 400,
            frame: true,
            items: [formPanel]
        });
        window.show();
    };
});