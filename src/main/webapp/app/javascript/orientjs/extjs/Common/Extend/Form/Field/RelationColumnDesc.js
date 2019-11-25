/**
 * Created by enjoy on 2016/4/19 0019.
 */
Ext.define('OrientTdm.Common.Extend.Form.Field.RelationColumnDesc', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.RelationColumnDesc',
    componentCls: 'relationColumnCls',
    alternateClassName: 'OrientExtend.RelationColumnDesc',
    mixins: {
        CommonField: "OrientTdm.Common.Extend.Form.Field.CommonField"
    },
    requires: [
        'OrientTdm.Common.Extend.Form.Field.RelationColumnDescForDisplay'
    ],
    msgTarget: 'side',
    config: {
        columnDesc: null
    },
    initComponent: function () {
        var me = this;
        if (Ext.isEmpty(me.columnDesc)) {
            throw('未绑定字段描述');
        }
        //初始展现框
        var displayFiled = Ext.create('OrientExtend.RelationColumnDescForDisplay', {
            columnDesc: me.columnDesc,
            listeners: {
                change: function (field) {
                    var newValue = field.getSubmitValue();
                    me.down('hidden').setValue(newValue);
                }
            }
        });
        //覆盖名称
        displayFiled.name = me.columnDesc.sColumnName + '_display';
        //增加隐藏属性
        var hiddenData = Ext.create('Ext.form.field.Hidden');
        this.mixins.CommonField.initCommonAttr.call(hiddenData, me.columnDesc);
        //生成面板
        Ext.apply(me, {
            layout: 'hbox',
            combineErrors: true,
            name: me.columnDesc.sColumnName,
            items: [
                displayFiled, hiddenData
            ]
        });
        me.callParent(arguments);
        me.addEvents('setHiddenData');
    },
    initEvents: function () {
        var me = this;
        me.mon(me, 'setHiddenData', me._setHiddenData, me);
        me.callParent(arguments);
    },
    createCustomerFilter: function (filterValue) {
        return this.down('RelationColumnDescForDisplay').createCustomerFilter(filterValue);
    },
    _setHiddenData: function (newValue) {
        var me = this;
        me.down('hidden').setValue(newValue);
    },
    customReadOnly: function () {
        //自定义只读组件形态

    },
    markInvalid : function(errors) {
        var me = this,
            oldMsg = me.getActiveError(),
            active;

        me.setActiveErrors(Ext.Array.from(errors));
        active = me.getActiveError();
        if (oldMsg !== active) {
            me.setError(active);
        }
    },
    clearInvalid : function() {
        var me = this,
            hadError = me.hasActiveError();

        delete me.needsValidateOnEnable;
        me.unsetActiveError();
        if (hadError) {
            me.setError('');
        }
    },
    setError: function(active){
        var me = this,
            msgTarget = me.msgTarget,
            prop;

        if (me.rendered) {
            if (msgTarget == 'title' || msgTarget == 'qtip') {
                if (me.rendered) {
                    prop = msgTarget == 'qtip' ? 'data-errorqtip' : 'title';
                }
                me.getActionEl().dom.setAttribute(prop, active || '');
            } else {
                me.updateLayout();
            }
        }
    }
});