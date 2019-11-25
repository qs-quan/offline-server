/**
 * Created by dailin on 2019/4/24 14:16.
 */

Ext.define('OrientTdm.TestBomBuild.Panel.PowerUploadImportFilePanel', {
    alias: 'widget.powerUploadImportFilePanel',
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    layout: 'fit',
    requires: [],
    actionUrl: serviceName + '/modelFile/uploadFile.rdm',
    initComponent: function () {
        var me = this;
        if (Ext.isIE) {
            // 如果是ie需要修改请求头，返回值会产生变化，所以使用不同的url
            me.actionUrl = serviceName + '/modelFile/IEuploadFile.rdm'
        }
        Ext.apply(me, {
            layout: "hbox",
            bodyStyle: 'padding:5px 5px 0',
            fieldDefaults: {
                labelAlign: 'right'
            },
            defaults: {
                border: false,
                xtype: 'panel',
                flex: 1,
                layout: 'anchor'
            },
            items: [{
                defaults: {
                    anchor: '95%"'
                },
                items: [
                    {
                        xtype: 'fileuploadfield',
                        fieldLabel: '数据文件',
                        name: 'dataFile',
                        allowBlank: false,
                        emptyText: '选择一个数据文件',
                        buttonText: '',
                        buttonConfig: {
                            iconCls: 'icon-upload'
                        }
                    }
                ]
            }],
            buttons: [
                {
                    text: '上传',
                    handler: function () {
                        me.fireEvent("saveOrientForm");
                    }
                }
            ]
        });
        me.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
    }

});