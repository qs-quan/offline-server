/**
 * 上传矩阵文件面板
 *
 * Created by GNY on 2018/5/29
 */
Ext.define('OrientTdm.Mongo.Form.UploadMatrixDataFileForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.uploadMatrixDataFileForm',
    layout: 'fit',
    height: 150,
    actionUrl: serviceName + '/mongoService/uploadFile.rdm',
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            layout: 'hbox',
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
                    anchor: "90%"
                },
                items: [
                    {
                        xtype: 'filefield',
                        fieldLabel: '矩阵数据文件',
                        name: 'dataFile',
                        allowBlank: false,
                        emptyText: '选择一个矩阵数据文件',
                        buttonText: '',
                        buttonConfig: {
                            iconCls: 'icon-upload'
                        },
                        validator: function (value) {
                            return true;
                            /*if (!value) {
                             this.invalidText = '请选择一个矩阵数据文件';
                             return false;
                             } else if (!(/.+\.zip$/i.test(value))) {
                             this.invalidText = '请选择一个zip文件';
                             return false;
                             } else {
                             return true;
                             }*/
                        }
                    }
                ]
            }, {
                defaults: {
                    anchor: "10%"
                },
                items: [
                    {
                        xtype: 'button',
                        text: '上传',
                        handler: function () {
                            var form = this.up('form').getForm();
                            var extraParams = {
                                modelId: me.modelId,
                                dataId: me.dataId
                            };
                            if (form.isValid()) {

                                form.submit({
                                    url: me.actionUrl,
                                    method: 'post',
                                    params: extraParams,
                                    waitMsg: '请耐心等待',
                                    success: function (fp, resp) {
                                        var fileId = resp.result.results.id;
                                        var fileName = resp.result.results.name;
                                        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/mongoService/insertData.rdm', {
                                            fileId: fileId,
                                            fileName: fileName,
                                            modelId: me.modelId,
                                            dataId: me.dataId
                                        }, false, function (resp) {
                                            if (me.successCallback) {
                                                me.successCallback.call(me);
                                            }
                                            OrientExtUtil.Common.tip('提示', '上传成功');
                                        });
                                    },
                                    failure: function (form, action) {
                                        OrientExtUtil.Common.tip('提示', '上传失败');
                                    }
                                })
                            }
                        }
                    }
                ]

            }
            ],
            buttonAlign: 'center'
        });
        me.callParent(arguments);
    }
});