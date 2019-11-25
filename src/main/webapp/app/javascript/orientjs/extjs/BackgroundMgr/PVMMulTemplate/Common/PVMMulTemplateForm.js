/**
 * Created by qjs on 2016/12/20.
 */
Ext.define('OrientTdm.BackgroundMgr.PVMMulTemplate.Common.PVMMulTemplateForm',{
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.pvmMulTemplateForm',
    initComponent: function () {
        var me = this;
        var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

        Ext.apply(this, {
            items: [
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: '名称',
                    margin: '0 0 5 0',
                    afterLabelTextTpl: required,
                    allowBlank: false
                }, {
                    name: 'remark',
                    xtype: 'textarea',
                    fieldLabel: '备注',
                    margin: '0 0 5 0'
                }, {
                    xtype: 'hiddenfield',
                    name: 'id'
                }
            ],
            //buttons: buttons,
            listeners: {
                resize: function (panel, width, height) {

                }
            }
        });
        me.callParent(arguments);
        me.addEvents('saveMulTemplate');
        me.addEvents('saveMulTemplateAndClose')
    },
    initEvents: function () {
        var me = this;
        me.mon(me, 'saveMulTemplate', me.saveMulTemplate, me);
        me.mon(me, 'saveMulTemplateAndClose', me.saveMulTemplateAndClose, me);
        me.callParent(arguments);
    },
    saveMulTemplate:function() {
        var me = this;
        me.fireEvent("saveOrientForm");
    },
    saveMulTemplateAndClose:function() {
        var me = this;
        me.fireEvent("saveOrientForm",{}, true);
    }

});