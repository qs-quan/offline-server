/**
 * Created by Seraph on 16/8/22.
 */
Ext.define('OrientTdm.Collab.common.collabFlow.AssignUserPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    config: {
        taskInfo : null,
        piId : null
    },
    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            items: [
                {
                    xtype: 'fieldset',
                    title: '详情',
                    collapsible: true,
                    margin: '5 5 5 5',
                    defaults: {
                        labelWidth: 89,
                        anchor: '100%',
                        layout: {
                            type: 'vbox',
                            defaultMargins: {top: 15, right: 15, bottom: 0, left: 15}
                        }
                    },
                    items: [
                        me.getUserSelectField()
                    ]
                }
            ],
            buttons: [{
                text: '保存',
                iconCls: 'icon-saveAssignee',
                handler: function () {

                    var assignedUsers = me.queryBy(function (item) {

                        if(Ext.isEmpty(item.name) || item.name !== "assignUserField"){
                            return false;
                        }
                    });

                    var assignee = assignedUsers[0].userName;
                    if(Ext.isEmpty(assignee)){
                        Ext.Msg.alert('提示', '人员未修改或未设置');
                        return;
                    }
                    me.doAssignUser(assignee, function () {
                        me.up("window").close();
                    })

                }
            }
            ]
        });
        this.callParent(arguments);
    },
    getUserSelectField : function (callBack) {
        var me = this;
        return Ext.create("Ext.form.TextField", {
            name: 'assignUserField',
            fieldLabel: '执行人',
            margin: '0 5 5 0',
            allowBlank: false,
            grow: true,
            labelWidth: 100,
            value : me.taskInfo.assRealName,
            width:300,
            listeners : {
                focus : function (field) {
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
                        selectedValue : me.taskInfo.assignee,
                        saveAction: function (saveData, callBack) {
                            var showValues = Ext.Array.pluck(saveData, 'name').join(',');
                            var realValues = Ext.Array.pluck(saveData, 'userName').join(',');

                            field.setValue(showValues);
                            field.userName = realValues;

                            if (callBack) {
                                callBack.call(this);
                            }
                            win.close();
                        }
                    });

                    win.add(userSelectorPanel);
                    win.show();
                }
            }
        });
    },
    doAssignUser : function (assignUsers, callback) {
        Ext.getBody().mask("请稍后...", "x-mask-loading");

        var me = this;

        var params = {
            taskName : me.taskInfo.name,
            piId : me.piId,
            assignee : assignUsers
        };

        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/flow/task/assignee/set.rdm', params, false, function (response) {
            var retV = response.decodedData;
            var success = retV.success;
            if(success){
                if (callback) {
                    callback.call(me);
                }
            }else{
                Ext.Msg.alert('提示', retV.message);
            }
        });
    }
});