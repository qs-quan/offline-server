/**
 * Created by Administrator on 2016/8/31 0031.
 */
Ext.define('OrientTdm.Collab.MyTask.dataTask.PreData.PreDataDashPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.preDataDashPanel',
    layout: 'border',
    config: {
        modelId: '',
        dataId: ''
    },
    requires: [
        'OrientTdm.Collab.MyTask.dataTask.PreData.PreDataTreePanel',
        'OrientTdm.Collab.Data.DevData.DevDataCard'
    ],
    initComponent: function () {
        var me = this;

        //var preTreePanel = Ext.create('OrientTdm.Collab.MyTask.dataTask.PreData.PreDataTreePanel', {
        //    modelId: me.modelId,
        //    dataId: me.dataId,
        //    region: 'west',
        //    width: 200,
        //    title: '前驱节点',
        //    collapseMode: 'mini',
        //    collapsible: true
        //});

        var preDataPanel = Ext.create('OrientTdm.Collab.Data.DevData.DevDataCard', {
            region: 'center',
            layout: 'fit',
            modelId: me.modelId,
            dataId: me.dataId,
            type: 2,
            apiConfig: {
                "read": 'myTask/dataTasks/preDataObjs.rdm'
            }
        });

        Ext.apply(me, {
            items: [preDataPanel]
        });
        this.callParent(arguments);
    },
    initEvents: function () {
        var me = this;
        me.callParent(arguments);
    }
});