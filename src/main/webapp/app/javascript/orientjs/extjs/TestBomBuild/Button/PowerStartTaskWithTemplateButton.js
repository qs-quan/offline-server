/**
 * 流程启动
 * Created by dailin on 2019/4/9 16:05.
 */

Ext.define('OrientTdm.TestBomBuild.Button.PowerStartTaskWithTemplateButton', {
    extend: 'OrientTdm.Common.Extend.Button.OrientButton',
    alias: 'widget.powerStartTaskWithTemplateButton',
    requires: [
        'OrientTdm.Collab.common.auditFlow.StartAuditFlowPanel'
    ],
    triggerClicked: function (modelGridPanel, isSetTemplate) {
        var me = this;
        var selections = modelGridPanel.getSelectionModel().getSelection();
        // 判断试验项是否绑定过委托单号
        var sylxDataId = modelGridPanel.treeNode.raw.dataId;
        var sylxModelId = modelGridPanel.treeNode.raw.tableId;
        var sylxValue = OrientExtUtil.ModelHelper.getModelData("T_SYLX",OrientExtUtil.FunctionHelper.getSchemaId(), sylxDataId);
        var wtdh = sylxValue["M_WTDH_" + sylxModelId];
        if (wtdh == null || wtdh == "") {
            OrientExtUtil.Common.info('提示','试验类型未绑定委托单号，请先绑定委托单号');
            return;
        }
        // 设置流程模板
        if(isSetTemplate == true){
            if(selections.length == 0){
                OrientExtUtil.Common.info('提示','未选择记录!');
                return;
            }
            // 过滤已发起过的，不执行
            var modelId = modelGridPanel.modelDesc.modelId;
            var dataIdArr = [];
            // 流程实例id
            Ext.each(selections, function (item) {
                // 判断是否已启动流程，没有保存dataid
                if(item.data['prjId'] == undefined){
                    dataIdArr.push(item.data['ID']);
                }
            });
            // 如果dataid 数量为0 全部启动流程了
            if(dataIdArr.length == 0){
                Ext.Msg.alert('提示', '所选记录均已下发过任务！');
                return;
            }

            var startCollabFlowPanel = Ext.create('OrientTdm.TestBomBuild.Panel.WindowPanel.StartCollabFlowPanel', {
                param : {
                    modelId: modelId,
                    // 传一个id
                    dataId: dataIdArr.join(','),
                    dataPrincipal: selections[0].data['M_ZRR_' + modelId],
                    dataIdArr: dataIdArr,
                    isSetTemplate: isSetTemplate
                },
                successCallback: function () {
                    modelGridPanel.fireEvent('refreshGrid');
                }
            });

            // 选择协同流程模板窗口
            OrientExtUtil.WindowHelper.createWindow(startCollabFlowPanel,{
                title: '设置流程模板' //isSetTemplate == true ? '设置流程模板' : '下发任务'
            }, '', 1000);

        // 启动流程
        }else {
            if (selections.length < 1) {
                OrientExtUtil.Common.info('提示','请选择至少一条记录!');
                return;
            }
            // 过滤已发起过的，不执行
            var modelId = modelGridPanel.modelDesc.modelId;
            var dataIdArr = [];
            var dataArr = [];
            var msg = '';
            for(var i = 0; i < selections.length; i++){
                var item = selections[i];

                var msg_ = '';
                if(item.data['prjId'] == undefined){
                    dataIdArr.push(item.data['ID']);
                }
                // 记录未设置仪器负责人的试验项
                if(item.data['M_ZRR_' + modelId] == null || item.data['M_ZRR_' + modelId] == ""){
                    msg_ += '，未设置被试品负责人';
                }
                /*// 记录未设置环境负责人的试验项
                if(item.data['M_HJ_FZR_' + modelId] == null || item.data['M_HJ_FZR_' + modelId] == ""){
                    msg_ += '，未设置环境负责人';
                }*/
                // 判断是否绑定了流程模板
                if(item.data['template_id'] == undefined){
                    msg_ += '，未设置流程模模板';
                }else if(item.data['template_id'] != undefined && item.data['prjId'] == undefined){
                    // 校验所选流程模板是否存在
                    var isExist = me._checkCollabFlowExist(item.data['template_id']);
                    if(isExist){
                        dataArr.push({
                            'dataId': item.data['ID'],
                            'templateId': item.data['template_id'],
                            'text': item.data['M_BH_' + modelId]
                        });
                    }else{
                        msg_ = "所选流程模板不存在，请重新设置后下发任务";
                    }
                }
                if(msg_.length > 0){
                    msg += '<br>试验项【<font color="red">' + item.data['M_BH_' + modelId] + '</font>】' + msg_;
                }
            }

            if(dataIdArr.length == 0){
                Ext.Msg.alert('提示', '所选记录均已下发过任务！');
                return;
            }
            if(msg.length > 0){
                Ext.Msg.alert('提示', msg.substr(4));
                return;
            }

            // 批量启动
            Ext.getBody().mask("请稍后...", "x-mask-loading");
            OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TaskController/startTestPrjWithTemplate.rdm',{
                paramJsonStr: Ext.encode(dataArr)
            }, false, function (response) {
                Ext.getBody().unmask();
                // 刷新列表
                modelGridPanel.fireEvent('refreshGrid');
                var responseText = Ext.decode(response.responseText);

                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TaskController/changePrincipal.rdm',{
                    param: Ext.encode(responseText.results),
                    isStrartPlan: true,
                    isStartFirstTask: true
                }, false, function (response) {
                    // 刷新列表
                    modelGridPanel.fireEvent('refreshGrid');
                });

                // 试验项启动后批量变更所属项目测试记录的测试人员字段为试验项的负责人
                // 遍历所选数据，保存负责人id
                var syxId = new Array();
                var syxFzr = new Array();
                for (var i = 0; i < selections.length; i++) {
                    syxId.push(selections[i].data.id);
                    syxFzr.push(selections[i].data['M_ZRR_' + modelId]);
                }

                OrientExtUtil.AjaxHelper.doRequest(serviceName + '/ProjectTestRecordController/batchUpdate4Syx.rdm',{
                    syxFzr: syxFzr,
                    syxId: syxId
                }, true);
            });
        }
    },

    /**
     * 下发任务时校验试验流程是否存在
     * @param templateId
     * @returns {boolean}
     * @private
     */
    _checkCollabFlowExist(templateId){
        var isExist = false;

        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/TaskController/checkCollabFlowExist.rdm',{
            collabTaskId: templateId
        }, false, function (response) {
            isExist = response.decodedData;
        });

        return isExist;
    }
});