/**
 * Created by Administrator on 2016/6/28 0028.
 */
Ext.define('OrientTdm.BackgroundMgr.DocHandler.Query.DocHandlerQueryForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.docHandlerQueryForm',
    buttonAlign: 'center',
    layout: 'hbox',
    defaults: {
        flex: 1
    },
    layoutConfig: {
        pack: "center",
        align: "stretch"
    },
    initComponent: function () {
        var me = this;
        Ext.apply(this, {
            items: [
                {
                    name: 'showName',
                    xtype: 'textfield',
                    fieldLabel: '名称',
                    margin: '0 5 0 0'
                }, {
                    name: 'beanName',
                    xtype: 'orientComboBox',
                    fieldLabel: '处理器类',
                    margin: '0 5 0 0',
                    remoteUrl: serviceName + '/DocHandler/getDocHandlerBeanList.rdm'
                }
            ],
            buttons: [
                {
                    text: '查询',
                    iconCls: 'icon-query',
                    handler: function () {
                        me.doQuery();
                    }
                },
                {
                    text: '清空',
                    iconCls: 'icon-clear',
                    handler: function () {
                        this.up('form').getForm().reset();
                        me.doQuery();
                    }
                }
            ]
        });
        me.callParent(arguments);
    },
    doQuery: function () {
        var me = this;
        var formValue = OrientExtUtil.FormHelper.generateFormData(me.getForm());
        if (me.ownerCt.centerPanelComponent) {
            me.ownerCt.centerPanelComponent.fireEvent("filterByForm", formValue);
        }
    }
});