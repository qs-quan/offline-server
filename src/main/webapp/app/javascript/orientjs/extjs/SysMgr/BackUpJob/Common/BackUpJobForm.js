/**
 * Created by Administrator on 2016/6/30 0030.
 */

Ext.define('OrientTdm.SysMgr.BackUpJob.Common.BackUpJobForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.backUpJobForm',
    initComponent: function () {
        var me = this;
        var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
        var weekDayStore = Ext.create('Ext.data.Store', {
            fields: ['value', 'name'],
            data: [
                {"value": "1", "name": "周一"},
                {"value": "2", "name": "周二"},
                {"value": "3", "name": "周三"},
                {"value": "4", "name": "周四"},
                {"value": "5", "name": "周五"},
                {"value": "6", "name": "周六"},
                {"value": "7", "name": "周日"}
            ]
        });
        var monthDayStore = Ext.create('Ext.data.Store', {
            fields: ['value', 'name'],
            data: [
                {"value": "1", "name": "1日"},
                {"value": "2", "name": "2日"},
                {"value": "3", "name": "3日"},
                {"value": "4", "name": "4日"},
                {"value": "5", "name": "5日"},
                {"value": "6", "name": "6日"},
                {"value": "7", "name": "7日"},
                {"value": "8", "name": "8日"},
                {"value": "9", "name": "9日"},
                {"value": "10", "name": "10日"},
                {"value": "11", "name": "11日"},
                {"value": "12", "name": "12日"},
                {"value": "13", "name": "13日"},
                {"value": "14", "name": "14日"},
                {"value": "15", "name": "15日"},
                {"value": "16", "name": "16日"},
                {"value": "17", "name": "17日"},
                {"value": "18", "name": "18日"},
                {"value": "19", "name": "19日"},
                {"value": "20", "name": "20日"},
                {"value": "21", "name": "21日"},
                {"value": "22", "name": "22日"},
                {"value": "23", "name": "23日"},
                {"value": "24", "name": "24日"},
                {"value": "25", "name": "25日"},
                {"value": "26", "name": "26日"},
                {"value": "27", "name": "27日"},
                {"value": "28", "name": "28日"},
                {"value": "29", "name": "29日"},
                {"value": "30", "name": "30日"}
            ]
        });
        var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
        Ext.apply(this, {
            items: [
                {
                    name: 'backname',
                    xtype: 'textfield',
                    fieldLabel: '定时任务名称',
                    allowBlank: false
                }, {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    combineErrors: true,
                    defaults: {
                        flex: 1,
                        margin: '0 5 0 0'
                    },
                    items: [
                        {
                            xtype: "radiogroup",
                            columns: 1,
                            vertical: true,
                            flex: 0.15,
                            items: [
                                {
                                    boxLabel: '每日',
                                    name: 'backStrategy',
                                    inputValue: '1',
                                    checked: true,
                                    listeners: {
                                        change: me.radioSelected,
                                        scope: me
                                    }
                                }
                            ]
                        }, {
                            name: 'daybacktime',
                            xtype: 'timefield',
                            format:'G:i:s'
                        }
                    ]
                }, {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    combineErrors: true,
                    defaults: {
                        flex: 1,
                        margin: '0 5 0 0'
                    },
                    items: [
                        {
                            xtype: "radiogroup",
                            columns: 1,
                            flex: 0.15,
                            vertical: true,
                            items: [
                                {
                                    boxLabel: '每周',
                                    name: 'backStrategy',
                                    inputValue: '2',
                                    listeners: {
                                        change: me.radioSelected,
                                        scope: me
                                    }
                                }
                            ]
                        }, {
                            flex: 0.15,
                            name: 'weekbackday',
                            xtype: 'combobox',
                            queryMode: 'local',
                            displayField: 'name',
                            valueField: 'value',
                            store: weekDayStore
                        }, {
                            name: 'weekbacktime',
                            xtype: 'timefield',
                            format:'G:i:s'
                        }
                    ]
                }, {
                    xtype: 'fieldcontainer',
                    layout: 'hbox',
                    combineErrors: true,
                    defaults: {
                        flex: 1,
                        margin: '0 5 0 0'
                    },
                    items: [
                        {
                            xtype: "radiogroup",
                            columns: 1,
                            flex: 0.15,
                            vertical: true,
                            items: [
                                {
                                    boxLabel: '每月',
                                    name: 'backStrategy',
                                    inputValue: '3',
                                    listeners: {
                                        change: me.radioSelected,
                                        scope: me
                                    }
                                }
                            ]
                        }, {
                            name: 'monthbackday',
                            flex: 0.15,
                            xtype: 'combobox',
                            queryMode: 'local',
                            displayField: 'name',
                            valueField: 'value',
                            store: monthDayStore
                        }, {
                            name: 'monthbacktime',
                            xtype: 'timefield',
                            format:'G:i:s'
                        }
                    ]
                }, {
                    xtype: 'hiddenfield',
                    name: 'id'
                }, {
                    xtype: 'hiddenfield',
                    name: 'isdayback'
                }, {
                    xtype: 'hiddenfield',
                    name: 'ismonthback'
                }, {
                    xtype: 'hiddenfield',
                    name: 'isweekback'
                }
            ],
            buttons: [
                {
                    text: '新建定时任务',
                    iconCls: 'icon-create',
                    handler: function () {
                        var radio = me.down("radiofield[checked=true]");
                        var radioValue = radio.inputValue;
                        if (radioValue === "1") {
                            me.down("hiddenfield[name=isdayback]").setValue(1);
                        } else if (radioValue === "2") {
                            me.down("hiddenfield[name=isweekback]").setValue(1);
                        } else if (radioValue === "3") {
                            me.down("hiddenfield[name=ismonthback]").setValue(1);
                        }
                        me.fireEvent("saveOrientForm");
                    }
                }
            ]
        });
        this.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
    },
    radioSelected: function (radio) {
        var me = this;
        if (radio.checked == true) {
            Ext.each(me.query("combobox"), function (loopCombobox) {
                loopCombobox.setValue(null);
            });
            Ext.each(me.query("textfield"), function (loopTextField) {
                loopTextField.setValue(null);
            });
            var nextNode = radio.nextNode();
            if (nextNode.getXType() == 'combobox') {
                nextNode.setValue("1");
               // nextNode.nextNode().setValue("23:59:59");
            } else {
               // nextNode.setValue("23:59:59");
            }
        }
    },
    clearBackStrategy: function () {
        var me = this;
        me.down("hiddenfield[name=isdayback]").setValue(null);
        me.down("hiddenfield[name=isweekback]").setValue(null);
        me.down("hiddenfield[name=ismonthback]").setValue(null);

    }
});