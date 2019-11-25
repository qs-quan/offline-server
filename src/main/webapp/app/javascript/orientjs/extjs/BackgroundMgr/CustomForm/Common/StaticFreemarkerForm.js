/**
 * Created by Administrator on 2016/8/13 0013.
 */
Ext.define('OrientTdm.BackgroundMgr.CustomForm.Common.StaticFreemarkerForm', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.staticFreemarkerForm',
    config: {
        modelId: '',
        html: ''
    },
    initComponent: function () {
        var me = this;
        var itemId = me.getItemId();
        window['previewHtml' + itemId] = me.html;
        //准备表单数据方法
        var saveModelDataFunName = "prepareFormData";
        me.saveModelDataFunName = saveModelDataFunName;
        Ext.apply(me, {
            html: '<iframe width="100%" height="100%" marginwidth="0" framespacing="0" marginheight="0" frameborder="0" src = "' + serviceName +
            '/app/javascript/orientjs/extjs/BackgroundMgr/CustomForm/Common/preview.jsp?funName=' + saveModelDataFunName + '&modelId=' + me.modelId + '&belongItemId=' + itemId + '"></iframe>',
            layout: 'fit',
            modal: true
        });
        this.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
    }
});