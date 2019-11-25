/**
 * Created by enjoy on 2016/4/19 0019.
 */
Ext.define('OrientTdm.Common.Extend.Form.Field.SimpleColumnDescForSelector', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.SimpleColumnDescForSelector',
    mixins: {
        CommonField: 'OrientTdm.Common.Extend.Form.Field.CommonField'
    },
    requires: [
        'OrientTdm.Common.Extend.Form.Selector.ChooseUserPanel',
        'OrientTdm.Common.Extend.Form.Selector.ChooseDepPanel',
        'OrientTdm.Common.Extend.Form.Selector.ChooseModelPanel'
    ],
    msgTarget: 'side',
    config: {
        columnDesc: null,
        excludedSchemaNames: [OrientLocal.constants.COLLAB_SCHEMA_NAME/*, OrientLocal.constants.RESOURCE_SCHEMA_NAME*/]
    },
    initComponent: function () {
        var me = this;
        if (Ext.isEmpty(me.columnDesc)) {
            throw('未绑定字段描述');
        }
        //公用属性初始化
        //初始展现框
        var displayFiled = Ext.create('Ext.form.field.Text', {
            labelAlign: 'right',
            flex: 1
        });
        me.displayFiled = displayFiled;
        this.mixins.CommonField.initCommonAttr.call(displayFiled, me.columnDesc);
        displayFiled.readOnly = true;
        //覆盖名称
        displayFiled.name = me.columnDesc.sColumnName + '_display';
        delete displayFiled.vtype;
        displayFiled.on('focus', Ext.Function.createInterceptor(me._openSelectorWin, me._checkCanEdit, me), me);
        //初始化操作按钮
        var showSelectorBtn = me.columnDesc.editAble ? Ext.create('Ext.button.Button', {
            iconCls: 'icon-select',
            scope: me,
            itemId: 'selectBtn',
            width: '22px',
            handler: me._openSelectorWin,
            disabled: me.editAble
        }) : null;
        var clearSelectorBtn = me.columnDesc.editAble ? Ext.create('Ext.button.Button', {
            iconCls: 'icon-clear',
            scope: me,
            width: '22px',
            itemId: 'clearBtn',
            handler: me._clearValue,
            disabled: me.editAble
        }) : null;
        //增加隐藏属性
        var hiddenData = Ext.create('Ext.form.field.Hidden');
        this.mixins.CommonField.initCommonAttr.call(hiddenData, me.columnDesc);
        var items = [displayFiled, showSelectorBtn, clearSelectorBtn, hiddenData];
        //注入默认值
        me._setDefaultValue(displayFiled, hiddenData);
        //生成面板
        Ext.apply(me, {
            layout: 'hbox',
            combineErrors: true,
            name: me.columnDesc.sColumnName,
            items: items
        });
        me.callParent(arguments);
        me.addEvents('afterChange');
    },
    initEvents: function () {
        var me = this;
        me.callParent();
    },
    createCustomerFilter: function (filterValue) {
        if (Ext.isEmpty(filterValue)) {
            return null;
        }
        var customerFilter = new CustomerFilter(this.columnDesc.sColumnName, CustomerFilter.prototype.SqlOperation.Like, '', filterValue);
        return customerFilter;
    },
    _setDefaultValue: function (displayFiled, hiddenData) {
        var me = this;
        if (!Ext.isEmpty(me.columnDesc.defaultValue)) {
            var realValue = Ext.decode(me.columnDesc.defaultValue);
            hiddenData.setValue(realValue.hiddenValue);
            displayFiled.setValue(realValue.showValue);
        }
    },
    _openSelectorWin: function () {
        var me = this;
        var selector = me.columnDesc.selector;
        if (!Ext.isEmpty(selector)) {
            var items = [];
            var selectorDesc = Ext.decode(selector);
            //获取选择器模式
            var selectortype = selectorDesc.selectorType;
            var selectorName = selectorDesc.selectorName;
            var multiSelect = selectorDesc.multiSelect;
            if (multiSelect == true || multiSelect == "true" || multiSelect == "1" || multiSelect == 1) {
                multiSelect = true;
            }
            else {
                multiSelect = false;
            }
            //获取已经选中的值
            var selectedValue = me.down('hiddenfield[name=' + me.columnDesc.sColumnName + ']').getValue();
            if ('1' == selectortype) {
                //选用户
                var filterType = selectorDesc.filterType;
                var filterValue = selectorDesc.filterValue;
                var filterTH = selectorDesc.filterTH ? selectorDesc.filterTH : "";
                var userSelectorPanel = me._createChooseUserPanel(selectedValue, filterType, filterValue, multiSelect, filterTH);
                items.push(userSelectorPanel);
            } else if ('0' == selectortype) {
                //选部门
                var depSelectorPanel = me._createChooseDepPanel(multiSelect, selectedValue);
                items.push(depSelectorPanel);
            } else if ('2' == selectortype) {
                //选模型 忽略权限
                var modelSelectorPanel = me._createChooseModelPanel(multiSelect, selectedValue, me.excludedSchemaNames);
                items.push(modelSelectorPanel);
            } else if ('3' == selectortype) {
                //选择综合模板
                var PVMMulModelSelectorPanel = me._createChoosePVMMulModelPanel(multiSelect, selectedValue);
                items.push(PVMMulModelSelectorPanel);
            } else if ('4' == selectortype) {
                //选设备
                var filterValue = selectorDesc.filterValue;
                var deviceSelectorPanel = me._createChooseDevicePanel(selectedValue, filterValue, multiSelect);
                items.push(deviceSelectorPanel);
            } else if ('5' == selectortype) {
                //根据tableName和schemaId选择
                selectorName = '选择数据';
                var tableName = selectorDesc.tableName;
                var schemaId = TDM_SERVER_CONFIG[selectorDesc.schemaId];
                if (!tableName || !schemaId) {
                    OrientExtUtil.Common.err(OrientLocal.prompt.error, "模型描述有误");
                    return;
                }
                selectedValue = selectedValue ? selectedValue.split(",") : [];
                var tableSelectorPanel = me._createChooseTableDataPanel(tableName, schemaId, multiSelect, selectedValue);
                items.push(tableSelectorPanel);
            }
            var width = Ext.Array.indexOf(['1', '4', '5'], selectortype) >= 0 ? 900 : 250;
            if (selectortype == '1' && me.columnDesc.showCalendar) {
                //如果带日历
                width = 1280;
            }
            var win = Ext.create('Ext.Window', {
                plain: true,
                height: 700,
                width: width,
                layout: 'fit',
                maximizable: true,
                title: Ext.isEmpty(selectorName) ? (selectortype == '1' ? '选择用户' : '选择部门') : selectorName,
                modal: true,
                style: {
                    'z-index': 1000
                },
                items: items
            });
            win.show();
        } else
            OrientExtUtil.Common.err(OrientLocal.prompt.error, OrientLocal.prompt.unBindSelector);
    },
    _clearValue: function () {
        var me = this;
        me.down('textfield[name=' + me.columnDesc.sColumnName + '_display]').setValue('');
        me.down('hiddenfield[name=' + me.columnDesc.sColumnName + ']').setValue('');
    },
    _setValue: function (data, raw) {
        raw = raw || data;
        //赋值
        var showValues = Ext.Array.pluck(data, 'name').join(',');
        var realValues = Ext.Array.pluck(data, 'id').join(',');
        var me = this;
        me.down('hiddenfield[name=' + me.columnDesc.sColumnName + ']').setValue(realValues);
        me.down('textfield[name=' + me.columnDesc.sColumnName + '_display]').setValue(showValues);
        me.fireEvent('afterChange', raw);
    },
    _createChooseDepPanel: function (multiSelect, selectedValue) {
        var me = this;
        return Ext.create('OrientTdm.Common.Extend.Form.Selector.ChooseDepPanel', {
            multiSelect: multiSelect,
            selectedValue: selectedValue,
            afterInitComponent: function () {
                this.viewConfig.listeners.refresh = function () {
                    //去除默认的选中事件
                };
            },
            saveAction: function (saveData, callBack) {
                //保存信息
                me._setValue(saveData);
                if (callBack) {
                    callBack.call(this);
                }
            }
        });
    },
    _createChooseUserPanel: function (selectedValue, filterType, filterValue, multiSelect, filterTH) {
        var me = this;
        var userSelectorPanel = Ext.create('OrientTdm.Common.Extend.Form.Selector.ChooseUserPanel', {
            selectedValue: selectedValue,
            filterType: filterType,
            filterValue: filterValue,
            filterTH: filterTH,
            multiSelect: multiSelect,
            showCalendar: me.columnDesc.showCalendar || false,
            saveAction: function (saveData, callBack) {
                //保存信息
                me._setValue(saveData);
                if (callBack) {
                    callBack.call(this);
                }
            }
        });
        return userSelectorPanel;
    },
    _createChooseModelPanel: function (multiSelect, selectedValue, excludedSchemaNames) {
        var me = this;
        return Ext.create('OrientTdm.Common.Extend.Form.Selector.ChooseModelPanel', {
            multiSelect: multiSelect,
            selectedValue: selectedValue,
            excludedSchemaNames: excludedSchemaNames,
            afterInitComponent: function () {
                this.viewConfig.listeners.refresh = function () {
                    //去除默认的选中事件
                };
            },
            saveAction: function (saveData, rawData, callBack) {
                //保存信息
                me._setValue(saveData, rawData);
                if (callBack) {
                    callBack.call(this);
                }
            }
        });
    },
    _createChoosePVMMulModelPanel: function (multiSelect, selectedValue) {
        var me = this;
        return Ext.create('OrientTdm.Common.Extend.Form.Selector.ChooseMulPVMTemplatePanel', {
            multiSelect: multiSelect,
            selectedValue: selectedValue,
            afterInitComponent: function () {

            },
            saveAction: function (saveData, callBack) {
                //保存信息
                me._setValue(saveData);
                if (callBack) {
                    callBack.call(this);
                }
            }
        });
    },
    _createChooseDevicePanel: function (selectedValue, filterValue, multiSelect) {
        var me = this;
        var deviceSelectorPanel = Ext.create('OrientTdm.TestResourceMgr.GeneralEquipmentMgr.ChooseDevicePanel', {
            showSelected: true,
            selectedValue: selectedValue,
            customFilters: filterValue ? [TestResourceUtil.getDeviceStateFilter(filterValue)] : [],
            multiSelect: Ext.decode(multiSelect),
            saveAction: function (selectedIds, selectedRecords, selectedInfoMap) {
                var panel = this;
                panel.up('window').close();
                //保存信息
                me._setValue(selectedInfoMap);
            }
        });
        return deviceSelectorPanel;
    },
    _createChooseTableDataPanel: function (tableName, schemaId, multiSelect, selectedValue) {
        var me = this;
        var tableDataSelectorPanel = Ext.create('OrientTdm.Common.Extend.Form.Selector.ChooseTableDataPanel', {
            tableName: tableName,
            schemaId: schemaId,
            showSelected: true,
            customFilters: [],
            multiSelect: Ext.decode(multiSelect),
            selectedValue: selectedValue,
            saveAction: function (selectedIds, selectedRecords, selectedInfoMap) {
                var panel = this;
                panel.up('window').close();
                //保存信息
                me._setValue(selectedInfoMap);
            }
        });
        return tableDataSelectorPanel;
    },
    _checkCanEdit: function () {
        var me = this;
        return me.columnDesc.editAble;
    },
    changeEditStatus: function (canEdit) {
        var me = this;
        var displayField = me.down('textfield');
        displayField.setReadOnly(canEdit);
        var selectBtn = me.down('#selectBtn');
        selectBtn.setDisabled(!canEdit);
        //stop event
        if (canEdit) {
            displayField.resumeEvent('focus');
        } else {
            displayField.suspendEvent('focus');
        }
    },
    customReadOnly: function () {
        //自定义只读组件形态
        var me = this;
        me.displayFiled.fieldBodyCls = 'x-item-disabled';
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
})
;