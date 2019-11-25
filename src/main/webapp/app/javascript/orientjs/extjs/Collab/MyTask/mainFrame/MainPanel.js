/**
 * Created by Seraph on 16/7/25.
 */
Ext.define('OrientTdm.Collab.MyTask.mainFrame.MainPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientTabPanel',
    alias: 'widget.taskMainPanel',
    requires: [

    ],
    config: {

    },
    initComponent: function () {
        var me = this;
        Ext.apply(me,
            {
                items: [

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
        if(newCard.title == '工作组'){

        }
    }
});