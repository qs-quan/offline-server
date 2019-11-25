/**
 * Created by Administrator on 2016/7/19 0019.
 */
Ext.define('OrientTdm.Common.Extend.Form.Selector.UserComponents.UnSelectedUserPanel', {
    extend: 'OrientTdm.Common.Extend.Form.Selector.UserComponents.CommonUserPanel',
    alternateClassName: 'OrientExtend.UnSelectedUserPanel',
    alias: 'widget.unSelectedUserPanel',
    loadMask: true,
    requires: [
        'OrientTdm.Common.Extend.Form.Selector.UserComponents.CommonUserPanel'
    ],
    config: {
        //已经选中的数据
        selectedValue: '',
        multiSelect: false,
        extraFilter: {}
    },
    initComponent: function () {
        var me = this;
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
            xtype: 'textfield',
            name: 'filterField',
            emptyText: '输入搜索词',
            listeners: {
                change: function (field, newValue) {
                    me.getStore().getProxy().setExtraParam('filterName', newValue);
                    me.getStore().loadPage(1);
                    /*if (Ext.isEmpty(newValue)) {
                     me.beforeFilter();
                     me.getStore().clearFilter();
                     me.getStore().reload();
                     } else {
                     me.getStore().filterBy(function (record) {
                     if (record.get('userName').indexOf(newValue) != -1 || record.get('allName').indexOf(newValue) != -1) {
                     return true;
                     }
                     return false;
                     });
                     }*/
                }
            }
        }];
        return retVal;
    },
    _addItem: function () {
        var me = this;
        if (!me.multiSelect && me.getSelectionModel().getSelection().length > 1) {
            OrientExtUtil.Common.err(OrientLocal.prompt.error, OrientLocal.prompt.removeFirst);
            return;
        }
        //校验是否可以添加

    },
    _removeIdFilter: function (ids) {
        var me = this;
        if (me.extraFilter && me.extraFilter.idFilter['not in']) {
            var oldFilter = me.extraFilter.idFilter['not in'].split(',');
            var newFilter = [];
            Ext.each(oldFilter, function (id) {
                if (!Ext.Array.contains(ids, id)) {
                    newFilter.push(id);
                }
            });
            me.extraFilter.idFilter['not in'] = newFilter.join(',');
            //重新加载
            me.getStore().getProxy().setExtraParam("extraFilter", Ext.isEmpty(me.extraFilter) ? '' : Ext.encode(me.extraFilter));
            me.getStore().load();
        }
    },
    filterByDepId: function (depId) {
        var me = this;
        me.beforeFilter();
        if (me.extraFilter) {
            delete me.extraFilter.roleFilter;
            if (depId === "未分组") {
                me.extraFilter.depFilter = {
                    'noDep': depId//depId占位,不起作用
                };
            } else {
                me.extraFilter.depFilter = {
                    'in': depId
                };
            }

            me.getStore().getProxy().setExtraParam("extraFilter", Ext.isEmpty(me.extraFilter) ? '' : Ext.encode(me.extraFilter));
            me.getStore().load();
        }
    },
    filterByRoleId: function (roleId) {
        var me = this;
        me.beforeFilter();
        if (me.extraFilter) {
            delete me.extraFilter.depFilter;
            me.extraFilter.roleFilter = {
                'in': roleId
            };
            me.getStore().getProxy().setExtraParam("extraFilter", Ext.isEmpty(me.extraFilter) ? '' : Ext.encode(me.extraFilter));
            me.getStore().load();
        }
    },
    beforeFilter: function () {
        var me = this;
        this.filtering = true;
    }
});