/**
 * Created by Administrator on 2016/9/6 0006.
 * 历史审批意见集合
 */
Ext.define('OrientTdm.Collab.MyTask.auditTask.Opinion.AuditTaskHisOpinionList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.auditTaskHisOpinionList',
    autoScroll: true,
    usePage: false,
    config: {
        piId: '',
        taskId: '',
        taskName: ''
    },
    requires: [
        'OrientTdm.Collab.MyTask.auditTask.model.AuditFlowOpinionExtModel'
    ],
    initComponent: function () {
        var me = this;
        this.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent(arguments);
    },
    //视图初始化
    createToolBarItems: function () {
        return null;
    },
    createColumns: function () {
        return [
            {
                header: '审批任务名称',
                sortable: true,
                width: 100,
                dataIndex: 'activity',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '审批人',
                sortable: true,
                dataIndex: 'handleuser',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '审批时间',
                sortable: true,
                width: 130,
                dataIndex: 'handletime',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '意见名称',
                sortable: true,
                dataIndex: 'label',
                width: 100,
                filter: {
                    type: 'value'
                }
            },
            {
                header: '意见内容',
                sortable: true,
                flex: 1,
                dataIndex: 'value',
                filter: {
                    type: 'value'
                }
            }
        ];
    },
    createStore: function () {
        var me = this;
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.Collab.MyTask.auditTask.model.AuditFlowOpinionExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    "read": serviceName + '/AuditFlowOpinion/list.rdm',
                    "create": serviceName + '/AuditFlowOpinion/create.rdm',
                    "update": serviceName + '/AuditFlowOpinion/update.rdm',
                    "delete": serviceName + '/AuditFlowOpinion/delete.rdm'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                },
                extraParams: {
                    limit: null,
                    flowid: me.piId
                }
            }
        });
        this.store = retVal;
        return retVal;
    },
    _changeRowClass: function (record, rowIndex, rowParams, store) {
        var me = this.up('grid');
        if (record.get('flowTaskId') == me.taskId) {
            return 'x-grid-record-blue'
        }
    }
});