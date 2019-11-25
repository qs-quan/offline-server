/**
 * Created by Administrator on 2017/7/20 0020.
 * -------------------------------------------
 * MainForm
 * xxx:____________________________________
 * xxx:____________________________________
 * xxx:____________________________________
 * xxx:____________________________________
 * xxx:____________________________________
 * xxx:____________________________________
 *
 * -------------------------------------------
 * RefGrid
 * -------------------------------------------
 * 新增 修改 删除 查询
 * -------------------------------------------
 * xxx | xxx | xxx | xxx| xxx | xxx | xxx |
 * -------------------------------------------
 * 1   | 1  | 1   | 1  |  1   |  1  |  1  |
 *
 * -------------------------------------------
 *
 */
Ext.define('OrientTdm.Common.Extend.Component.MainFormComponent', {
    extend: 'Ext.Base',
    alias: 'widget.mainFormComponent',
    initMainForm: function (extraConfig) {
        var me = this;
        extraConfig = extraConfig || {};
        if (me.hisTaskDetail != null) {
            me._recoverFromHis();
        }
        var items = [];
        var params = {
            flowTaskId: me.flowTaskId,
            taskModelId: me.modelId,
            taskId: me.dataId,
            templateName: me.templateName
        };
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/customExampleController/getCollabFLowBindModelDescAndData.rdm', params, false, function (resp) {
            var data = resp.decodedData.results;
            var modelDesc = data.orientModelDesc;
            me.modelDesc = modelDesc;
            me.templateId = data.templateId;
            var modelData = data.modelData;
            //初始化表单面板
            var centerPanel = Ext.create("OrientTdm.Common.Extend.Form.OrientDetailModelForm", Ext.apply(extraConfig, {
                region: 'center',
                bindModelName: modelDesc.dbName,
                modelDesc: modelDesc,
                originalData: modelData,
                rowNum: 2,
                afterInitForm: function () {
                    if (me._prepareRefTable) {
                        me._prepareRefTable(this, data);
                    } else {
                        throw "主类必须实现_prepareRefTable方法";
                    }
                }
            }));
            items.push(centerPanel);
        });
        return items;
    }
});