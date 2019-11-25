/**
 * Created by Administrator on 2017/7/20 0020.
 */
Ext.define('OrientTdm.Example.Component.PlanTestResource', {
    extend: 'OrientTdm.Collab.common.Component.BaseComponent',
    alias: 'widget.planTestResource',
    loadMask: true,
    mixins: {
        MainFormComponent: 'OrientTdm.Common.Extend.Component.MainFormComponent',
        GridRefToMainFormComponent: 'OrientTdm.Common.Extend.Component.GridRefToMainFormComponent'
    },
    requires: [
        'OrientTdm.Example.Component.AssignTestEquiGrid',
        'OrientTdm.Example.Component.AssignTestUserGrid'
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
            assignTestUserGrid: '1.分配人员',
            assignTestEquiGrid: '2.分配设备'
        };
        me.mixins.GridRefToMainFormComponent.initRefGrid.call(me, mainForm, mainData, items);
    }
});