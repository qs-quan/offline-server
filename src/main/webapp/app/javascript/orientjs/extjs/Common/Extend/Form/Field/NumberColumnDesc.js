/**
 * Created by enjoy on 2016/4/19 0019.
 */
Ext.define('OrientTdm.Common.Extend.Form.Field.NumberColumnDesc', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.NumberColumnDesc',
    mixins: {
        CommonField: "OrientTdm.Common.Extend.Form.Field.CommonField"
    },
    config: {
        columnDesc: null
    },
    msgTarget: 'side',
    initComponent: function () {
        var me = this;
        if (Ext.isEmpty(me.columnDesc)) {
            throw("未绑定字段描述");
        }
        //动态约束
        var dynamicRangeRestriction = !Ext.isEmpty(me.columnDesc.maxTableId) || !Ext.isEmpty(me.columnDesc.minTableId);
        //初始化数值输入框
        var dataFiled = Ext.create('Ext.form.field.Number', {
            labelAlign: 'right',
            hideTrigger: true,
            maxValue: me.columnDesc.maxValue,
            minValue: me.columnDesc.minValue,
            columnDesc: me.columnDesc,
            dynamicRangeRestriction: dynamicRangeRestriction,
            vtype: 'orientNumberValidate',
            listeners: {
                change: function (field, newValue, oldValue) {
                    var columnDesc = field.columnDesc;
                    if(columnDesc.type=="C_Integer" || columnDesc.type=="C_BigInteger") {
                        if(newValue && !/^\-?\d+$/.test(newValue)) {
                            field.setValue(oldValue);
                        }
                    }
                    else {
                        if(newValue && !/^\-?\d+(\.\d+)?$/.test(newValue)) {
                            field.setValue(oldValue);
                        }
                    }
                }
            }
        });
        this.mixins.CommonField.initCommonAttr.call(dataFiled, me.columnDesc);
        var items = [dataFiled];
        //初始化单位
        var unit = me.columnDesc.unit;
        if (!Ext.isEmpty(unit)) {
            var unitDesc = Ext.decode(unit);
            if (unitDesc.selectorIds.length > 1) {
                var data = [];
                var selectorNames = unitDesc.selectorNames;
                Ext.each(unitDesc.selectorIds, function (selectorId, index) {
                    data.push({
                        'selectorId': selectorId,
                        'selectorName': selectorNames[index]
                    });
                });
                var unitStore = Ext.create('Ext.data.Store', {
                    fields: [
                        'selectorId',
                        'selectorName'
                    ],
                    data: data
                });
                var unitField = Ext.create('Ext.form.field.ComboBox', {
                    fieldLabel: '',
                    flex: 0.1,
                    padding: '0 0 0 5',
                    valueField: 'selectorId',
                    displayField: 'selectorName',
                    name: me.columnDesc.sColumnName + "_unit",
                    mode: 'local',
                    value: data[0]['selectorId'],
                    isFormField: true,
                    store: unitStore
                });
                items.push(unitField);
            } else {
                var unitLabel = Ext.create("Ext.form.field.Display", {
                    padding: '0 0 0 5',
                    flex: 0.1,
                    value: unitDesc.selectorNames[0]
                });
                var hiddenUnit = Ext.create('Ext.form.field.Hidden', {
                    name: me.columnDesc.sColumnName + "_unit",
                    value: unitDesc.selectorIds[0]
                });
                items.push(unitLabel, hiddenUnit);
            }
        }
        Ext.apply(me, {
            layout: 'hbox',
            combineErrors: true,
            defaults: {
                flex: 1
            },
            items: items
        });
        me.callParent(arguments);
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