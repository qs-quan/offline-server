/**
 * Created by Administrator on 2016/7/19 0019.
 * 选择人员面板
 */
Ext.define('OrientTdm.TestResourceMgr.StaffMgr.ChooseStaffPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alternateClassName: 'OrientExtend.ChooseStaffPanel',
    alias: 'widget.chooseStaffPanel',
    loadMask: true,
    requires: [
        'OrientTdm.TestResourceMgr.StaffMgr.StaffComponents.StaffFilterPanel',
        'OrientTdm.TestResourceMgr.StaffMgr.StaffComponents.UnSelectedStaffPanel',
        'OrientTdm.TestResourceMgr.StaffMgr.StaffComponents.SelectedStaffPanel',
        "OrientTdm.TestResourceMgr.Util.TestResourceUtil"
    ],
    config: {
        TPL_SYRY: TDM_SERVER_CONFIG.TPL_SYRY,
        beforeInitComponent: Ext.emptyFn,
        afterInitComponent: Ext.emptyFn,
        //显示已选数据
        showSelected: true,
        //已经选中的数据
        selectedValue: '',
        //过滤
        customFilters: [],
        //是否多选
        multiSelect: false,
        saveAction: Ext.emptyFn
    },
    initComponent: function () {
        var me = this;
        me.beforeInitComponent.call(me);
        //区分选中 未选中
        me.selectedValue = Ext.isEmpty(me.selectedValue) ? '' : me.selectedValue;
        //左侧过滤面板
        var westPanel = Ext.create('OrientTdm.TestResourceMgr.StaffMgr.StaffComponents.StaffFilterPanel', {
            width: 220,
            region: 'west',
            title: '类型过滤',
            collapsible: true,
            autoScroll:true
        });
        //中间展现面板
        var modelId = OrientExtUtil.ModelHelper.getModelId("T_SYRY", TDM_SERVER_CONFIG.DEVICE_SCHEMA_ID);
        var templateId = OrientExtUtil.ModelHelper.getTemplateId(modelId, me.TPL_SYRY);
        var centerPanel = Ext.create('OrientTdm.TestResourceMgr.StaffMgr.StaffComponents.UnSelectedStaffPanel', {
            title: '可选人员',
            region: 'center',
            selectedValue: me.selectedValue,
            extraFilters: me.customFilters,
            multiSelect: me.multiSelect,
            modelId: modelId,
            isView: 0,
            templateId: templateId
        });

        var northPanel = Ext.create('OrientTdm.TestResourceMgr.StaffMgr.StaffComponents.SelectedStaffPanel', {
            title: '已选人员',
            region: 'north',
            height: 200,
            showSelected: me.showSelected,
            selectedValue: me.selectedValue,
            multiSelect: me.multiSelect,
            modelId: modelId,
            isView: 0,
            templateId: templateId
        });

        Ext.apply(me, {
            layout: 'border',
            items: [northPanel,westPanel, centerPanel],
            northPanel: northPanel,
            centerPanel: centerPanel,
            westPanel: westPanel,
            buttons: [
                {
                    text: '保存',
                    iconCls: 'icon-save',
                    scope: me,
                    handler: me._saveChoose
                },
                {
                    text: '关闭',
                    iconCls: 'icon-close',
                    handler: function () {
                        this.up('window').close();
                    }
                }
            ]
        });
        this.callParent(arguments);
        me.afterInitComponent.call(me);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        //me.mon(me,"_saveChoose",me._saveChoose,me);
    },
    _saveChoose: function (notClose) {
        var me = this;
        var northPanel = me.northPanel;
        var selectedIds = northPanel.getAllRecordIds();
        if(!me.multiSelect && selectedIds.length!=1) {
            OrientExtUtil.Common.tip("提示", "只能选择一位人员");
            return;
        }

        var selectedRecords = northPanel.getAllRecords();
        var selectedInfoMap = northPanel.getAllInfoMap();
        if (me.saveAction) {
            me.saveAction.call(me, selectedIds, selectedRecords, selectedInfoMap);
        }
    }
});