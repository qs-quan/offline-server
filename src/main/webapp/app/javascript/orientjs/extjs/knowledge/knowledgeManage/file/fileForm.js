/**
 * 文档表单
 * @author : weilei
 */
define(function (require, exports, module) {

    var curFormPanel;

    exports.init = function (operationType, title, record, store, nodeId, constant, fileEvent) {

        Ext.QuickTips.init();

        var fileId = new Ext.form.Hidden({
            name: 'id'
        });
        var fileCateId = new Ext.form.Hidden({
            name: 'categoryId'
        });

        //名称
        var fileName = new Ext.form.TextField({
            width: '95%',
            name: 'name',
            fieldLabel: '名称',
            allowBlank: false
        });

        //文档
        var fileUpload = new Ext.ux.form.FileUploadField({
            id: 'file',
            name: 'file',
            width: '95%',
            emptyText: '请选择.',
            buttonCfg: {iconCls: 'upload-icon'},
            buttonText: '',
            fieldLabel: '文档',
            validator: function (value) {
                if (value.length == 0) {
                    this.invalidTex = '请选择.';
                    return false;
                } else {
                    return true;
                }
            }
        });

        //所见范围
        var filePreviewArea = new Ext.form.ComboBox({
            width: '95%',
            mode: 'remote',
            store: fileEvent.loadEnumData(constant.constant.PREVIEWAREA_NAME),
            name: 'previewArea',
            editable: false,
            fieldLabel: '所见范围',
            emptyText: '请选择.',
            valueField: 'VALUE',
            displayField: 'DISPLAY_VALUE',
            triggerAction: 'all',
            allowBlank: false
        });

        //密级
        var fileSecurity = new Ext.form.ComboBox({
            width: '95%',
            mode: 'remote',
            store: fileEvent.loadEnumData(constant.constant.RESTRICTION_NAME),
            name: 'security',
            editable: false,
            fieldLabel: '密级',
            emptyText: '请选择.',
            valueField: 'VALUE',
            displayField: 'DISPLAY_VALUE',
            triggerAction: 'all',
            allowBlank: false
        });

        //关键字
        var fileKeyword = new Ext.form.TextField({
            width: '95%',
            name: 'keyword',
            fieldLabel: '关键字'
        });

        //摘要
        var fileSummary = new Ext.form.TextArea({
            name: 'defineSummary',
            width: '95%',
            height: 160,
            fieldLabel: '摘要'
        });

        //保存按钮
        var saveButton = new Ext.Button({
            text: '保存',
            iconCls: 'cateFormSave',
            handler: function () {
                if (curFormPanel != null && curFormPanel != 'undefined') {
                    var basicForm = curFormPanel.getForm();
                    if ('add-file' == operationType) {
                        var fileCateField = basicForm.findField('categoryId');
                        fileCateField.setValue(nodeId);
                    }
                    if (!basicForm.isValid()) return;
                    fileEvent.saveFile(operationType, basicForm, store, window, constant);
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

        //FormPanel
        var buttonItem = 'detail-file' == operationType ? [closeButton] : [saveButton, closeButton];
        var formPanel = new Ext.form.FormPanel({
            frame: true,
            items: [],
            buttons: buttonItem,
            defaults: {anchor: '100%'},
            labelWidth: 70,
            buttonAlign: 'center',
            fileUpload: true
        });
        formPanel.add(fileId);
        formPanel.add(fileCateId);
        if ('add-file' == operationType) formPanel.add(fileUpload);
        else formPanel.add(fileName);
        formPanel.add(filePreviewArea);
        formPanel.add(fileSecurity);
        formPanel.add(fileKeyword);
        formPanel.add(fileSummary);

        curFormPanel = formPanel;

        formPanel.on('afterrender', function () {
            fileEvent.initData(operationType, curFormPanel, record);
        });

        //Window
        var window = new Ext.Window({
            title: title,
            layout: 'fit',
            width: 600,
            height: 350,
            items: [formPanel]
        });

        window.show();
    };

});