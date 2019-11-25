/**
 * 列表加统计图表
 */
Ext.define('OrientTdm.TestBomBuild.Panel.Panel.PrjStatuslStatisticsPanel',{
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.PrjStatuslStatisticsPanel',
    
    initComponent: function () {
        var me = this;

        var modelId = OrientExtUtil.ModelHelper.getModelId("T_RW_INFO", OrientExtUtil.FunctionHelper.getSchemaId(), false);
        var centerPanel = Ext.create('OrientTdm.TestBomBuild.Panel.GridPanel.TestProjectGridpanel', {
            region: 'center',
            treeNode: me.treeNode,
            tableName: 'T_RW_INFO',
            tableId: modelId,
            showAnalysisBtns: true,
            modelId: modelId,
            isView: 0,
            padding: '0 0 0 5',
            listeners: {
                afterLoadData: function (records) {
                    me._reloadStatistic([{
                        isUser:'1',
                        panelId: 'userStatisticPanel'
                    }/*,{
                        isUser:'0',
                        panelId: 'userDepStatisticPanel'
                    }*/], '', '', me.treeNode.raw.id);
                }
            }
        });

        Ext.apply(me, {
            layout: 'border',
            title: '查看【' + me.treeNode.raw.text + '】数据列表',
            items: [centerPanel, {
                layout: 'hbox',
                region: 'south',
                height: 356,
                title: '统计视图',
                autoScroll: true,
                tbar: me._createToolbar(),
                items: [{
                        id: 'userStatisticPanel',
                        flex: 1
                    }/*,{
                        id: 'userDepStatisticPanel',
                        flex: 1
                }*/]
            }]
        });
        me.callParent(arguments);
    },

    /**
     * 按钮栏
     * @private
     */
    _createToolbar: function () {
        var me = this;
        return [{
            xtype: 'datefield',
            id: 'startDate',
            emptyText: '预计开始时间'
        },{
            xtype: 'datefield',
            id: 'endDate',
            emptyText: '预计结束时间'
        },{
            text : "统计",
            iconCls: 'icon-query',
            itemId: 'query',
            handler:function () {
                var startDate = Ext.getCmp('startDate').value;
                if(startDate != undefined){
                    startDate = new Date(startDate).getTime();
                }
                var endDate = Ext.getCmp('endDate').value;
                if(endDate != undefined){
                    endDate = new Date(endDate).getTime();
                }
                if(startDate > endDate){
                    OrientExtUtil.Common.info("项目时间", "项目结束时间不能大于开始时间");
                    return;
                }
                me._reloadStatistic([{
                    isUser:'1',
                    panelId: 'userStatisticPanel'
                }/*,{
                    isUser:'0',
                    panelId: 'userDepStatisticPanel'
                }*/], startDate, endDate, me.treeNode.raw.id);
            }
        },{
            text: '清空',
            iconCls: 'icon-clear',
            handler: function () {
                Ext.getCmp('startDate').reset();
                Ext.getCmp('endDate').reset();
            }
        }];
    },

    /**
     * 加载统计图表
     * @param param
     * @private
     */
    _reloadStatistic: function (param, startDate, endDate, nodeId) {
        var me = this;
        Ext.each(param, function (item) {
            OrientExtUtil.StatisticUtil.constructChart('', {
                    height: 300,
                    statisticName: '试验项目状态统计'
                }, {
                    nodeId: nodeId == undefined ? '' : nodeId,
                    startDate: startDate == undefined ? '' : startDate,
                    endDate: endDate == undefined ? '' : endDate,
                    isUser: item.isUser,
                    isLeaderChart: 'False'
                }, function (statisticCharts) {
                    var panel = Ext.getCmp(item.panelId);
                    panel.removeAll();
                    panel.add(statisticCharts);
                }, me
            );
        });
    }

});