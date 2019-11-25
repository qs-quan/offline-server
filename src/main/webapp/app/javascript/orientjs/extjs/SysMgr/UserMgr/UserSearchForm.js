/**
 * Created by duanduanpan on 16-3-16.
 */
Ext.define('OrientTdm.SysMgr.UserMgr.UserSearchForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.userSearchForm',
    buttonAlign: 'center',
    actionUrl: serviceName + '/user/search.rdm',
    initComponent: function () {
        var me = this;
        var gradeStore = me.createGradeStore();
        Ext.apply(this, {
            items: [
                {
                    xtype: 'panel',
                    bodyStyle: 'border-width:0 0 0 0; background:transparent',
                    layout: 'hbox',
                    combineErrors: true,
                    defaults: {
                        flex: 1
                    },
                    layoutConfig: {
                        pack: "start",
                        align: "stretch"
                    },
                    items: [{
                        xtype: 'fieldcontainer',
                        layout: 'anchor',
                        combineErrors: true,
                        defaults: {
                            flex: 1,
                            anchor: '100%'
                        },
                        items: [
                            {
                                name: 'userName',
                                xtype: 'textfield',
                                fieldLabel: '账号',
                                margin: '0 5 5 0'
                            },
                            {
                                name: 'allName',
                                xtype: 'textfield',
                                fieldLabel: '姓名',
                                margin: '0 5 5 0'
                            }
                        ]
                    }, {
                        xtype: 'fieldcontainer',
                        layout: 'anchor',
                        combineErrors: true,
                        defaults: {
                            flex: 1,
                            anchor: '100%'
                        },
                        layoutConfig: {
                            pack: "start",
                            align: "stretch"
                        },
                        items: [{
                            name: 'grade',
                            xtype: 'combobox',
                            fieldLabel: '密级',
                            displayField: 'value',
                            valueField: 'id',
                            editable: false,
                            margin: '0 5 5 0',
                            store: gradeStore
                        }]
                    }]
                }
            ],
            buttons: [{
                text: '查询',
                iconCls: 'icon-query',
                handler: function () {
                    var form = this.up('form');
                    var vals = form.getForm().getValues();
                    for (var key in vals) {
                        if (!vals[key]) {
                            delete vals[key];
                        }
                    }
                    //OrientExtUtil.AjaxHelper.doRequest(serviceName + '/user/search.rdm', vals, true, function (resp) {
                    //    var data = resp.decodedData;
                    //    //保存成功后操作
                    //    if (form.successCallback) {
                    //        me.ownerCt.centerPanel.down('UserList').fireEvent("loadSearchData",data.results);
                    //    }
                    //});

                    for (var key in vals) {
                        me.ownerCt.centerPanel.down('UserList').getStore().getProxy().setExtraParam(key, vals[key]);
                    }
                    me.ownerCt.centerPanel.down('UserList').getStore().loadPage(1);
                }
            }, {
                text: '清空',
                iconCls: 'icon-clear',
                handler: function () {
                    var form = this.up('form');
                    var vals = form.getForm().getValues();
                    form.getForm().reset();
                    var deptNode = me.ownerCt.centerPanel.down('UserDeptTree').getSelectionModel().getSelection()[0];
                    for (var key in vals) {
                        me.ownerCt.centerPanel.down('UserList').getStore().getProxy().setExtraParam(key, null);
                    }
                    me.ownerCt.centerPanel.down('UserList').fireEvent("filterByDepId", deptNode.data.id);
                    //me.ownerCt.centerPanel.down('UserList').fireEvent("refreshGrid");
                }
            }
            ]
        });
        this.callParent(arguments);
    },
    createGradeStore: function () {
        var store = Ext.create('Ext.data.Store', {
            autoLoad: true,
            proxy: {
                type: 'ajax',
                startParam: 'startIndex',
                limitParam: 'maxResults',
                url: serviceName + '/orientForm/getEnumCombobox.rdm?restrictionId=u3',
                pageSize: 25,
                reader: {
                    type: 'json',
                    totalProperty: 'totalProperty',
                    root: 'results'
                }
            },
            fields: [{
                name: "id",
                type: 'string'
            }, {
                name: "value",
                type: 'string'
            }]
        });
        return store;
    }


});
