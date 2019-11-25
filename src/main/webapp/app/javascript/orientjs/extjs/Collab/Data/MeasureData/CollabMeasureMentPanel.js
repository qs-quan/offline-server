/**
 * Created by panduanduan on 13/07/2017.
 */
Ext.define('OrientTdm.Collab.Data.MeasureData.CollabMeasureMentPanel', {
    extend: 'OrientTdm.Common.Extend.Panel.OrientPanel',
    alias: 'widget.collabMeasureMentPanel',
    config: {
        modelId: null,
        dataId: null
    },
    requires: [
        'OrientTdm.BackgroundMgr.Quantity.Instance.QuantityInstanceList'
    ],
    initComponent: function () {
        var me = this;
        var instanceGrid = Ext.create('OrientTdm.BackgroundMgr.Quantity.Instance.QuantityInstanceList', {
            modelId: me.modelId,
            dataId: me.dataId
        });
        Ext.apply(me, {
            items: [instanceGrid],
            layout: 'fit'
        });
        this.callParent(arguments);
    }
});