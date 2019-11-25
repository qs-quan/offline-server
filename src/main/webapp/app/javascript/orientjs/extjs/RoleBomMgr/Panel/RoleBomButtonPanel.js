/**
 * 节点权限配置的取消和配置权限的按钮的panel
 * Created by dailin on 2019/4/2 8:55.
 */

Ext.define("OrientTdm.RoleBomMgr.Panel.RoleBomButtonPanel", {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.roleBomButtonPanel',
    config: {
        beforeInitComponent: Ext.emptyFn,
        afterInitComponent: Ext.emptyFn,
        assignCallback: Ext.emptyFn
    },
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        this.addEvents("moveToRight", "moveToLeft");
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        // 配置刷新事件，给予权限事件，取消权限事件
        me.mon(me, 'activate', me.doRefreshStore, me);
        me.mon(me, 'moveToRight', me.moveToRight, me);
        me.mon(me, 'moveToLeft', me.moveToLeft, me);
    },
    createButtonPanel: function () {
        var me = this;
        return Ext.create("Ext.view.View", {
            // width: 33,
            flex:1,
            overItemCls: 'x-view-over',
            itemSelector: 'div.column-select',  // 配置哪些可以被选中
            margins: '300 300 150 20',
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
                    {id: '1', name: '添加', thumb: 'right.png'},
                    {id: '2', name: '移除', thumb: 'left.png'}
                ]
            }),
            listeners: {
                // 配置点击监听
                itemclick: function (view, record) {
                    var eventType = "";
                    if (record.get("id") == "1") {
                        eventType = "moveToRight";
                    } else if (record.get("id") == "2") {
                        eventType = "moveToLeft";
                    } else {
                        return;
                    }

                    me.fireEvent(eventType);
                }
            }
        });
    },

    // 刷新两边panel的store
    doRefreshStore: function () {
        var me = this;
        var sonPanels = [me.westPanel, me.eastPanel];
        me.getRoleBomIds(me.nodeId);
        Ext.each(sonPanels, function (sonPanel) {
            sonPanel.ids = me.roleIds;
            sonPanel.getStore().getProxy().setExtraParam("ids",me.roleIds);
            sonPanel.getStore().load();
        })
    },

    // 给角色赋予该节点的权限(若)
    moveToRight: function () {
        var me = this;
        if (OrientExtUtil.GridHelper.hasSelected(me.westPanel)) {
            // 获取左侧panel选中的记录里面id的数组
            var roleIds = OrientExtUtil.GridHelper.getSelectRecordIds(me.westPanel).join(",");
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomRoleController/updateRoleBomRelation.rdm',{
                nodeId: me.nodeId,
                roles: roleIds
            }, false, function (response) {
                // 触发刷新两个panel的事件
                me.fireEvent("activate");
            });
        }
    },

    // 给角色取消该节点的权限
    moveToLeft: function () {
        var me = this;
        if (OrientExtUtil.GridHelper.hasSelected(me.eastPanel)) {
            // 获取右侧panel选中的记录里面id
            var roleIds = OrientExtUtil.GridHelper.getSelectRecordIds(me.eastPanel).join(",");
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TbomRoleController/deleteRoleBomRelationByRoleIds.rdm',{
                nodeId: me.nodeId,
                roles: roleIds
            }, false, function (response) {
                // 触发刷新两个panel的事件
                me.fireEvent("activate");
            });

        }
    }
});