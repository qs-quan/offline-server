/**
 * Created by Seraph on 16/8/5.
 */
Ext.define('OrientTdm.Collab.common.gantt.StartAuditFlowPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    config: {
        startCallback : null
    },
    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            items: [{
                    xtype: 'fieldset',
                    title: '详情',
                    collapsible: true,
                    defaults: {
                        labelWidth: 89,
                        anchor: '100%',
                        layout: {
                            type: 'vbox',
                            defaultMargins: {top: 15, right: 15, bottom: 0, left: 15}
                        }
                    },
                    items: [
                        Ext.bind(me.getUserSelectField, me)()
                    ]
            }],
            buttons: [{
                text: '启动',
                iconCls: 'icon-saveSingle',
                handler: function () {
                    me.down("textfield[name=selectUserField]").startCallback(assignedUser);
                }
            }]
        });
        this.callParent(arguments);
    },
    getUserSelectField : function (fieldName) {
        var me = this;
        return Ext.create("Ext.form.TextField", {
            name: "selectUserField",
            fieldLabel: '处理人',
            margin: '0 5 5 0',
            allowBlank: false,
            grow: true,
            labelWidth: 100,
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
                        multiSelect: false,
                        saveAction: function (saveData) {
                            var showValues = Ext.Array.pluck(saveData, 'name').join(',');
                            var realValues = Ext.Array.pluck(saveData, 'userName').join(',');

                            field.setValue(showValues);
                            field.userName = realValues;

                            win.close();
                        }
                    });

                    win.add(userSelectorPanel);
                    win.show();
                }
            }
        });
    }
});