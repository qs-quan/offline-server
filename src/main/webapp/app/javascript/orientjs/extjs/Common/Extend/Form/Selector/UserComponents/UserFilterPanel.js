/**
 * Created by Administrator on 2016/7/19 0019.
 */
Ext.define('OrientTdm.Common.Extend.Form.Selector.UserComponents.UserFilterPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alternateClassName: 'OrientExtend.UserFilterPanel',
    alias: 'widget.userFilterPanel',
    requires: [
        'OrientTdm.Common.Extend.Form.Selector.UserComponents.RoleTree',
        'OrientTdm.Common.Extend.Form.Selector.UserComponents.DepTree'
    ],
    loadMask: true,
    config: {
        //过滤类型
        filterType: '',
        //过滤值
        filterValue: ''
    },
    initComponent: function () {
        var me = this;
        //默认部门过滤
        var items = [];
        if (Ext.isEmpty(me.filterType)) {
            var depItem = Ext.create('OrientTdm.Common.Extend.Form.Selector.UserComponents.DepTree', {
                itemClickListener: me._filerUserByDepId
            });
            items.push(depItem);
        } else if ('1' == me.filterType) {
            //角色过滤
            var roleItem = me._createRoleFilterPanel();
            items.push(roleItem);
        } else if ('0' == me.filterType) {
            //部门过滤
            var depItem = me._createDepFilterPanel();
            items.push(depItem);
        }
        Ext.apply(me, {
            items: items
        });
        this.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
    },
    _filerUserByDepId: function (tree, record, item) {
        var me = this.up('userFilterPanel');
        var depId = record.get('id');
        var centerPanel = me.ownerCt.centerPanel;
        if (centerPanel) {
            centerPanel.filterByDepId(depId);
        }
    },
    _createRoleFilterPanel: function () {
        var me = this;
        var retVal = Ext.create('OrientTdm.Common.Extend.Form.Selector.UserComponents.RoleTree', {
            filterTH: me.filterTH,
            chooseRoleIds: me.filterValue
        });
        return retVal;
    },
    _createDepFilterPanel:function(){
        var me = this;
        var retVal = Ext.create('OrientTdm.Common.Extend.Form.Selector.UserComponents.DepTree', {
            chooseRoleIds: me.filterValue
        });
        return retVal;
    }
});