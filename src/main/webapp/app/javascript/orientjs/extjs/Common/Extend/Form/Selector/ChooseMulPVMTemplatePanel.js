/**
 * Created by qjs on 2016/12/28.
 * 综合模板选择器
 */
Ext.define('OrientTdm.Common.Extend.Form.Selector.ChooseMulPVMTemplatePanel', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alternateClassName: 'OrientExtend.ChooseMulPVMTemplatePanel',
    alias: 'widget.chooseMulPVMTemplatePanel',
    loadMask: true,
    //已经选中的数据
    selectedValue: '',
    //是否多选
    multiSelect: false,
    config: {
        saveAction: Ext.emptyFn
    },
    requires: [
        'OrientTdm.BackgroundMgr.PVMMulTemplate.Model.MulPVMExtModel',
        'OrientTdm.BackgroundMgr.PVMHtml.Common.PVMHtmlForm'
    ],
    initComponent: function () {
        var me = this;
        me.selectedData = Ext.isEmpty(me.selectedValue) ? [] : me.selectedValue.split(',');
        me.beforeInitComponent.call(me);
        Ext.apply(me, {
            selModel: {
                mode: me.multiSelect ? 'MULTI' : 'SINGLE'
            },
            //selType: "checkboxmodel",
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
        me.callParent(arguments);
    },
    //视图初始化
    createToolBarItems: function () {
        var me = this;

        var updateConfig = {
            title: '预览检查表综合模板',
            height: 850,
            formConfig: {
                actionType:'update',
                formClassName: 'OrientTdm.BackgroundMgr.PVMMulTemplate.PVMMulTemplateFormPanel',
                appendParam: function () {
                    return {
                        bindModelName: 'CWM_TASKMULTIPLECHECKMODEL',
                        actionUrl: me.store.getProxy().api['update'],
                        originalData: this.getSelectedData()[0],
                        preview:true,
                        successCallback: function () {
                            me.fireEvent('refreshGrid');
                            this.up('window').close();
                        }
                    }
                }
            }
        };

        var retVal = [];
        me.actionItems.push({
            iconCls: 'icon-preview',
            text: '预览',
            itemId: 'preview',
            scope: this,
            handler: Ext.bind(me.onUpdateClick, me, [updateConfig], false)
        });
        return retVal;
    },
    createColumns: function () {
        return [
            {
                header: '名称',
                width: 200,
                sortable: true,
                dataIndex: 'name',
                filter: {
                    type: 'string'
                }
            }
            //{
            //    header: '备注',
            //    width:200,
            //    sortable: true,
            //    dataIndex: 'remark',
            //    filter: {
            //        type: 'string'
            //    }
            //}
        ];
    },
    createStore: function () {
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.BackgroundMgr.PVMMulTemplate.Model.MulPVMExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    'read': serviceName + '/PVMMulTemplate/list.rdm'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                },
                extraParams: {
                    limit: null
                }
            }
        });
        this.store = retVal;
        return retVal;
    },
    //initComponent: function () {
    //    var me = this;
    //
    //    this.callParent(arguments);
    //    me.afterInitComponent.call(me);
    //},
    initEvents: function () {
        var me = this;
        me.callParent();
    },
    createFooBar: function () {
        return Ext.emptyFn;
    },
    _save: function () {
        var me = this;
        //保存选中的信息
        var selectedRecords = me.getSelectionModel().getSelection();
        var selectedValue = [];
        Ext.each(selectedRecords, function (selectedRecord) {
            var obj = {
                id: selectedRecord.get('id'),
                name: selectedRecord.get('name')
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