/**
 * Created by Administrator on 2016/8/18 0018.
 */
Ext.define('OrientTdm.Collab.Data.PVMData.Common.PVMCombineDashBord', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientTabPanel',
    alias: 'widget.pvmCombineDashBord',
    requires: [
        'OrientTdm.Collab.Data.PVMData.Common.PVMData',
        'OrientTdm.Collab.Data.PVMData.Common.PVMDataHtmlForm'
    ],
    config: {
        taskCheckModelId: '',
        modelId: '',
        status: '',
        html: '',
        rawData: {},
        localMode : false,
        localData : null,
        hisTaskDetail: null
    },
    closable: true,
    initComponent: function () {
        var me = this;
        var items = [];
        //获取数据面板
        if (!Ext.isEmpty(me.modelId)) {
            var modelPanel = Ext.create('OrientTdm.Collab.Data.PVMData.Common.PVMData', {
                taskCheckModelId: me.taskCheckModelId,
                status: me.status,
                title: '数据检查表',
                iconCls: 'icon-model',
                localMode : me.localMode,
                localData : me.localData,
                hisTaskDetail: me.hisTaskDetail
            });
            items.push(modelPanel);
        }
        //HTML面板
        var htmlPanel = Ext.create('OrientTdm.Collab.Data.PVMData.Common.PVMDataHtmlForm', {
            bindModelName: 'CWM_TASKCHECK_HTML',
            actionUrl: serviceName + '/CheckModel/update.rdm',
            title: '自定义检查表',
            iconCls: 'icon-html',
            originalData: me.rawData,
            taskCheckModelId: me.taskCheckModelId,
            status: me.status,
            successCallback: function () {//在回调函数中改变传入的值
                var html = this.down("textarea[name=html]").getValue();
                if(html) {
                    me.rawData.html = html;
                }
            }
        });
        items.push(htmlPanel);
        var fbarItems = [];
        if(!me.localMode || null == me.hisTaskDetail){
            if (me.status == '1') {
                fbarItems.push({
                    type: 'button',
                    text: '设置签署角色',
                    handler: me._setAssigners,
                    scope: me
                });
                fbarItems.push({
                    text: '保存编制',
                    handler: function () {
                        me.up('pvmDataDashBord').saveStatus(2, me.taskCheckModelId, me);
                    }
                });
            } else if (me.status == '2') {
                fbarItems.push(
                    {
                        text: '重新编制',
                        handler: function () {
                            me.up('pvmDataDashBord').saveStatus(1, me.taskCheckModelId, me);
                        }
                    });
            }
        }

        Ext.apply(me, {
            items: items
            //fbar: fbarItems
        });
        this.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.mon(me, 'activate', me.reconfig, me);
        me.callParent();
    },
    reconfig: function () {
        var me = this;
        var modelPanel = me.down('pvmData');
        if (modelPanel) {
            modelPanel.fireEvent('activate', modelPanel);
        }
    },
    _setAssigners: function () {
        var me = this;
        var originalAssigners = me.rawData.signroles;
        var roleData = [];
        if (!Ext.isEmpty(originalAssigners)) {
            Ext.each(originalAssigners.split(','), function (roleName) {
                roleData.push({
                    name: roleName
                });
            });
        }
        var columns = [
            {
                header: "角色名称",
                flex: 1,
                dataIndex: "name",
                editor: {
                    xtype: 'textfield'
                }
            }
        ];
        var store = Ext.create("Ext.data.Store", {
            fields: ['name'],
            data: roleData
        });
        var cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 2
        });
        var toolBarItems = [];
        if(!me.localMode){
            toolBarItems = [
                {
                    iconCls: 'icon-create',
                    text: '新增',
                    itemId: 'create',
                    handler: function () {
                        var grid = this.up("window").down("grid");
                        var store = grid.getStore();
                        var rec = {
                            name: '新增角色'
                        };
                        store.insert(store.getCount(), rec);
                    }
                },
                {
                    iconCls: 'icon-delete',
                    text: '删除',
                    itemId: 'delete',
                    handler: function () {
                        var grid = this.up("window").down("grid");
                        var store = grid.getStore();
                        store.remove(OrientExtUtil.GridHelper.getSelectedRecord(grid));
                    }
                },
                {
                    iconCls: 'icon-save',
                    text: '保存',
                    itemId: 'save',
                    handler: function () {
                        var btn = this;
                        var grid = this.up("window").down("grid");
                        //判断是否有有重复的列
                        var store = grid.getStore();
                        var assignerArray = [];
                        var containsRepeat = false;
                        store.each(function (record) {
                            var roleName = record.get("name");
                            if (!Ext.Array.contains(assignerArray, roleName)) {
                                assignerArray.push(roleName);
                            } else {
                                containsRepeat = true;
                            }
                        });
                        if (containsRepeat === true) {
                            OrientExtUtil.Common.err(OrientLocal.prompt.error, OrientLocal.prompt.containsRepeatRole);
                        } else {
                            //重新整理数据 保存至数据库
                            me._saveAssignRoles(assignerArray, function () {
                                var belongWin = btn.up("window");
                                belongWin.close();
                            });
                        }
                    }
                },
                {
                    iconCls: 'icon-close',
                    text: '关闭',
                    itemId: 'close',
                    handler: function () {
                        var belongWin = this.up("window");
                        belongWin.close();
                    }
                }
            ];
        }

        var toolBar = Ext.create('Ext.toolbar.Toolbar', {
            items: toolBarItems
        });
        var grid = Ext.create("Ext.grid.Panel", {
            columns: columns,
            plugins: [cellEditing],
            store: store,
            bbar: Ext.create('Ext.ux.statusbar.StatusBar', {
                text: '双击单元格即可编辑角色名称',
                iconCls: 'x-status-error'
            }),
            cellEditing: cellEditing,
            selModel: {
                mode: 'MULTI'
            },
            selType: "checkboxmodel"
        });
        var win = Ext.create('Ext.Window', {
            plain: true,
            height: 350,
            width: 400,
            layout: 'fit',
            maximizable: false,
            title: '设置签署角色',
            modal: true,
            items: [
                grid
            ],
            dockedItems: [toolBar]
        });
        win.show();
    },
    _saveAssignRoles: function (assignRoles, callBack) {
        var me = this;
        var assignRoleStr = assignRoles.join(',');
        var params = {
            taskCheckModelId: me.taskCheckModelId,
            signroles: assignRoleStr
        };
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/CheckModel/saveAssignRoles.rdm', params, true, function (resp) {
            me.rawData.signroles = assignRoleStr;
            if (callBack) {
                callBack.call(me);
            }
        });
    }
});