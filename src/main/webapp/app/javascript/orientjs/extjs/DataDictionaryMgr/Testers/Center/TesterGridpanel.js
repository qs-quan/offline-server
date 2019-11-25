/**
 * 试验人员管理
 * Created by dailin on 2019/5/23 15:17.
 */

Ext.define('OrientTdm.DataDictionaryMgr.Testers.Center.TesterGridpanel',{
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    // alias: 'widget.testerGridpanel',
    config: {},
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,

    initComponent: function () {
        var me = this;
        me.padding = '0 0 0 5';
        me.callParent(arguments);
    },

    //视图初始化
    createToolBarItems: function () {
        var me = this;
        var retVal = [{
            iconCls: 'icon-create',
            text: '选择',
            itemId: 'create',
            scope: me,
            handler: me.chooseImplementPeople
        },{
            iconCls: 'icon-delete',
            text: '删除',
            disabled: false,
            itemId: 'delete',
            scope: me,
            handler: me.deleteImplementPeople
        }];
        return retVal;
    },

    // 创建列表
    createColumns: function() {
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
                header: '密级',
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

    // 创建数据源
    createStore: function () {
        var me = this;
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.SysMgr.UserMgr.Model.UserListExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    /*todo url有，但是要传一个新的url*/
                    // 如果传了readUrl就用传参的url如果没有传则使用啥都没过滤的list进行查询,应该要更改
                    "read": me.readUrl ? me.readUrl : serviceName + '/TesterController/getUserListFilterByTestType.rdm'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    root: 'results',
                    totalProperty: 'totalProperty',
                    messageProperty: 'msg'
                },
                extraParams: {
                    testTypeId: me.nodeId,
                    isPositive: 'true'
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

    /**
     * 选择人员
     */
    chooseImplementPeople: function() {
        var me = this;
        var filterIds = [];
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TesterController/getUserIdsAfterFilter.rdm',{
            columnName: "ID",
            modelName: "T_SYLX",
            schemaId: OrientExtUtil.FunctionHelper.getSYZYSchemaId(),
            value: me.nodeId
        },false, function (response) {
            filterIds = response.decodedData;
        });
        var me = this;
        var win = Ext.create('Ext.Window', {
            plain: true,
            height: 600,
            width: 800,
            layout: 'fit',
            maximizable: false,
            title: '选择用户',
            modal: true
        });

        var userSelectorPanel = Ext.create('OrientTdm.Common.Extend.Form.Selector.ChooseUserPanel', {
            multiSelect: true,
            extraFilter: {
                idFilter: {'not in': filterIds.join(",")}
            },
            saveAction: function (saveData, callBack) {
                var showValues = Ext.Array.pluck(saveData, 'name').join(',');
                var realValues = Ext.Array.pluck(saveData, 'userName').join(',');
                var userIds = Ext.Array.pluck(saveData, 'id').join(',');
                if (userIds == "") {
                    OrientExtUtil.Common.info('提示','请选择至少一个用户');
                    return;
                }
                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TesterController/addUsersToTestTypeRelation.rdm',{
                    userIds: userIds,
                    testTypeId: me.nodeId
                }, false, function (response) {
                    var retV = response.decodedData;
                    if (retV.success) {
                        OrientExtUtil.Common.tip('提示', retV.results);
                        me.refreshGrid();
                    } else {
                        OrientExtUtil.Common.tip('提示', '新增失败');
                        me.refreshGrid();
                    }
                    win.close();
                });
            }
        });

        win.add(userSelectorPanel);
        win.show();
    },

    /**
     * 删除选中人员
     */
    deleteImplementPeople: function () {
        var me = this;
        if (!OrientExtUtil.GridHelper.hasSelected(me)) {
            OrientExtUtil.Common.info('提示', '请至少选择一条记录');
            return;
        }
        var ids = OrientExtUtil.GridHelper.getSelectRecordIds(me).join(",");
        OrientExtUtil.AjaxHelper.doRequest(serviceName + "/TesterController/deleteUsersToTestTypeRelation.rdm", {
            userIds: ids,
            testTypeId: me.nodeId
        }, false, function (response) {
            var retV = response.decodedData;
            if (retV.success) {
                OrientExtUtil.Common.tip('提示', retV.results);
                me.refreshGrid();
            } else {
                OrientExtUtil.Common.tip('删除', '删除失败');
            }
        })

    }
});

