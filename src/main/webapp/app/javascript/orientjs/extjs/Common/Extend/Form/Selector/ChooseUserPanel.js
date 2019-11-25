/**
 * Created by Administrator on 2016/7/19 0019.
 * 选择用户面板
 */
Ext.define('OrientTdm.Common.Extend.Form.Selector.ChooseUserPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alternateClassName: 'OrientExtend.ChooseUserPanel',
    alias: 'widget.chooseUserPanel',
    loadMask: true,
    requires: [
        'OrientTdm.Common.Extend.Form.Selector.UserComponents.UserFilterPanel',
        'OrientTdm.Common.Extend.Form.Selector.UserComponents.UnSelectedUserPanel',
        'OrientTdm.Common.Extend.Form.Selector.ChooseUserNav'
    ],
    config: {
        beforeInitComponent: Ext.emptyFn,
        afterInitComponent: Ext.emptyFn,
        //已经选中的数据
        selectedValue: '',
        //过滤类型
        filterType: '',
        //过滤值
        filterValue: '',
        //过滤未选用户
        extraFilter: {},
        //是否多选
        multiSelect: false,
        saveAction: Ext.emptyFn,
        showCalendar: false
    },
    initComponent: function () {
        var me = this;
        me.beforeInitComponent.call(me);
        //区分选中 未选中
        me.selectedValue = Ext.isEmpty(me.selectedValue) ? '0' : me.selectedValue;
        //左侧过滤面板
        var westPanel = Ext.create('OrientTdm.Common.Extend.Form.Selector.UserComponents.UserFilterPanel', {
            filterType: me.filterType,
            filterValue: me.filterValue,
            filterTH: me.filterTH,
            width: 220,
            region: 'west',
            title: '过滤面板',
            collapsible: true,
            autoScroll: true
        });
        //中间展现面板
        var centerPanel = Ext.create('OrientTdm.Common.Extend.Form.Selector.UserComponents.UnSelectedUserPanel', {
            selectedValue: me.selectedValue,
            selectedUsers: {},
            filterTH: me.filterTH,
            multiSelect: me.multiSelect,
            extraFilter: me.extraFilter,
            title: '可选用户',
            region: 'center'
        });

        //用图片显示用户状态 找到那个本地变量 修改store
        var northPanel = {
            xtype: 'panel',
            region: 'north',
            collapsible: true,
            layout: 'fit',
            title: '已选用户' + '    <span style="color: red">*双击即可取消选中</span>',
            height: 150,
            items: [Ext.create('OrientTdm.Common.Extend.Form.Selector.ChooseUserNav', {
                autoScroll: true,
                id: 'chosenUserView',
                selectedValue: me.selectedValue == '0' ? '' : me.selectedValue
            })]
        };

        var items = [northPanel, westPanel, centerPanel];
        if (me.showCalendar) {
            var eastPanel = Ext.create('OrientTdm.Collab.MyTask.Calendar.CalendarTaskPanel', {
                title: '已安排工作',
                region: 'east',
                collapsible: true,
                width: 600
            });
            items.push(eastPanel);
        }

        Ext.apply(me, {
            layout: 'border',
            items: items,
            northPanel: northPanel,
            centerPanel: centerPanel,
            westPanel: westPanel,
            buttons: [
                {
                    text: '保存',
                    iconCls: 'icon-save',
                    scope: me,
                    handler: me._saveChoose
                },
                {
                    text: '关闭',
                    iconCls: 'icon-close',
                    handler: function () {
                        this.up('window').close();
                    }
                }
            ]
        });
        this.callParent(arguments);
        me.afterInitComponent.call(me);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        //me.mon(me,"_saveChoose",me._saveChoose,me);
    },
    _saveChoose: function (notClose) {
        var me = this;
        var selectedUsers = me.down('chosenuserbrowser').selectedUsers;
        var selectedValue = [];
        for (var attri in selectedUsers) {
            var selectedUser = selectedUsers[attri]
            var obj = {
                id: selectedUser['id'],
                name: selectedUser['allName'],
                userName: selectedUser['userName']
            };
            selectedValue.push(obj);
        }
        if (me.saveAction) {
            me.saveAction.call(me, selectedValue, function () {
                if (notClose === true) {

                } else {
                    me.up('window').close();
                }
            });
        }
    }
});