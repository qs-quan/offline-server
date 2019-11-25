Ext.define('OrientTdm.SysMgr.RoleMgr.RoleList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alias: 'widget.RoleList',
    requires: [
        'OrientTdm.SysMgr.RoleMgr.Model.RoleListExtModel',
        'OrientTdm.SysMgr.RoleMgr.Create.RoleAddForm',
        'OrientTdm.SysMgr.RoleMgr.Update.RoleUpdateForm',
        'OrientTdm.SysMgr.RoleMgr.RoleSearchForm'
    ],
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,
    itemdblclickListener: function (grid, record, item, index, e, eOpts) {
        var southPanel = this.up('RoleMain').southPanel;
        var eastPanel = this.up('RoleMain').eastPanel;
        southPanel.fireEvent('showRoleDetail', record.data.id);
        eastPanel.fireEvent('showRoleFunction', record.data.id);
        this.maxOperateArea();
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
            iconCls: 'icon-query',
            text: '查询',
            disabled: false,
            itemId: 'search',
            scope: this,
            handler: this.onSearchClick
        }, {
            iconCls: 'icon-queryAll',
            text: '显示全部',
            disabled: false,
            itemId: 'searchAll',
            scope: this,
            handler: this.onSearchAllClick
        }, '->', {
            xtype: 'tbtext',
            text: '<span style="color: red">*双击行即可分配角色权限</span>'
        }];
        me.actionItems.push({
            iconCls: 'icon-update',
            text: '修改',
            itemId: 'update',
            scope: this,
            handler: this.onUpdateClick
        }, {
            iconCls: 'icon-delete',
            text: '删除',
            disabled: false,
            itemId: 'delete',
            scope: this,
            handler: this.onDeleteClick
        }, {
            iconCls: 'icon-assign',
            text: '分配权限',
            scope: this,
            handler: function (grid, rowIndex, colIndex, item, event, record) {
                me.fireEvent("itemdblclick", me, record, item, rowIndex, event, 'assign');
            }
        });
        return retVal;
    },
    createColumns: function () {
        return [
            {
                header: '角色名称',
                flex: 2,
                sortable: true,
                dataIndex: 'name',
                filter: {
                    type: 'string'
                }
            }, {
                header: '备注',
                flex: 2,
                sortable: true,
                dataIndex: 'memo',
                filter: {
                    type: 'string'
                }
            }
        ];
    },
    createStore: function () {
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.SysMgr.RoleMgr.Model.RoleListExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    'read': serviceName + '/role/list.rdm',
                    'create': serviceName + '/role/create.rdm',
                    'update': serviceName + '/role/update.rdm',
                    'delete': serviceName + '/role/delete.rdm'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    root: 'results',
                    messageProperty: 'msg'
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
    initComponent: function () {
        this.on('itemdblclick', this.itemdblclickListener, this);
        this.callParent(arguments);
    },
    onDeleteClick: function () {
        var me = this;
        OrientExtUtil.GridHelper.deleteRecords(me, serviceName + '/role/delete.rdm', function () {
            me.fireEvent('refreshGrid');
        });
    },
    onCreateClick: function () {
        var me = this;
        //弹出新增面板窗口
        var createWin = Ext.create('Ext.Window', {
            title: '新增角色',
            plain: true,
            height: 250,
            width: 0.3 * globalWidth,
            layout: 'fit',
            maximizable: true,
            modal: true,
            items: [Ext.create(OrientTdm.SysMgr.RoleMgr.Create.RoleAddForm, {
                bindModelName: 'CWM_SYS_ROLE',
                successCallback: function (resp, callBackArguments) {
                    me.fireEvent('refreshGrid');
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
                title: '修改角色',
                plain: true,
                height: 250,
                width: 0.3 * globalWidth,
                layout: 'fit',
                maximizable: true,
                modal: true,
                items: [Ext.create('OrientTdm.SysMgr.RoleMgr.Update.RoleUpdateForm', {
                    bindModelName: 'CWM_SYS_ROLE',
                    successCallback: function (resp, callBackArguments) {
                        me.fireEvent('refreshGrid');
                        if (callBackArguments) {
                            updateWin.close();
                        }
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
            title: '查询角色',
            plain: true,
            height: 200,
            width: 0.3 * globalWidth,
            layout: 'fit',
            maximizable: true,
            modal: true,
            items: [Ext.create(OrientTdm.SysMgr.RoleMgr.RoleSearchForm, {
                bindModelName: 'CWM_SYS_ROLE',
                successCallback: function (data) {
                    me.fireEvent('loadData', data);
                    createWin.close();
                }
            })]
        });
        createWin.show();
    },
    onSearchAllClick: function () {
        var me = this;
        me.fireEvent('refreshGrid');
        if(this.ownerCt.southPanel){
            this.ownerCt.southPanel.collapse('bottom');
        }
        if(this.ownerCt.eastPanel){
            this.ownerCt.eastPanel.collapse('right');
        }
    },
    maxOperateArea: function () {
        var me = this;
        //收缩右侧功能导航
        Ext.getCmp('orient-functionnav').collapse();
        //如果存在子功能点导航
        var sysDashPanel = me.up('functionDashBord');
        if (sysDashPanel && me.up('functionDashBord').westPanelComponent) {
            me.up('functionDashBord').westPanelComponent.collapse();
        }
    }
});