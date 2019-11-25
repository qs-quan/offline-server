/**
 * Created by Administrator on 2016/9/6 0006.
 * 历史审批意见集合
 */
Ext.define('OrientTdm.Collab.MyTask.auditTask.Opinion.AuditTaskOpinionForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.auditTaskOpinionForm',
    autoScroll: true,
    config: {
        opinion: ''
    },
    requires: [],
    initComponent: function () {
        var me = this;
        var items = [];
        var itemSize = me.opinion.split(',').length;
        Ext.each(me.opinion.split(','), function (loopValue) {
            if (!Ext.isEmpty(loopValue)) {
                var opinionField = {
                    xtype: 'textarea',
                    name: loopValue,
                    grow: true,
                    fieldLabel: loopValue,
                    anchor: '100%',
                    allowBlank: false,
                    height: 240 / itemSize
                };
                items.push(opinionField);
            }
        });
        Ext.apply(me, {
            items: items
        });
        this.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent(arguments);
    }
});