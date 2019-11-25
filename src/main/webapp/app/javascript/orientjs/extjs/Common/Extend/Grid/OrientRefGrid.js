/**
 * 关联表格
 */
Ext.define('OrientTdm.Common.Extend.Grid.OrientRefGrid', {
    extend: 'OrientTdm.Common.Extend.Grid.OrientModelGrid',
    alias: 'widget.orientRefGrid',
    loadDataFirst: true,
    config: {
        mainModelDesc: null,
        mainData: null,
        templateName: '',
        //是否可编辑
        canEdit: true,
        collapsed: false
    },
    initComponent: function () {
        var me = this;
        //获取模板ID
        var fkName = me.mainModelDesc.dbName + "_ID";
        var customerFilter = new CustomerFilter(fkName, CustomerFilter.prototype.SqlOperation.Equal, "", me.mainData.ID);
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelGridView/getModelIdAndTempIdByTemplateName.rdm', {
            templateName: me.templateName
        }, false, function (resp) {
            var data = resp.decodedData.results;
            me.setModelId(data.modelId);
            me.setTemplateId(data.templateId);
            me.setCustomerFilter(me.extraCustomFilter ? Ext.Array.merge([customerFilter], me.extraCustomFilter) : [customerFilter]);
        });
        this.callParent(arguments);
    },
    afterInitComponent: function () {
        var me = this;
        //定制新增
        var toolbar = me.dockedItems[0];
        var addButton = toolbar.child('[text=新增]');
        if (me.canEdit && addButton) {
            var mainColumnName = me.mainModelDesc.dbName + "_ID";
            var mainDataId = me.mainData.ID;
            Ext.Function.interceptAfter(addButton, 'handler', function (button) {
                //新增表单出现后 相关定制
                var customPanel = button.orientBtnInstance.customPanel;
                var formValue = {};
                var refValue = {
                    name: '当前任务',
                    id: mainDataId
                };
                formValue[mainColumnName + '_display'] = Ext.encode([refValue]);
                formValue[mainColumnName] = mainDataId;
                customPanel.getForm().setValues(formValue);
            });
        }
        else {
            //隐藏其他按钮 只保留详细按钮
            var buttons = toolbar.query('button');
            Ext.each(buttons, function (button) {
                var text = button.text;
                if ('详细' != text && '查询' != text && '查询全部' != text) {
                    button.hide();
                }
            });
        }
    }
});