/**
 * Created by Administrator on 2016/9/1 0001.
 * 选择组件信息
 */
Ext.define("OrientTdm.Collab.common.util.SelectComponentField", {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.selectComponentField',
    mixins: {
        CommonField: 'OrientTdm.Common.Extend.Form.Field.CommonField'
    },
    config: {
        columnDesc: null
    },
    requires: [
        'OrientTdm.BackgroundMgr.Component.ComponentDashBord'
    ],
    initComponent: function () {
        var me = this;
        if (Ext.isEmpty(me.columnDesc)) {
            throw('未绑定字段描述');
        }
        //公用属性初始化
        //初始展现框
        var displayFiled = Ext.create('Ext.form.field.Text', {
            labelAlign: 'right',
            flex: 1
        });
        this.mixins.CommonField.initCommonAttr.call(displayFiled, me.columnDesc);
        //覆盖名称
        displayFiled.name = me.columnDesc.sColumnName + '_display';
        delete displayFiled.vtype;
        displayFiled.on('focus', Ext.Function.createInterceptor(me._openSelectorWin, me._checkCanEdit, me), me);
        //初始化操作按钮
        var showSelectorBtn = me.columnDesc.editAble ? Ext.create('Ext.button.Button', {
            iconCls: 'icon-select',
            scope: me,
            width: '22px',
            handler: me._openSelectorWin,
            disabled: me.editAble
        }) : null;
        var clearSelectorBtn = me.columnDesc.editAble ? Ext.create('Ext.button.Button', {
            iconCls: 'icon-clear',
            scope: me,
            width: '22px',
            handler: me._clearValue,
            disabled: me.editAble
        }) : null;
        //增加隐藏属性
        var hiddenData = Ext.create('Ext.form.field.Hidden');
        this.mixins.CommonField.initCommonAttr.call(hiddenData, me.columnDesc);
        var items = [displayFiled, showSelectorBtn, clearSelectorBtn, hiddenData];
        //生成面板
        Ext.apply(me, {
            layout: 'hbox',
            combineErrors: true,
            name: me.columnDesc.sColumnName,
            items: items
        });
        me.callParent(arguments);
    },
    _clearValue: function () {
        var me = this;
        me.down('textfield[name=' + me.columnDesc.sColumnName + '_display]').setValue('');
        me.down('hiddenfield[name=' + me.columnDesc.sColumnName + ']').setValue('');
    },
    _setValue: function (data) {
        //赋值
        var showValues = Ext.Array.pluck(data, 'componentname').join(',');
        var realValues = Ext.Array.pluck(data, 'id').join(',');
        var me = this;
        me.down('textfield[name=' + me.columnDesc.sColumnName + '_display]').setValue(showValues);
        me.down('hiddenfield[name=' + me.columnDesc.sColumnName + ']').setValue(realValues);
    },
    _openSelectorWin: function () {
        var me = this;
        var item = Ext.create('OrientTdm.BackgroundMgr.Component.ComponentDashBord');
        OrientExtUtil.WindowHelper.createWindow(item, {
            title: '选择组件',
            buttons: [
                {
                    text: '保存',
                    iconCls: 'icon-save',
                    handler: function () {
                        var grid = this.up('window').down('componentList');
                        if (OrientExtUtil.GridHelper.hasSelectedOne(grid)) {
                            var selectedRecords = OrientExtUtil.GridHelper.getSelectedRecord(grid);
                            var datas = [];
                            Ext.each(selectedRecords, function (record) {
                                datas.push(record.data);
                            });
                            me._setValue(datas);
                            this.up('window').close();
                        }
                    }
                }
            ]
        });
    },
    _checkCanEdit: function () {
        var me = this;
        return me.columnDesc.editAble;
    }
});