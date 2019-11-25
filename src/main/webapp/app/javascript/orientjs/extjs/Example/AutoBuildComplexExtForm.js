/**
 * Created by Administrator on 2016/8/3 0003.
 */
Ext.define('OrientTdm.Example.AutoBuildComplexExtForm', {
    extend: 'Ext.window.Window',
    requires: [
        'OrientTdm.BaseRequires'
    ],
    initComponent: function () {
        var me = this;
        //默认ID
        var generateId = Ext.data.IdGenerator.get('uuid').generate();
        //初始化表单
        var params = {
            modelId: 229,
            isView: 0
        };
        var modelDesc;
        //初始化模型描述
        OrientExtUtil.AjaxHelper.doRequest(serviceName + "/modelData/getGridModelDesc.rdm", params, false, function (response) {
            //1.获取模型字段描述 字段名称 显示名 类型...
            //2.获取模型操作描述 新增/修改/删除/查询/导入/导出...
            modelDesc = response.decodedData.results.orientModelDesc;
        });
        var addForm = Ext.create("OrientTdm.Common.Extend.Form.OrientAddModelForm", {
            buttonAlign: 'center',
            region: 'center',
            bindModelName: modelDesc.dbName,
            modelDesc: modelDesc
        });
        //初始化表格
        var modelGrid = Ext.create("OrientTdm.Common.Extend.Grid.OrientModelGrid", {
            modelId: 226,
            isView: 0,
            templateId: 380,
            usePage: false,
            region: 'south',
            height: 0.8 * globalHeight,
            customerFilter: [
                {
                    filterName: "T_MUL_161_ID",
                    filterValue: generateId,
                    operation: "In"
                }
            ],
            afterInitComponent: function () {
                //构建完表格后 定制操作
                var me = this;
                var addButton = this.dockedItems[0].down('button[text=新增]');
                addButton.text = '定制新增';
                var defaultHandler = addButton.handler;
                addButton.handler = Ext.Function.createInterceptor(defaultHandler, function (modelGridPanel) {
                    //新增表单出现前 相关定制
                    var columns = me.modelDesc.columns;
                    return true;
                });
                Ext.Function.interceptAfter(addButton, 'handler', function (button) {
                    //新增表单出现后 相关定制
                    var customPanel = button.orientBtnInstance.customPanel;
                    if (customPanel) {
                        var formValue = {
                            C_STRING_226: "121"
                        };
                        customPanel.getForm().setValues(formValue);
                        //注入额外参数
                        customPanel.originalData = Ext.apply(customPanel.originalData || {}, {
                            T_MUL_161_ID: generateId
                        });
                    }
                });
            }
        });
        Ext.apply(me, {
            title: '复杂表单',
            autoScroll: true,
            autoShow: true,
            width: 800,
            height: 600,
            layout: 'border',
            items: [addForm, modelGrid],
            buttons: [
                {
                    itemId: 'save',
                    text: '保存',
                    iconCls: 'icon-saveSingle',
                    handler: function () {
                        var form = this.up('window').down('orientAddModelForm');
                        if (form.isValid()) {
                            var formValue = OrientExtUtil.FormHelper.generateFormData(form.getForm());
                            //更新关联表信息
                            var refModelIds = [];
                            this.up('window').down('orientModelGrid').getStore().each(function (record) {
                                refModelIds.push(record.get('id'));
                            });
                            //保存表单内容

                        }
                    }
                }
            ]
        });
        this.callParent(arguments);
    }
});