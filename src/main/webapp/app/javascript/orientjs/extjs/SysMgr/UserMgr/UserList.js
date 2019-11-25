/**
 * Created by enjoy on 2016/3/16 0016.
 */
Ext.define('OrientTdm.SysMgr.UserMgr.UserList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.UserList',
    requires: [
        "OrientTdm.SysMgr.UserMgr.Model.UserListExtModel",
        "OrientTdm.SysMgr.UserMgr.Create.UserAddForm",
        "OrientTdm.SysMgr.UserMgr.Update.UserUpdateForm",
        "OrientTdm.SysMgr.UserMgr.UserSearchForm"
    ],
    config: {
        extraFilter: ''
    },
    //usePage:false,
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    initComponent: function () {
        var me = this;
        me.extraFilter = {};
        me.callParent(arguments);
        this.addEvents("filterByDepId");
        this.addEvents("loadSearchData");
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'filterByDepId', me.filterByDepId, me);
        me.mon(me, 'loadSearchData', me.loadSearchData, me);
    },
    //视图初始化
    createToolBarItems: function () {
        var me = this;
        var retVal = [{
            iconCls: 'icon-create',
            text: '新增',
            itemId: 'create',
            scope: this,
            handler: this.onCreateClick
        }, {
            iconCls: 'icon-delete',
            text: '批量删除',
            disabled: false,
            itemId: 'delete',
            scope: this,
            handler: this.onDeleteClick
        }, {
            iconCls: 'icon-queryAll',
            text: '显示全部',
            disabled: false,
            itemId: 'searchAll',
            scope: this,
            handler: this.onSearchAllClick
        }, {
            iconCls: 'icon-importUser',
            text: '导入用户',
            disabled: false,
            itemId: 'import',
            scope: this,
            handler: this.openImportWin
        }, {
            iconCls: 'icon-exportUser',
            text: '导出用户',
            disabled: false,
            itemId: 'export',
            scope: this,
            handler: this.onExportClick
        }, {
            iconCls: 'icon-create',
            text: '人员分配所有磁贴',
            disabled: false,
            itemId: 'oneKeyBindPortal',
            scope: this,
            handler: this.oneKeyBindPortal
        }];

        me.actionItems.push({
            iconCls: 'icon-update',
            text: '修改',
            itemId: 'update',
            scope: this,
            handler: this.onUpdateClick
        }, retVal[1]);

        return retVal;
    },

    openImportWin: function () {
        var me = this;
        var win = Ext.create("Ext.Window", {
            title: '新增用户',
            plain: true,
            height: 100,
            width: '70%',
            layout: 'fit',
            maximizable: true,
            modal: true,
            items: [
                {
                    xtype: 'form',
                    bodyPadding: 10,
                    layout: 'anchor',
                    defaults: {
                        anchor: '100%',
                        labelAlign: 'left',
                        msgTarget: 'side',
                        labelWidth: 90
                    },
                    items: [{
                        xtype: 'filefield',
                        buttonText: '',
                        fieldLabel: '导入用户',
                        buttonConfig: {
                            iconCls: 'icon-search'
                        },
                        listeners: {
                            'change': function (fb, v) {
                                if (v.substr(v.length - 3) != "xls" && v.substr(v.length - 4) != "xlsx") {
                                    OrientExtUtil.Common.info('提示', '请选择Excel文件！');
                                    return;
                                }
                            }
                        }
                    }]
                }
            ],
            buttons: [
                {
                    text: '导入',
                    handler: function () {
                        var form = win.down("form").getForm();
                        if (form.isValid()) {
                            form.submit({
                                url: serviceName + '/user/importUsers.rdm',
                                waitMsg: '导入用户...',
                                success: function (form, action) {
                                    OrientExtUtil.Common.tip('成功', action.result.msg);
                                    win.close();
                                    me.fireEvent("refreshGrid");
                                },
                                failure: function (form, action) {
                                    switch (action.failureType) {
                                        case Ext.form.action.Action.CLIENT_INVALID:
                                            OrientExtUtil.Common.err('失败', '文件路径存在错误');
                                            break;
                                        case Ext.form.action.Action.CONNECT_FAILURE:
                                            OrientExtUtil.Common.err('失败', '无法连接服务器');
                                            break;
                                        case Ext.form.action.Action.SERVER_INVALID:
                                            OrientExtUtil.Common.err('失败', action.result.msg);
                                    }
                                }
                            });
                        }
                    }
                }
            ]
        });
        win.show();
    },

    createColumns: function () {
        return [
            {
                header: '账号',
                flex: 2,
                sortable: true,
                dataIndex: 'userName',
                filter: {
                    type: 'string'
                }
            },
            {
                header: '姓名',
                flex: 2,
                sortable: true,
                dataIndex: 'allName',
                filter: {
                    type: 'string'
                }
            },
            //{
            //    header: '手机',
            //    flex: 3,
            //    sortable: true,
            //    dataIndex: 'mobile'
            //},
            //{
            //    header: '邮件',
            //    flex: 3,
            //    sortable: false,
            //    dataIndex: 'email'
            //},
            {
                header: '部门',
                flex: 2,
                sortable: false,
                dataIndex: 'department',
                renderer: function (value) {
                    var retVal = '';
                    if (!Ext.isEmpty(value)) {
                        retVal = Ext.decode(value)["text"];
                    }
                    return retVal;
                },
                filter: {
                    type: 'string'
                }
            },
            {
                header: '涉密等级',
                flex: 2,
                sortable: false,
                dataIndex: 'grade',
                renderer: function (value) {
                    var retVal = '';
                    if (!Ext.isEmpty(value)) {
                        retVal = Ext.decode(value)["value"];
                    }
                    return retVal;
                }
            }
        ];
    },

    createStore: function () {
        var me = this;
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.SysMgr.UserMgr.Model.UserListExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    "read": serviceName + '/user/listByFilter.rdm',
                    "create": serviceName + '/user/create.rdm',
                    "update": serviceName + '/user/update.rdm',
                    "delete": serviceName + '/user/delete.rdm'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    root: 'results',
                    totalProperty: 'totalProperty',
                    messageProperty: 'msg'
                },
                extraParams: {
                    extraFilter: Ext.isEmpty(me.extraFilter) ? '' : Ext.encode(me.extraFilter)
                },
                writer: {
                    type: 'json',
                    writeAllFields: false,
                    root: 'data'
                },
                listeners: {
                    exception: function (proxy, response, operation) {
                        Ext.MessageBox.show({
                            title: '读写数据异常',
                            msg: operation.getError(),
                            icon: Ext.MessageBox.ERROR,
                            buttons: Ext.Msg.OK
                        });
                    }
                }
            },
            listeners: {
                write: function (proxy, operation) {

                }
            }
        });
        this.store = retVal;
        return retVal;
    },

    onDeleteClick: function () {
        var me = this;
        OrientExtUtil.GridHelper.deleteRecords(me, serviceName + '/user/delete.rdm', function () {
            me.fireEvent("refreshGrid");
        });
    },

    onCreateClick: function () {
        var me = this;
        var westPanel = me.ownerCt.westPanel;
        var deptNode = westPanel.getSelectionModel().getSelection()[0];

        //弹出新增面板窗口
        var createWin = Ext.create('Ext.Window', {
            title: '新增用户',
            plain: true,
            height: 0.5 * globalHeight,
            width: 0.7 * globalWidth,
            layout: 'fit',
            maximizable: true,
            modal: true,
            items: [Ext.create(OrientTdm.SysMgr.UserMgr.Create.UserAddForm, {
                bindModelName: "CWM_SYS_USER",
                deptNode: deptNode,
                successCallback: function (resp, callBackArguments) {
                    me.fireEvent("refreshGrid");
                    if (callBackArguments) {
                        createWin.close();
                    }
                }
            })]
        });
        createWin.show();
    },

    onUpdateClick: function () {
        var me = this;
        var selections = this.getSelectionModel().getSelection();
        if (selections.length === 0) {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.atleastSelectOne);
        } else if (selections.length > 1) {
            OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.onlyCanSelectOne);
        } else {
            var updateWin = Ext.create('Ext.Window', {
                title: '修改用户',
                plain: true,
                height: 0.7 * globalHeight,
                width: 0.7 * globalWidth,
                layout: 'fit',
                maximizable: true,
                modal: true,
                items: [Ext.create("OrientTdm.SysMgr.UserMgr.Update.UserUpdateForm", {
                    bindModelName: "CWM_SYS_USER",
                    successCallback: function () {
                        me.fireEvent("refreshGrid");
                        updateWin.close();
                    },
                    originalData: selections[0]
                })]
            });
            updateWin.show();
        }
    },

    onSearchClick: function () {
        var me = this;
        //弹出新增面板窗口
        var createWin = Ext.create('Ext.Window', {
            title: '查询用户',
            plain: true,
            height: 0.7 * globalHeight,
            width: 0.7 * globalWidth,
            layout: 'fit',
            maximizable: true,
            modal: true,
            items: [Ext.create(OrientTdm.SysMgr.UserMgr.UserSearchForm, {
                bindModelName: "CWM_SYS_USER",
                successCallback: function (data) {
                    me.fireEvent("loadData", data);
                    createWin.close();
                }
            })]
        });
        createWin.show();
    },

    onSearchAllClick: function () {
        var me = this;
        var form = me.ownerCt.ownerCt.down('form');
        var vals = form.getForm().getValues();
        form.getForm().reset();
        var deptNode = me.ownerCt.down('UserDeptTree').getSelectionModel().getSelection()[0];
        for (var key in vals) {
            me.ownerCt.down('UserList').getStore().getProxy().setExtraParam(key, null);
        }
        me.ownerCt.down('UserList').fireEvent("filterByDepId", deptNode.data.id);
    },

    onExportClick: function () {
        var selections = this.getSelectionModel().getSelection();
        var toExportIds = OrientExtUtil.GridHelper.getSelectRecordIds(this);
        var exportAll = false;
        if (selections.length === 0) {
            Ext.MessageBox.confirm('提示', '是否导出所有用户信息？', function (btn) {
                if (btn == 'yes') {
                    exportAll = true;
                    window.location.href = serviceName + '/user/exportUsers.rdm?exportAll=' + exportAll + '&toExportIds=' + toExportIds;
                }

            });
        } else {
            window.location.href = serviceName + '/user/exportUsers.rdm?exportAll=' + exportAll + '&toExportIds=' + toExportIds;
        }
    },

    filterByDepId: function (depId) {
        var me = this;
        if (me.extraFilter) {
            if (depId === "未分组") {
                me.extraFilter.depFilter = {
                    'noDep': depId//depId占位,不起作用
                };
            } else {
                me.extraFilter.depFilter = {
                    'in': depId
                };
            }
            me.getStore().getProxy().setExtraParam("extraFilter", Ext.isEmpty(me.extraFilter) ? '' : Ext.encode(me.extraFilter));
            me.getStore().load();
        }
    },

    loadSearchData: function (data) {
        //this.getSelectionModel().clearSelections();
        //var storeBefore = this.getStore();
        //var memoryStore = Ext.create('Ext.data.Store',{
        //    autoLoad:true,
        //    model: 'OrientTdm.SysMgr.UserMgr.Model.UserListExtModel',
        //    data:data,
        //    proxy: {
        //        type: 'memory',
        //        reader: {
        //            type: 'json',
        //            root: 'results',
        //            totalProperty:'totalProperty'
        //        }
        //    }
        //});
        //
        //this.store = memoryStore;
        //var store2 = this.getStore();
        //;
        //this.getStore().load();
        this.getSelectionModel().clearSelections();
        var store = this.getStore();
        store.loadData(data);
    },

    /**
     * 一键给所有用户分配磁贴
     */
    oneKeyBindPortal: function () {
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/CustomPortalController/oneKeyDind.rdm',{}, false, function (response) {
            if(response.decodedData.success){
                OrientExtUtil.Common.tip('提示', '分配磁贴成功');
            }else{
                OrientExtUtil.Common.err('失败', '分配磁贴失败');
            }
        });
    }

});
