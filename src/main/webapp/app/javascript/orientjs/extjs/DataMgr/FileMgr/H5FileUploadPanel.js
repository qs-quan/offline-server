/**
 *
 * Created by GNY on 2018/5/17
 */
Ext.define('OrientTdm.DataMgr.FileMgr.H5FileUploadPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.h5FileUploadPanel',
    config: {
        url: serviceName + '/modelFile/addFile.rdm',
        modelId: null,
        dataId: null
    },
    initComponent: function () {
        var me = this;
        me.url = me.url + '?modelId=' + me.modelId + '&dataId=' + me.dataId;
        var html = '<iframe width=' + globalWidth * 0.50 + ' height=' + '330px' + ' frameborder=' + 0 + ' scrolling=no' + ' marginwidth=' +0 + ' src=' + me.url + '>';
        Ext.apply(me, {
            items: [
                {
                    xtype: 'fieldset',
                    border: false,
                    default: {anchor: '100%'},
                    collapsible: false,
                    html: html
                }
            ]
        });
        me.callParent(arguments);
    }
});