/**
 * Created by enjoy on 2016/4/30 0030.
 */
Ext.define('OrientTdm.SysMgr.ToolMgr.ToolList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.toolList',
    requires: [
        "OrientTdm.SysMgr.ToolMgr.Model.ToolExtModel",
        "OrientTdm.SysMgr.ToolMgr.Common.ToolForm"
    ],
    config: {
        belongGroupId: ""
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
        var addConfig = {
            title: '新建工具',
            height: 0.25 * globalHeight,
            formConfig: {
                formClassName: "OrientTdm.SysMgr.ToolMgr.Common.ToolForm",
                appendParam: function () {
                    return {
                        bindModelName: "CWM_SYS_TOOLS",
                        belongGroupId: me.getBelongGroupId(),
                        actionUrl: me.store.getProxy().api.create,
                        successCallback: function (resp,callBackArguments) {
                            me.fireEvent("refreshGrid");
                            if(callBackArguments) {
                                this.up("window").close();
                            }
                        }
                    }
                }
            }
        };

        var updateConfig = {
            title: '修改工具',
            height: 0.25 * globalHeight,
            formConfig: {
                formClassName: "OrientTdm.SysMgr.ToolMgr.Common.ToolForm",
                appendParam: function () {
                    return {
                        bindModelName: "CWM_SYS_TOOLS",
                        originalData: this.getSelectedData()[0],
                        actionUrl: me.store.getProxy().api.update,
                        successCallback: function () {
                            me.fireEvent("refreshGrid");
                            this.up("window").close();
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
            iconCls: 'icon-update',
            text: '修改',
            itemId: 'update',
            scope: this,
            handler: Ext.bind(me.onUpdateClick, me, [updateConfig], false)
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
                width: 150,
                sortable: true,
                dataIndex: 'toolVersion',
                filter: {
                    type: 'string'
                }
            }
           /* ,
            {
                header: '工具类型',
                width: 150,
                sortable: true,
                dataIndex: 'toolType',
                filter: {
                    type: 'string'
                }
            }*/
        ];
    },
    createStore: function () {
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.SysMgr.ToolMgr.Model.ToolExtModel',
            proxy: {
                type: 'ajax',
                api: {
                    "read": serviceName + '/Tool/list.rdm',
                    "create": serviceName + '/Tool/create.rdm',
                    "update": serviceName + '/Tool/update.rdm',
                    "delete": serviceName + '/Tool/delete.rdm'
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
        this.setBelongGroupId(belongGroupId);
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
        this.getStore().getProxy().setExtraParam("groupId", me.belongGroupId);
        this.getStore().loadPage(1);
    }
});