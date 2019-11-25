/**
 * Created by Administrator on 2016/7/19 0019.
 */
Ext.define('OrientTdm.Common.Extend.Form.Selector.UserComponents.SelectedUserPanel', {
    extend: 'OrientTdm.Common.Extend.Form.Selector.UserComponents.CommonUserPanel',
    alternateClassName: 'OrientExtend.SelectedUserPanel',
    alias: 'widget.selectedUserPanel',
    loadMask: true,
    requires: [
        'OrientTdm.Common.Extend.Form.Selector.UserComponents.CommonUserPanel'
    ],
    config: {
        //已经选中的数据
        selectedValue: ''
    },
    initComponent: function () {
        var me = this;
        if (!Ext.isEmpty(me.selectedValue)) {
            me.extraFilter = {
                idFilter: {
                    'in': me.selectedValue
                }
            };
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
            iconCls: 'icon-remove',
            text: '移除',
            itemId: 'remove',
            scope: this,
            handler: this._removeItem
        }];
        return retVal;
    },
    _removeItem: function () {
        var me = this;
        var selectedRecords = me.getSelectionModel().getSelection();
        me.getStore().remove(selectedRecords);
        var unSeletedUserPanel = me.ownerCt.centerPanel;
        if (unSeletedUserPanel) {
            unSeletedUserPanel._removeIdFilter(Ext.Array.pluck(selectedRecords, 'internalId'));
        }
    },
    _canAdd: function () {
        //是否可被添加
        var me = this;
        var flag = false;
        var multiSelect = me.multiSelect;
        if (!multiSelect && me.getStore().getCount() > 0) {
            OrientExtUtil.Common.err(OrientLocal.prompt.error, OrientLocal.prompt.removeFirst);
        } else
            flag = true;
        return flag;
    },
    getSelectValue: function () {
        var me = this;
        var selectedValue = [];
        me.getStore().each(function (record) {
            var obj = {
                id: record.get('id'),
                name: record.get('allName'),
                userName: record.get('userName')
            };
            selectedValue.push(obj);
        });
        return selectedValue;
    }
});
