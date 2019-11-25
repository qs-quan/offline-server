/**
 * Created by enjoy on 2016/5/3 0003.
 */
Ext.define('OrientTdm.SysMgr.BackupMgr.Common.BackupForm', {
    extend: 'OrientTdm.Common.Extend.Form.OrientForm',
    alias: 'widget.backupForm',
    initComponent: function () {
        var me = this;
        var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
        Ext.apply(this, {
            items: [
                {
                    name: 'remark',
                    xtype: 'textarea',
                    fieldLabel: '备份说明'
                }, {
                    xtype: 'hiddenfield',
                    name: 'id'
                }, {
                    xtype: 'hiddenfield',
                    name: 'userId'
                }, {
                    xtype: 'hiddenfield',
                    name: 'backDate'
                }, {
                    xtype: 'hiddenfield',
                    name: 'filePath'
                }, {
                    xtype: 'hiddenfield',
                    name: 'schemaId'
                }, {
                    xtype: 'hiddenfield',
                    name: 'tableId'
                }, {
                    xtype: 'hiddenfield',
                    name: 'backModel'
                }, {
                    xtype: 'hiddenfield',
                    name: 'backData'
                }, {
                    xtype: 'hiddenfield',
                    name: 'autoBack'
                }, {
                    xtype: 'hiddenfield',
                    name: 'autoBackDate'
                }, {
                    xtype: 'hiddenfield',
                    name: 'autoBackZq'
                }, {
                    xtype: 'hiddenfield',
                    name: 'type'
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
        me.callParent(arguments);
    }
});