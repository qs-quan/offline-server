/**
 * 审批按钮
 */
Ext.define("OrientTdm.TestBomBuild.Button.PowerApplyButton", {
    extend: 'OrientTdm.Common.Extend.Button.OrientButton',

    // 按钮点击时触发事件
    triggerClicked: function (modelGridPanel) {
        var me = this;
        me.modelGridPanel = modelGridPanel;

        // 获取选择项
        var selected = OrientExtUtil.GridHelper.getSelectedRecord(modelGridPanel);

        var isMultiple = modelGridPanel.isMultiple;
        if(isMultiple == undefined || isMultiple == null || isMultiple == true){
            if(selected.length == 0){
                OrientExtUtil.Common.info('提示','请选择至少一条数据！');
                return;
            }
        }else{
            if(selected.length != 1){
                OrientExtUtil.Common.info('提示','请选择一条数据！');
                return;
            }
        }

        // 获取选择项 ids
        var selectedIds = '';
        for(var i = 0; i < selected.length; i++){
            selectedIds = selectedIds + ',' + selected[i].data.id;
        }
        selectedIds = selectedIds.length > 0 ? selectedIds.substr(1) : '';
        if(selectedIds == ''){
            OrientExtUtil.Common.info('提示','执行失败，获取 dataId 为空！');
            return;
        }
        modelGridPanel.selectedIds = selectedIds;

        var params = {
            setShowName: true,
            modelId: modelGridPanel.modelId,
            dataIds: modelGridPanel.selectedIds,
            // 军检，所检，XXXX
            typeName: selected[0].data["M_APPLY_TYPE_" + modelGridPanel.modelId],
            successCallback: sfb
        };

        function sfb(resp, taskUserAssigns) {
            if (modelGridPanel.hasListener('customRefreshGrid')) {
                //如果存在自定义刷新事件
                modelGridPanel.fireEvent('customRefreshGrid', resp, taskUserAssigns);
            } else {
                //否则调用默认刷新事件
                modelGridPanel.fireEvent('refreshGridByCustomerFilter');
            }
        }

        //重写审批发起面板
        Ext.require('OrientTdm.Collab.common.auditFlow.StartAuditFlowPanel', function () {
            var item = Ext.create('OrientTdm.Collab.common.auditFlow.StartAuditFlowPanel', params);
            var data = selected[0].data;
            // 对申请流程的流程名称赋值，规则：XXX（图号）+ (AD后的一位进行判断 1:系统，2-4整机，5-6模块) + 的XXX（军检/所检）的试验申请
            var thName = data["M_TH_" + modelGridPanel.modelId];
            switch (thName.charAt(2)) {
                case '1': var thTypeName = '系统'; break;
                case '2':
                case '3':
                case '4': var thTypeName = '整机'; break;
                case '5':
                case '6': var thTypeName = '模块'; break;
                default:
                    var thTypeName = '';
            }
            var collabName = thName + thTypeName + data["M_APPLY_TYPE_" + modelGridPanel.modelId] + "试验申请";
            Ext.getCmp('customName').setValue(collabName);
            OrientExtUtil.WindowHelper.createWindow(item, {
                title: me.btnDesc.name
            });
        });
    }

});