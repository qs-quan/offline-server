/**
 * Created by Seraph on 16/8/19.
 */
Ext.define('OrientTdm.Collab.common.planTaskBreak.PlanTaskBreakTabPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientTabPanel',
    alias: 'widget.planTaskBreakTabPanel',
    requires: [
        "OrientTdm.Collab.common.util.RightControlledPanelHelper"
    ],
    config: {

    },
    initComponent: function () {
        var me = this;
        Ext.apply(me,
            {
                items: [
                    {
                        title: '简介',
                        iconCls: 'icon-basicInfo',
                        html: '<h1></h1>'
                    }
                ],
                activeItem: 0
            }
        );

        me.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent();
        me.on('tabchange', me.tabChanged, me);
    },
    tabChanged: function (tabPanel, newCard, oldCard) {

        var panel = CollabRightControlledPanelHelper.getPanelByTitle(newCard.title, {
            region: 'center',
            treeNodeData : newCard.data,
            modelName: newCard.modelName,
            dataId : newCard.dataId,
            modelId : newCard.modelId
        }, {
            '甘特图' : {
                readOnly : false,
                enableControl : true
            }
        });

        if(!Ext.isEmpty(panel)){
            newCard.removeAll();
            newCard.add(panel);
            newCard.doLayout();
        }
    }
});