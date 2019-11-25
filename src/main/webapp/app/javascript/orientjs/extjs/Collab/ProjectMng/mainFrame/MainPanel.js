/**
 * Created by Seraph on 16/7/7.
 */
Ext.define('OrientTdm.Collab.ProjectMng.mainFrame.MainPanel', {
    alias: 'widget.projectMngCenterPanel',
    extend: 'OrientTdm.Common.Extend.Panel.OrientTabPanel',
    requires: [
        "OrientTdm.Collab.common.util.RightControlledPanelHelper"
    ],
    config: {},
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.on('tabchange', me.tabChanged, me);
        me.on('beforetabchange', me.beforetabchange, me);
    },
    tabChanged: function (tabPanel, newCard, oldCard) {
        var me = this;

        var extraParams = {};
        if(newCard.title == '甘特图' ) {
            extraParams = {
                '甘特图' : {
                    readOnly: false,
                    enableControl: true,
                    projectPlannedStartDate : Ext.Date.parse(newCard.extraInfo.projectPlannedStartDate, "Y-m-d"),
                    projectPlannedEndDate : Ext.Date.parse(newCard.extraInfo.projectPlannedEndDate, "Y-m-d")
                }
            }
        } else if (newCard.title == '工作组' ) {
            extraParams = {
                '工作组' : {
                    ids: newCard.extraInfo.ids
                }
            }
        } else if (newCard.title == '控制流' ) {
            extraParams = {
                '控制流' : newCard.extraInfo
            }
        }
        var panel = CollabRightControlledPanelHelper.getPanelByTitle(newCard.title, {
            region: 'center',
            treeNodeData: newCard.data,
            modelName: newCard.modelName,
            dataId: newCard.dataId,
            modelId: newCard.modelId
        }, extraParams);



        if (!Ext.isEmpty(panel)) {
            newCard.removeAll(true);
            newCard.add(panel);
            newCard.doLayout();
        }
    },
    beforetabchange : function (tabPanel, newCard, oldCard) {
        var me = this;
        if(oldCard){
            if(oldCard.title == '设计数据'){
                var dashBoard = oldCard.items.items[0];
                var shareData = dashBoard.shareDataPanel.devDataInstancePanel;
                var dataModified = shareData.getStore().getModifiedRecords().length > 0
                    || shareData.getStore().getNewRecords().length > 0
                    || shareData.getStore().getRemovedRecords().length > 0;

                if(!Ext.isEmpty(oldCard.privateDataPanel)){
                    var privateDataStore = oldCard.privateDataPanel.devDataInstancePanel;

                    dataModified = dataModified || (privateDataStore.getModifiedRecords().length > 0
                        || privateDataStore.getNewRecords().length > 0
                        || shareData.getStore().getRemovedRecords().length > 0);
                }

                if(dataModified){
                    me.doAlertSave(function(){
                        shareData.getStore().sync({
                            success: function () {
                            }
                        });

                        if(!Ext.isEmpty(oldCard.privateDataPanel)){
                            dashBoard.privateDataPanel.devDataInstancePanel.getStore().sync({
                                success: function () {
                                }
                            });

                        }
                        return true;
                    });
                }


            }else if(oldCard.title == '数据流'){
                var dataFlowPanel = oldCard.items.items[0];
                if(dataFlowPanel.isHistory || dataFlowPanel.localMode){

                }else{
                    if(dataFlowPanel.dataDirty){
                        me.doAlertSave(function(){
                            dataFlowPanel._saveDataFlow();
                        });
                        dataFlowPanel.clearDirty();
                    }
                }
            }
        }
    },

    doAlertSave : function(yesFn){
        Ext.Msg.show({
            title:'提示',
            msg: '有未保存的数据，是否保存？',
            buttons: Ext.Msg.YESNO,
            fn : function(btn){
                if (btn == 'yes'){
                    yesFn();
                }else{
                    return true;
                }
            }
        });
    }
});