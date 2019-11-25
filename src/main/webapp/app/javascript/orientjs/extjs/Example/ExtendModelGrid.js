/**
 * Created by Administrator on 2016/8/19 0019.
 */
Ext.define('OrientTdm.Example.ExtendModelGrid', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientModelGrid',
    alias: 'widget.extendModelGrid',
    initComponent: function () {
        var me = this;
        this.callParent(arguments);
    },
    afterInitComponent: function () {
        var me = this;
        var toolbar = me.dockedItems[0];
        var addButton = toolbar.child('[text=新增]');
        if(addButton){
            addButton.text = '定制新增';
            Ext.Function.interceptAfter(addButton, 'handler', function (button) {
                //新增表单出现后 相关定制
                var customPanel = button.orientBtnInstance.customPanel;
                if (customPanel) {
                    //特殊处理事件
                    var systemPicField = customPanel.down('[name=C_XTTMS_362]');
                    if (systemPicField) {
                        systemPicField.on('change', me.doCheckCustomField, customPanel);
                    }
                }
            });
        }
    },
    doCheckCustomField: function (field, value) {
        var me = this;
        if (value == '121') {
            //隐藏系统图控件
            var systemPicFileField = me.down('FileColumnDesc[name=C_XTT_362]');
            if (systemPicFileField) {
                field.nextNode().hide();
            }
        } else {
            //恢复系统图控件
            field.nextNode().show();
        }
    }
});

