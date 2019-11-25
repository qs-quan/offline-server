/**
 * Created by Administrator on 2016/7/25 0025.
 */
Ext.define('OrientTdm.Common.Extend.Form.Selector.ChooseModelPanel', {
    extend: 'OrientTdm.Common.Extend.Tree.OrientTree',
    alternateClassName: 'OrientExtend.ChooseModelPanel',
    alias: 'widget.chooseModelPanel',
    loadMask: true,
    //已经选中的数据
    selectedValue: '',
    //是否多选
    multiSelect: false,
    config: {
        saveAction: Ext.emptyFn,
        containsView: true,
        excludeSchemaId: '',
        excludedSchemaNames: []
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
            ],
            listeners: {
                beforeselect: function (rowmodel, record) {
                    if (record.childNodes.length > 0) {
                        return false;
                    } else
                        return true;
                },
                itemdblclick: function () {
                    me._save();
                }
            }
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
                url: serviceName + '/modelData/getModelTree.rdm',
                extraParams: {
                    containsView: me.containsView,
                    excludeSchemaId: me.excludeSchemaId,
                    excludedSchemaNames: me.excludedSchemaNames
                },
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
                    Ext.each(record.childNodes, function (childNode) {
                        if (Ext.Array.contains(me.selectedData, childNode.get('id'))) {
                            me.getSelectionModel().select(childNode, true, false);
                        }
                    });
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
            me.saveAction.call(me, selectedValue, selectedRecords, function () {
                me.up('window').close();
            });
        }
    }
});