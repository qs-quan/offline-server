/**
 * Created by enjoy on 2016/5/3 0003.
 */
Ext.define('OrientTdm.SysMgr.UserToolMgr.Common.UpdateUserToolForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.updateUserToolForm',
    config: {
        actionUrl: serviceName + '/userTool/update.rdm'
    },
    initComponent: function () {
        var me = this;
        var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
        var oriData = this.originalData.data;
        if(oriData) {
            Ext.apply(this, {
                items: [
                    {
                        xtype: 'hiddenfield',
                        name: 'id'
                    },
                    {
                        xtype: 'hiddenfield',
                        name: 'userId'
                    },
                    {
                        xtype: 'hiddenfield',
                        name: 'toolId'
                    },
                    {
                        name: 'toolPath',
                        xtype: 'textfield',
                        fieldLabel: '工具路径',
                        margin: '0 5 0 0',
                        afterLabelTextTpl: required,
                        allowBlank: false
                    }
                ],
                buttons: [
                    {
                        text: '保存',
                        iconCls:'icon-save',
                        handler: function () {
                            me.fireEvent("saveOrientForm");
                        }
                    }
                ]
            });
        }

        me.callParent(arguments);
    }
});