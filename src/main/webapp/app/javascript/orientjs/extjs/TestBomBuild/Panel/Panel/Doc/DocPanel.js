/**
 * 文档预览或编辑界面
 */

Ext.define('OrientTdm.TestBomBuild.Panel.Panel.Doc.DocPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.DocPanel',
    config: {
        reportName: ''
    },

    initComponent: function () {
        var me = this;

        var items = [];
        if(!me.nameReadonly){
            items.push({
                xtype: 'fieldset',
                border: '1 5 1 5',
                region: 'north',
                title: me.nameReadonly ? '名称' : '第一步：输入名称',
                items: [{
                    id: me.modelName + me.modelId,
                    xtype: 'textfield',
                    width: 300,
                    fieldLabel: '名称',
                    emptyText: '名称不可为空',
                    allowBlank: false,
                    value: me.name,
                    readOnly: me.nameReadonly
                }]
            });
        }

        var centerPanel = Ext.create('OrientTdm.TestBomBuild.Panel.Panel.Doc.DocReportViewPanle',{
            region: 'center',
            modelName: me.modelName,
            modelId: me.modelId,
            title: me.nameReadonly ? '内容' : '第二步：编辑内容',
            reportNameFolderName: me.reportNameFolderName == undefined ? '' : me.reportNameFolderName
        });
        items.push(centerPanel);

        Ext.apply(me, {
            layout: 'border',
            items: items,
            centerPanel: centerPanel,
            listeners: {
                'show': function (scope, obj) {
                    this.down('docReportViewPanel').fireEvent('initDocPreview', me.reportName);
                }
            }
        });

        this.callParent(arguments);
    }
});