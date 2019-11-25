/**
 * Created by Administrator on 2016/8/26 0026.
 */
Ext.define('OrientTdm.Collab.MyTask.auditTask.ModelDataAuditDetailPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.modelDataAuditDetailPanel',
    autoScroll: true,
    //layout: 'fit',
    config: {
        bindDatas: [],
        piId: '',
        taskName: '',
        //保存历史任务时 是否需要序列化至数据库
        isHistoryAble: true
    },
    requires: [
        'OrientTdm.BackgroundMgr.CustomForm.Common.FreemarkerForm'
    ],
    initComponent: function () {
        var me = this;
        Ext.apply(me, {
            listeners: {
                afterrender: me._initModelData
            }
        });
        this.callParent(arguments);
    },

    initEvents: function () {
        this.callParent(arguments);
    },

    _initModelData: function () {
        var me = this;
        //加载模型数据
        var items = [];
        //获取发起流程时绑定信息
        var auditBindFlowId = me.bindDatas[0].extramParams ? Ext.decode(me.bindDatas[0].extramParams)['auditFlowModelBindId'] : '';
        if (Ext.isEmpty(auditBindFlowId)) {
            //默认展现
            var modelCache = {};
            Ext.each(me.bindDatas, function (bindData) {
                if(bindData.mainType == 'ModelDataAudit'){
                    items.push(me._initDefaultModelForm(modelCache, bindData));
                }
            });
        } else {
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/auditFlow/info/getTaskSetting.rdm', {
                bindId: auditBindFlowId,
                taskName: me.taskName
            }, false, function (resp) {
                if (resp.decodedData.results) {
                    var taskSetting = resp.decodedData.results;
                    if (taskSetting.formId) {
                        //如果绑定了form表单
                        var formId = taskSetting.formId;
                        Ext.each(me.bindDatas, function (bindData) {
                            if(bindData.mainType == 'ModelDataAudit'){
                                items.push(me._initFreemarkerModelForm(bindData, formId));
                            }
                        });
                    } else if (!Ext.isEmpty(taskSetting.customPath)) {
                        //加载js 或者 jsp
                        var customPath = taskSetting.customPath;
                        if (customPath.indexOf('.jsp') != -1) {
                            Ext.each(me.bindDatas, function (bindData) {
                                if(bindData.mainType == 'ModelDataAudit'){
                                    items.push(me._initCustomJsp(bindData, customPath));
                                }
                            });
                        } else {
                            if(bindData.mainType == 'ModelDataAudit'){
                                items.push(me._initCustomJsClass(me.bindDatas, customPath));
                            }
                        }
                    } else {
                        var modelCache = {};
                        Ext.each(me.bindDatas, function (bindData) {
                            if(bindData.mainType == 'ModelDataAudit'){
                                items.push(me._initDefaultModelForm(modelCache, bindData));
                            }
                        });
                    }
                } else {
                    //默认展现
                    var modelCache = {};
                    Ext.each(me.bindDatas, function (bindData) {
                        if(bindData.mainType == 'ModelDataAudit'){
                            items.push(me._initDefaultModelForm(modelCache, bindData));
                        }
                    });
                }
            });
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
    _initDefaultModelForm: function (modelCache, bindData) {
        var me = this;
        var retVal, modelDesc, modelData, me = this;
        if (modelCache[bindData.tableName]) {
            modelDesc = modelCache[bindData.tableName];
            var filter = new CustomerFilter('ID', CustomerFilter.prototype.SqlOperation.Equal, "", bindData.dataId);
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelData/getModelData.rdm', {
                orientModelId: bindData.tableName,
                customerFilter: Ext.encode([filter])
            }, false, function (response) {
                modelData = response.decodedData.results[0];
            });
        } else {
            var params = {
                modelId: bindData.tableName,
                dataId: bindData.dataId
            };
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelData/getGridModelDescAndData.rdm', params, false, function (response) {
                modelDesc = response.decodedData.results.orientModelDesc;
                modelCache[bindData.tableName] = modelDesc;
                modelData = response.decodedData.results.modelData;

            });
        }

        // 试验申请表的审批流程，申请人发起审批阶段可以修改表单信息
        if(me.isNotMine == undefined && me.taskName == '申请人发起审批' && modelDesc.text == '试验申请'){
            // 指定字段绑定事件
            for(var i = 0; i < modelDesc.columns.length; i++){
                var column = modelDesc.columns[i];
                if(column.sColumnName == 'M_TH_' + modelDesc.modelId){
                    column.listeners = {
                        blur: function (c, e, eopts) {
                            if(c.value == undefined || c.value.indexOf('AD') != 0){
                                OrientExtUtil.Common.info('提示', '图号格式不正确，格式：AD......');
                            }
                        }
                    };
                }
            }

            retVal = Ext.create("OrientTdm.Common.Extend.Form.OrientModifyModelForm", {
                title: '查看【<span style="color: red; ">' + modelDesc.text + '</span>】数据',
                bindModelName: modelDesc.dbName,
                modelDesc: modelDesc,
                originalData: modelData,
                actionUrl: '/OrientTDM/modelData/updateModelData.rdm',
                buttons: [/*{
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [*/'->', {
                        itemId: 'save',
                        text: '保存',
                        iconCls: 'icon-save',
                        handler: function (btn) {
                            // 校验指定字段数据格式
                            var result = true;
                            btn.up("form").form.getFields().each(function (item) {
                                if(item.name == 'M_TH_' + modelDesc.modelId){
                                    if(item.value == undefined || item.value.indexOf('AD') != 0){
                                        OrientExtUtil.Common.info('提示', '图号格式不正确，格式：AD......');
                                        result = false;
                                    }

                                    return;
                                }
                            });
                            if(result == false){
                                return;
                            }

                            // 触发表单的提交事件
                            btn.up("form").fireEvent("saveOrientForm", {
                                modelId: modelDesc.modelId
                            });
                        }
                    }, '->'/*]
                }*/],
                // 表单保存成功的回调函数
                getSuccessCallback: function () {
                    me.upScope.saveBtnClick = true;
                }
            });
        }else{
            retVal = Ext.create("OrientTdm.Common.Extend.Form.OrientDetailModelForm", {
                title: '查看【<span style="color: red; ">' + modelDesc.text + '</span>】数据',
                bindModelName: modelDesc.dbName,
                modelDesc: modelDesc,
                originalData: modelData
            });
        }
        return retVal;
    },

    _initFreemarkerModelForm: function (bindData, formId) {
        var retVal = Ext.create('OrientTdm.BackgroundMgr.CustomForm.Common.FreemarkerForm', {
            title: '表单数据',
            formViewId: formId,
            modelId: bindData.tableName,
            dataId: bindData.dataId,
            canOperate: false
        });
        return retVal;
    },

    _initCustomJsp: function (bindData, jspUrl) {
        var params = '?modelId=' + bindData.tableName + '&dataId=' + bindData.dataId;
        var html = '<iframe width="100%" height="100%" marginwidth="0" framespacing="0" marginheight="0" frameborder="0" src = "' + serviceName + '/' + jspUrl + params + '"></iframe>';
        var retVal = Ext.create('OrientTdm.Common.Extend.Panel.OrientPanel', {
            html: html,
            title: '自定义JSP',
            layout: 'fit'
        });
        return retVal;
    },

    _initCustomJsClass: function (bindDatas, jsClassPath) {
        var me = this;
        me.bindCustomJsClass = jsClassPath;
        Ext.require(jsClassPath);
        var retVal = Ext.create(jsClassPath, {
            bindDatas: bindDatas,
            title: '待审批数据'
        });
        return retVal;
    },

    /**
     *
     * 为后台历史任务引擎，提供输入参数，历史引擎根据参数保存相关历史信息至数据库
     */
    getHistoryData: function () {
        var me = this;
        var retVal = {
            modelDataRequestList: [],
            modelFreemarkerHtml: {}
        };
        //保存默认Ext组件表单
        if (me.query('orientDetailModelForm').length > 0) {
            var bindItems = me.query('orientDetailModelForm');
            var modelIdDataCache = {};
            Ext.each(bindItems, function (item) {
                var modelDesc = item.modelDesc;
                var modelId = modelDesc.modelId;
                if (!modelIdDataCache[modelId]) {
                    modelIdDataCache[modelId] = {
                        dataList: []
                    }
                }
                modelIdDataCache[modelId].dataList.push(item.originalData);
            });
            for (var modelId in modelIdDataCache) {
                retVal.modelDataRequestList.push({
                    modelId: modelId,
                    dataList: modelIdDataCache[modelId].dataList
                });
            }
        } else if (me.query('freemarkerForm').length > 0) {
            //保存freemarker表单
            var bindItems = me.query('freemarkerForm');
            var modelIdCache = [];
            Ext.each(bindItems, function (item) {
                var html = window['previewHtml' + item.getId()];
                var modelId = item.modelId;
                if (!Ext.Array.contains(modelIdCache, modelId)) {
                    retVal.modelFreemarkerHtml[modelId] = [];
                    modelIdCache.push(modelId);
                }
                retVal.modelFreemarkerHtml[modelId].push(html);
            });
        } else {
            //保存自定义js

        }
        return retVal;
    }

});