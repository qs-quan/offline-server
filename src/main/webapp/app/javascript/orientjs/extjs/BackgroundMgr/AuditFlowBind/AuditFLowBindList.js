/**
 * Created by enjoy on 2016/4/6 0006.
 */
Ext.define('OrientTdm.BackgroundMgr.AuditFlowBind.AuditFLowBindList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.auditFLowBindList',
    requires: [
        'OrientTdm.BackgroundMgr.AuditFlowBind.Common.AuditProcessDefinitionList',
        'OrientTdm.BackgroundMgr.AuditFlowBind.Model.AuditFlowBindExtModel',
        'OrientTdm.BackgroundMgr.AuditFlowTaskBind.AuditFLowTaskBindList'
    ],
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    usePage: false,
    //视图初始化
    createToolBarItems: function () {
        var me = this;
        var retVal = [{
            iconCls: 'icon-create',
            text: '新增流程绑定',
            itemId: 'create',
            scope: this,
            handler: me._AddBind
        }, {
            iconCls: 'icon-delete',
            text: '删除',
            disabled: false,
            itemId: 'delete',
            scope: this,
            handler: Ext.Function.createInterceptor(this.onDeleteClick, this.checkCanOperate, me)
        }];
        me.actionItems.push({
            iconCls: 'icon-update',
            text: '修改备注',
            itemId: 'update',
            scope: this,
            handler: me._modifyRemark
        }, retVal[1]);
        return retVal;
    },
    createColumns: function () {
        return [
            {
                header: '备注',
                sortable: true,
                flex: 1,
                dataIndex: 'remark',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '流程版本',
                sortable: true,
                dataIndex: 'flowVersion',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '最后修改人',
                sortable: true,
                dataIndex: 'userName',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '最后修改时间',
                sortable: true,
                width: 150,
                dataIndex: 'lastUpdateDate',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '任务设置',
                xtype: 'actioncolumn',
                align: 'center',
                width: 100,
                items: [{
                    icon: serviceName + '/app/images/icons/default/background/bullet_group.gif',
                    tooltip: 'Remove',
                    handler: function (grid, rowIndex, colIndex) {
                        var id = grid.store.getAt(rowIndex).get('id');
                        var taskSettingPanel = Ext.create('OrientTdm.BackgroundMgr.AuditFlowTaskBind.AuditFLowTaskBindList', {
                            belongAuditBind: id
                        });
                        OrientExtUtil.WindowHelper.createWindow(taskSettingPanel, {
                            title: '任务设置'
                        }, 600, 850);
                    }
                }]
            }
        ];
    },
    createStore: function () {
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.BackgroundMgr.AuditFlowBind.Model.AuditFlowBindExtModel',
            proxy: {
                type: 'ajax',
                api: {
                    "read": serviceName + '/AuditFlowModelBind/list.rdm',
                    "create": serviceName + '/AuditFlowModelBind/create.rdm',
                    "update": serviceName + '/AuditFlowModelBind/update.rdm',
                    "delete": serviceName + '/AuditFlowModelBind/delete.rdm'
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
    _AddBind: function () {
        //获取当前已经绑定的集合
        var me = this;
        var modelId = me.getStore().getProxy().extraParams['modelId'];
        if (!modelId) {
            OrientExtUtil.Common.err(OrientLocal.prompt.error, '请先点击左侧模型节点');
        } else {
            var selectAuditFlowPanel = Ext.create('OrientTdm.BackgroundMgr.AuditFlowBind.Common.AuditProcessDefinitionList', {
                modelId: modelId,
                saveCallBack: function () {
                    me.getStore().load();
                }
            });
            OrientExtUtil.WindowHelper.createWindow(selectAuditFlowPanel, {
                title: '选择审批模型'
            });
        }
    },
    _modifyRemark: function () {
        var me = this;
        var record = OrientExtUtil.GridHelper.getSelectedRecord(me)[0];
        var remark = record.get('remark');
        Ext.MessageBox.prompt('修改备注', '请输入新的备注名称:', function (btn, value) {
            if ('ok' == btn) {
                record.set('remark', value);
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/AuditFlowModelBind/update.rdm', record.data, true, function () {
                    me.getStore().load();
                });
            }
        }, me, false, remark);
    }
});