Ext.define('OrientTdm.SysMgr.UserToolMgr.UserToolList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.userToolList',
    requires: [
        "OrientTdm.SysMgr.UserToolMgr.Model.UserToolExtModel",
        "OrientTdm.SysMgr.UserToolMgr.Common.UpdateUserToolForm",
        'OrientTdm.SysMgr.UserToolMgr.Common.CreateUserToolWindow'
    ],
    config: {
        toolGroupId: ""
    },
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        this.addEvents("filterByBelongGroupId", "filterByFilter");
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'filterByBelongGroupId', me.filterByBelongGroupId, me);
        me.mon(me, 'filterByFilter', me.filterByFilter, me);
    },
    //视图初始化
    createToolBarItems: function () {
        var me = this;

        var retVal = [{
            iconCls: 'icon-create',
            text: '新增',
            itemId: 'create',
            scope: this,
            handler: function() {
                var msgWin = Ext.create('OrientTdm.SysMgr.UserToolMgr.Common.CreateUserToolWindow', {
                    toolGroupId: me.toolGroupId,
                    userToolGrid: me
                });
                msgWin.show();
            }
        }, {
            iconCls: 'icon-update',
            text: '修改',
            itemId: 'update',
            scope: this,
            handler: Ext.bind(me.onUpdateClick, me, [{
                title: '修改工具路径',
                height: 0.25 * globalHeight,
                formConfig: {
                    formClassName: "OrientTdm.SysMgr.UserToolMgr.Common.UpdateUserToolForm",
                    appendParam: function () {
                        return {
                            bindModelName: "CWM_USER_TOOL",
                            originalData: this.getSelectedData()[0],
                            actionUrl: me.store.getProxy().api.update,
                            successCallback: function () {
                                me.fireEvent("refreshGrid");
                                this.up("window").close();
                            }
                        }
                    }
                }
            }], false)
        }, {
            iconCls: 'icon-delete',
            text: '删除',
            disabled: false,
            itemId: 'delete',
            scope: this,
            handler: this.onDeleteClick
        }];
        me.actionItems.push(retVal[1], retVal[2]);
        return retVal;
    },
    createColumns: function () {
        return [
            {
                header: '工具名称',
                flex: 1,
                sortable: true,
                dataIndex: 'toolName',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '工具安装文件',
                width: 150,
                sortable: true,
                dataIndex: 'toolCode',
                renderer: function (value) {
                    var retVal = "";
                    if (!Ext.isEmpty(value)) {
                        var template = "<a target='_blank' class='attachment'  onclick='OrientExtUtil.FileHelper.doDownload(\"#fileId#\")' title='#title#'>#name#</a>";
                        var fileJson = Ext.decode(value);
                        var fileSize = fileJson.length;
                        Ext.each(fileJson, function (fileDesc, index) {
                            var fileId = fileDesc.id;
                            var fileName = fileDesc.name;
                            retVal += template.replace("#name#", fileName).replace("#title#", fileName).replace("#fileId#", fileId);
                            if (index != (fileSize - 1)) {
                                retVal += "</br>";
                            }
                        });
                    }
                    return retVal;
                }
            },
            {
                header: '工具版本',
                width: 60,
                sortable: true,
                dataIndex: 'toolVersion',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '工具路径',
                width: 150,
                sortable: true,
                dataIndex: 'toolPath',
                filter: {
                    type: 'string'
                }
            }
        ];
    },
    createStore: function () {
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.SysMgr.UserToolMgr.Model.UserToolExtModel',
            proxy: {
                type: 'ajax',
                api: {
                    "read": serviceName + '/userTool/list.rdm',
                    "create": serviceName + '/userTool/create.rdm',
                    "update": serviceName + '/userTool/update.rdm',
                    "delete": serviceName + '/userTool/delete.rdm'
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
    filterByBelongGroupId: function (belongGroupId) {
        this.toolGroupId = belongGroupId;
        this.getStore().getProxy().setExtraParam("groupId", belongGroupId);
        this.getStore().load({
            page: 1
        });
    },
    filterByFilter: function (filter) {
        var me = this;
        for (var proName in filter) {
            this.getStore().getProxy().setExtraParam(proName, filter[proName]);
        }
        this.getStore().getProxy().setExtraParam("groupId", me.toolGroupId);
        this.getStore().loadPage(1);
    }
});