/**
 * 模板管理主界面
 * Created by dailin on 2019/7/9 10:44.
 */

Ext.define('OrientTdm.DataDictionaryMgr.Template.TemplateMgrDashBord',{
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.templateMgrDashBord',

    initComponent: function () {
        var me = this;
        var functionId = me.itemId;
        if (functionId) {
            //截取ID
            functionId = functionId.substr(functionId.indexOf("-") + 1, functionId.length);
        }
        //创建中间面板
        var centerPanel = Ext.create('OrientTdm.DataDictionaryMgr.Template.Center.TemplateShowRegion', {
            region: 'center',
            padding: '0 0 0 5'
        });
        //Tbom
        var tbomPanel = Ext.create('OrientTdm.DataDictionaryMgr.Template.TBom.TestTypeTree', {
            width: 280,
            minWidth: 280,
            maxWidth: 400,
            belongFunctionId: functionId,
            region: 'west'
        });
        Ext.apply(me, {
            layout: 'border',
            items: [centerPanel, tbomPanel],
            westPanel: tbomPanel,
            centerPanel: centerPanel
        });
        me.callParent(arguments);
    }
});