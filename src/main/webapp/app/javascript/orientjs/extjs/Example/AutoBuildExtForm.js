/**
 * Created by Administrator on 2016/8/3 0003.
 */
Ext.define('OrientTdm.Example.AutoBuildExtForm', {
    extend: 'Ext.window.Window',
    requires: [
        'OrientTdm.BaseRequires'
    ],
    initComponent: function () {
        var me = this;
        var params = {
            modelId: 226,
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
                title: '新增【<span style="color: red; ">' + modelDesc.text + '</span>】数据',
                buttonAlign: 'center',
                buttons: [
                    {
                        itemId: 'save',
                        text: '保存',
                        iconCls: 'icon-saveSingle',
                        handler: function () {
                            var form = this.up('orientAddModelForm');
                            if (form.isValid()) {
                                var formValue = OrientExtUtil.FormHelper.generateFormData(form.getForm());
                            }
                        }
                    }
                ],
                bindModelName: modelDesc.dbName,
                actionUrl: serviceName + '/custom/customSave.rdm',
                modelDesc: modelDesc
            })
            ;
        Ext.apply(me, {
            autoScroll: true,
            autoShow: true,
            width: 800,
            height: 600,
            items: [addForm]

        });
        this.callParent(arguments);
    }
});