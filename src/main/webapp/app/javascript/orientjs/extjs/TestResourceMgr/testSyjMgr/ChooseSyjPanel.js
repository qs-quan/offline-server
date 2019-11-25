/**
 * 选择试验件面板
 */
Ext.define('OrientTdm.TestResourceMgr.testSyjMgr.ChooseSyjPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alternateClassName: 'OrientExtend.ChooseSyjPanel',
    alias: 'widget.chooseSyjPanel',
    loadMask: true,
    requires: [
        'OrientTdm.TestResourceMgr.testSyjMgr.Syj.SyjFilterPanel',
        'OrientTdm.TestResourceMgr.testSyjMgr.Syj.UnSelectedSyjPanel',
        'OrientTdm.TestResourceMgr.testSyjMgr.Syj.SelectedSyjPanel',
        'OrientTdm.TestResourceMgr.testSyjMgr.Syj.SyjDetailPanel',
        "OrientTdm.TestResourceMgr.testSyjMgr.Syj.SyjResourceUtil"
    ],
    config: {
        TPL_SYJ: TDM_SERVER_CONFIG.TPL_SYJ,
        beforeInitComponent: Ext.emptyFn,
        afterInitComponent: Ext.emptyFn,
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
        var westPanel = Ext.create('OrientTdm.TestResourceMgr.testSyjMgr.Syj.SyjFilterPanel', {
            width: 160,
            region: 'west',
            title: '分类过滤',
            collapsible: true,
            autoScroll:true
        });

        //中间展现面板
        var modelId = SyjResourceUtil.getSyjModelId();
        var templateId = OrientExtUtil.ModelHelper.getTemplateId(modelId, me.TPL_SYJ);
        var centerPanel = Ext.create('OrientTdm.TestResourceMgr.testSyjMgr.Syj.UnSelectedSyjPanel', {
            title: '可选试验件',
            region: 'center',
            selectedValue: me.selectedValue,
            extraFilters: me.customFilters,
            multiSelect: me.multiSelect,
            modelId: modelId,
            isView: 0,
            templateId: templateId
        });

        var northPanel = Ext.create('OrientTdm.TestResourceMgr.testSyjMgr.Syj.SelectedSyjPanel', {
            title: '已选试验件',
            region: 'north',
            height: 180,
            selectedValue: me.selectedValue,
            multiSelect: me.multiSelect,
            modelId: modelId,
            isView: 0,
            templateId: templateId
        });

        var southPanel = Ext.create("OrientTdm.Common.Extend.Panel.OrientPanel", {
            region: 'south',
            padding: '0 0 0 0',
            layout: "fit",
            deferredRender: false,
            maxHeight: 300
        });

        var eastPanel = Ext.create('OrientTdm.TestResourceMgr.testSyjMgr.Syj.SyjDetailPanel', {
            region: 'east',
            width: 300,
            collapsible: true,
            collapsed: true,
            modelId: modelId,
            isView: 0,
            rowNum: 1,
            templateId: templateId
        });

        Ext.apply(me, {
            layout: 'border',
            items: [northPanel,westPanel, centerPanel, eastPanel, southPanel],
            northPanel: northPanel,
            centerPanel: centerPanel,
            westPanel: westPanel,
            eastPanel: eastPanel,
            southPanel: southPanel,
            buttons: [{
                    text: '保存',
                    iconCls: 'icon-save',
                    scope: me,
                    handler: me._saveChoose
                },{
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
    },

    _saveChoose: function (notClose) {
        var me = this;
        var northPanel = me.northPanel;
        var selectedIds = northPanel.getAllRecordIds();
        if(!me.multiSelect && selectedIds.length!=1) {
            OrientExtUtil.Common.tip("提示", "只能选择一个试验件");
            return;
        }

        var selectedRecords = northPanel.getAllRecords();
        var selectedInfoMap = northPanel.getAllInfoMap();
        if (me.saveAction) {
            me.saveAction.call(me, selectedIds, selectedRecords, selectedInfoMap);
        }
    }
});