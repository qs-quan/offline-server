/**
 * Created by Administrator on 2016/8/26 0026.
 */
Ext.define('OrientTdm.Collab.MyTask.historyTask.audit.HisModelDataAuditDetailPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.hisModelDataAuditDetailPanel',
    autoScroll: true,
    layout: 'fit',
    config: {
        taskSetInfo: null,
        taskBindInfo: null,
        modelDataInfo: null,
        freemarkerInfo: null
    },
    requires: [
        'OrientTdm.BackgroundMgr.CustomForm.Common.FreemarkerForm',
        'OrientTdm.Common.Extend.Form.OrientDetailModelForm',
        'OrientTdm.BackgroundMgr.CustomForm.Common.StaticFreemarkerForm'
    ],
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            title: '审批数据',
            iconCls: 'icon-basicInfo',
            listeners: {
                afterrender: me._initModelData
            }
        });
        this.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent(arguments);
    },
    _initModelData: function () {
        //查看设置信息
        var me = this;
        var modelDescCache = {};
        var items = [];
        if (me.taskSetInfo.oriSysDataList.length > 0) {
            var taskSet = me.taskSetInfo.oriSysDataList[0];
            if (!Ext.isEmpty(taskSet.FORM_ID)) {
                me._initFreemarkerModelForm(items);
            } else if (!Ext.isEmpty(taskSet.CUSTOM_PATH)) {
                me._initCustomPanel(taskSet.CUSTOM_PATH, items);
            } else
                me._initDefaultModelForm(modelDescCache, items);
        } else {
            me._initDefaultModelForm(modelDescCache, items);
        }
        if (items.length > 1) {
            //Tab展现
            me.add(Ext.create('OrientTdm.Common.Extend.Panel.OrientTabPanel', {
                items: items
            }));
        } else {
            me.add(items);
        }
    },
    _initDefaultModelForm: function (modelCache, items) {
        var me = this;
        Ext.each(me.modelDataInfo, function (modelAndData) {
            var modelDesc = modelCache[modelAndData.modelId];
            if (!modelDesc) {
                modelDesc = Ext.decode(modelAndData.modelDesc);
                modelCache[modelAndData.modelId] = modelDesc;
            }
            var dataList = modelAndData.modelDataList;
            Ext.each(dataList, function (data) {
                var tmpPanel = Ext.create("OrientTdm.Common.Extend.Form.OrientDetailModelForm", {
                    title: '查看【<span style="color: red; ">' + modelDesc.text + '</span>】数据',
                    bindModelName: modelDesc.dbName,
                    modelDesc: modelDesc,
                    originalData: data
                });
                items.push(tmpPanel);
            });
        });
    },
    _initFreemarkerModelForm: function (items) {
        var me = this;
        Ext.each(me.freemarkerInfo, function (htmlInfo) {
            items.push({
                xtype: 'staticFreemarkerForm',
                html: htmlInfo.html,
                modelId: me.taskBindInfo.tableName
            });
        });
    },
    _initCustomPanel: function (customPanelPath, items) {
        if (customPanelPath.indexOf('.jsp') != -1) {
            this._initCustomJsp(items);
        } else {
            this._initCustomJsClass(customPanelPath, items);
        }
    },
    _initCustomJsp: function (items) {
        var me = this;
        //暂时无法做历史状态控制
        var params = '?modelId=' + me.taskBindInfo.tableName + '&dataId=' + me.taskBindInfo.dataId + '&history=true';
        var html = '<iframe width="100%" height="100%" marginwidth="0" framespacing="0" marginheight="0" frameborder="0" src = "' + serviceName + '/' + jspUrl + params + '"></iframe>';
        var retVal = Ext.create('OrientTdm.Common.Extend.Panel.OrientPanel', {
            html: html,
            title: '自定义JSP',
            layout: 'fit'
        });
        items.push(retVal);
    },
    _initCustomJsClass: function (jsClassPath, items) {
        var me = this;
        //暂时无法做历史状态控制
        Ext.require(jsClassPath);
        var retVal = Ext.create(jsClassPath, {
            modelId: me.taskBindInfo.tableName,
            dataId: me.taskBindInfo.dataId,
            history: true,
            dataSource: me.modelDataInfo,
            bindDatas: me.taskBindInfo.oriSysDataList
        });
        items.push(retVal);
    }
});