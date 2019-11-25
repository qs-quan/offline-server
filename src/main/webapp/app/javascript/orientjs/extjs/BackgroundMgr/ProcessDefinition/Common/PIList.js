Ext.define('OrientTdm.BackgroundMgr.ProcessDefinition.Common.PIList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alternateClassName: 'OrientExtend.PIList',
    alias: 'widget.piList',
    requires: [
        'OrientTdm.BackgroundMgr.ProcessDefinition.Model.PIExtModel',
        'OrientTdm.Collab.common.auditFlow.auditFlowPanel',
        'OrientTdm.Collab.common.collabFlow.collabFlowPanel'
    ],
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    config: {
        pdId: '',
        type: ''
    },
    usePage: false,
    statics: {
        doOperate: function (itemId, id, operatType) {
            var me = Ext.getCmp(itemId);
            if (me && me[operatType]) {
                me[operatType].call(me, id);
            }
        }
    },
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
    },
    createToolBarItems: function () {
        var me = this;
        var retVal = [{
            text: '删除',
            iconCls: 'icon-delete',
            handler: me._doDelete,
            scope: me
        }, {
            text: '返回',
            iconCls: 'icon-back',
            handler: me._back,
            scope: me
        }];
        return retVal;
    },
    createColumns: function () {
        var me = this;
        var itemId = me.getItemId();
        return [
            {
                header: '流程实例ID',
                flex: 1,
                sortable: true,
                dataIndex: 'id',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '流程状态',
                width: 150,
                sortable: true,
                dataIndex: 'status',
                renderer: function (value) {
                    if ('suspended' == value) {
                        return '暂停中';
                    } else if ('ended' == value || 'null' == value) {
                        return '已结束';
                    } else {
                        return '进行中';
                    }

                }
            },
            {
                header: '操作',
                sortable: true,
                width: 150,
                minWidth: 150,
                maxWidth: 150,
                align: 'center',
                dataIndex: 'id',
                renderer: function (value) {
                    var retVal = '<input type="button" value="删除" class="cbtn_danger" onclick="OrientExtend.PIList.doOperate(\'' + itemId + '\',\'' + value + '\',\'deletePI\')" />';
                    retVal += '&nbsp;' + '<input type="button" value="流程监控" class="cbtn" onclick="OrientExtend.PdList.doOperate(\'' + itemId + '\',\'' + value + '\',\'monitFLow\')" />';
                    return retVal;
                }
            }
        ];
    },
    createStore: function () {
        var me = this;
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.BackgroundMgr.ProcessDefinition.Model.PIExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    'read': serviceName + '/PIMgr/list.rdm',
                    'delete': serviceName + '/PIMgr/delete.rdm'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    totalProperty: 'totalProperty',
                    root: 'results',
                    messageProperty: 'msg'
                },
                extraParams: {
                    pdId: me.pdId
                }
            }
        });
        this.store = retVal;
        return retVal;
    },
    _doDelete: function () {
        var _this = this;
        if (OrientExtUtil.GridHelper.hasSelected(_this)) {
            var selectedIds = OrientExtUtil.GridHelper.getSelectRecordIds(_this);
            _this.deletePI(selectedIds)
        }
    },
    deletePI: function (piId) {
        var me = this;
        //展现流程定义的相关实例信息
        OrientExtUtil.Common.confirm(OrientLocal.prompt.info, OrientLocal.prompt.deleteConfirm, function (btn) {
            if (btn == 'yes') {
                var params = {
                    piId: piId
                };
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/PIMgr/delete.rdm', params, true, function (resp) {
                    me.fireEvent("refreshGrid");
                });
            }
        });
    },
    monitFLow: function (piId) {
        var item = Ext.create('OrientTdm.Collab.common.auditFlow.MonitAuditFlowPanel', {
            piId: piId
        });
        OrientExtUtil.WindowHelper.createWindow(item, {
            title: '控制流'
        });
    },
    _back: function () {
        var me = this;
        var fatherPanel = me.up('pdCard');
        if (fatherPanel) {
            var layout = fatherPanel.getLayout();
            layout.setActiveItem(0);
        }
    }
});