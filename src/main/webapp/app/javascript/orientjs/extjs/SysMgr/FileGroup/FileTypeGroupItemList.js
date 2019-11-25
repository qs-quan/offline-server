/**
 * Created by enjoy on 2016/4/30 0030.
 */
Ext.define('OrientTdm.SysMgr.FileGroup.FileTypeGroupItemList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.fileTypeItemList',
    requires: [
        "OrientTdm.SysMgr.FileGroup.Model.FileTypeGroupItemExtModel",
        "OrientTdm.SysMgr.FileGroup.Create.FileGroupItemCreateForm",
        "OrientTdm.SysMgr.FileGroup.Update.FileGroupItemUpdateForm"
    ],
    config: {
        belongFileGroupId: ""
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
            title: '新增文件分组项',
            height: 0.12*globalHeight,
            width: 0.5*globalWidth,
            formConfig: {
                formClassName: "OrientTdm.SysMgr.FileGroup.Create.FileGroupItemCreateForm",
                appendParam: function () {
                    return {
                        bindModelName: "CWM_FILE_GROUP_ITEM",
                        belongFileGroupId: me.getBelongFileGroupId(),
                        successCallback: function (resp, callBackArguments) {
                            me.fireEvent("refreshGrid");
                            if(callBackArguments){
                                this.up("window").close();
                            }
                        }
                    }
                }
            }
        };

        var updateConfig = {
            title: '修改文件分组项',
            height: 0.12*globalHeight,
            width: 0.5*globalWidth,
            formConfig: {
                formClassName: "OrientTdm.SysMgr.FileGroup.Update.FileGroupItemUpdateForm",
                appendParam: function () {
                    return {
                        bindModelName: "CWM_FILE_GROUP_ITEM",
                        originalData: this.getSelectedData()[0],
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
            iconCls: 'icon-delete',
            text: '批量删除',
            disabled: false,
            itemId: 'delete',
            scope: this,
            handler: this.onDeleteClick
        }];
        me.actionItems = [{
            iconCls: 'icon-update',
            text: '修改',
            itemId: 'update',
            scope: this,
            handler: Ext.bind(me.onUpdateClick, me, [updateConfig], false)
        }, retVal[1]];
        return retVal;
    },
    createColumns: function () {
        return [
            {
                header: '文件类型名称',
                flex: 1,
                sortable: true,
                dataIndex: 'name',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '文件分组项后缀',
                width: 150,
                sortable: true,
                dataIndex: 'suffix',
                filter: {
                    type: 'string'
                }
            }
        ];
    },
    createStore: function () {
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.SysMgr.FileGroup.Model.FileTypeGroupItemExtModel',
            proxy: {
                type: 'ajax',
                api: {
                    "read": serviceName + '/fileGroupItem/list.rdm',
                    "create": serviceName + '/fileGroupItem/create.rdm',
                    "update": serviceName + '/fileGroupItem/update.rdm',
                    "delete": serviceName + '/fileGroupItem/delete.rdm'
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
    filterByBelongGroupId: function (belongFileGroupId) {
        this.setBelongFileGroupId(belongFileGroupId);
        this.getStore().getProxy().setExtraParam("belongFileGroupId", belongFileGroupId);
        this.getStore().load({
            page: 1
        });
    },
    filterByFilter: function (filter) {
        var me = this;
        for (var proName in filter) {
            this.getStore().getProxy().setExtraParam(proName, filter[proName]);
        }
        this.getStore().getProxy().setExtraParam("belongFileGroupId", me.belongFileGroupId);
        this.getStore().loadPage(1);
    }
});