/**
 * Created by enjoy on 2016/4/30 0030.
 */
Ext.define('OrientTdm.SysMgr.LogMgr.SysLogList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.sysLogList',
    requires: [
        "OrientTdm.SysMgr.LogMgr.Model.SysLogExtModel"
    ],
    config: {},
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        this.addEvents("filterByFilter");
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'filterByFilter', me.filterByFilter, me);
    },
    //视图初始化
    createToolBarItems: function () {
        var me = this;
        var retVal = [{
            iconCls: 'icon-delete',
            text: '删除',
            disabled: false,
            itemId: 'delete',
            scope: this,
            handler: this.onDeleteClick
        }];
        retVal.push({
            iconCls: 'icon-backup',
            text: '备份',
            disabled: false,
            itemId: 'backup',
            scope: this,
            handler: this.onBackUpClick
        }, {
            iconCls: 'icon-createjob',
            text: '设置定时备份',
            disabled: false,
            itemId: 'setBackup',
            scope: this,
            handler: this.onSetBackUpClick
        }, {
            iconCls: 'icon-designdata',
            text: '统计',
            disabled: false,
            itemId: 'statistic',
            scope: this,
            handler: this.onStatisticClick
        });
        return retVal;
    },
    createColumns: function () {
        return [
            {
                header: '操作人',
                width: 100,
                sortable: true,
                dataIndex: 'opUserId'
            }, {
                header: '操作时间',
                width: 150,
                sortable: true,
                dataIndex: 'opDate'
            },
            {
                header: '操作人IP',
                width: 150,
                sortable: true,
                dataIndex: 'opIpAddress'
            },
            {
                header: '操作目标',
                width: 150,
                sortable: true,
                dataIndex: 'opTarget'
            },
            {
                header: '操作结果',
                width: 100,
                sortable: true,
                dataIndex: 'opResult'
            },
            {
                header: '操作说明',
                flex: 1,
                sortable: true,
                dataIndex: 'opRemark'
            }
        ];
    },
    createStore: function () {
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.SysMgr.LogMgr.Model.SysLogExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    "read": serviceName + '/SysLog/list.rdm',
                    "create": serviceName + '/SysLog/create.rdm',
                    "update": serviceName + '/SysLog/update.rdm',
                    "delete": serviceName + '/SysLog/delete.rdm'
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
    filterByFilter: function (filter) {
        for (var proName in filter) {
            this.getStore().getProxy().setExtraParam(proName, filter[proName]);
        }
        this.getStore().loadPage(1);
    },
    onBackUpClick: function () {
        var selections = this.getSelectionModel().getSelection();
        if (selections.length === 0) {
            window.location.href = serviceName + '/SysLog/backup.rdm?';
        } else {
            var ids = OrientExtUtil.GridHelper.getSelectRecordIds(this);
            window.location.href = serviceName + '/SysLog/backup.rdm?ids=' + ids;
        }
    },
    onSetBackUpClick: function () {
        var win = Ext.create('Ext.Window', Ext.apply({
            plain: true,
            title: '定时日志备份',
            height: 0.7 * globalHeight,
            width: 0.7 * globalWidth,
            layout: 'fit',
            maximizable: true,
            modal: true,
            items: [
                Ext.create('OrientTdm.SysMgr.LogMgr.BackUpLogDashBord')
            ]
        }));
        win.show();
    },
    onStatisticClick: function () {
        var me = this;
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/StatisticSetUp/list.rdm', {
            name: '日志统计'
        }, true, function (resp) {
            var results = resp.decodedData.results;
            if (Ext.isEmpty(results)) {
                OrientExtUtil.Common.err(OrientExtLocal.prompt.error, '请联系管理员进行项目统计配置工作');
            } else {
                var statisticId = results[0].id;
                OrientExtUtil.StatisticUtil.constructChart(statisticId, {height: 500}, {}, function (statisticCharts) {
                   OrientExtUtil.WindowHelper.createWindow(statisticCharts,{
                       title:'统计'
                   },510,510);
                });
            }
        });
    }
});