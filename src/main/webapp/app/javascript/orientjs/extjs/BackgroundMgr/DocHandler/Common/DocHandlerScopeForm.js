/**
 * Created by enjoy on 2016/4/11 0011.
 */
Ext.define('OrientTdm.BackgroundMgr.DocHandler.Common.DocHandlerScopeForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.docHandlerScopeForm',
    config: {
        belongHandler: ''
    },
    initComponent: function () {
        var me = this;
        var buttons = [{
            text: '保存',
            iconCls: 'icon-save',
            handler: function () {
                me.fireEvent("saveOrientForm", {
                    belongHandler: me.belongHandler
                });
            }
        }];
        if (!me.originalData) {
            buttons.push({
                text: '保存并关闭',
                iconCls: 'icon-saveAndClose',
                handler: function () {
                    me.fireEvent("saveOrientForm", {
                        belongHandler: me.belongHandler
                    }, true);
                }
            });
        }
        Ext.apply(this, {
            items: [
                {
                    name: 'columnType',
                    xtype: 'orientComboBox',
                    fieldLabel: '字段类型',
                    margin: '0 5 0 0',
                    remoteUrl: serviceName + '/DocHandlerScope/getColumnTypeList.rdm',
                    allowBlank: false
                }, {
                    xtype: 'hiddenfield',
                    name: 'id'
                }
            ],
            buttons: buttons
        });
        me.callParent(arguments);
    }
});