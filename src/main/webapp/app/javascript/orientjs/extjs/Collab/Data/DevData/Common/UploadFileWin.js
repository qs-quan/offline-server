/**
 * Created by Administrator on 2016/7/21 0021.
 */
Ext.define('OrientTdm.Collab.Data.DevData.Common.UploadFileWin', {
        extend: 'Ext.window.Window',
        alias: 'widget.uploadFileWin',
        config: {
            bindRecord: null
        },
        requires: [
            ''
        ],
        initComponent: function () {
            var me = this;
            Ext.apply(me, {
                width: 680,
                title: '上传附件',
                height: 400,
                layout: 'fit',
                items: [
                    {
                        xtype: 'uploadpanel',
                        isSingle: true
                    }
                ],
                autoShow: true,
                buttons: [
                    {
                        text: '取消',
                        iconCls: 'icon-close',
                        handler: function () {
                            this.up('window').close();
                        }
                    },
                    {
                        text: '保存',
                        iconCls: 'icon-save',
                        handler: me._saveSelected,
                        scope: me
                    }
                ]
            });
            me.callParent(arguments);
        },
        _saveSelected: function () {
            var me = this;
            var uploadpanel = this.down('uploadpanel');
            var data = [];
            if (uploadpanel) {
                var attachs = uploadpanel.getSuccessFiles();
                if (attachs == undefined || attachs == []) return;
                for (var i = 0; i < attachs.length; i++) {
                    var fileId = attachs[i].attachmentId;
                    var name = attachs[i].attachName;
                    data.push({
                        id: fileId,
                        name: name
                    });
                }
                if (data.length > 0) {
                    me.bindRecord.set('value', Ext.encode(data));
                }
                me.close();
            }
        }
    }
);