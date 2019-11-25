/**
 * Created by Administrator on 2016/9/6 0006.
 */
Ext.define('OrientTdm.Collab.MyTask.auditTask.Opinion.AuditTaskOpinionPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.auditTaskOpinionPanel',
    layout: 'border',
    config: {
        piId: '',
        pdId: '',
        taskName: '',
        taskId: '',
        isHistory: false,
        //保存历史任务时 是否需要序列化至数据库
        isHistoryAble: true,
        filePanelInfo: ''
    },
    requires: [
        'OrientTdm.Collab.MyTask.auditTask.Opinion.AuditTaskHisOpinionList',
        'OrientTdm.Collab.MyTask.auditTask.Opinion.AuditTaskOpinionForm',
        'OrientTdm.Collab.MyTask.auditTask.File.AuditFileGridpanel'
    ],
    initComponent: function () {
        var me = this;
        var params = {
            pdId: me.pdId,
            taskName: me.taskName
        };
        var opinionSetting = null;
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/AuditFlowOpinionSetting/init.rdm', params, false, function (resp) {
            if (resp.decodedData && resp.decodedData.results) {
                //有且只有一条意见描述
                var opinionDesc = resp.decodedData.results[0];
                opinionSetting = opinionDesc.opinion;
            }
        });

        var items = [];
        if (!Ext.isEmpty(opinionSetting) && me.isHistory == false) {
            var height1 = 300;
            if(items.length > 0){
                height1 = 200;
            }
            var opinionForm = Ext.create('OrientTdm.Collab.MyTask.auditTask.Opinion.AuditTaskOpinionForm', {
                opinion: opinionSetting,
                title: '当前意见',
                region: 'south',
                height: height1
            });
            items.push(opinionForm);
        }
        var hisOpinionList = Ext.create('OrientTdm.Collab.MyTask.auditTask.Opinion.AuditTaskHisOpinionList', {
            id: "AuditTaskHisOpinionList",
            piId: me.piId,
            taskName: me.taskName,
            taskId: me.taskId,
            title: '历史意见',
            region: 'center',
            split: true
        });
        items.push(hisOpinionList);
        Ext.apply(me, {
            items: items
        });
        this.callParent(arguments);
    },

    initEvents: function () {
        var me = this;
        me.callParent(arguments);
    },

    /**
     *
     * 为后台历史任务引擎，提供输入参数，历史引擎根据参数保存相关历史信息至数据库
     */
    getHistoryData: function () {
        var me = this.down('auditTaskOpinionForm');
        var retVal = {
            opinions: {}
        };
        if (me) {
            var form = me.getForm();
            var opinionFields = me.query('textarea');
            Ext.each(opinionFields, function (item) {
                var name = item.name;
                var value = item.getValue();
                retVal.opinions[name] = value;
            });
        }
        return retVal;
    }
});