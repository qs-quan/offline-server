/**
 * Created by Seraph on 16/9/23.
 */
Ext.define('OrientTdm.Collab.common.template.TemplateExportPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    config : {
        personal : true,
        baseParams : null,
        successCallback : Ext.emptyFn(),
        mainTab : null
    },
    initComponent: function () {
        var me = this;
        var param = {
            region: 'center',
            baseParams : me.baseParams,
            successCallback : me.successCallback,
            bodyStyle:{background:'#ffffff'},
            sfsy: me.sfsy == undefined ? undefined : me.sfsy
        };
        if(me.baseParams.url){
            param.url = me.baseParams.url;
        }
        var centerPanel = Ext.create("OrientTdm.Collab.common.template.TemplateCreateFormPanel", param);
        Ext.apply(this, {
            layout : 'border',
            items : [centerPanel],
            centerPanel : centerPanel
        });
        this.callParent(arguments);
    }
});