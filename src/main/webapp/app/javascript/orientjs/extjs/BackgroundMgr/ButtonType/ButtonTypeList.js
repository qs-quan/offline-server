/**
 * Created by enjoy on 2016/4/6 0006.
 */
Ext.define('OrientTdm.BackgroundMgr.ButtonType.ButtonTypeList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.buttonTypeList',
    requires: [
        "OrientTdm.BackgroundMgr.ButtonType.Model.ButtonTypeExtModel",
        "OrientTdm.BackgroundMgr.ButtonType.Create.ButtonTypeCreateForm",
        "OrientTdm.BackgroundMgr.ButtonType.Update.ButtonTypeUpdateForm"
    ],
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    //视图初始化
    createToolBarItems: function () {
        var me = this;
        var addConfig = {
            title: '新增按钮类型',
            height: 120,
            formConfig: {
                formClassName: "OrientTdm.BackgroundMgr.ButtonType.Create.ButtonTypeCreateForm",
                appendParam: function () {
                    return {
                        bindModelName: "MODEL_BTN_TYPE",
                        successCallback: function (resp, callBackArguments) {
                            me.fireEvent("refreshGrid");
                            if (callBackArguments) {
                                this.up("window").close();
                            }
                        }
                    }
                }
            }
        };

        var updateConfig = {
            title: '修改按钮类型',
            height: 120,
            formConfig: {
                formClassName: "OrientTdm.BackgroundMgr.ButtonType.Update.ButtonTypeUpdateForm",
                appendParam: function () {
                    return {
                        bindModelName: "MODEL_BTN_TYPE",
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
            handler: Ext.Function.createInterceptor(this.onDeleteClick, this.checkCanOperate, me)
        }];
        me.actionItems = [{
            iconCls: 'icon-update',
            text: '修改',
            itemId: 'update',
            scope: this,
            handler: Ext.Function.createInterceptor(Ext.bind(me.onUpdateClick, me, [updateConfig], false), this.checkCanOperate, me)
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
                header: '代号',
                sortable: true,
                dataIndex: 'code'
            },
            {
                header: '是否系统类型',
                sortable: true,
                dataIndex: 'issystem',
                renderer: function (value) {
                    var retVal = "否";
                    if (value == "1") {
                        retVal = "是";
                    }
                    return retVal;
                }
            }
        ];
    },
    createStore: function () {
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.BackgroundMgr.ButtonType.Model.ButtonTypeExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    "read": serviceName + '/modelBtnType/list.rdm',
                    "create": serviceName + '/modelBtnType/create.rdm',
                    "update": serviceName + '/modelBtnType/update.rdm',
                    "delete": serviceName + '/modelBtnType/delete.rdm'
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
    checkCanOperate: function () {
        var retVal = true;
        //检验是否可以删除
        var me = this;
        var selections = me.getSelectionModel().getSelection();
        if (selections.length === 0) {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.atleastSelectOne);
        } else {
            Ext.Array.each(selections, function (selection) {
                if (selection.get("issystem") != 0) {
                    retVal = false;
                    return false;
                }
            });
        }
        if (retVal == false)OrientExtUtil.Common.err(OrientLocal.prompt.error, "所选记录中包含了系统类型，系统类型不可被操作");
        return retVal;
    }
});