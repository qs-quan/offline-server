/**
 * Created by Administrator on 2016/7/19 0019.
 */
Ext.define('OrientTdm.TestResourceMgr.StaffMgr.StaffComponents.SelectedStaffPanel', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientModelGrid',
    alternateClassName: 'OrientExtend.SelectedStaffPanel',
    alias: 'widget.selectedStaffPanel',
    loadMask: true,
    requires: [

    ],
    config: {
        showSelected: true,
        selectedValue: '',
        multiSelect: false
    },
    initComponent: function () {
        var me = this;
        me.customerFilter = [];
        if (!Ext.isEmpty(me.selectedValue) && me.showSelected) {
            me.customerFilter.push(new CustomerFilter("ID", CustomerFilter.prototype.SqlOperation.In, "", me.selectedValue));
        }
        else {
            me.customerFilter.push(new CustomerFilter("1", CustomerFilter.prototype.SqlOperation.Equal, "", "0"));
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
        var retVal = [{
            text: '删除',
            iconCls: 'icon-delete',
            handler: function (btn) {
                if (!OrientExtUtil.GridHelper.hasSelected(me)) {
                    return;
                }
                var selectedRecords = OrientExtUtil.GridHelper.getSelectedRecord(me);
                me.getStore().remove(selectedRecords);
            }
        }];
        return retVal;
    },
    getAllRecordIds: function() {
        var me = this;
        var retVal = [];
        var records = me.getStore().getRange();
        for(var i=0; i<records.length; i++) {
            retVal.push(records[i].get("id"));
        }
        return retVal;
    },
    getAllRecords: function() {
        var me = this;
        var retVal = me.getStore().getRange();
        return retVal;
    },
    getAllInfoMap: function() {
        var me = this;
        var records = me.getStore().getRange();
        var retVal = [];
        for(var i=0; i<records.length; i++) {
            var obj = {
                id: records[i].get("ID"),
                name: records[i].get('C_XM_'+me.modelId)
            };
            retVal.push(obj);
        }
        return retVal;
    }
});