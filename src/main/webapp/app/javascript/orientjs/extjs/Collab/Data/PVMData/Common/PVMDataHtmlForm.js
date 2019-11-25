/**
 * Created by enjoy on 2016/4/11 0011.
 */
Ext.define('OrientTdm.Collab.Data.PVMData.Common.PVMDataHtmlForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.pvmDataHtmlForm',
    config: {
        taskCheckModelId: '',
        status: '',
        isHistory:false
    },
    requires: [
        'OrientTdm.Collab.Data.PVMData.Common.PVMData',
        'OrientTdm.BackgroundMgr.PVMHtml.PVMHtmlDashBord'
    ],
    initComponent: function () {
        var me = this;
        var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
        var buttons = [];
        buttons.push({
            text: '预览',
            iconCls: 'icon-preview',
            handler: function () {
                var htmlData = this.up('form').down("textarea[name=html]").getValue();
                var item = {
                    html: htmlData,
                    autoScroll: true
                };
                OrientExtUtil.WindowHelper.createWindow(item);
            }
        });
        if (me.status == '1') {
            buttons.push(
                {
                    text: '保存',
                    iconCls: 'icon-save',
                    handler: function () {
                        me.fireEvent("saveOrientForm");
                    }
                },
                {
                    text: '从模板选择',
                    handler: me._selectFromTemplate,
                    scope: me
                }
            );
        }
        Ext.apply(this, {
            items: [
                {
                    name: 'html',
                    xtype: 'textarea',
                    listeners: {
                        afterrender: function (field) {
                            var panelHeight = me.getHeight();
                            var panelWidth = me.getWidth();
                            var itemId = this.getItemId() + '-inputEl';
                            CKEDITOR.replace(itemId);
                            var oEditor = CKEDITOR.instances[itemId];
                            oEditor.on('instanceReady', function () {
                                oEditor.resize(me.getWidth() - 20, me.getHeight() - 60);
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
                }, {
                    xtype: 'hiddenfield',
                    name: 'name'
                }, {
                    xtype: 'hiddenfield',
                    name: 'taskmodelid'
                }, {
                    xtype: 'hiddenfield',
                    name: 'taskdataid'
                }, {
                    xtype: 'hiddenfield',
                    name: 'checkmodelid'
                }, {
                    xtype: 'hiddenfield',
                    name: 'checktablestatus'
                }, {
                    xtype: 'hiddenfield',
                    name: 'signroles'
                }, {
                    xtype: 'hiddenfield',
                    name: 'signnames'
                }, {
                    xtype: 'hiddenfield',
                    name: 'uploaduser'
                }, {
                    xtype: 'hiddenfield',
                    name: 'uploadtime'
                }
            ],
            buttons: buttons,
            buttonAlign: 'center',
            listeners: {
                resize: function (panel, width, height) {
                    //var itemId = panel.down("textarea[name=html]").getItemId() + '-inputEl';
                    //var oEditor = CKEDITOR.instances[itemId];
                    //oEditor.resize(width - 120, height);
                }
            }
        });
        me.callParent(arguments);
    },
    _selectFromTemplate: function () {
        var me = this;
        var win = Ext.create('Ext.Window', {
                plain: true,
                title: '选择HTML模板',
                autoShow: true,
                height: 600,
                width: 1024,
                layout: 'fit',
                maximizable: true,
                modal: true,
                items: [
                    {
                        xtype: 'pvmHtmlDashBord'
                    }
                ],
                buttons: [
                    {
                        text: '关闭',
                        iconCls: 'icon-close',
                        handler: function () {
                            win.close();
                        }
                    }, {
                        text: '保存',
                        iconCls: 'icon-save',
                        handler: function () {
                            var templateGrid = win.down('pvmHtmlList');
                            if (templateGrid && OrientExtUtil.GridHelper.hasSelectedOne(templateGrid)) {
                                var selectedRecord = OrientExtUtil.GridHelper.getSelectedRecord(templateGrid)[0];
                                var html = selectedRecord.get('html');
                                me.down("textarea[name=html]").setValue(html);
                                win.close();
                            }
                        }
                    }
                ]
            }
        );
    }
});