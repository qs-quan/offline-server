/**
 * Created by Administrator on 2016/7/19 0019
 */
Ext.define('OrientTdm.Common.Extend.Form.Selector.UserComponents.CommonUserPanel', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientGrid',
    alternateClassName: 'OrientExtend.CommonUserPanel',
    alias: 'widget.commonUserPanel',
    requires: [
        'OrientTdm.SysMgr.UserMgr.Model.UserListExtModel'
    ],
    //usePage: false,
    config: {
        extraFilter: '',
        selectedUsers: {},
        filtering: false,
        multiSelect: false
    },
    loadMask: true,
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            listeners: {
                select: function (grid, record, index, eOpts) {
                    if (!me.multiSelect) {
                        me.selectedUsers = {};
                    }
                    if (record.data) {
                        me.selectedUsers[record.data.id] = record.data;
                        //刷新日历 如果存在的话
                        var userId = record.data.id;
                        var calendarTaskPanel = me.up('chooseUserPanel').down('calendarTaskPanel');
                        if (calendarTaskPanel) {
                            calendarTaskPanel.fireEvent('refreshByUserId', userId);
                        }
                    }
                    //选中后增加保存记录的图片
                    var chooseUserBrowser = me.up('chooseUserPanel').down('chosenuserbrowser');
                    var chosenUsers = chooseUserBrowser.selectedUsers;
                    var tplData = [];
                    if (me.multiSelect) {
                        //将之前已选择的用户加入新选用户中
                        for (var i = 0; i < chosenUsers.length; i++) {
                            if (!Ext.isEmpty(chosenUsers[i]) && chosenUsers[i]['id'].length > 0) {
                                tplData.push({
                                    name: chosenUsers[i]['allName'],
                                    icon: 'app/images/head/defaultUser.png',
                                    userName: chosenUsers[i]['userName']
                                });
                            }
                        }
                    } else {
                        chooseUserBrowser.selectedValue = '';
                        chooseUserBrowser.selectedUsers = [];
                    }

                    var records = me.getSelectionModel().getSelection();
                    for (var i = 0; i < records.length; i++) {
                        var find = false;
                        for (var j = 0; j < tplData.length; j++) {
                            if (records[i].data.userName == tplData[j].userName) {
                                find = true;
                            }
                        }
                        if (!find) {  //若已选用户中再次被选择，不再继续加入
                            tplData.push({
                                name: records[i].data.allName,
                                icon: 'app/images/head/defaultUser.png',
                                userName: records[i].data['userName']
                            });
                            chooseUserBrowser.selectedValue += ',' + records[i].data.userName;
                            chooseUserBrowser.selectedUsers.push(records[i].data);
                        }
                    }
                    chooseUserBrowser.getStore().loadData(tplData);
                }
            }
        });

        me.on('deselect', me.deselectUser, me);
        this.callParent(arguments);

        if (me.multiSelect) {
            me.getSelectionModel().setSelectionMode('MULTI');
        } else {
            me.getSelectionModel().setSelectionMode('SINGLE');
        }
    },
    initEvents: function () {
        var me = this;
        me.callParent();
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
    createStore: function () {
        var me = this;
        var retVal = Ext.create('Ext.data.Store', {
            model: 'OrientTdm.SysMgr.UserMgr.Model.UserListExtModel',
            autoLoad: true,
            proxy: {
                type: 'ajax',
                api: {
                    "read": (me.filterTH && me.filterTH != "") ?
                        // 产品通用
                        serviceName + '/TbomRoleController/listByRoleIdAndTH.rdm' :
                        // 试验团队人员分配特殊用
                        serviceName + '/user/listByFilter.rdm'
                },
                reader: {
                    type: 'json',
                    successProperty: 'success',
                    root: 'results',
                    totalProperty: 'totalProperty',
                    messageProperty: 'msg'
                },
                extraParams: {
                    filterTH: me.filterTH,
                    extraFilter: Ext.isEmpty(me.extraFilter) ? '' : Ext.encode(me.extraFilter)
                }
            },
            listeners: {
                beforeload: function () {
                    //me.removeListener('deselect', me.deselectUser, me);
                },
                load: function (store, records, successful, eOpts) {
                    me.filtering = false;
                    var toSelectRecords = [];
                    var userArr = me.selectedValue.split(',');
                    for (var i = 0; i < records.length; i++) {
                        var record = records[i];
                        var flag = false;
                        for (var j in userArr) {
                            if (userArr[j] === (record.data.userName)) {
                                flag = true;
                            }
                        }
                        if (!Ext.isEmpty(me.selectedUsers[records[i].data.id]) || flag) {
                            toSelectRecords.push(records[i]);
                            me.getSelectionModel().select(records[i]);
                        }
                    }

                }
            }
        });
        this.store = retVal;
        return retVal;
    },
    deselectUser: function (grid, record, index, eOpts) {
        var me = this;
        if (me.filtering) {
            return;
        }
        delete me.selectedUsers[record.data.id];

        //修改保存记录的图片
        var chooseUserBrowser = me.up('chooseUserPanel').down('chosenuserbrowser');
        var chosenUsers = chooseUserBrowser.selectedUsers;
        chooseUserBrowser.selectedUsers = [];
        chooseUserBrowser.selectedValue = '';
        var tplData = [];
        for (var i = 0; i < chosenUsers.length; i++) {
            if (!Ext.isEmpty(chosenUsers[i]) && chosenUsers[i]['userName'] == record.data.userName) {

            } else if (!Ext.isEmpty(chosenUsers[i]) && chosenUsers[i]['userName'].length > 0) {
                tplData.push({
                    name: chosenUsers[i]['allName'],
                    icon: 'app/images/head/defaultUser.png',
                    userName: chosenUsers[i]['userName']
                });
                chooseUserBrowser.selectedUsers.push(chosenUsers[i]);
                chooseUserBrowser.selectedValue += chosenUsers[i]['userName'] + ',';
            }
        }

        chooseUserBrowser.getStore().loadData(tplData);
    }
});