/**
 * Created by Administrator on 2016/7/19 0019.
 */
Ext.define('OrientTdm.TestResourceMgr.testSyjMgr.Syj.UnSelectedSyjPanel', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientModelGrid',
    alternateClassName: 'OrientExtend.UnSelectedSyjPanel',
    alias: 'widget.UnSelectedSyjPanel',
    loadMask: true,
    requires: [],
    config: {
        //过滤
        selectedValue: '',
        //extraFilters: [],
        multiSelect: false
    },

    initComponent: function () {
        var me = this;
        var modelId = me.modelId;
        me.customerFilter = me.extraFilters;
        if (me.selectedValue) {
            me.customerFilter.push(new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.NotIn, "", me.selectedValue));
        }
        // for(var i=0; i<me.extraFilters.length; i++) {
        //     me.customerFilter.push(me.extraFilters[i]);
        // }

        Ext.apply(me, {
            listeners: {
                select: function(rowModel, record, index) {
                    var northPanel = me.ownerCt.northPanel;
                    var existIds = northPanel.getAllRecordIds();
                    if(!me.multiSelect && existIds.length>0) {
                        OrientExtUtil.Common.tip("提示", "只能选择一个试验件");
                        return;
                    }

                    var selectedId = record.get("id");
                    if(!Ext.Array.contains(existIds, selectedId)) {
                        northPanel.getStore().insert(0, record);
                        me.getStore().remove(record);
                    }
                },
                itemdblclick: function(view, record, item, index) {
                    me.ownerCt.eastPanel.loadSyjRecord(record);
                }
            }
        });
        this.callParent(arguments);
    },

    initEvents: function () {
        var me = this;
        me.callParent();
    },

    /**
     * 视图初始化
     * @returns {*[]}
     */
    createToolBarItems: function () {
        var me = this;
        var retVal = [{
                text: '选择',
                iconCls: 'icon-create',
                handler: function (btn) {
                    if (!OrientExtUtil.GridHelper.hasSelected(me)) {
                        return;
                    }
                    var selectedRecords = OrientExtUtil.GridHelper.getSelectedRecord(me);

                    var northPanel = me.ownerCt.northPanel;
                    var existIds = northPanel.getAllRecordIds();
                    if(!me.multiSelect && existIds.length>0) {
                        OrientExtUtil.Common.tip("提示", "只能选择一个试验件");
                        return;
                    }

                    for(var i=0; i<selectedRecords.length; i++) {
                        var selectedId = selectedRecords[i].get("id");
                        if(!Ext.Array.contains(existIds, selectedId)) {
                            northPanel.getStore().insert(0, selectedRecords[i]);
                            me.getStore().remove(selectedRecords[i]);
                        }
                    }
                }
            },"-",{
                text: '查询',
                iconCls: 'icon-query',
                handler: function (btn) {
                    var form = Ext.create("OrientTdm.Common.Extend.Form.OrientQueryModelForm", {
                        title: '查询【<span style="color: red; ">' + me.modelDesc.text + '</span>】数据',
                        rowNum: 2,
                        buttonAlign: 'center',
                        buttons: [{
                                itemId: 'doQuery',
                                text: '查询',
                                iconCls: 'icon-query',
                                scope: me,
                                handler: function (btn) {
                                    btn.up("form").fireEvent("doQuery", function () {
                                        me.fireEvent("refreshGridByQueryFilter");
                                    }, me);
                                }
                            },{
                                itemId: 'doQueryAll',
                                text: '查询全部',
                                iconCls: 'icon-query',
                                scope: me,
                                handler: function (btn) {
                                    me.fireEvent("refreshGridByCustomerFilter");
                                }
                            },{
                                itemId: 'back',
                                text: '关闭',
                                iconCls: 'icon-close',
                                scope: me,
                                handler: function (btn) {
                                    var southPanel = me.ownerCt.southPanel;
                                    southPanel.hide();
                                }
                            }
                        ],
                        successCallback: function() {
                            me.fireEvent("refreshGrid");
                        },
                        bindModelName: me.modelDesc.dbName,
                        modelDesc: me.modelDesc
                    });
                    var southPanel = me.ownerCt.southPanel;
                    southPanel.removeAll();
                    southPanel.add(form);
                    southPanel.doLayout();
                    southPanel.show();
                }
            },"->",{
                xtype: 'trigger',
                triggerCls: 'x-form-clear-trigger',
                onTriggerClick: function () {
                    this.setValue('');
                    me.getStore().clearFilter();
                    me.getStore().reload();
                },
                emptyText: '快速搜索',
                enableKeyEvents: true,
                listeners: {
                    keyup: function (field, e) {
                        if (Ext.EventObject.ESC == e.getKey()) {
                            field.onTriggerClick();
                        }else {
                            var search = this.getRawValue();
                            me.getStore().filterBy(function (record) {
                                var name = record.get('C_BH_'+me.modelId);
                                var code = record.get('C_MC_'+me.modelId);
                                if(name && name.indexOf(search)!=-1) {
                                    return true;
                                }
                                if(code && code.indexOf(search)!=-1) {
                                    return true;
                                }
                                return false;
                            });
                        }
                    }
                }
            }
        ];
        return retVal;
    },

    /**
     * 根据试验件分类过滤试验件列表
     * @param syjTypeId
     */
    filterBySyjTypeId: function (syjTypeId) {
        var me = this;
        var filter = [];

        var selected = me.ownerCt.northPanel.getAllRecordIds().join(",");
        if(selected) {
            filter.push(new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.NotIn, "", selected));
        }
        if(syjTypeId && "-1" != syjTypeId) {
            filter.push(new CustomerFilter("T_SYJFL_"+TDM_SERVER_CONFIG.DEVICE_SCHEMA_ID+"_ID", CustomerFilter.prototype.SqlOperation.In, "", syjTypeId));
        }
        for(var i=0; i<me.extraFilters.length; i++) {
            filter.push(me.extraFilters[i]);
        }
        if(filter.length == 0) {
            filter.push(new CustomerFilter("1", CustomerFilter.prototype.SqlOperation.Equal, "", "1"));
        }

        me.customerFilter = [];
        me.refreshGridByCustomerFilter(filter, true);
    }

});