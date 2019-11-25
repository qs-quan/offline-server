/**
 * Created by enjoy on 2016/4/11 0011.
 */
Ext.define('OrientTdm.BackgroundMgr.Quantity.Template.Common.QuantityTemplateForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.quantityTemplateForm',
    initComponent: function () {
        var me = this;
        var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
        var buttons = [{
            text: '保存',
            iconCls: 'icon-save',
            handler: function () {
                me.fireEvent("saveOrientForm");
            }
        }];
        if (!me.originalData) {
            buttons.push({
                text: '保存并关闭',
                iconCls: 'icon-saveAndClose',
                handler: function () {
                    me.fireEvent("saveOrientForm", {}, true);
                }
            });
        }
        Ext.apply(this, {
            items: [
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: '名称',
                    margin: '0 0 5 0',
                    afterLabelTextTpl: required,
                    allowBlank: false,
                    vtype: 'unique'
                }, {
                    xtype: 'hiddenfield',
                    name: 'id'
                }
            ],
            buttons: buttons
        });
        me.callParent(arguments);
    }
});