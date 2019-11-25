Ext.define('OrientTdm.BackgroundMgr.ProcessDefinition.Common.PdList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alternateClassName: 'OrientExtend.PdList',
    alias: 'widget.pdList',
    requires: [
        'OrientTdm.BackgroundMgr.ProcessDefinition.Model.PdExtModel',
        'OrientTdm.BackgroundMgr.ProcessDefinition.Common.PIList',
        'OrientTdm.BackgroundMgr.ProcessDefinition.Common.AuditFLowTaskOpinionSettingList'
    ],
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    config: {
        type: 'audit',
        name: ''
    },
    usePage: false,
    statics: {
        doOperate: function (itemId, id, operatType) {
            var gridPanel = Ext.getCmp(itemId);
            if (gridPanel && gridPanel[operatType]) {
                var retVal = gridPanel[operatType].call(gridPanel, id);
                if (retVal && retVal.isComponent && retVal.isComponent == true) {
                    var fatherPanel = gridPanel.up('pdCard');
                    if (fatherPanel) {
                        var layout = fatherPanel.getLayout();
                        var respPanel = layout.getNext();
                        respPanel.removeAll();
                        respPanel.add(retVal);
                        layout.setActiveItem(1);
                    } else {
                        OrientExtUtil.WindowHelper.createWindow(retVal);
                    }
                }
            }
        }
    },
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
    },
    createToolBarItems: function () {
        var me = this;
        if (!Ext.isEmpty(me.name)) {
            return [{
                text: '返回',
                iconCls: 'icon-back',
                handler: me._doBack,
                scope: me
            }];
        }
        return null;
    },
    createColumns: function () {
        var me = this;
        var itemId = me.getItemId();
        return [
            {
                header: '流程名称',
                flex: 1,
                sortable: true,
                dataIndex: 'name',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '流程版本',
                sortable: true,
                dataIndex: 'version',
                filter: {
                    type: 'string'
                }
            },
            {
                xtype: 'checkcolumn',
                header: '是否启用',
                sortable: true,
                dataIndex: 'canStart',
                listeners: {
                    'checkchange': function (column, rowIndex, checked) {
                        var record = me.getStore().getAt(rowIndex);
                        record.commit();
                    }
                }
            },
            {
                header: '流程实例',
                sortable: true,
                width: 100,
                minWidth: 100,
                maxWidth: 100,
                align: 'center',
                dataIndex: 'id',
                renderer: function (value) {
                    var retVal = '<input type="button" value="流程实例" class="cbtn_warn" onclick="OrientExtend.PdList.doOperate(\'' + itemId + '\',\'' + value + '\',\'instance\')" />';
                    return retVal;
                }
            },
            {
                header: '操作',
                sortable: true,
                width: 200,
                minWidth: 200,
                maxWidth: 200,
                align: 'center',
                dataIndex: 'id',
                renderer: function (value) {
                    var retVal = '<input type="button" value="删除" class="cbtn_danger" onclick="OrientExtend.PdList.doOperate(\'' + itemId + '\',\'' + value + '\',\'deletePd\')" />';
                    if (Ext.isEmpty(me.name)) {
                        retVal += '&nbsp;' + '<input type="button" value="历史版本" class="cbtn" onclick="OrientExtend.PdList.doOperate(\'' + itemId + '\',\'' + value + '\',\'history\')" />';
                    }
                    if (me.type == 'audit') {
                        retVal += '&nbsp;' + '<input type="button" value="意见设置" class="cbtn_opinion" onclick="OrientExtend.PdList.doOperate(\'' + itemId + '\',\'' + value + '\',\'setOpinions\')" />';
                    }
                    return retVal;
                }
            }
        ];
    },
    createStore: function () {
        var me = this;
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.BackgroundMgr.ProcessDefinition.Model.PdExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    'read': serviceName + '/PDMgr/list.rdm',
                    'delete': serviceName + '/PDMgr/delete.rdm'
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
                    type: me.type,
                    name: me.name
                }
            }
        });
        this.store = retVal;
        return retVal;
    },
    instance: function (pdId) {
        var me = this;
        //展现流程定义的相关实例信息
        return Ext.create('OrientTdm.BackgroundMgr.ProcessDefinition.Common.PIList', {
            pdId: pdId,
            type: me.type
        });
    },
    deletePd: function (pdId) {
        var me = this;
        //展现流程定义的相关实例信息
        OrientExtUtil.Common.confirm(OrientLocal.prompt.info, OrientLocal.prompt.deleteConfirm, function (btn) {
            if (btn == 'yes') {
                var record = me.getStore().getById(pdId);
                var params = {
                    id: pdId,
                    name: record.get('name'),
                    version: record.get('version')
                };
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/PDMgr/delete.rdm', params, true, function (resp) {
                    me.fireEvent("refreshGrid");
                });
            }
        });

    },
    history: function (pdId) {
        var me = this;
        var record = me.getStore().getById(pdId);
        var container = me.up();
        var pdListPanel = Ext.create('OrientTdm.BackgroundMgr.ProcessDefinition.Common.PdList', {
            type: me.type,
            name: record.get('name')
        });
        container.removeAll();
        container.add(pdListPanel);
        container.doLayout();
    },
    setOpinions: function (pdId) {
        return Ext.create('OrientTdm.BackgroundMgr.ProcessDefinition.Common.AuditFLowTaskOpinionSettingList', {
            pdId: pdId
        });
    },
    _doBack: function () {
        var me = this;
        var container = me.up();
        var pdListPanel = Ext.create('OrientTdm.BackgroundMgr.ProcessDefinition.Common.PdList', {
            type: me.type
        });
        container.removeAll();
        container.add(pdListPanel);
        container.doLayout();
    }
});