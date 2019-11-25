/**
 * 中间面板
 */
Ext.define('OrientTdm.Collab.PrjTemplate.PrjTemplateMngCenterPanel', {
    extend : 'OrientTdm.Common.Extend.Panel.OrientPanel',
    config : {
        schemaId : null,
        modelName : null
    },
    initComponent: function () {
        var me = this;

        var objParma = {
            title: '模板列表',
            region: 'center',
            layout: 'fit',
            personal : false,
            modelId : me.modelId,
            pId: me.pId,
            model: me.model,
            sysjglParam: me.sysjglParam == undefined ? undefined : me.sysjglParam
            // deviceModelId: me.deviceModelId,
            // rwModelId: me.rwModelId,
            // southPanelName: me.southPanelName,
            // deleteBtnDisabled: me.deleteBtnDisabled == null ? false : true
        };
        if(me.sysjglParam != undefined){
            objParma.id = 'prjTemplateListPanel';
        }
        var centerPanel = Ext.create("OrientTdm.Collab.PrjTemplate.PrjTemplateListPanel", objParma);

/*        var southPanel = Ext.create('OrientTdm.Common.Extend.Panel.OrientTabPanel', {
            id: me.southPanelName,
            title: '模板预览',
            region : 'south',
            layout : 'fit',
            height : 250,
            collapsible: true,
            collapsed: true
        });*/

        Ext.apply(this, {
            items: [/*northPanel,*/ centerPanel/*, southPanel*/],
           // northPanel: northPanel,
            //southPanel: southPanel,
            centerPanel: centerPanel
        });

        this.callParent(arguments);
    }
});