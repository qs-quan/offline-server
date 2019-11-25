/**
 * Created by enjoy on 2016/4/6 0006.
 */
Ext.define('OrientTdm.BackgroundMgr.PVMTemplate.PVMTemplateList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.pvmTemplateList',
    requires: [
        'Ext.grid.feature.Grouping',
        'OrientTdm.BackgroundMgr.PVMTemplate.Model.PVMTemplateExtModel',
        'OrientTdm.BackgroundMgr.PVMTemplate.Common.PVMTemplateForm'
    ],
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    usePage: true,
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            features: [{
                ftype: 'grouping',
                groupHeaderTpl: '{groupValue}',
                collapsible: false,
                hideGroupedHeader: true,
                startCollapsed: false
            }]
        });
        me.callParent(arguments);
    },
    //视图初始化
    createToolBarItems: function () {
        var me = this;
        var addConfig = {
            title: '新增',
            height: 250,
            formConfig: {
                formClassName: 'OrientTdm.BackgroundMgr.PVMTemplate.Common.PVMTemplateForm',
                appendParam: function () {
                    return {
                        actionUrl: me.store.getProxy().api['create'],
                        bindModelName: 'CWM_CHECKMODELDATATEMPLATE',
                        successCallback: function () {
                            me.fireEvent('refreshGrid');
                            this.up('window').close();
                        }
                    }
                }
            }
        };

        var updateConfig = {
            title: '修改按钮类型',
            height: 250,
            formConfig: {
                formClassName: 'OrientTdm.BackgroundMgr.PVMTemplate.Common.PVMTemplateForm',
                appendParam: function () {
                    return {
                        bindModelName: 'CWM_CHECKMODELDATATEMPLATE',
                        actionUrl: me.store.getProxy().api['update'],
                        originalData: this.getSelectedData()[0],
                        successCallback: function (resp, callBackArguments) {
                            me.fireEvent('refreshGrid');
                            if (callBackArguments) {
                                this.up('window').close();
                            }
                        }
                    }
                }
            }
        };

        var retVal = [{
            iconCls: 'icon-create',
            text: '新增',
            itemId: 'create',
            tooltip: {
                text: '新增检查表模板',
                title: '操作提示'
            },
            scope: this,
            handler: Ext.bind(me.onCreateClick, me, [addConfig], false)
        }, {
            iconCls: 'icon-delete',
            text: '批量删除',
            disabled: false,
            itemId: 'delete',
            tooltip: {
                text: '删除检查表模板',
                title: '操作提示'
            },
            scope: this,
            handler: this.onDeleteClick
        }];
        me.actionItems = [{
            iconCls: 'icon-update',
            text: '修改',
            itemId: 'update',
            tooltip: {
                text: '修改检查表模板',
                title: '操作提示'
            },
            scope: this,
            handler: Ext.bind(me.onUpdateClick, me, [updateConfig], false)
        }, retVal[1]];
        return retVal;
    },
    createColumns: function () {
        return [
            {
                header: '名称',
                flex: 1,
                sortable: true,
                dataIndex: 'name',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '数据表',
                flex: 1,
                sortable: true,
                dataIndex: 'checkmodelid_display',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '创建人',
                flex: 1,
                sortable: true,
                dataIndex: 'createuser',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '创建时间',
                flex: 1,
                sortable: true,
                dataIndex: 'uploadtime',
                filter: {
                    type: 'string'
                }
            }
        ];
    },
    createStore: function () {
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.BackgroundMgr.PVMTemplate.Model.PVMTemplateExtModel',
            autoLoad: true,
            groupField: 'groupname',
            proxy: {
                type: 'ajax',
                api: {
                    'read': serviceName + '/CheckModelDataTemplate/list.rdm',
                    'create': serviceName + '/CheckModelDataTemplate/create.rdm',
                    'update': serviceName + '/CheckModelDataTemplate/update.rdm',
                    'delete': serviceName + '/CheckModelDataTemplate/delete.rdm'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                }
            }
        });
        this.store = retVal;
        return retVal;
    },
    onSearchClick: function () {

    }
});