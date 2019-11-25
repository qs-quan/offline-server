/**
 * Created by Administrator on 2016/7/8 0008.
 */
Ext.define('OrientTdm.DataMgr.Import.MapModelColumnPanel', {
    alias: 'widget.mapModelColumnPanel',
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    autoScroll: true,
    requires: [
        'Ext.ux.statusbar.StatusBar'
    ], config: {
        modelDesc: {}
    },
    initComponent: function () {
        var me = this;
        /*Ext.apply(me, {
            bbar: Ext.create('Ext.ux.statusbar.StatusBar', {
                text: '重复映射的字段将被忽略',
                iconCls: 'x-status-error'
            })
        });*/
        me.callParent(arguments);
        me.addEvents('loadMapping');
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'loadMapping', me._loadMapping, me);
    },
    _loadMapping: function (columns) {
        var me = this;
        me.removeAll();

        var colDescs = me.modelDesc.columns;

        var labelWidth = 70;
        Ext.Array.map(Ext.Array.pluck(colDescs, 'text'), function (item) {
            var length = item.length * 12;
            labelWidth = labelWidth > length ? labelWidth : length;
        });

        var store = Ext.create('Ext.data.Store', {
            fields: ["header", "dataIndex"],
            data: columns
        });
        Ext.each(colDescs, function (colDesc) {
            var val = null;
            var index = store.find("header", colDesc.text);
            if (index >= 0) {
                val = store.getAt(index);
            }
            if (colDesc.type == 'C_DateTime' || colDesc.type == 'C_Date') {
                var container = {
                    xtype: 'fieldcontainer',
                    fieldLabel: colDesc.text,
                    labelWidth: labelWidth,
                    padding: '0 0 5 0',
                    layout: 'hbox',
                    columnDesc: colDesc,
                    items: [
                        {
                            xtype: 'combo',
                            flex: 2,
                            name: colDesc.sColumnName,
                            fieldLabel: '',
                            labelWidth: 0,
                            allowBlank: !colDesc.isRequired,
                            emptyText: '选择映射的文件列',
                            store: store,
                            forceSelection: true,
                            queryMode: 'local',
                            displayField: 'header',
                            valueField: 'dataIndex',
                            value: val
                        },
                        {
                            xtype: 'combo',
                            flex: 3,
                            name: colDesc.sColumnName + "_timeformat",
                            fieldLabel: '',
                            labelWidth: 0,
                            allowBlank: !colDesc.isRequired,
                            emptyText: '选择或输入日期格式',
                            store: Ext.create('Ext.data.ArrayStore', {
                                fields: ["format"],
                                data: [
                                    ["时间戳"],
                                    ["yyyy-MM-dd"],
                                    ["yyyy/MM/dd"],
                                    ["yyyy年MM月dd日"],
                                    ["yyyy-MM-dd hh:mm:ss"],
                                    ["yyyy/MM/dd hh:mm:ss"],
                                    ["yyyy年MM月dd日hh:mm:ss"]
                                ]
                            }),
                            queryMode: 'local',
                            displayField: 'format',
                            valueField: 'format'
                        }
                    ]
                };
                me.add(container);
            }
            else if (colDesc.type == 'C_Relation') {
                var copyModelDesc = Ext.decode(Ext.encode(colDesc));
                copyModelDesc.text = '';
                var container = {
                    xtype: 'fieldcontainer',
                    fieldLabel: colDesc.text,
                    labelWidth: labelWidth,
                    padding: '0 0 5 0',
                    layout: 'hbox',
                    columnDesc: colDesc,
                    items: [
                        {
                            xtype: 'RelationColumnDesc',
                            name: colDesc.sColumnName,
                            columnDesc: copyModelDesc
                        }
                    ]
                };
                me.add(container);
            }
            else if (colDesc.sModelName == "T_XMCSJL_500") {
                if (colDesc.text != '任务id' && colDesc.text != "节点关系id") {
                    var container = {
                        xtype: 'fieldcontainer',
                        fieldLabel: colDesc.text,
                        labelWidth: labelWidth,
                        padding: '0 0 5 0',
                        layout: 'hbox',
                        columnDesc: colDesc,
                        items: [
                            {
                                xtype: 'combo',
                                name: colDesc.sColumnName,
                                fieldLabel: '',
                                labelWidth: 0,
                                allowBlank: !colDesc.isRequired,
                                emptyText: '选择映射的文件列',
                                store: store,
                                forceSelection: true,
                                queryMode: 'local',
                                displayField: 'header',
                                valueField: 'dataIndex',
                                columnDesc: colDesc,
                                value: val
                            }
                        ]
                    };
                    me.add(container);
                }
            }
            else {
                var container = {
                    xtype: 'fieldcontainer',
                    fieldLabel: colDesc.text,
                    labelWidth: labelWidth,
                    padding: '0 0 5 0',
                    layout: 'hbox',
                    columnDesc: colDesc,
                    items: [
                        {
                            xtype: 'combo',
                            name: colDesc.sColumnName,
                            fieldLabel: '',
                            labelWidth: 0,
                            allowBlank: !colDesc.isRequired,
                            emptyText: '选择映射的文件列',
                            store: store,
                            forceSelection: true,
                            queryMode: 'local',
                            displayField: 'header',
                            valueField: 'dataIndex',
                            columnDesc: colDesc,
                            value: val
                        }
                    ]
                };
                me.add(container);
            }
        });

    }
});