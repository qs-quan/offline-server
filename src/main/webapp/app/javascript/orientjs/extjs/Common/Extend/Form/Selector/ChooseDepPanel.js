/**
 * Created by Administrator on 2016/7/19 0019.
 * 选择用户面板
 */
Ext.define('OrientTdm.Common.Extend.Form.Selector.ChooseDepPanel', {
    extend: 'OrientTdm.Common.Extend.Tree.OrientTree',
    alternateClassName: 'OrientExtend.ChooseDepPanel',
    alias: 'widget.chooseDepPanel',
    loadMask: true,
    //已经选中的数据
    selectedValue: '',
    //是否多选
    multiSelect: false,
    config: {
        saveAction: Ext.emptyFn
    },
    initComponent: function () {
        var me = this;
        me.selectedData = Ext.isEmpty(me.selectedValue) ? [] : me.selectedValue.split(',');
        me.beforeInitComponent.call(me);
        Ext.apply(me, {
            selModel: {
                mode: me.multiSelect ? 'MULTI' : 'SINGLE'
            },
            selType: "checkboxmodel",
            listeners: {
                itemdblclick: function () {
                    me._save();
                }
            },
            buttons: [
                {
                    text: '保存',
                    iconCls: 'icon-save',
                    handler: me._save,
                    scope: me
                },
                {
                    text: '关闭',
                    iconCls: 'icon-close',
                    handler: function () {
                        this.up('window').close();
                    }
                }
            ]
        });
        this.callParent(arguments);
        me.afterInitComponent.call(me);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
    },
    itemClickListener: function (tree, record, item) {

    },
    createToolBarItems: function () {
        var me = this;
        var retVal = [{
            xtype: 'trigger',
            width: 230,
            triggerCls: 'x-form-clear-trigger',
            onTriggerClick: function () {
                this.setValue('');
                me.clearFilter();
            },
            emptyText: '快速搜索',
            enableKeyEvents: true,
            listeners: {
                keyup: function (field, e) {
                    if (Ext.EventObject.ESC == e.getKey()) {
                        field.onTriggerClick();
                    } else {
                        me.filterByText(this.getRawValue(), "text");
                    }
                }
            }
        }];
        return retVal;
    },
    createFooBar: function () {
        return Ext.emptyFn;
    },
    createStore: function () {
        var me = this;
        var retVal = new Ext.data.TreeStore({
            proxy: {
                type: 'ajax',
                url: serviceName + '/dept/getByPid.rdm',
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                }
            },
            root: {
                text: 'root',
                id: '-1',
                expanded: true
            },
            listeners: {
                load: function (store, record) {
                    if (Ext.Array.contains(this.selectedData, record.get('id'))) {
                        this.getSelectionModel().select(record, true, false);
                    }
                },
                scope: me
            }
        });
        return retVal;
    },
    _save: function () {
        var me = this;
        //保存选中的信息
        var selectedRecords = me.getSelectionModel().getSelection();
        var selectedValue = [];
        Ext.each(selectedRecords, function (selectedRecord) {
            var obj = {
                id: selectedRecord.get('id'),
                name: selectedRecord.get('text')
            };
            selectedValue.push(obj);
        });
        if (me.saveAction) {
            me.saveAction.call(me, selectedValue, function () {
                me.up('window').close();
            });
        }
    }
});