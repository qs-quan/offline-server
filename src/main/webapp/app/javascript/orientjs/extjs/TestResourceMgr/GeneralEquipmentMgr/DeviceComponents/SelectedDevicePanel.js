/**
 * Created by Administrator on 2016/7/19 0019.
 */
Ext.define('OrientTdm.TestResourceMgr.GeneralEquipmentMgr.DeviceComponents.SelectedDevicePanel', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientModelGrid',
    alternateClassName: 'OrientExtend.SelectedDevicePanel',
    alias: 'widget.selectedDevicePanel',
    loadMask: true,
    requires: [

    ],
    config: {
        //显示已选设备
        showSelected: true,
        showAnalysisBtns: false,
        //过滤
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

        Ext.apply(me, {
            listeners: {
                itemdblclick: function(view, record, item, index) {
                    var eastPanel = me.ownerCt.eastPanel;
                    eastPanel.loadDeviceRecord(record);
                }
            }
        });
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

                var centerPanel = me.ownerCt.centerPanel;
                centerPanel.getStore().insert(0, selectedRecords);
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
                name: records[i].get('C_NAME_'+me.modelId)
            }
            retVal.push(obj);
        }
        return retVal;
    }
});