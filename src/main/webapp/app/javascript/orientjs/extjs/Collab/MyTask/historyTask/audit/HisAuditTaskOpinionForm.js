/**
 * Created by Administrator on 2016/9/6 0006.
 * 历史审批意见集合
 */
Ext.define('OrientTdm.Collab.MyTask.historyTask.audit.HisAuditTaskOpinionForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.hisAuditTaskOpinionForm',
    autoScroll: true,
    config: {
        opinion: ''
    },
    requires: [],
    initComponent: function () {
        var me = this;
        var items = [];
        for (var item in me.opinion) {
            if (!Ext.isEmpty(item)) {
                var opinionField = {
                    xtype: 'textarea',
                    name: item,
                    grow: true,
                    fieldLabel: item,
                    anchor: '100%',
                    allowBlank: false,
                    value: me.opinion[item],
                    readOnly: true
                };
                items.push(opinionField);
            }
        }
        Ext.apply(me, {
            items: items,
            title: '审批意见'
        });
        this.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent(arguments);
    }
});