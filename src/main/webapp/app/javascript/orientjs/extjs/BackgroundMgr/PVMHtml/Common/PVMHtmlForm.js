/**
 * Created by enjoy on 2016/4/11 0011.
 */
Ext.define('OrientTdm.BackgroundMgr.PVMHtml.Common.PVMHtmlForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.pvmHtmlForm',
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
        buttons.push({
            text: '预览',
            iconCls: 'icon-preview',
            handler: function () {
                var htmlData = this.up('form').down("textarea[name=html]").getValue();
                var item = {
                    html: htmlData,
                    autoScroll: true
                };
                OrientExtUtil.WindowHelper.createWindow(item, {
                    maximizable: true
                });
            }
        });
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
                    name: 'notes',
                    xtype: 'textarea',
                    fieldLabel: '备注',
                    margin: '0 0 5 0'
                }, {
                    name: 'html',
                    xtype: 'textarea',
                    fieldLabel: 'html',
                    listeners: {
                        afterrender: function (field) {
                            var panelHeight = me.getHeight();
                            var panelWidth = me.getWidth();
                            var itemId = this.getItemId() + '-inputEl';
                            CKEDITOR.replace(itemId);
                            var oEditor = CKEDITOR.instances[itemId];
                            oEditor.on('instanceReady', function () {

                            });
                            oEditor.on('blur', function () {
                                if (!this.destroying && this.destroying != false) {
                                    field.setValue(oEditor.getData());
                                }
                            });
                        },
                        change: function (field, newValue, oldValue) {
                            var itemId = this.getItemId() + '-inputEl';
                            var oEditor = CKEDITOR.instances[itemId];
                            oEditor.setData(newValue);
                        },
                        destroy: function () {
                            var itemId = this.getItemId() + '-inputEl';
                            CKEDITOR.instances[itemId] = null;
                        }
                    }
                }, {
                    xtype: 'hiddenfield',
                    name: 'id'
                }
            ],
            buttons: buttons,
            listeners: {
                resize: function (panel, width, height) {

                }
            }
        });
        me.callParent(arguments);
    }
});