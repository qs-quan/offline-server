/**
 * Created by Administrator on 2016/7/19 0019.
 */
Ext.define('OrientTdm.TestResourceMgr.StaffMgr.StaffComponents.UnSelectedStaffPanel', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientModelGrid',
    alternateClassName: 'OrientExtend.UnSelectedStaffPanel',
    alias: 'widget.unSelectedStaffPanel',
    loadMask: true,
    requires: [

    ],
    config: {
        //过滤
        selectedValue: '',
        staffTypeValue: '-1',
        extraFilters: [],
        multiSelect: false
    },
    initComponent: function () {
        var me = this;
        me.customerFilter = [];
        if (me.selectedValue) {
            me.customerFilter.push(new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.NotIn, "", me.selectedValue));
        }
        if (me.staffTypeValue && "-1"!=me.staffTypeValue) {
            me.customerFilter.push(new CustomerFilter("T_RYFL_"+TDM_SERVER_CONFIG.DEVICE_SCHEMA_ID+"_ID", CustomerFilter.prototype.SqlOperation.Equal, "", me.staffTypeValue));
        }
        for(var i=0; i<me.extraFilters.length; i++) {
            me.customerFilter.push(me.extraFilters[i]);
        }
        this.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
    },
    //视图初始化
    createToolBarItems: function () {
        var me = this;
        var retVal = [
            {
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
                        OrientExtUtil.Common.tip("提示", "只能选择一位人员");
                        return;
                    }

                    for(var i=0; i<selectedRecords.length; i++) {
                        var selectedId = selectedRecords[i].get("id");
                        if(!Ext.Array.contains(existIds, selectedId)) {
                            northPanel.getStore().insert(0, selectedRecords[i]);
                        }
                    }
                }
            },
            "->",
            {
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
                        }
                        else {
                            var search = this.getRawValue();
                            me.getStore().filterBy(function (record) {
                                var name = record.get('C_XM_'+me.modelId);
                                if(name && name.indexOf(search)!=-1) {
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
    filterByStaffTypeId: function (staffTypeId) {
        var me = this;
        var filter = [];

        var northPanel = me.ownerCt.northPanel;
        var existIds = northPanel.getAllRecordIds();
        var selected = existIds.join(",");
        if(selected) {
            filter.push(new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.NotIn, "", selected));
        }
        if(staffTypeId && "-1"!=staffTypeId) {
            filter.push(new CustomerFilter("T_RYFL_"+TDM_SERVER_CONFIG.DEVICE_SCHEMA_ID+"_ID", CustomerFilter.prototype.SqlOperation.In, "", staffTypeId));
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