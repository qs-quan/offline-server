/**
 * Created by enjoy on 2016/5/26 0026.
 */
Ext.define("OrientTdm.SysMgr.RoleMgr.Common.AssignPanel", {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.assignPanel',
    config: {
        roleId: "",
        beforeInitComponent: Ext.emptyFn,
        afterInitComponent: Ext.emptyFn,
        assignCallback: Ext.emptyFn
    },
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        this.addEvents("moveAllToRight", "moveToRight", "moveToLeft", "moveAllToLeft");
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me, 'activate', me.doRefreshStore, me);
        me.mon(me, 'moveAllToRight', me.moveAllToRight, me);
        me.mon(me, 'moveToRight', me.moveToRight, me);
        me.mon(me, 'moveToLeft', me.moveToLeft, me);
        me.mon(me, 'moveAllToLeft', me.moveAllToLeft, me);
    },
    createButtonPanel: function () {
        var me = this;
        return Ext.create("Ext.view.View", {
            width: 33,
            overItemCls: 'x-view-over',
            itemSelector: 'div.column-select',
            margins: '50 5 0 5',
            tpl: [
                '<tpl for=".">',
                '<div class="column-select" style="padding-bottom: 5px;">',
                '<div class="column">',
                (!Ext.isIE6 ? '<img src="app/images/itemselect/{thumb}" style="cursor: hand;"/>' :
                    '<div style="filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'app/images/itemselect/{thumb}\')"></div>'),
                '</div>',
                '</div>',
                '</tpl>'
            ],
            store: Ext.create("Ext.data.Store", {
                fields: ['id', 'name', 'thumb'],
                data: [
                    {id: '1', name: '添加全部', thumb: 'allright.png'},
                    {id: '2', name: '添加', thumb: 'right.png'},
                    {id: '3', name: '移除', thumb: 'left.png'},
                    {id: '4', name: '移除全部', thumb: 'allleft.png'}
                ]
            }),
            listeners: {
                itemclick: function (view, record) {
                    if(!Ext.isEmpty(this.up('RoleMain'))){
                        var eastPanel = this.up('RoleMain').eastPanel;
                        eastPanel.collapse();
                    }

                    var eventType = "";
                    if (record.get("id") == "1") {
                        eventType = "moveAllToRight";
                    } else if (record.get("id") == "2") {
                        eventType = "moveToRight";
                    } else if (record.get("id") == "3") {
                        eventType = "moveToLeft";
                    } else if (record.get("id") == "4") {
                        eventType = "moveAllToLeft";
                    } else {
                        return;
                    }

                    me.fireEvent(eventType);
                }
            }
        });
    },
    doRefreshStore: function () {
        var me = this;
        var sonPanels = this.query("assignGrid");
        Ext.each(sonPanels, function (sonPanel) {
            sonPanel.getStore().getProxy().setExtraParam("roleId", me.roleId);
            sonPanel.getStore().load();
        });
    },
    moveAllToRight: function () {
        //获取左侧所有列表中所有数据
        var me = this;
        var unselectedGrid = me.down("assignGrid[assigned=false]");
        var store = unselectedGrid.getStore();
        var selectedIds = [];
        store.each(function (record) {
            selectedIds.push(record.get(unselectedGrid.idProperty));
        });

        if (selectedIds.length > 0) {
            me.saveAssign(selectedIds, "right");
        }

    },
    moveToRight: function () {
        //获取左侧选中数据
        var me = this;
        var unselectedGrid = me.down("assignGrid[assigned=false]");
        if (unselectedGrid && OrientExtUtil.GridHelper.hasSelected(unselectedGrid)) {
            var selectedIds = OrientExtUtil.GridHelper.getSelectRecordIds(unselectedGrid);
            me.saveAssign(selectedIds, "right");
        }
    },
    moveToLeft: function () {
        var me = this;
        var selectedGrid = me.down("assignGrid[assigned=true]");
        if (selectedGrid && OrientExtUtil.GridHelper.hasSelected(selectedGrid)) {
            var selectedIds = OrientExtUtil.GridHelper.getSelectRecordIds(selectedGrid);
            me.saveAssign(selectedIds, "left");
        }
    },
    moveAllToLeft: function () {
        //获取右侧所有列表中所有数据
        var me = this;
        var selectedGrid = me.down("assignGrid[assigned=true]");
        var store = selectedGrid.getStore();
        var selectedIds = [];
        store.each(function (record) {
            selectedIds.push(record.get(selectedGrid.idProperty));
        });

        if (selectedIds.length > 0) {
            me.saveAssign(selectedIds, "left");
        }
    },
    saveAssign: function (selectedIds, direction) {
        var me = this;
        var unselectedGrid = me.down("assignGrid[assigned=false]");
        var saveUrl = unselectedGrid.saveUrl;
        OrientExtUtil.AjaxHelper.doRequest(saveUrl, {
            selectedIds: selectedIds,
            direction: direction,
            roleId: me.roleId
        }, true, function (resp) {
            var respData = resp.decodedData;
            if (respData.success == true) {
                OrientExtUtil.Common.tip(OrientLocal.prompt.info, OrientLocal.prompt.assignSuccess);
                me.fireEvent("activate");
                me.assignCallback(selectedIds, direction);
            } else
                OrientExtUtil.Common.tip(OrientLocal.prompt.info, Ext.isEmpty(respData.msg)? OrientLocal.prompt.assignFail : respData.msg);
        });
    }
});