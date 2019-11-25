/**
 * Created by dailin on 2019/4/8 18:28.
 */

Ext.define('OrientTdm.TestBomBuild.Panel.PowerH5FileUploadPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.powerH5FileUploadPanel',
    config: {
        url: serviceName + '/modelFile/addFile.rdm',
        modelId: "",
        nodeId: "",
        dataId: ""
    },
    initComponent: function () {
        var me = this;
        me.url = me.url + '?modelId=' + me.modelId + '&dataId=' + me.dataId + '&nodeId=' + me.nodeId + '&piId=' + me.piId;
        var html = '<iframe id="powerH5FileUploadPanelFrame" width=' + globalWidth * 0.50 + ' height=' + '330px' + ' frameborder=' + 0 + ' scrolling=no' + ' marginwidth=' +0 + ' src=' + me.url + '>';
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