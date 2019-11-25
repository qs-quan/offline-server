/**
 * Created by Administrator on 2016/8/30 0030.
 * 組件基類
 */
Ext.define('OrientTdm.Collab.common.Component.BaseComponent', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.baseComponent',
    autoScroll: true,
    config: {
        beforeInitComponent: Ext.emptyFn,
        afterInitComponent: Ext.emptyFn,
        flowTaskId: '',
        modelId: '',
        dataId: '',
        componentId: '140',
        //保存历史任务时 是否需要序列化至数据库 暂不保存历史信息
        isHistoryAble: false,
        //历史任务描述
        hisTaskDetail: null

    },
    initComponent: function () {
        var me = this;
        me.beforeInitComponent.call(me);
        this.callParent(arguments);
        me.afterInitComponent.call(me);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
    },
    validateComponent: function (successCallBack, scope) {
        var me = this;
        //私有方法 提交任務前出触发 返回true 或者 false
        var toSubmitData = me.getComponentOutData();
        //如果为空则不校验
        if (toSubmitData) {
            var params = {
                jsonComponent: Ext.encode(toSubmitData),
                belongModelId: me.modelId,
                belongDataId: me.dataId,
                flowTaskId: me.flowTaskId,
                componentId: me.componentId
            };
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/Component/validateComponent.rdm', params, true, function (resp) {
                if (resp.decodedData) {
                    var validateResult = resp.decodedData.results;
                    if (validateResult == true) {
                        successCallBack.call(scope);
                    }
                }
            }, true);
        } else {
            //successCallBack.call(scope);
        }
    },
    getComponentOutData: function () {
        //獲取組件輸出 返回json 对象
        return {};
    },
    /**
     *
     * 为后台历史任务引擎，提供输入参数，历史引擎根据参数保存相关历史信息至数据库
     */
    getHistoryData: function () {
        throw "子类必须实现该方法";
    },
    isHistory: function () {
        var me = this;
        return null != me.hisTaskDetail;
    }
});