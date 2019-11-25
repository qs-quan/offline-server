/**
 * 试验任务的配置人员的tab页内容
 * Created by dailin on 2019/4/13 14:30.
 */

Ext.define('OrientTdm.TestBomBuild.Panel.GridPanel.TaskUserList', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    requires: [
        "OrientTdm.Common.Util.OrientExtUtil"
    ],
    alias: 'widget.taskUserList',
    config: {
        extraFilter: ''
    },
    beforeInitComponent: Ext.emptyFn,
    afterInitComponent: Ext.emptyFn,

    initComponent: function () {
        var me = this;

        me.extraFilter = {};
        me.region = 'center';
        me.hasToolBar = false;
        me.showAnalysisBtns = false;
        /*if (me.cj == 3) {
            me.ryNodeId = OrientExtUtil.TreeHelper.getChildNode(4, me.nodeId, ["实施人员"]);
        } else {
            me.ryNodeId = me.nodeId;
        }

        var ids="";
        if(me.ryNodeId != "") {
            OrientExtUtil.AjaxHelper.doRequest(serviceName + "/TbomQueryController/getNodesRelationTableDataIds.rdm", {
                isAll: "1",
                isDataId: "1",
                nodeId: me.ryNodeId
            }, false, function (response) {
                if (response.decodedData.success) {
                    ids = response.decodedData.results;
                }
            });
        }*/
        me.extraFilter = me.getCustomerFilter();
        me.isView = 0;
        me.padding = '0 0 0 5';

        me.callParent(arguments);
    },

    initEvents: function () {
        var me = this;
        me.callParent();
    },

    //视图初始化
    createToolBarItems: function () {
        var me = this;
        var retVal = [];
       /* var retVal = [{
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
            handler: this.deleteImplementPeople
        }];
        me.actionItems = [];*/
        return retVal;
    },

/*    // 选择人员
    chooseImplementPeople: function() {
        // OrientExtUtil.Common.info('提示','这是选择人员的方法');
        var me = this;
        var existIds = me.extraFilter.idFilter["in"].split(",");
        // 试验项目（任务）或者是 实施人员
        if (me.cj == 3) {
            testTypeNodeId = me.treeNode.parentNode.raw.id;
        } else {
            testTypeNodeId = me.treeNode.parentNode.parentNode.raw.id;
        }

        var testTypeUserIds = "";
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomQueryController/getTestTypeUserIdsByTesttypeNodeId.rdm',{
            nodeId: testTypeNodeId
        },false,function (response) {
            if (response.decodedData.success) {
                testTypeUserIds = response.decodedData.results;
            }
        });
        // 查找其余的id
        var win = Ext.create('Ext.Window', {
            plain: true,
            height: 600,
            width: 800,
            layout: 'fit',
            maximizable: false,
            title: '选择用户',
            modal: true
        });

        var filterIdArray = [];
        Ext.each(testTypeUserIds.split(","), function (testTypeUserId) {
            if (!Ext.Array.contains(existIds,testTypeUserId)) {
                filterIdArray.push(testTypeUserId);
            }
        });
        var userSelectorPanel = Ext.create('OrientTdm.Common.Extend.Form.Selector.ChooseUserPanel', {
            multiSelect: true,
            extraFilter: {
                idFilter: {
                    'in': filterIdArray.join(",")
                }
            },
            saveAction: function (saveData, callBack) {
                var showValues = Ext.Array.pluck(saveData, 'name').join(',');
                var realValues = Ext.Array.pluck(saveData, 'userName').join(',');
                var userIds = Ext.Array.pluck(saveData, 'id').join(',');
                if (userIds == "") {
                    OrientExtUtil.Common.info('提示','请选择至少一个用户');
                    return;
                }

                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomInsertController/insertNodeByUserIds.rdm',{
                    pid: me.ryNodeId,
                    tableName: "CWM_SYS_USER",
                    userIds : userIds
                }, false, function (response) {
                    if (response.decodedData.success) {
                        OrientExtUtil.Common.tip('提示','选择人员成功');
                        me.extraFilter.idFilter['in'] =  me.extraFilter.idFilter['in'] + "," + userIds;
                        me.store.getProxy().setExtraParam("extraFilter",Ext.isEmpty(me.extraFilter) ? '' : Ext.encode(me.extraFilter));
                        // 重新加载这个节点有时候会没有用，就删除所有子节点重新再加载一次节点
                        if (me.treeNode) {
                            var childNodes = me.treeNode.childNodes;
                            for (var i = childNodes.length -1; i >= 0; i--) {
                                me.treeNode.removeChild(childNodes[i]);
                            }
                            me.treeNode.store.reload({node: me.treeNode});
                        }

                        me.fireEvent("refreshGrid");
                        win.close();
                    }
                });

            }
        });

        win.add(userSelectorPanel);
        win.show();
    },

    // 删除选中人员
    deleteImplementPeople: function() {
        // OrientExtUtil.Common.info('提示', '这是删除人员的方法');
        var me = this;
        if (OrientExtUtil.GridHelper.hasSelectedOne(me)) {
            // 删除前进行确认
            Ext.Msg.confirm('提示', '是否删除?',
                function (btn, text) {
                    if (btn == 'yes') {
                        var userIds = OrientExtUtil.GridHelper.getSelectRecordIds(me).join(',');
                        /!*todo url没有*!/
                        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomDeleteController/deleteShadowByPnodeAndMasterIds.rdm',{
                            dataIds: userIds,
                            type: "CWM_SYS_USER",
                            nodeId: me.ryNodeId
                        },false, function (response) {
                            OrientExtUtil.Common.tip('提示','人员删除成功');
                            var idArray = [];
                            Ext.each(me.extraFilter.idFilter['in'].split(","), function (id) {
                                if (!Ext.Array.contains(userIds.split(","),id)) {
                                    idArray.push(id);
                                }
                            });
                            me.extraFilter.idFilter['in'] =  idArray.join(",");
                            me.store.getProxy().setExtraParam("extraFilter",Ext.isEmpty(me.extraFilter) ? '' : Ext.encode(me.extraFilter));
                            me.fireEvent("refreshGrid");
                            // 重新加载这个节点有时候会没有用，就删除所有子节点重新再加载一次节点
                            if (me.treeNode) {
                                var childNodes = me.treeNode.childNodes;
                                for (var i = childNodes.length -1; i >= 0; i--) {
                                    me.treeNode.removeChild(childNodes[i]);
                                }
                                me.treeNode.store.reload({node: me.treeNode});
                            }

                            // me.doRefresh();
                        });
                    }
                });
            // 获取人员的ids
        } else {
            OrientExtUtil.Common.info('选择','请至少选择一个人员');
            return;
        }
    },*/

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

    getCustomerFilter: function () {
        var me = this;
        var customFilter = {'idFilter' : {'in': '-1'}};
        OrientExtUtil.AjaxHelper.doRequest(serviceName + "/TbomQueryController/getChildBom.rdm", {
            cj: parseInt(me.cj) + 1,
            nodeId: me.nodeId
        }, false, function (response) {
            if (response.decodedData) {
                var UserIds = Ext.Array.pluck(response.decodedData,'dataId').join(',');
                if (UserIds != "") {
                    customFilter.idFilter['in'] = UserIds;
                }
            }
        });
        return customFilter;
    },

    createStore: function () {
        var me = this;
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.SysMgr.UserMgr.Model.UserListExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    // 如果传了readUrl就用传参的url如果没有传则使用啥都没过滤的list进行查询
                    "read": me.readUrl ? me.readUrl : serviceName + '/user/listByFilter.rdm'
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
    }

});
