/**
 * Created by qjs on 2016/12/19.
 */
Ext.define('OrientTdm.BackgroundMgr.PVMMulTemplate.MulPVMTmpList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.mulPvmTmpList',
    requires: [
        'OrientTdm.BackgroundMgr.PVMMulTemplate.Model.MulPVMExtModel',
        'OrientTdm.BackgroundMgr.PVMHtml.Common.PVMHtmlForm'
    ],
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    //usePage: false,分页用基类中默认设为true
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
    },
    //视图初始化
    createToolBarItems: function () {
        var me = this;
        var addConfig = {
            title: '新增检查表综合模板',
           // height: 850,
            listeners: {
                beforeclose: function () {
                    var me = this;
                    me.down('pvmMulTemplateFormPanel').centerPanel.fireEvent("deleteEmptyTmpIdData");
                }
            },
            formConfig: {
                actionType:'create',
                formClassName: 'OrientTdm.BackgroundMgr.PVMMulTemplate.PVMMulTemplateFormPanel',//不能用form，改为panel来做
                appendParam: function () {
                    return {
                        actionUrl: me.store.getProxy().api['create'],
                        bindModelName: 'CWM_TASKMULTIPLECHECKMODEL',
                        successCallback: function (resp, callBackArguments) {
                            Ext.ComponentQuery.query('pvmMulTemplateDataDashBord')[0].templateId = resp.data;
                            Ext.ComponentQuery.query('pvmMulTemplateDataDashBord')[0].fireEvent("insertTemplateId");
                            me.fireEvent('refreshGrid');
                            if (callBackArguments) {
                                this.up("window").close();
                            }
                        }
                    }
                }
            }
        };

        var updateConfig = {
            title: '修改检查表综合模板',
            //height: 850,
            formConfig: {
                actionType:'update',
                formClassName: 'OrientTdm.BackgroundMgr.PVMMulTemplate.PVMMulTemplateFormPanel',
                appendParam: function () {
                    return {
                        bindModelName: 'CWM_TASKMULTIPLECHECKMODEL',
                        actionUrl: me.store.getProxy().api['update'],
                        originalData: this.getSelectedData()[0],
                        successCallback: function () {
                            me.fireEvent('refreshGrid');
                            this.up('window').close();
                        }
                    }
                }
            }
        };

        var retVal = [{
            iconCls: 'icon-create',
            text: '新增',
            itemId: 'create',
            scope: this,
            handler: Ext.bind(me.onCreateClick, me, [addConfig], false)
        }, {
            iconCls: 'icon-delete',
            text: '批量删除',
            disabled: false,
            itemId: 'delete',
            scope: this,
            handler: this.deleteModelAndRelation
        }];
        me.actionItems.push({
            iconCls: 'icon-update',
            text: '修改',
            itemId: 'update',
            scope: this,
            handler: Ext.bind(me.onUpdateClick, me, [updateConfig], false)
        }, retVal[1]);
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
            },
            {
                header: '备注',
                flex: 1,
                sortable: true,
                dataIndex: 'remark',
                filter: {
                    type: 'string'
                }
            }
        ];
    },
    createStore: function () {
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.BackgroundMgr.PVMMulTemplate.Model.MulPVMExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    'read': serviceName + '/PVMMulTemplate/list.rdm',
                    'create': serviceName + '/PVMMulTemplate/create.rdm',
                    'update': serviceName + '/PVMMulTemplate/update.rdm',
                    'delete': serviceName + '/PVMMulTemplate/delete.rdm'
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
    deleteModelAndRelation:function() {
        var me = this;
        var templateId = me.getSelectedData()[0].internalId;
        if (me.getStore() && me.getStore().getProxy() && me.getStore().getProxy().api) {
            OrientExtUtil.GridHelper.deleteRecords(me, me.getStore().getProxy().api['delete'], function () {
                me.fireEvent('refreshGrid');
            });
        } else {
            OrientExtUtil.Common.err(OrientLocal.prompt.error, '未定义删除Url');
        }
        Ext.Ajax.request({
            url : serviceName + "/PVMMulCheckRelation/deleteRelationByTemplateId.rdm",
            async: false,
            method : 'POST',
            params : {
                templateId:templateId
            },
            success : function(response) {

            }
        });
    }
});