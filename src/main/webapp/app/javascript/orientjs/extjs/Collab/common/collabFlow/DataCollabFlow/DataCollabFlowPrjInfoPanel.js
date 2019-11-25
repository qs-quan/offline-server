/**
 * 测试数据导入记录标签页
 */

Ext.define('OrientTdm.Collab.common.collabFlow.DataCollabFlow.DataCollabFlowPrjInfoPanel',{
    extend: 'OrientTdm.Common.Extend.Panel.OrientTabPanel',
    alias: 'widget.DataCollabFlowPrjInfoPanel',

    initComponent: function () {
        var me = this;
        me.region = 'north';
        var items = [];

        // 上半部分项目表单、仪器
        var modelDesc,modelData;
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/modelData/getGridModelDescAndData.rdm', {
            modelId: me.rwModelId,
            dataId: me.dataId
        }, false, function (response) {
            modelDesc = response.decodedData.results.orientModelDesc;
            modelData = response.decodedData.results.modelData;
        });
        items.push(Ext.create("OrientTdm.Common.Extend.Form.OrientDetailModelForm", {
            title: '查看【' + modelData['M_BH_' + modelDesc.modelId ] + '】数据',
            bindModelName: modelDesc.dbName,
            itemId: "tab_" + me.testDataObj.nodeId,
            modelDesc: modelDesc,
            originalData: modelData
        }));

        var customerFilter = [new CustomerFilter("T_RW_INFO_" + OrientExtUtil.FunctionHelper.getSchemaId() + "_ID",
            CustomerFilter.prototype.SqlOperation.Equal, "", modelData['ID'])];
        /*var itemArr = [
            {tableName: "T_SYTJ", title: "试验条件", customerFilter: customerFilter},
            {tableName: "T_HGPJ", title: "合格判据", customerFilter: customerFilter},
            {tableName: "T_GC", title: "试验过程", customerFilter: customerFilter}
        ];
        // ext.each 在 ie8 上执行失败
        for(var i in itemArr){
            var item = itemArr[i];
            if(item.tableName != ''){
                item.tableId = OrientExtUtil.ModelHelper.getModelId(item.tableName, OrientExtUtil.FunctionHelper.getSchemaId(), false);
            }

            items.push(Ext.create('OrientTdm.Common.Extend.Grid.OrientModelGrid', {
                title : '【' + modelData['M_BH_' + modelDesc.modelId ] + '】' + item.title,
                modelId: item.tableId,
                isView: 0,
                customerFilter: item.customerFilter,
                createToolBarItems: function () {}
            }));
        };*/

        // 根据模版名称请求文件路径后组装
        /*var parmParam = []
        var modelDataId = modelData['ID'];
        OrientExtUtil.AjaxHelper.doRequest(serviceName + '/DocController/getRwParam.rdm',{
            datadId: modelDataId
        },false, function (response) {
            var respons = Ext.decode(response.responseText);
            if(respons.success){
                var paramArr = respons.results;
                var itemArr = [
                        {tableName: "T_SYTJ", title: "试验条件"},
                        {tableName: "T_HGPJ", title: "合格判据"},
                        {tableName: "T_GC", title: "试验过程"}
                    ];
                for(var i = 0; i < itemArr.length; i++){
                    var item = itemArr[i];
                    var local = paramArr[item.tableName];

                    parmParam.push(Ext.create('Ext.panel.Panel', {
                        title: item['title'],
                        flex: 1,
                        html: local.length > 0 ?
                            '<img src="' + serviceName + '/' + local + '"/>':
                            '预览失败！',
                        autoScroll: true
                    }));
                }
            }
        });
        items.push(Ext.create('Ext.panel.Panel', {
            title: '条件、判据、过程',
            layout: 'fit',
            items: Ext.create('Ext.panel.Panel', {
                layout: 'hbox',
                items: parmParam
            })
        }));*/

        // 设备
        /*items.push(Ext.create('OrientTdm.TestBomBuild.Panel.GridPanel.TaskDeviceGridpanel', {
            nodeId: me.testDataObj.nodeId,
            //treeNode: treeNode,
            //modelId : deviceModelId,
            isShow : true,
            isView : "0",
            title : '【' + modelData['M_BH_' + modelDesc.modelId ] + '】仪器',
            region : 'center',
            usePage : true,
            hasToolBar: true,
            onlyBorrowButton: true
        }));*/

        Ext.apply(me,{
            items: items,
            activeItem: 0,
            listeners: {
                afterLayout: function () {}
            }
        });
        me.callParent(arguments);
    }
});