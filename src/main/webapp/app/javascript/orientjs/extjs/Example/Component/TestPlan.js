/**
 * Created by Administrator on 2017/7/20 0020.
 */
Ext.define('OrientTdm.Example.Component.TestPlan', {
    extend: 'OrientTdm.Collab.common.Component.BaseComponent',
    alias: 'widget.testPlan',
    loadMask: true,
    mixins: {
        MainFormComponent: 'OrientTdm.Common.Extend.Component.MainFormComponent',
        GridRefToMainFormComponent: 'OrientTdm.Common.Extend.Component.GridRefToMainFormComponent'
    },
    requires: [
        'OrientTdm.Example.Component.TestPlanGrid'
    ],
    config: {
        templateName: '试验任务'
    },
    initComponent: function () {
        var me = this;
        var items = me.mixins.MainFormComponent.initMainForm.call(me);
        Ext.apply(me, {
            items: items
        });
        me.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
    },
    getComponentOutData: function () {
        var me = this;
        //保存当前试验任务信息
        var testTaskForm = me.down('orientDetailModelForm');
        var formData = testTaskForm.getFormData();
        //增加模型ID
        formData.modelId = testTaskForm.modelDesc.modelId;
        return formData;
    },
    _prepareRefTable: function (mainForm, mainData) {
        var me = this;
        var items = {
            testPlanGrid: '试验大纲'
        };
        me.mixins.GridRefToMainFormComponent.initRefGrid.call(me, mainForm, mainData, items);
    }
});